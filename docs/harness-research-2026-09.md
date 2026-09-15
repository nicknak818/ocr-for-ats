# Claude Code Subagents and Context Management: Research Summary
**Date**: 2026-09-13 | **Source**: Official Anthropic documentation (code.claude.com, platform.claude.com)

> **Reviewer note (main session, 2026-09-13).** Written by a Haiku helper. Read with care:
> - **Wrong:** "caching survives `/compact`". Compaction rewrites the conversation, so only the standing-instructions prefix stays cached. Measured here: `/compact` took 251K down to 78K, not "20–30%".
> - **Wrong:** "your Haiku 4.5 setup". The main session is Opus 5. The extended thinking docs list Haiku 4.5 as extended-thinking-only, not adaptive.
> - **Unverified, and conflicts with the extended thinking docs:** per-message effort on Opus 5 or Fable 5.1 preserving the cache. Those docs say changing effort invalidates cache breakpoints in adaptive mode. Treat as unconfirmed.
> - **Unsourced:** the percentage savings (30–50%, 40%, 60–70%, 2.7–5.3×), "~2–4 tokens per line", and "don't disable thinking at xhigh/max".
> - **Not a lever:** "enable prompt caching". Claude Code already caches automatically.
> - **Sound:** `/clear` between unrelated tasks (`/rename` first to `/resume` later), a short CLAUDE.md with domain knowledge in skills, subagents for investigation, self-contained briefs, `/compact` with focus instructions, and `/context` to inspect usage.

## Top 10 Recommendations for Your Setup (Ranked by Impact)

1. **Enable prompt caching at session start** (2.7–5.3× cost reduction for agent loops)
   - Automatic caching is default; it survives `/compact` and effort changes on Fable 5.1+ / Opus 5+
   - [Prompt Caching docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

2. **Use `/clear` between unrelated tasks** (eliminates stale context; improves decision quality)
   - Each unrelated task fills context with irrelevant history, degrading performance
   - `/clear` resets context; rename sessions before clearing for resumability via `/resume`
   - [Best Practices](https://code.claude.com/docs/en/best-practices#manage-your-session)

3. **Keep CLAUDE.md under 200 lines** (base context stays lean; focus on rules that prevent mistakes)
   - Every line loaded at session start costs ~2–4 tokens; bloated files are ignored
   - Move domain knowledge to skills (loaded on-demand, not at startup)
   - [CLAUDE.md guidance](https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md)

4. **Delegate high-volume operations to subagents** (keeps main context clean for implementation)
   - Use: research, verification, testing, log processing. Subagents report summaries only
   - Parallel subagents finish faster and don't block implementation
   - [Subagent patterns](https://code.claude.com/docs/en/best-practices#use-subagents-for-investigation)

5. **Set effort to `medium` for subagents and routine tasks** (30–50% cost savings)
   - Subagents doing research use `low` effort; reserve `high`/`xhigh` for complex coding
   - On Fable 5.1 / Opus 5, per-message effort changes preserve prompt cache
   - [Effort guidance](https://platform.claude.com/docs/en/build-with-claude/effort)

6. **Hold top-level effort constant within cached conversations** (cache invalidation)
   - Changing top-level `effort` mid-session breaks cache on models without per-message support
   - Use per-message effort (Fable 5.1, Opus 5) or `/clear` between effort changes
   - [Cache invalidation rules](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)

7. **Control thinking depth via effort, not thinking budgets** (adaptive thinking + effort optimal)
   - Opus 5+ and Fable 5.1+ use adaptive thinking (effort controls both output and thinking)
   - Do not disable thinking at `xhigh`/`max` effort on Opus 5 (returns error)
   - [Thinking + effort](https://platform.claude.com/docs/en/build-with-claude/thinking#thinking-and-effort)

8. **Expect hidden thinking from prior turns to stay in context** (Opus 4.5+ preserve blocks)
   - Your measured 57–77% of context from thinking confirms Opus 4.5+ behavior
   - Haiku 4.5 and Sonnet 4.5 strip thinking blocks; only Opus 4.5+ preserve them
   - Workaround: `/clear` or `/compact` when thinking bloat is observed
   - [Model differences](https://platform.claude.com/docs/en/build-with-claude/thinking#thinking-block-preservation-by-model)

9. **Use `/compact` to summarize history without restarting** (frees 20–30% context mid-session)
   - Preserves decisions, code patterns, and file state while trimming conversation
   - Add custom instructions: `"Focus on API changes, preserve test results"`
   - `/compact` is cheaper than `/clear` when continuity matters
   - [Compaction](https://code.claude.com/docs/en/best-practices#manage-context-aggressively)

10. **Pair prompt caching with lower model effort for cost-optimal subagents** (reduces per-request cost)
    - Subagent at `low` effort + cached prefix costs 60–70% less than main session at `high`
    - Verification subagents benefit most (same cached context, fresh review lens)
    - [Subagent cost optimization](https://code.claude.com/docs/en/costs#delegate-verbose-operations-to-subagents)

## When to Use a Subagent / When Not

### **Use a subagent:**
- **Research in isolation**: Exploring code, reading docs, or answering questions without bloating main context
- **Verification with fresh perspective**: Code review, diff analysis, or testing after implementation
- **High-volume operations**: Tests, log analysis, batch file processing (output stays in subagent context)
- **Parallel work**: Tasks that don't depend on main session output
- **Specialized roles**: Security review, performance analysis, or domain-specific auditing

### **Don't use a subagent:**
- **Sequential single-file edits**: Direct edits are faster; spawning is overhead
- **Tasks where main context matters**: Feature work that builds on earlier decisions
- **When you need real-time interaction**: Tight feedback loops; subagent adds latency
- **Small, simple tasks**: Under 5 min scope; overhead exceeds benefit

### **Subagent pitfall—avoid:**
Briefs must be self-contained. Don't rely on "based on the earlier findings, do X"—summarize those findings in the brief. Subagents have zero knowledge of your main conversation.

## Context Management Playbook

| Scenario | Action | Notes |
|----------|--------|-------|
| **Session fills to 150K+ tokens** | Run `/compact` with custom focus | Preserves continuity; frees 20–30% |
| **Cache hits drop below 50%** | Check `/context` for invalidation causes | Changes to effort, thinking config, or tools break cache |
| **Switching between unrelated work** | `/rename` then `/clear` | Resumable; context doesn't mix |
| **Long multi-turn conversation** | Enable prompt caching; set 1-hour TTL | Costs 2× on cache writes, saves 90% on cache reads |
| **Thinking tokens dominating context** | Switch to `effort: "medium"`; test quality | Opus 4.5+ preserve thinking blocks—effort is leverage |
| **Subagent context bloat** | Set `effort: "low"` on subagent; use parallel runs | Reduces per-request cost by 30–50% |

## Effort and Model Choice

**Opus 5** (complex reasoning, debugging):
- Default: `high` | For coding: `xhigh` | For cost: `medium`
- Supports all effort levels; start high, tune down by task

**Sonnet 4.6 / 5** (general-purpose):
- Recommended: `medium` (speed + cost) | For complex: `high` | For simple: `low`
- Sonnet 4.6 defaults to `high`; explicitly set `medium` to save 30% cost

**Fable 5.1 / Haiku 4.5** (speed-sensitive, subagents):
- For subagents: `low` (saves 40%+ cost)
- For main tasks: `high` (default); avoid `xhigh` unless critical
- Fable 5.1 supports per-message effort without cache invalidation

**Thinking mode**:
- Enabled by default on Opus 5, Fable 5.1 (adaptive)
- Effort controls thinking depth; don't disable at `xhigh`/`max`
- On your Haiku 4.5 setup: adaptive thinking available; lower effort reduces thinking cost

## Sources

- [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- [Manage costs effectively](https://code.claude.com/docs/en/costs)
- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Extended thinking (deprecated mode)](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Subagents in the SDK](https://platform.claude.com/docs/en/agent-sdk/subagents)
- [Thinking (overview & block preservation by model)](https://platform.claude.com/docs/en/build-with-claude/thinking)
