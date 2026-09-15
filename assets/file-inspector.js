/* File inspector: what does this resume file actually contain?
   Characters in XML (DOCX), a PDF text layer (characters placed on the page), or only pixels (needs OCR).
   Everything runs in the browser; the file never leaves the machine.
   Load first: JSZip 3.10.1, then pdf.js 3.11.174 as pdf.min.js followed by pdf.worker.min.js
   (the worker script as a plain <script> lets pdf.js run on the main thread, since file:// pages
   can't always start a Web Worker).
   Usage: FileInspector.mount(element, { samples: window.RESUME_SAMPLES }) */
(function () {
  "use strict";
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const MC = "http://schemas.openxmlformats.org/markup-compatibility/2006";
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  const MAX_PAGES = 3;  // resumes are short; keeps rendering quick
  const TEXT_MIN = 20;  // fewer visible characters than this counts as "no text layer"
  const THUMB_W = 220;  // rendered page width in CSS pixels

  // Characters outside Latin, punctuation and common symbols. A text layer made mostly of these
  // usually means glyphs without a usable Unicode mapping: the "garbled copy-paste" case.
  const ODD = /[^\x20-\x7e\u00a0-\u024f\u2000-\u2bff]/;

  const fmt = (n) => n.toLocaleString("en-US");
  const kb = (n) => (n < 1024 ? n + " B" : fmt(Math.round(n / 1024)) + " KB");
  const b64ToBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else n.setAttribute(k, v);
    }
    for (const k of kids) if (k != null && k !== false) n.append(k);
    return n;
  }
  const pre = (text, cls) =>
    el("pre", { class: "insp-pre" + (cls ? " " + cls : ""), text: text && text.trim() ? text : "(nothing: zero characters)" });
  const chip = (text) => el("span", { class: "chip", text });
  const verdict = (kind, head, detail) =>
    el("div", { class: "insp-verdict " + kind }, el("strong", { text: head }), detail ? " " + detail : null);
  const block = (title, note, body) =>
    el("div", { class: "insp-block" }, el("h3", { text: title }), note ? el("p", { class: "insp-note", text: note }) : null, body);

  // Identify the file by its first bytes, not its name.
  function sniff(bytes) {
    const head = new TextDecoder("latin1").decode(bytes.slice(0, 1024));
    if (head.includes("%PDF")) return "pdf";
    if (head.startsWith("PK\x03\x04")) return "zip";
    if (head.startsWith("\xd0\xcf\x11\xe0")) return "ole"; // legacy binary .doc
    return "unknown";
  }

  // ---------- DOCX ----------

  // Walk every w:t / w:tab / w:br in document order, starting a new line at each new paragraph.
  // Skips mc:Fallback, where Word keeps a second copy of shape and text-box content for older readers.
  function wordText(xml) {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (doc.getElementsByTagName("parsererror").length) throw new Error("the XML inside this DOCX is malformed");
    const inFallback = (n) => { for (; n; n = n.parentNode) if (n.namespaceURI === MC && n.localName === "Fallback") return true; return false; };
    const paraOf = (n) => { for (; n; n = n.parentNode) if (n.namespaceURI === W && n.localName === "p") return n; return null; };
    const parts = [];
    let lastP = null, paras = 0;
    for (const n of doc.getElementsByTagNameNS(W, "*")) {
      const name = n.localName;
      if ((name !== "t" && name !== "tab" && name !== "br") || inFallback(n)) continue;
      const p = paraOf(n);
      if (p !== lastP) { if (lastP) parts.push("\n"); lastP = p; paras++; }
      parts.push(name === "t" ? n.textContent : name === "tab" ? "\t" : "\n");
    }
    const boxes = Array.from(doc.getElementsByTagNameNS(W, "txbxContent")).filter((n) => !inFallback(n)).length;
    const sample = Array.from(doc.getElementsByTagNameNS(W, "p")).find((p) => !inFallback(p) && p.textContent.trim());
    const text = parts.join("");
    return { text, paras, boxes, chars: text.replace(/\s/g, "").length, sample: sample ? new XMLSerializer().serializeToString(sample) : "" };
  }

  // Indent XML one tag per line; drop namespace and revision-ID attributes so the structure shows.
  function prettyXml(s, maxLines = 32) {
    s = s.replace(/ xmlns(:\w+)?="[^"]*"/g, "").replace(/ w:rsid\w*="[^"]*"/g, "");
    const lines = [];
    let depth = 0;
    for (const line of s.replace(/>\s*</g, ">\n<").split("\n")) {
      if (line.startsWith("</")) depth--;
      lines.push("  ".repeat(Math.max(depth, 0)) + line);
      if (/^<[^!?/]/.test(line) && !line.endsWith("/>") && !/<\/[^>]+>$/.test(line)) depth++;
    }
    return lines.length > maxLines ? lines.slice(0, maxLines).join("\n") + "\n  …" : lines.join("\n");
  }

  async function inspectDocx(bytes, out) {
    const zip = await JSZip.loadAsync(bytes);
    const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir).sort();
    const main = zip.file("word/document.xml");
    if (!main) { out.append(verdict("warn", "This ZIP isn't a Word document.", "It has no word/document.xml part.")); return; }
    const body = wordText(await main.async("string"));
    const isHf = (n) => /^word\/(header|footer)\d*\.xml$/.test(n);
    const hfNames = names.filter(isHf);
    let hfChars = 0;
    for (const n of hfNames) hfChars += wordText(await zip.file(n).async("string")).chars;
    const media = names.filter((n) => n.startsWith("word/media/"));
    const s = (n) => (n === 1 ? "" : "s");

    out.append(body.chars
      ? verdict("ok", "No OCR needed.", `The words are stored as characters in word/document.xml: ${fmt(body.paras)} paragraphs, ${fmt(body.chars)} characters.`)
      : verdict("warn", "No text in the body.", media.length ? "The content is probably images, and those images would need OCR." : "The main document part is empty."));
    if (media.length) out.append(verdict("warn", `${media.length} embedded image${s(media.length)}.`, "If one contains text (a pasted screenshot, a logo with words), only OCR can read it."));
    if (hfChars) out.append(verdict("warn", `${fmt(hfChars)} characters sit in headers or footers.`, "They live in separate parts; a parser that reads only document.xml misses them."));
    if (body.boxes) out.append(verdict("warn", `${body.boxes} text box${body.boxes === 1 ? "" : "es"}.`, "Text boxes are separate stories; their text may not come out where you expect."));

    out.append(el("div", { class: "insp-chips" },
      chip(`${names.length} parts`), chip(`${fmt(body.paras)} paragraphs`), chip(`${fmt(body.chars)} characters`),
      chip(`${media.length} image${s(media.length)}`), chip(`${hfNames.length} header/footer part${s(hfNames.length)}`), chip(`${body.boxes} text box${body.boxes === 1 ? "" : "es"}`)));

    const notes = { "word/document.xml": "the body text", "word/styles.xml": "fonts and formatting" };
    const listing = names.map((n) => {
      const why = notes[n] || (isHf(n) ? "header or footer text" : n.startsWith("word/media/") ? "an image: only this could need OCR" : "");
      return why ? n.padEnd(30) + " ← " + why : n;
    }).join("\n");
    out.append(el("div", { class: "insp-grid2" },
      block("Inside the ZIP", "A .docx is a ZIP of XML files, called parts.", pre(listing, "xml")),
      block("One paragraph of document.xml", "Paragraph <w:p>, run <w:r>, text <w:t>. Namespace attributes removed.", pre(prettyXml(body.sample), "xml"))));
    out.append(block("Body text, in stored order", "What a text extractor gets. No OCR involved.", pre(body.text.slice(0, 4000))));
  }

  // ---------- PDF ----------

  function imageOps() {
    const O = pdfjsLib.OPS;
    return new Set([O.paintImageXObject, O.paintInlineImageXObject, O.paintImageMaskXObject, O.paintImageXObjectRepeat,
      O.paintImageMaskXObjectRepeat, O.paintImageMaskXObjectGroup, O.paintInlineImageXObjectGroup, O.paintJpegXObject]
      .filter((x) => x !== undefined));
  }

  // A naive reader: group text into rows by baseline, top to bottom, then left to right, ignoring columns.
  // Four spaces mark a jump across a wide horizontal gap.
  function acrossOrder(items) {
    const rows = [];
    for (const it of items) {
      if (!it.str.trim()) continue;
      const [, , , d, x, y] = it.transform;
      const h = Math.abs(d) || it.height || 10;
      let row = rows.find((r) => Math.abs(r.y - y) < Math.min(r.h, h) * 0.5);
      if (!row) rows.push((row = { y, h, cells: [] }));
      row.cells.push({ x, w: it.width || 0, s: it.str });
    }
    rows.sort((a, b) => b.y - a.y);
    return rows.map((r) => {
      r.cells.sort((a, b) => a.x - b.x);
      let line = "", end = null;
      for (const c of r.cells) {
        if (end !== null) { const gap = c.x - end; line += gap > 12 ? "    " : gap > 1 && !line.endsWith(" ") ? " " : ""; }
        line += c.s;
        end = c.x + c.w;
      }
      return line.replace(/ {5,}/g, "    ").trim();
    }).join("\n");
  }

  async function renderPage(page, canvas) {
    const base = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: (THUMB_W / base.width) * (window.devicePixelRatio || 1) });
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
  }

  async function inspectPdf(bytes, out) {
    const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    const ops = imageOps();
    const pages = [];
    for (let i = 1; i <= Math.min(pdf.numPages, MAX_PAGES); i++) {
      const page = await pdf.getPage(i);
      const items = (await page.getTextContent()).items.filter((it) => typeof it.str === "string");
      const images = (await page.getOperatorList()).fnArray.filter((f) => ops.has(f)).length;
      const stored = items.map((it) => it.str + (it.hasEOL ? "\n" : "")).join("");
      const visible = Array.from(stored.replace(/\s/g, ""));
      const odd = visible.filter((c) => ODD.test(c)).length;
      const kind = visible.length < TEXT_MIN ? "pixels" : odd / visible.length > 0.2 ? "garbled" : "text";
      pages.push({ page, i, items, stored, images, kind, chars: visible.length });
    }

    const bad = pages.filter((p) => p.kind !== "text").length;
    const more = pdf.numPages > MAX_PAGES ? ` (first ${MAX_PAGES} of ${pdf.numPages} pages shown)` : "";
    if (!bad) out.append(verdict("ok", "No OCR needed to get the characters.", `Every page has a readable text layer${more}. Their order still has to be rebuilt: compare the two text columns below.`));
    else if (bad === pages.length) out.append(verdict("warn", "OCR needed.", `No page has a usable text layer${more}. To a text extractor, this file is pictures of pages.`));
    else out.append(verdict("warn", "OCR needed on some pages.", `${bad} of ${pages.length} pages have no usable text layer${more}.`));
    if (pages.some((p) => p.kind === "garbled")) out.append(verdict("warn", "Garbled text layer.", "Characters exist, but most don't map to ordinary letters. Treat those pages as pixels and OCR them."));

    for (const p of pages) {
      const canvas = el("canvas", { "aria-label": `Rendered page ${p.i}` });
      const label = { text: "text layer", garbled: "garbled text layer", pixels: "pixels only" }[p.kind];
      out.append(
        el("div", { class: "insp-chips" }, chip(`page ${p.i}`), chip(`${fmt(p.chars)} characters`), chip(`${p.images} image${p.images === 1 ? "" : "s"}`), chip(label)),
        el("div", { class: "insp-page" },
          block("What a person sees", "The page, rendered.", canvas),
          block("What the file stores", "Text items in the order they sit in the file.", pre(p.stored.slice(0, 4000))),
          block("Read straight across", "Top to bottom, left to right, ignoring columns.", pre(acrossOrder(p.items).slice(0, 4000)))));
      await renderPage(p.page, canvas);
    }
  }

  // ---------- UI ----------

  function mount(root, opts) {
    const samples = (opts && opts.samples) || {};
    if (window.pdfjsLib && !pdfjsLib.GlobalWorkerOptions.workerSrc) pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js";
    const out = el("div", { class: "insp-out", "aria-live": "polite" });
    const input = el("input", { type: "file", accept: ".pdf,.docx" });
    input.hidden = true;
    const bar = el("div", { class: "insp-bar" }, el("span", { text: "Try a sample:" }));
    for (const s of Object.values(samples)) {
      const b = el("button", { type: "button", text: s.label });
      b.addEventListener("click", () => run(s.name, b64ToBytes(s.b64)));
      bar.append(b);
    }
    const pick = el("button", { type: "button", class: "insp-own", text: "Open your own file…" });
    pick.addEventListener("click", () => input.click());
    bar.append(pick, el("span", { class: "insp-note", text: "or drop one on this box. It never leaves your computer." }), input);
    input.addEventListener("change", () => { if (input.files[0]) runFile(input.files[0]); });
    root.addEventListener("dragover", (e) => { e.preventDefault(); root.classList.add("dragging"); });
    root.addEventListener("dragleave", () => root.classList.remove("dragging"));
    root.addEventListener("drop", (e) => { e.preventDefault(); root.classList.remove("dragging"); if (e.dataTransfer.files[0]) runFile(e.dataTransfer.files[0]); });
    root.append(bar, out);

    async function runFile(f) { const bytes = new Uint8Array(await f.arrayBuffer()); input.value = ""; run(f.name, bytes); }

    let latest = 0;
    async function run(name, bytes) {
      const mine = ++latest;
      out.replaceChildren(el("p", { class: "insp-file", text: `${name} · ${kb(bytes.length)} · reading…` }));
      const kind = sniff(bytes);
      const body = el("div");
      try {
        if (kind === "pdf") { if (!window.pdfjsLib) throw new Error("pdf.js didn't load. The inspector needs internet access once, to fetch it from cdnjs."); await inspectPdf(bytes.slice(), body); }
        else if (kind === "zip") { if (!window.JSZip) throw new Error("JSZip didn't load. The inspector needs internet access once, to fetch it from cdnjs."); await inspectDocx(bytes, body); }
        else if (kind === "ole") body.append(verdict("warn", "Legacy .doc (binary Word 97-2003).", "Out of scope for this course: convert it to .docx first."));
        else body.append(verdict("warn", "Not a PDF or DOCX.", "The inspector checks the file's first bytes, not its name."));
      } catch (err) {
        body.append(verdict("warn", "Couldn't read this file.", String((err && err.message) || err)));
      }
      if (mine !== latest) return; // a newer file was chosen meanwhile
      const label = { pdf: "PDF", zip: "DOCX (a ZIP)", ole: "legacy DOC", unknown: "unknown type" }[kind];
      out.replaceChildren(el("p", { class: "insp-file", text: `${name} · ${kb(bytes.length)} · ${label}` }), body);
    }
  }

  window.FileInspector = { mount };
})();
