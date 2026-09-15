# OCR for ATS Resources

## Knowledge

- [OmniDocBench (GitHub, opendatalab)](https://github.com/opendatalab/OmniDocBench)
  The main whole-page document-parsing benchmark (CVPR 2025; v1.7 since Apr 2026) with a live leaderboard. Use for: current rankings, metric definitions (edit distance, TEDS, CDM, reading order).
- [olmOCR and olmOCR-Bench (GitHub, AllenAI)](https://github.com/allenai/olmocr)
  Fully open OCR VLM plus a unit-test benchmark (1,403 pages, 8,413 tests). Use for: a second leaderboard, cost-per-million-pages framing, designing pass/fail tests.
- [Paper: olmOCR 2, unit-test rewards (arXiv 2510.19817)](https://arxiv.org/abs/2510.19817)
  How unit tests become a training and evaluation signal. Use for: benchmark design.
- [Paper: OmniDocBench (arXiv 2412.07626)](https://arxiv.org/abs/2412.07626)
  Use for: what whole-page parsing metrics measure, and what they miss.
- [Paper: Layout-Aware Parsing Meets Efficient LLMs (arXiv 2510.09722)](https://arxiv.org/abs/2510.09722)
  Alibaba's deployed resume parser: text-layer plus OCR fusion, YOLOv10 layout for multi-column resumes, field-level F1 with Hungarian alignment, a 0.6B model beating a frontier LLM. Use for: the ATS benchmark and production lessons. The most on-mission source found so far.
- [Article: "Supercharge your OCR Pipelines with Open Models" (Hugging Face)](https://huggingface.co/blog/ocr-open-models)
  Practitioner guide to picking an OCR VLM by output format, cost and benchmark. Use for: model-selection lessons.
- [PaddleOCR (GitHub)](https://github.com/PaddlePaddle/PaddleOCR)
  PP-OCRv6 (tiny CPU OCR) and PaddleOCR-VL-1.6. Use for: rungs 1 and 3.
- [Docling (GitHub)](https://github.com/docling-project/docling)
  MIT layout-aware conversion pipeline; Granite-Docling VLM with MLX on Apple Silicon. Use for: running rungs 2 and 3 on the Mac.
- [Article: Best Open-Source OCR Models in 2026 (Roboflow, Aug 2026)](https://blog.roboflow.com/best-open-source-ocr-models/)
  Secondary roundup. Use for: discovery only; confirm every number at the primary source.
- [Docs: Structure of a WordprocessingML document (Microsoft Learn)](https://learn.microsoft.com/en-us/office/open-xml/word/structure-of-a-wordprocessingml-document)
  DOCX as a ZIP of XML parts; document, body, p, r, t; stories (header, footer, text box). Use for: anything about reading DOCX.
- [Docs: Converting a PDF file to text (pdfminer.six)](https://pdfminersix.readthedocs.io/en/latest/topic/converting_pdf_to_text.html)
  A PDF knows only characters and their placement; layout analysis groups them into lines and boxes. Use for: text layers and reading order. Lesson 1's primary source.
- [Docs: pdfminer.six FAQ, "(cid:x)" entry](https://pdfminersix.readthedocs.io/en/latest/faq.html)
  Glyph vs Unicode representations; incomplete mappings make extraction impossible; the copy-paste test. Use for: garbled text layers.
- [Docs: OCRmyPDF introduction](https://ocrmypdf.readthedocs.io/en/latest/introduction.html)
  Adds OCR text layers to scanned PDFs to make them searchable. Use for: the hidden-OCR-layer trap in test sets.

## Wisdom (Communities)

- [OmniDocBench issues](https://github.com/opendatalab/OmniDocBench/issues) and [olmOCR issues](https://github.com/allenai/olmocr/issues)
  Benchmark maintainers answer evaluation questions. Use for: "is this score comparable?"
- [Docling Discussions](https://github.com/docling-project/docling/discussions)
  Active maintainers and practitioners. Use for: pipeline, layout and reading-order questions.
- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)
  Practitioner-heavy; new OCR VLMs get tested on consumer hardware within days. Use for: "does X run on a Mac, and how fast?" reality checks.

## Gaps

- No public benchmark for resume OCR or parsing. We build a synthetic one (course step 6).
- No clearly licensed real-resume dataset found yet. Real samples stay in `data/private/`.
- Production cost figures come mostly from vendors on H100s. We need our own measurements.
