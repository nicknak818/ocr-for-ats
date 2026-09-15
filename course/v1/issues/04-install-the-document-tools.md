# Install the document tools

Type: task (AFK)
Status: resolved
Run with: /wayfinder course/v1/map.md

## Question

Neither is installed (checked 2026-09-15): Tesseract, the legacy baseline, and Poppler (`pdftotext`, `pdftoppm`) for checking text layers and turning PDF pages into images. Install both with Homebrew, record their versions with a source link, and label each "runs locally". The sample script uses only macOS built-ins (`textutil`, `qlmanage`, `sips`), so it needs nothing new.

## Answer

Installed both via Homebrew (`brew install tesseract poppler`):

- **Tesseract 5.5.3** — runs locally. Source: [Homebrew formula](https://formulae.brew.sh/formula/tesseract). Only the `eng` and `osd` language data files ship by default (`tesseract-lang` adds more, not needed here). Bundled with leptonica 1.87.0.
- **Poppler 26.09.0** (`pdftotext`, `pdftoppm`) — runs locally. Source: [Homebrew formula](https://formulae.brew.sh/formula/poppler) / [poppler.freedesktop.org](https://poppler.freedesktop.org/).

Both on PATH at `/opt/homebrew/bin/`. Verified with `tesseract --version` and `pdftotext -v`. No changes needed for the sample script (macOS built-ins only).
