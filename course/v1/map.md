# OCR course map (v1)

Label: wayfinder:map

## Destination

All five success criteria in [MISSION.md](../../MISSION.md) met, by walking the fixed 8-step course arc in [NOTES.md](../../NOTES.md). This map is the learner's to-do list: the first open, unblocked ticket is always what's next.

## Notes

- **Your to-do list is the [issues/](issues/) folder**, in number order. Each ticket says what it's for, who does it and which command starts it.
- **Basics first** (learner's choice, 2026-09-15): setup tickets come before any lesson ticket. Lessons get tickets once the basics are done.
- **Carries execution** (learner's choice, 2026-09-14): lessons and setup are tickets here, not only decisions. This overrides wayfinder's plan-only default.
- **Arc is fixed** (2026-09-14): tickets fill in each arc step. They never reorder, merge or cut steps.
- **Horizon**: all five success criteria, including the AWS deployment and the vendor checklist.
- **Versioned**: this is course v1. If the destination is ever redrawn, the new plan goes in `course/v2/` and this folder stays as the record.
- **Settled 2026-09-12, not reopened**: AWS; $50/month cap with alerts at 50%, 80% and 100%; image-only PDFs in the test set; labs ship complete scripts with guided edits.
- **Starting a ticket**: `/teach` and `/wayfinder` run only when the learner types them. Each ticket names its command: lessons start with `/teach`, most others with `/wayfinder course/v1/map.md`.
- **One ticket per session.** If a lesson needs new components, a separate build ticket comes first (lesson 0001's build-and-teach session hit RED).
- **Skills**: decision tickets use grilling and domain-modeling; research tickets use a research subagent.
- **Style**: short and plain. Density is the problem this map exists to fix.
- Standing rules in [CLAUDE.md](../../CLAUDE.md) apply: hardware labels, sources, no real resumes, teardown.

## Decisions so far

- **2026-09-15, ticket 01 resolved**: baseline commit made; `data/private/` created (gitignored, empty); GitHub access set up (`gh` CLI, learner authenticated, repo `nicknak818/ocr-for-ats` created public and pushed as `main`). See [issues/01-make-the-first-git-commit.md](issues/01-make-the-first-git-commit.md).
- **2026-09-15, ticket 02 resolved**: `.venv/` created with pyenv 3.11.15, pip upgraded to 26.2.1; learner confirmed by running the activate + version check themselves, holding learning record 0003. See [issues/02-create-the-python-environment.md](issues/02-create-the-python-environment.md).
- **2026-09-15, ticket 03 resolved**: `.claude/launch.json` runs `python3 -m http.server 8000` from the workspace root; lesson 0001 confirmed loading clean (all assets 200, no console errors). See [issues/03-set-up-the-lesson-server.md](issues/03-set-up-the-lesson-server.md).
- **2026-09-15, ticket 04 resolved**: Tesseract 5.5.3 and Poppler 26.09.0 (`pdftotext`, `pdftoppm`) installed via Homebrew, both runs-locally, versions sourced to their Homebrew formulae. See [issues/04-install-the-document-tools.md](issues/04-install-the-document-tools.md).

## Not yet specified

- **Lessons along the fixed arc**, starting with checking and taking lesson 0001 (the check needs the lesson server). Ticketed once the basics are done.
- **Setup that waits on course decisions**: a Hugging Face account (only if a chosen model is gated; arc step 5), Docker or another container setup (depends on the deployment design, and is heavy on 8 GB RAM; arc step 7), and the AWS command-line tools with a safe sign-in (arc step 7).

## Out of scope

- Training OCR models, handwriting, photographed documents, historical or non-Latin scripts, and building a full ATS ([MISSION.md](../../MISSION.md)).
