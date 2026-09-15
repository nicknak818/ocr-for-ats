# Mission is evaluation depth, plus a deployment track

At kickoff (2026-09-12) the learner chose the vendor-evaluator angle and defined the goal as being able to evaluate *any* OCR technique in depth. They added a production-like deployment track on AWS or Databricks, accepted modest cloud spend, and limited inputs to PDF and Word files. See [[MISSION.md]].

**Implications**: The course backbone is the six-question evaluation scorecard in `NOTES.md`. DOCX never needs OCR and born-digital PDFs rarely do, so the test set must deliberately include image-only (flattened or scanned) PDFs, or OCR is never exercised (pending the learner's confirmation). The deployment platform decision is open.
