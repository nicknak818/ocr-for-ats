# Mission: Evaluate any OCR technique for ATS resume parsing

## Why

I want to be able to evaluate any OCR technique or vendor for resume parsing in depth: understand how it works, test it on documents I control, and judge accuracy, cost and production fitness from evidence rather than claims. Along the way I want real deployment experience in a production-like cloud environment.

## Success looks like

- I can explain how any OCR technique turns a PDF or DOCX into text, and place it on the compute ladder.
- I have a resume test set with ground truth (PDF and DOCX) and can score any technique on it: CER, reading order, field-level F1.
- I have run one evaluation across at least one model per affordable rung plus one hosted vendor-style option, and written a comparison a buyer could act on: accuracy, failure modes, cost per 1K resumes, latency, licence.
- I have deployed an OCR pipeline and its evaluation harness to a production-like cloud environment (AWS, chosen 2026-09-12; $50/month cap with billing alerts), with monitoring, cost controls and teardown.
- I hold a vendor-evaluation checklist I can apply to a new OCR product within an hour.

## Constraints

- Starting from zero in OCR. Depth of understanding over tool tours.
- Inputs: PDF and Word (DOCX) files only; no photos.
- Modest cloud spend is fine. Budget alarms and teardown habits from day one.
- Local hardware: Apple M1, 8 GB RAM.
- Lean: recent, relevant tech only. Also learning to drive the agent harness well.

## Out of scope

- Training OCR models from scratch.
- Handwriting, photographed documents, historical or non-Latin scripts.
- Building a full ATS product. The goal is evaluation skill plus deployment experience.
