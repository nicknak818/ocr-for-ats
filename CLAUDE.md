# OCR for ATS: learning workspace

The learner is studying open-source OCR (recent tech only) through a comparative study aimed at ATS resume parsing: model landscape, then validation and benchmarking, then productionising (the priority). This directory is a stateful teaching workspace driven by `/teach`.

## Workspace map

- `MISSION.md`: why we're here. Every lesson traces back to it.
- `NOTES.md`: learner preferences, proposed course arc, harness notes.
- `RESOURCES.md`: trusted sources. Cite them; don't trust parametric memory (model facts change monthly).
- `GLOSSARY.md`: canonical vocabulary, created lazily once a term is understood.
- `learning-records/`: what the learner has demonstrated or disclosed. Input for choosing the next lesson.
- `lessons/`: one self-contained HTML lesson each, `0001-name.html`.
- `reference/`: cheat sheets (model landscape, metrics). Revisited more than lessons.
- `assets/`: shared CSS/JS. Every lesson links `assets/course.css`; reuse before inventing.
- `lab/`: runnable experiments, created when the first hands-on lesson needs it.
- `.scratch/`: local-markdown issue tracker used by `/wayfinder`.
- `docs/agents/`: config read by the engineering skills.

## Skills (.claude/skills, from mattpocock/skills @ 3cca18b, MIT)

- User-invoked (type them): `/teach`, `/grill-me`, `/grill-with-docs`, `/wayfinder`, `/setup-matt-pocock-skills`
- Model-invoked (pulled in by the above): `grilling`, `domain-modeling`, `research`, `prototype`
- `/teach` runs lessons. `/grill-me` stress-tests a decision. `/grill-with-docs` does the same and writes GLOSSARY/ADRs. `/wayfinder` charts the comparative study as a map of decision tickets in `.scratch/`.

## Agent skills

### Issue tracker

Local markdown under `.scratch/` (no git remote). See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context; `GLOSSARY.md` stands in for `CONTEXT.md`. See `docs/agents/domain.md`.

## Standing rules

- Lean and recent: only what matters for ATS OCR in 2026. Tesseract stays in solely as the legacy baseline.
- Hardware is an Apple M1 with 8 GB RAM. Label every model "runs locally" or "needs cloud GPU"; never try to load one that won't fit.
- System Python 3.9 is too old for several OCR stacks. Use pyenv 3.11.15 in a project `.venv/`.
- Never commit real resumes (PII). Real samples live in `data/private/` (gitignored); benchmarks use synthetic resumes.
- Every factual claim about a model (params, licence, score, date) carries a source link, or is marked unverified.
- Offer a git commit as a progress checkpoint at the end of each lesson.
- Deployment track (AWS, $50/month cap; see `NOTES.md`): the learner creates accounts and credentials themselves; never handle keys. Every deploy lesson ends with a teardown step and a cost check.

## Harness health protocol

`.claude/hooks/harness_health.py` runs on every prompt and after every reply, reporting context fill from the transcript. After each tool call it also warns mid-task, but only when the band gets worse.

- On a mid-task AMBER warning, finish the current step leanly and suggest `/compact` when the turn ends. On a mid-task RED warning, finish the current step, save state to files, and stop to hand back to the user.

- End each substantive reply with a one-line `🩺 Harness:` footer built from the latest `[harness-health]` note.
- AMBER (40% or more of the 200K working budget): say so, and suggest `/compact <focus>` at the next natural break.
- RED (65% or more): start no new work. Write a learning record or handoff, then recommend `/clear` or a fresh session.
- Also flag qualitative drag: large tool dumps, repeated re-reads, a skill load that pulled in lots of text, slow turns.
- Stay lean: write findings to files, read files by section, prefer WebFetch summaries over raw pages, load `update-config` only when editing settings (it injects ~30K tokens).
