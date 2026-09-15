#!/usr/bin/env python3
"""Harness health meter for Claude Code (read-only).

Reads this session's transcript and reports how full the context is, how long
the last turn took, and how many compactions have happened.

Wired in .claude/settings.json to three events:
  UserPromptSubmit -> adds a one-line [harness-health] note to Claude's context
  PostToolUse      -> mid-task: warns Claude and the user only when the band gets
                      worse than the last one reported (GREEN -> AMBER -> RED)
  Stop             -> shows the same line to the user as a systemMessage

The last reported band lives in a small per-session file in the temp directory.
It never blocks: on any error it prints nothing and exits 0.
Tunables (env): HARNESS_BUDGET tokens (default 200000); HARNESS_AMBER and
HARNESS_RED as fractions of the budget (defaults 0.40 and 0.65).
"""
import json
import os
import sys
import tempfile
from datetime import datetime

BUDGET = int(os.environ.get("HARNESS_BUDGET", "200000"))
AMBER = float(os.environ.get("HARNESS_AMBER", "0.40"))
RED = float(os.environ.get("HARNESS_RED", "0.65"))
USAGE_KEYS = ("input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens", "output_tokens")


def timestamp(entry):
    try:
        return datetime.fromisoformat(entry["timestamp"].replace("Z", "+00:00"))
    except (KeyError, ValueError, AttributeError):
        return None


def is_human_prompt(entry):
    if entry.get("type") != "user" or entry.get("isMeta") or entry.get("isCompactSummary") or "toolUseResult" in entry:
        return False
    content = entry.get("message", {}).get("content")
    if isinstance(content, list):
        return not any(isinstance(b, dict) and b.get("type") == "tool_result" for b in content)
    return isinstance(content, str)


def read_main_thread(path):
    entries = []
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            try:
                entry = json.loads(line)
            except ValueError:
                continue
            if not entry.get("isSidechain"):
                entries.append(entry)
    return entries


def measure(entries):
    # Each compaction writes a boundary entry and a summary entry; count boundaries only,
    # falling back to summaries for transcripts that have no boundary entries.
    marks = [i for i, e in enumerate(entries) if e.get("type") == "system" and e.get("subtype") == "compact_boundary"]
    if not marks:
        marks = [i for i, e in enumerate(entries) if e.get("isCompactSummary")]
    compactions = len(marks)

    # Context size = everything the model saw on its latest call, plus what it wrote.
    # Only calls after the last compaction count; earlier ones measure a context that's gone.
    context = None
    for e in reversed(entries[marks[-1] if marks else 0:]):
        usage = e.get("message", {}).get("usage") if e.get("type") == "assistant" else None
        if usage:
            context = sum(usage.get(k) or 0 for k in USAGE_KEYS)
            break

    # Last completed turn: the latest human prompt followed by assistant output.
    turn_secs, tool_calls = None, 0
    prompts = [i for i, e in enumerate(entries) if is_human_prompt(e)]
    for n in range(len(prompts) - 1, -1, -1):
        start = prompts[n]
        stop = prompts[n + 1] if n + 1 < len(prompts) else len(entries)
        replies = [e for e in entries[start + 1:stop] if e.get("type") == "assistant"]
        if not replies:
            continue
        began, ended = timestamp(entries[start]), timestamp(replies[-1])
        if began and ended:
            turn_secs = (ended - began).total_seconds()
        for e in replies:
            content = e.get("message", {}).get("content")
            if isinstance(content, list):
                tool_calls += sum(1 for b in content if isinstance(b, dict) and b.get("type") == "tool_use")
        break
    return context, compactions, turn_secs, tool_calls


MID_TASK_ADVICE = {
    1: "finish the current step leanly, then suggest /compact when this turn ends",
    2: "finish the current step, save state to files, then stop and hand back to the user",
}


def band_file(payload):
    key = payload.get("session_id") or os.path.basename(payload.get("transcript_path", "session"))
    key = "".join(c for c in key if c.isalnum() or c in "-_")
    return os.path.join(tempfile.gettempdir(), "harness_health_%s.band" % key)


def last_reported(path):
    try:
        with open(path) as f:
            return int(f.read().strip())
    except (OSError, ValueError):
        return -1


def remember(path, rank):
    try:
        with open(path, "w") as f:
            f.write(str(rank))
    except OSError:
        pass


def kilo(n):
    return "%dK" % round(n / 1000) if n >= 1000 else str(n)


def main():
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        payload = {}
    path = payload.get("transcript_path")
    if not path or not os.path.exists(path):
        return
    context, compactions, turn_secs, tool_calls = measure(read_main_thread(path))
    if context is None:
        if not compactions:
            return  # first prompt of a session: nothing measured yet
        # Just compacted: no call has measured the new, smaller context yet.
        rank, head, advice = -1, "⚪ just compacted · context size shows after the next reply", None
    else:
        fill = context / BUDGET
        if fill >= RED:
            rank, band, advice = 2, "🔴 RED", "wrap up: write a learning record or handoff, then /clear or open a fresh session"
        elif fill >= AMBER:
            rank, band, advice = 1, "🟡 AMBER", "plan a /compact at the next natural break"
        else:
            rank, band, advice = 0, "🟢 GREEN", "healthy"
        head = "%s · context ≈ %s tokens (%d%% of %s working budget)" % (band, kilo(context), round(fill * 100), kilo(BUDGET))

    event = payload.get("hook_event_name")
    state = band_file(payload)
    if event == "PostToolUse":
        # Mid-task: stay quiet unless the band is worse than the last one reported.
        if rank <= last_reported(state):
            return
        remember(state, rank)
        if rank < 1:
            return
        line = "Harness health (mid-task): %s · %s" % (head, MID_TASK_ADVICE[rank])
        print(json.dumps({
            "systemMessage": "🩺 " + line,
            "hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": "[harness-health] " + line},
        }, ensure_ascii=False))
        return
    if event == "UserPromptSubmit":
        remember(state, rank)  # new turn: mid-task warnings compare against this band

    parts = [head]
    if turn_secs is not None:
        took = "%.1f min" % (turn_secs / 60) if turn_secs >= 90 else "%ds" % round(turn_secs)
        parts.append("last turn %s, %d tool calls" % (took, tool_calls))
    parts.append("compactions %d" % compactions)
    if advice:
        parts.append(advice)
    line = "Harness health: " + " · ".join(parts)

    if event == "UserPromptSubmit":
        out = {"hookSpecificOutput": {"hookEventName": "UserPromptSubmit", "additionalContext": "[harness-health] " + line}}
    else:
        out = {"systemMessage": "🩺 " + line}
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
