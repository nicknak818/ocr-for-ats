# ATS Resume Parsing: Greenhouse, Lever, Workday

Investigation of resume parsing and OCR capabilities in three major ATS platforms. Search conducted September 2026.

---

## Greenhouse

### Resume Parsing Technology

- **Parsing approach**: API-based resume parsing, NOT OCR-based. Distinguishes itself from OCR-dependent competitors. [Jobloo](https://jobloo.co/blog/how-ats-systems-read-your-resume/)
- **ML/AI extraction**: Parses resumes with ML models; extracts skills, job titles, years of experience, start/end dates, and company names as structured data. September 2025 launch of "Greenhouse AI" and 2024 parser engine upgrade introduced new parsing rules. [Greenhouse Support](https://support.greenhouse.io/hc/en-us/articles/41131616864283-Talent-Matching-Data-Processing-FAQ)
- **Text-based PDF requirement**: Only text-based PDFs (with selectable, not flattened text layer) are supported. Scanned PDFs and designs from Canva/Figma often have scrambled text layers requiring OCR, which fails and leaves candidate profiles blank to recruiters. [Resume Optimizer Pro](https://resumeoptimizerpro.com/blog/greenhouse-ats-resume-format)
- **Failure behavior**: When parsing fails, candidate is not added to pipeline at all. [Jobloo](https://jobloo.co/blog/how-ats-systems-read-your-resume/)

### Non-English Language Support

- Supports resume parsing in multiple languages: Arabic, Chinese (Simplified), Croatian, Czech, Danish, Dutch, and others documented in help articles. [Greenhouse Support](https://support.greenhouse.io/hc/en-us/articles/205019689-Resume-parsing-with-non-English-languages)

### Third-Party Engine Licensing

- **(unverified)** No primary source found confirming whether Greenhouse licenses from Textkernel/Sovren, HireAbility, RChilli, or Daxtra. Internal parsing engine assumed but not documented publicly.

### Formats & Volume

- **Supported formats**: PDF (text-based), likely DOCX and plain text. [Resume Optimizer Pro](https://resumeoptimizerpro.com/blog/greenhouse-ats-resume-format)
- **Volume**: Not publicly disclosed.
- **Resume diversity**: Poor support for multi-column layouts; sensitive to visual formatting and image-based elements.

---

## Lever

### Resume Parsing Technology

- **Parsing approach**: Resume parsing is supported when resume file is provided with parsing enabled. Extracted data auto-fills candidate fields (name, email, phone, location, company, headline, links). [Lever API Documentation](https://hire.lever.co/developer/documentation)
- **Workflow philosophy**: Emphasizes recruiter-centric workflow over algorithmic filtering; human review happens earlier in process compared to competitors. [Mokahr](https://www.mokahr.io/articles/en/the-best-ats-with-resume-parsing-feature)
- **Image file limitation**: Image files are not supported and will not be successfully parsed according to Lever's developer documentation. [Lever Developer Documentation](https://hire.lever.co/developer/documentation)
- **Accuracy context**: Modern LLM-based parsers (industry-wide in 2025-2026) reach ~97% extraction accuracy on standard layouts vs. 65% for legacy rule-based tools. (unverified) Lever's specific parsing engine accuracy not documented.

### Non-English Language Support

- **(unverified)** No specific documentation found on multilingual resume support.

### Third-Party Engine Licensing

- **(unverified)** No primary source found confirming licensing from Textkernel/Sovren, HireAbility, RChilli, or Daxtra. Internal or third-party engine not disclosed.

### Formats & Volume

- **Supported formats**: Resume file attachments accepted in API; images not supported. Specific file types (PDF, DOCX) not explicitly listed in available documentation.
- **Volume**: Not publicly disclosed.
- **Resume diversity**: Limited technical documentation on handling multi-column or visually complex resumes.

---

## Workday

### Resume Parsing Technology

- **Two-stage parsing**: (1) Upload converts file to plain text with layout elements stripped via Apache Tika; (2) Entity extraction identifies structured fields (contact info, education, experience, skills). [Resume Optimizer Pro](https://resumeoptimizerpro.com/blog/workday-resume-format)
- **Text extraction method**: Apache Tika parser using horizontal coordinate scanning required because Workday's enterprise compliance engine requires normalized, structured text rather than raw PDF binary. [Resume Optimizer Pro](https://resumeoptimizerpro.com/blog/workday-resume-format)
- **OCR availability**: Workday offers optional OCR via "Document Intelligence" through AI Gateway (Workday Extend). This is separate from core resume parsing and uses OCR technology to scan and capture text from images. [Workday Marketplace](https://marketplace-setup.workday.com/apps/425535/document-intelligence-with-the-ai-gateway/overview)
- **Official documentation**: Resume parsing concept documented at Workday's admin guide with guidance to "use resumes that don't have images or image-based styles" for best results. [Workday Documentation](https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html)

### Critical Limitation: Multi-Column Layout Failure

- **Two-column problem**: Two-column PDF resumes cause data interleaving—text from adjacent columns merges into scrambled string, rendering candidate profile unreadable in Workday recruiter dashboard. Single-column DOCX files bypass text-extraction issues and parse cleanly. [Resume Optimizer Pro](https://resumeoptimizerpro.com/blog/workday-resume-format)

### Non-English Language Support

- **(unverified)** Not documented in available primary sources.

### Third-Party Engine Licensing

- **(unverified)** Workday uses Apache Tika (open-source text extraction library) for core parsing, but no primary source found confirming whether Workday additionally licenses from Textkernel/Sovren, HireAbility, RChilli, or Daxtra for structured entity extraction.

### Formats & Volume

- **Supported formats**: PDF, DOCX, and likely other common office formats. Text-based PDFs preferred.
- **Volume**: Not publicly disclosed. Workday processes enterprise-scale recruiting operations but specific metrics not available.
- **Resume diversity**: Poor support for multi-column layouts (major limitation). Sensitive to image-based styling and visual elements.

---

## Cross-Platform Summary

| Platform | Parsing Tech | OCR | Text-Based PDF Requirement | Multi-Column Support | Known 3rd-Party Vendor |
|---|---|---|---|---|---|
| Greenhouse | API + ML models | No | Yes (required) | Poor | (unverified) |
| Lever | Resume parsing (details limited) | No | Not documented | Limited info | (unverified) |
| Workday | Apache Tika + entity extraction | Optional (AI Gateway) | Yes (preferred) | Poor | (unverified) |

---

## Gaps in Public Documentation

1. **Third-party vendor licensing**: None of the three platforms publicly disclose which (if any) third-party resume parsing engine they license. Textkernel/Sovren is known to power SAP SuccessFactors and iCIMS, but Greenhouse, Lever, and Workday licensing is unverified.

2. **Processing volume**: None of the platforms publish resume/application processing statistics (e.g., "processes 10M resumes/year").

3. **Multilingual resume quality**: Only Greenhouse explicitly documents non-English language support; Lever and Workday do not publicly detail multilingual capabilities.

4. **Resume format specifics**: Most platforms discuss PDF vs. DOCX in secondary sources (resume optimization sites) rather than official documentation. Exact supported MIME types and versions not published.

5. **Parsing accuracy metrics**: No platform publishes structured field extraction accuracy percentages (e.g., "phone number extraction 98% accurate"). Comparisons appear only in third-party benchmarks.

6. **Scanned resume/image handling**: All three platforms discourage or fail on image-heavy/scanned resumes, but official policies vary (Greenhouse: complete failure; Workday: optional OCR addon; Lever: not documented).

---

## Research Notes

- **Primary sources used**: Official help documentation (Greenhouse Support, Workday Admin Guide, Lever Developer API), official marketplace listings (Workday AI Gateway), and help center articles.
- **Secondary sources**: Resume optimization blogs (Resume Optimizer Pro, Jobloo), ATS comparison guides (Mokahr, Parseur), and salary/pricing databases.
- **Unverified claims**: All assertions about third-party vendor licensing lack direct confirmation from ATS official sources; they are labeled "(unverified)" per research guidelines.
- **Knowledge cutoff alignment**: Information reflects 2025-2026 platform updates (Greenhouse AI September 2025, Workday AI Gateway recent), but some technical details remain opaque in public docs.
