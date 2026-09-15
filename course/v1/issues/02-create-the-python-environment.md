# Create the project Python environment

Type: task (AFK)
Status: resolved
Run with: /wayfinder course/v1/map.md

## Question

pyenv and Python 3.11.15 are already installed (checked 2026-09-15). Create `.venv/` in the workspace root with 3.11.15, upgrade pip, and confirm `.venv/bin/python --version`. Have the learner run one command themselves, to test learning record 0003 ("runs and tweaks scripts").

## Answer

Created `.venv/` from pyenv 3.11.15 (`.venv/bin/python --version` → `Python 3.11.15`), already covered by `.gitignore`. Upgraded pip 24.0 → 26.2.1 inside it. Learner ran `source .venv/bin/activate && python --version` themselves and confirmed `(.venv) Python 3.11.15` — learning record 0003 holds as written, no supersede needed.
