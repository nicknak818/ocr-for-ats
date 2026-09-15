# Make the first git commit

Type: task (HITL: needs the learner's yes)
Status: resolved
Run with: /wayfinder course/v1/map.md

## Question

The workspace has no commits yet (checked 2026-09-15). Create `data/private/` for real resumes (already gitignored), check that `git status` shows no real resumes, `.venv/` or model files, then make a baseline commit once the learner says yes.

## Answer

Created `data/private/` (gitignored, empty). Verified `git status` showed no real resumes, `.venv/`, or model files — only workspace source files and the synthetic sample assets under `assets/samples/`. Learner also asked for GitHub access: installed `gh`, learner authenticated (`gh auth login`), created public repo `nicknak818/ocr-for-ats`, and pushed the baseline commit as `main` tracking `origin/main`.
