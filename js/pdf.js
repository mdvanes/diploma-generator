import { state } from "./state.js";
import { toast, formatDate, yearsLabel } from "./helpers.js";
import { getLayout } from "./layout.js";

export async function generatePDF() {
  const { PDFDocument, rgb, StandardFonts } = window.PDFLib;

  const name = document.getElementById("f-name").value.trim();
  const date = document.getElementById("f-date").value;
  const years = document.getElementById("f-years").value;
  const star = document.querySelector('input[name="star"]:checked').value;
  const certType = document.querySelector(
    'input[name="cert-type"]:checked',
  ).value;
  const isHonorary = certType === "honorary";
  const nameColor = isHonorary
    ? rgb(0.753, 0.004, 0) // #c00100 honorary
    : rgb(0.059, 0.408, 0.651); // #0f68a6 anniversary

  // Validate form
  if (!name) {
    toast("Please enter a recipient name", true);
    return null;
  }
  if (!date) {
    toast("Please select a date", true);
    return null;
  }
  if (!isHonorary && (!years || parseInt(years) < 1)) {
    toast("Please enter valid years of service", true);
    return null;
  }

  // Validate critical assets
  if (!state.template || !state.templateHonorary) {
    toast("template PDF failed to load", true);
    return null;
  }
  if (!isHonorary && !state.stars[star]) {
    toast(`star_${star}.png failed to load`, true);
    return null;
  }

  // Load template
  const templateBuffer = isHonorary ? state.templateHonorary : state.template;
  const pdfDoc = await PDFDocument.load(templateBuffer);
  pdfDoc.registerFontkit(window.fontkit);

  const pages = pdfDoc.getPages();
  if (!pages.length) throw new Error("Template PDF has no pages");
  const page = pages[0];

  // Embed fonts — fall back gracefully if custom fonts didn't load
  const font = state.font
    ? await pdfDoc.embedFont(state.font)
    : await pdfDoc.embedFont(StandardFonts.Helvetica);

  const sigFont = state.blankScriptFont
    ? await pdfDoc.embedFont(state.blankScriptFont)
    : await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Draw centre-aligned text
  function drawCentred(text, cfg, color) {
    const w = font.widthOfTextAtSize(text, cfg.size);
    const x = cfg.align === "center" ? cfg.x - w / 2 : cfg.x;
    page.drawText(text, { x, y: cfg.y, size: cfg.size, font, color });
  }

  const pronoun = document.querySelector('input[name="pronoun"]:checked').value;
  const anniversaryText = isHonorary
    ? "With all the rights, privileges, and honors pertaining thereto the"
    : `With ${pronoun} ${star} anniversary of`;
  const yearsText = isHonorary ? "Codestar Honorary Degree" : yearsLabel(years);

  const layout = getLayout();
  drawCentred(anniversaryText, layout.anniv, rgb(0, 0, 0));
  drawCentred(name, layout.name, nameColor);
  drawCentred(yearsText, layout.years, nameColor);
  drawCentred(formatDate(date), layout.date, rgb(0, 0, 0));

  // Draw signature in Blank Script font
  const signee = document.getElementById("f-signee").value.trim();
  if (signee) {
    const sigCfg = layout.sig;
    const sigW = sigFont.widthOfTextAtSize(signee, sigCfg.size);
    const sigX = sigCfg.align === "center" ? sigCfg.x - sigW / 2 : sigCfg.x;
    page.drawText(signee, {
      x: sigX,
      y: sigCfg.y,
      size: sigCfg.size,
      font: sigFont,
      color: rgb(0.12, 0.08, 0.35),
    });
  }

  // Optional border
  if (document.getElementById("f-border").checked) {
    const { width, height } = page.getSize();
    page.drawRectangle({
      x: 25.5,
      y: 25.5,
      width: width - 51,
      height: height - 51,
      borderColor: nameColor,
      borderWidth: 2.5,
    });
    page.drawRectangle({
      x: 35.4,
      y: 35.4,
      width: width - 70.8,
      height: height - 70.8,
      borderColor: nameColor,
      borderWidth: 0.8,
    });
  }

  // Embed seal (optional — skip silently if it didn't load)
  if (state.seal) {
    const sealImg = state.seal.isPng
      ? await pdfDoc.embedPng(state.seal.buffer)
      : await pdfDoc.embedJpg(state.seal.buffer);
    const ss = layout.seal.size;
    page.drawImage(sealImg, {
      x: layout.seal.x,
      y: layout.seal.y,
      width: ss,
      height: ss,
    });
  }

  // Embed star (anniversary only)
  if (!isHonorary) {
    const starAsset = state.stars[star];
    const starImg = starAsset.isPng
      ? await pdfDoc.embedPng(starAsset.buffer)
      : await pdfDoc.embedJpg(starAsset.buffer);
    const sz = layout.star.size;
    page.drawImage(starImg, {
      x: layout.star.x,
      y: layout.star.y,
      width: sz,
      height: sz,
    });
  }

  return pdfDoc.save();
}
