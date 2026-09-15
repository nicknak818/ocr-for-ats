# Resume Parsing at Job Boards: LinkedIn, Indeed, ZipRecruiter, Glassdoor

Research into public disclosures about resume parsing technology by major job boards. Primary sources: official engineering blogs, published papers by research teams, patents, API documentation, and job postings revealing tech stack.

**Research Date:** September 15, 2026  
**Last Updated:** September 15, 2026

---

## LinkedIn

### What LinkedIn Publicly Says About Resume Parsing

- **Skill Extraction Approach**: LinkedIn extracts skills through a two-stage pipeline: structured parsing of raw resume input into well-formed text, then skill tagging using models fine-tuned to resume content. [LinkedIn Engineering Blog - Extracting skills from content to fuel the LinkedIn Skills Graph](https://engineering.linkedin.com/blog/2023/extracting-skills-from-content-to-fuel-the-linkedin-skills-graph)

- **Skill Tagging Methods**: Uses "trie-based tagger" for token-level matching against their skills taxonomy, and "Multilingual BERT encoders in a two-tower architecture" for semantic-based skill matches. Example: "experience with design of iOS application" maps to "Mobile Development". [LinkedIn Engineering Blog - Extracting skills from content to fuel the LinkedIn Skills Graph](https://engineering.linkedin.com/blog/2023/extracting-skills-from-content-to-fuel-the-linkedin-skills-graph)

- **Text Understanding Models**: Employs "Contextual Text Encoder and Contextual Entity Encoder" using Transformer models to capture contextual information from surrounding text. [LinkedIn Engineering Blog - Extracting skills from content to fuel the LinkedIn Skills Graph](https://engineering.linkedin.com/blog/2023/extracting-skills-from-content-to-fuel-the-linkedin-skills-graph)

- **Multitask Learning Framework**: Uses shared modules for text/entity embeddings and separate domain-specific towers for resume-specific extraction rules. [LinkedIn Engineering Blog - Extracting skills from content to fuel the LinkedIn Skills Graph](https://engineering.linkedin.com/blog/2023/extracting-skills-from-content-to-fuel-the-linkedin-skills-graph)

- **Work Experience Ranking**: For Resume Assistant feature, uses "gradient-boosted decision tree classifier" trained on human-annotated data to rank work experience descriptions by quality. System distinguishes company descriptions from actual member role descriptions. [LinkedIn Engineering Blog - Resume Assistant: Finding High-Quality Work Experience Examples](https://engineering.linkedin.com/blog/2018/08/resume-assistant--finding-high-quality-work-experience-examples)

- **Production Scale**: Processes ~200 profile edits per second with <100ms latency using Knowledge Distillation to reduce BERT model size by 80% without sacrificing performance. [LinkedIn Engineering Blog - Extracting skills from content to fuel the LinkedIn Skills Graph](https://engineering.linkedin.com/blog/2023/extracting-skills-from-content-to-fuel-the-linkedin-skills-graph)

- **Multilingual Support**: BaseNLP multilingual NLP pipeline processes resume and job domain text across seven different international languages in production, including language identification, sentence breaking, tokenization, stemming/lemmatization, POS tagging, and entity mention detection. [LinkedIn Engineering Blog - How Natural Language Processing Helps LinkedIn Members Get Support Easily](https://engineering.linkedin.com/blog/2019/04/how-natural-language-processing-help-support)

### Scale LinkedIn Processes

- **(unverified)** No publicly disclosed metric for resume parsing volume (e.g., resumes parsed per day). Search for LinkedIn job openings and investor reports did not yield this specific statistic.

### Resume Formats Accepted and Handling of Diversity

- **Supported Formats**: LinkedIn supports plain text format import for resumes and profiles. Multiple resume format guides indicate LinkedIn accepts PDF and DOCX along with plain text. [Resume Format Guide](https://www.recrew.ai/blog/7-resume-file-types-the-definitive-guide)

- **(unverified)** Specific technical limitations regarding multi-column, scanned, or non-English resume handling not publicly disclosed by LinkedIn.

### Continuous Improvement

- Feedback loops from members validating extracted skills help iteratively improve model accuracy through real-world validation signals. [LinkedIn Engineering Blog - Extracting skills from content to fuel the LinkedIn Skills Graph](https://engineering.linkedin.com/blog/2023/extracting-skills-from-content-to-fuel-the-linkedin-skills-graph)

---

## Indeed

### What Indeed Publicly Says About Resume Parsing

- **General Parsing Approaches**: Indeed's public career guidance identifies three approaches to resume parsing: statistical, keyword-based, and grammar-based methods. The article notes parsing "accepts many formats" but does not specify which approach Indeed uses internally. [Indeed Career Advice - What Is Resume Parsing?](https://www.indeed.com/career-advice/resumes-cover-letters/resume-parsing)

- **Accuracy Acknowledgement**: Indeed acknowledges that "resume parsing usually produces a high level of accuracy, it can also miss some things," recommending hiring managers review discarded resumes when feasible. [Indeed Career Advice - What Is Resume Parsing?](https://www.indeed.com/career-advice/resumes-cover-letters/resume-parsing)

- **Resume Formats**: Indeed recommends single-column layout specifically designed to meet automated parsing requirements. The Indeed Resume Builder uses single-column layout to ensure smooth processing by Indeed's ATS. [Indeed Career Advice - What Is Resume Parsing?](https://www.indeed.com/career-advice/resumes-cover-letters/resume-parsing)

### Patents and Technology

- **Computer Vision and OCR**: Indeed holds patents for "Resume management and recruitment workflow system and method" that uses computer vision and optical character recognition (OCR) technology in combination with a user feedback interface system to improve parsing quality. [US Patent 10296872](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10296872)

- **Multi-Pass Processing**: Patent describes two-pass system: first pass generates initial resume data by extracting plurality of resume text blocks; second pass involves user feedback to regroup bounding blocks for improved accuracy. [US Patent 10296872](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10296872)

- **Patent Inventors**: Technology developed by Vidhem Chhabra, Abhineet Jain, Christian Johannessen, Aditya Pandya, David Park, and others. [Patents Assigned to Indeed, Inc.](https://patents.justia.com/assignee/indeed-inc)

### Scale Indeed Processes

- **Resume Database Size**: Indeed maintains 200-245 million searchable resumes in their database (up from 150 million in 2019). [Indeed Resume Search](https://www.indeed.com/candidates) and [Indeed Newsroom](https://www.indeed.com/news/releases/indeed-opens-resume-search)

- **Total Job Seeker Profiles**: 665 million job seeker profiles company-wide, though not all are searchable/active. [Indeed Hiring Lab](https://www.hiringlab.org/indeed-data-faq-2/)

- **Resume Instant Search**: Launched feature enabling employers to see search results in real-time. [Indeed Engineering Blog - Building Resume Instant Search](https://engineering.indeedblog.com/blog/2013/08/building-resume-instant-search/)

### Resume Formats Accepted and Handling of Diversity

- **Layout Challenges**: ATS systems struggle with images, icons, tables, and multi-column layouts. [Enhancv - The State of Resume Parsing: Does ATS Read Two-Column Resumes?](https://enhancv.com/blog/ats-resume-parsing/)

- **Scanned Document Handling**: For scanned PDFs and photos of resumes, OCR converts the image to text first, then parsing identifies and structures fields. Flat image files provide no text for parser to read. [Resume Parsing Explained](https://www.theinterviewguys.com/resume-parsing-explained/)

- **Modern Multi-Column Support**: Industry consensus (across 20+ years of development) indicates modern parsing systems solve multi-column document reading via XY-Cut algorithm. However, older government and legacy enterprise systems (Taleo, older SuccessFactors) still struggle with complex layouts. [Enhancv - The State of Resume Parsing](https://enhancv.com/blog/ats-resume-parsing/)

- **Accuracy by Layout Type**: 
  - AI-based parsers: 92-97% accuracy on standard single-column, 80-90% on creative multi-column designs
  - Rule-based parsers: 80-90% on standard, 40-60% on creative layouts
  [Enhancv - The State of Resume Parsing](https://enhancv.com/blog/ats-resume-parsing/)

---

## ZipRecruiter

### What ZipRecruiter Publicly Says About Resume Parsing

- **ZipResumes Feature**: ZipRecruiter launched "ZipResumes," a parsing feature that allows hiring managers to scan resumes and quickly identify key information including education, skills, job titles, and employment history presented in clear sections. [ZipRecruiter Blog - New: View Resumes Like Never Before!](https://www.ziprecruiter.com/blog/ziprecruiter-zipresume/)

- **Partner Integration Capability**: ZipRecruiter's Apply Webhook includes jobseeker profile data "either parsed from the jobseeker's resume or entered from the profile page," indicating parsing capability for uploaded resumes. [ZipRecruiter Partner Documentation](https://www.ziprecruiter.com/partner/documentation/)

- **Resume Database Integration (RDB)**: Partner API provides access to Resume Database (RDB) Integration to receive sourced candidates from ZipRecruiter's Resume Database. [ZipRecruiter Partner Documentation](https://www.ziprecruiter.com/partner/documentation/)

### Scale ZipRecruiter Processes

- **(unverified)** No publicly disclosed metric for resume parsing volume or resume database size found in official sources.

### Resume Formats Accepted and Handling of Diversity

- **Recommended Format Standards**: ZipRecruiter advises sticking to simple, easy-to-read formats with standard web-safe fonts (Arial, Georgia, Courier, Lucida, Tahoma). Avoid special characters (arrows, emoticons) that prevent correct ATS parsing. [ZipRecruiter - Creating the Perfect Resume](https://www.ziprecruiter.com/career/resume/resume-format)

- **Multilingual Support**: (unverified) General resume parsing capabilities indicate support for PDF, DOCX, HTML, TXT, and image files with multilingual handling, but ZipRecruiter's specific multilingual capabilities not publicly documented.

- **(unverified)** Specific technical limitations regarding multi-column or scanned resume handling not publicly disclosed by ZipRecruiter.

---

## Glassdoor

### What Glassdoor Publicly Says About Resume Parsing

- **Resume Upload Feature**: Glassdoor allows users to upload, preview, replace, download, or delete resume data with privacy control options ("Make this resume visible to hiring employers"). [Glassdoor Help Center - Resume Upload and Management](https://help.glassdoor.com/s/article/Resume-Upload-and-Management)

- **Resume Discovery**: Users can make resumes visible to employers, and Glassdoor indicates option to have resumes "readily available to employers searching for ideal candidates." [Glassdoor Help Center - Resume Upload and Management](https://help.glassdoor.com/s/article/Resume-Upload-and-Management)

- **Easy Apply Integration**: Glassdoor synced profile users can enable Easy Apply which pre-fills future job applications and have option to make resumes discoverable by hiring employers on Indeed (indicating integration with Indeed's systems). [Glassdoor Help Center - Resume Upload and Management](https://help.glassdoor.com/s/article/Resume-Upload-and-Management)

### Engineering & Technology

- **Machine Learning Platform**: Glassdoor engineering team has published work on building their ML platform and artifact management solutions. [Glassdoor Engineering Blog - Building Glassdoor's Machine Learning Platform and Engineering Team](https://medium.com/glassdoor-engineering/building-glassdoors-machine-learning-platform-and-engineering-team-3bafd94d5b2b)

- **(unverified)** No published technical documentation specifically about resume parsing algorithms or OCR methodology.

### Scale Glassdoor Processes

- **(unverified)** No publicly disclosed metric for resume database size or parsing volume.

### Resume Formats Accepted and Handling of Diversity

- **(unverified)** Specific technical documentation regarding resume formats supported, multi-column handling, or OCR for scanned documents not found in official Glassdoor sources.

---

## Cross-Platform Findings

### Industry Standard Parsing Challenges

All platforms must handle:
- **Multi-column layouts**: Industry solved via XY-Cut algorithm (formalized 2005, updated 2025), but older/legacy systems still struggle. [Enhancv - The State of Resume Parsing](https://enhancv.com/blog/ats-resume-parsing/)

- **Scanned/image resumes**: Require OCR as preprocessing step before NLP extraction. [Resume OCR](https://www.lido.app/blog/resume-ocr)

- **Format diversity**: PDF vs. DOCX vs. plain text have different structural characteristics affecting parsing accuracy. [Resume Format Comparison](https://www.recrew.ai/blog/7-resume-file-types-the-definitive-guide)

- **Non-English content**: Multilingual NLP required (LinkedIn explicitly handles 7 languages in production). (unverified) Other platforms' multilingual capabilities unclear.

### Third-Party Dependencies

Industry reliance on third-party parsing engines: ATS platforms historically licensed from providers like Daxtra, Sovren, and HireAbility, many still using second-generation statistical approaches as of 2024. [Resume Parsing Analysis](https://blog.theinterviewguys.com/resume-parsing-explained/)

---

## Gaps in Public Disclosure

### Information Not Found

1. **Indeed**: 
   - Specific NLP/ML techniques or model architecture (patents describe OCR/CV but not downstream NLP)
   - Engineering blog has no dedicated article on resume parsing (despite other technical depth)
   - Scale metrics not disclosed

2. **LinkedIn**:
   - Scale metrics: resumes parsed per day or volume processed
   - Specific handling of scanned/image resumes with OCR
   - Technical details on non-English resume parsing (though multilingual support confirmed)

3. **ZipRecruiter**:
   - Parsing algorithm and ML techniques
   - Scale/volume metrics
   - Multilingual capabilities (assumed but unverified)
   - OCR handling for scanned resumes
   - Official API documentation for resume parsing

4. **Glassdoor**:
   - Any technical details on resume parsing methodology
   - Scale metrics
   - OCR capabilities for scanned documents
   - Specific algorithm or ML framework used
   - No official resume parsing API found (unlike Indeed/LinkedIn which have some disclosure)

### Unverified Claims

Several facts appear in industry articles but lack attribution to these platforms' official sources:
- Glassdoor offers resume parsing (referenced in ATS comparisons but not documented on their engineering blog)
- Specific accuracy rates claimed in industry analyses (92-97% for modern systems, 40-60% for rule-based)
- Parsing volumes ("thousands per day") – general industry standard, not platform-specific

### Research Limitations

- Web search budget exhausted (200 searches)
- Glassdoor and ZipRecruiter have minimal public engineering documentation (Glassdoor blog on Medium exists but no parsing articles; ZipRecruiter lacks public engineering blog)
- Patents provide technical detail but are often generalized and don't always reflect current production systems
- Academic papers on resume parsing exist but mostly from independent researchers, not company research teams

---

## Recommendations for Further Research

1. **Contact engineering teams directly** for technical specifications not publicly disclosed
2. **Request API documentation** from ZipRecruiter and Glassdoor support teams
3. **Monitor LinkedIn/Indeed engineering blogs** for future publications on parsing at scale
4. **Review patent applications** filed after 2023 for more recent innovations
5. **Search Google Scholar** for author affiliations with these companies' research teams
