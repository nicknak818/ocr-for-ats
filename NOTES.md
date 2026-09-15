# Teaching notes

## Learner preferences

- Assume zero prior OCR knowledge. They want in-depth understanding of what it means to evaluate any OCR technique, not tool tours.
- Angle: vendor evaluation. Inputs: PDF and DOCX only.
- Lean, recent, relevant. As the course advances, flag what to know at each stage: tech, validation, benchmarking, production.
- Modest cloud spend is OK.
- Report harness health when context gets heavy, and name harness moves briefly as they happen.

## Course backbone: the evaluation scorecard

Every technique or vendor is judged on six questions. Lessons fill them in one at a time.

1. **Input**: what does it actually read (DOCX XML, PDF text layer, or pixels)?
2. **Accuracy** on our own ground truth: CER, reading order, field-level F1.
3. **Robustness**: two-column layouts, tables, icons, flattened or scanned PDFs.
4. **Cost and speed**: per 1K resumes, latency, hardware.
5. **Operability**: licence, self-host vs API, PII and data residency, monitoring.
6. **Evidence quality**: which benchmark and version, reproducible or not, vendor or independent.

## Course arc (proposed; learning records override)

1. What a PDF and a DOCX really contain: text layer vs pixels, and why DOCX never needs OCR.
2. The compute ladder (`reference/ocr-compute-ladder.html`): placing any technique on it.
3. Ground truth and metrics: CER, WER, reading order, field-level F1.
4. Build the synthetic resume test set: DOCX, text-layer PDF, flattened PDF.
5. Evaluate rungs 0 to 3 locally with one harness.
6. Evaluate a hosted vendor-style option with the same harness; read a leaderboard critically.
7. Deployment track: package pipeline and evaluation for the chosen cloud.
8. Production: routing by input type, monitoring and drift, PII, cost controls, teardown.

## Decisions (settled 2026-09-12)

- Deployment platform: **AWS**. Verify current services and pricing before the first spend. The learner creates the account; nudge them to start early.
- Test set **includes image-only PDFs** (flattened and scanned). Every flattened file must show zero characters in the inspector, or it isn't testing OCR.
- Cloud spend cap: **$50/month**, with billing alerts at 50%, 80% and 100%.
- Coding level: runs and tweaks scripts (LR 0003). Labs ship complete scripts with guided edits.

## Components (assets/)

- `course.css`: shared styles, including cards (`.trio`), quiz, recall prompt and inspector.
- `file-inspector.js`: drop a PDF or DOCX and see its XML text, text layer (stored order vs straight-across order) or pixels. Needs JSZip 3.10.1 and pdf.js 3.11.174 from cdnjs. Reuse it for test-set checks.
- `quiz.js`: multiple choice with instant feedback, per-option `data-why`, first-try tally.
- `samples/`: synthetic "Jordan Sample" resume as DOCX, text-layer PDF and flattened PDF; `make_samples.sh` rebuilds them.

## Next session starts here

**Start from the course map: [course/v1/map.md](course/v1/map.md).** Charted with `/wayfinder` on 2026-09-14 and 15. The learner chose basics first: seven setup tickets in `course/v1/issues/` come before any lesson ticket. They type `/wayfinder course/v1/map.md` to take the first open ticket. Don't nudge an early AWS sign-up: the ticket "Check AWS's new-account rules before signing up" comes first. The learner's files are the map and its `issues/` (the to-do list), `lessons/` (in order) and `reference/` (cheat sheets); the rest are the agent's working files. Still to do: add `course/` to the CLAUDE.md workspace map.

Lesson 0001 (what's inside a resume file) is built and opened for the learner, but **not yet browser-verified by the agent**: the session hit RED context first.

1. Verify it over a local server (see harness notes). Click all three sample buttons and check the console is clean. Confirm the text-layer PDF's "Read straight across" pane really mixes the sidebar into the job history, since lesson step 2 asks the learner to find that. If it doesn't, fix the wording or the code.
2. Ask for the learner's recall answer and quiz tally, give feedback, and write a learning record if they show understanding (triage, reading order vs OCR, the hidden-text-layer trap).
3. Then lesson 0002: the compute ladder (arc step 2).

## Harness notes

- 2026-09-12: loading `update-config` injected the full settings schema (~30K tokens). Load it only when editing hooks or settings.
- 2026-09-12: the kickoff session reached ~270K tokens (skill review, research, schema). State moved into files; run one fresh session per lesson.
- 2026-09-12: headless Chrome 152 `--screenshot` hung from the Bash tool, and `--print-to-pdf` took minutes. Rasterise with `qlmanage -t` plus `sips` instead. cdnjs and jsDelivr don't serve the pdf.js 3.11.174 `cmaps/` or `standard_fonts/`.
- 2026-09-12: the Browser pane renders local HTML as a static `data:` snapshot, so a lesson's relative `../assets/*.js` never loads there. Test lessons through a local server instead: add a `.claude/launch.json` entry that runs `python3 -m http.server` from the workspace root, then call `preview_start`.
- 2026-09-12: the lesson 0001 session hit RED (~208K) after a single 26-minute, 50-call turn (research fetches, sample building, a 250-line component, then the lesson). Next time, build components in one session and write the lesson in the next.
- 2026-09-13: usage breakdown of that session (20 API calls, context 58K to 251K). The agent's hidden reasoning was about 57% of the context and about 77% of effective usage: roughly 128K of 155K output tokens were thinking, and it stays in context. Standing instructions (system prompt, tool list, CLAUDE.md, memory) cost about 56K on every call. Everything read, fetched or written came to about 20%, and the conversation itself about 1%. Levers: shorter turns, lower effort for mechanical steps, a fresh session per lesson.
- 2026-09-13: why thinking stays. Claude Opus 4.5 and models numbered 4.6 or higher keep earlier turns' thinking in context and bill it as input; Sonnet 4.5, Haiku 4.5 and earlier models stripped it ([extended thinking docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)). The API can clear it (`clear_thinking` context editing), but that invalidates the cache from that point ([context editing docs](https://platform.claude.com/docs/en/build-with-claude/context-editing)). In Claude Code the levers are effort, `/compact` and `/clear`. Changing effort mid-conversation also invalidates the cache, so set it when a session starts. `/compact` re-attaches recently read files and used skills: this session restarted at 78K. Two meter bugs: straight after a compaction it reports the old pre-compaction size until the next reply, and it counts each compaction twice (a boundary entry plus a summary entry). Both fixed the same day: it now says "just compacted" until a new reply measures the context. The meter also warns mid-task (PostToolUse), only when the band worsens.
- 2026-09-13: agent and context research is in `docs/harness-research-2026-09.md`. It came from a Haiku helper (about 84K tokens in its own context, about 1K back here); read its reviewer note first, since some claims were wrong. Lesson: Haiku is fine for gathering sources, but check its conclusions.
