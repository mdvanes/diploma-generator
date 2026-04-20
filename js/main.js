import { fetchAssets } from "./assets.js";
import { generatePDF } from "./pdf.js";
import { toast } from "./helpers.js";
import { state } from "./state.js";
import { slugName } from "./helpers.js";

const btn = document.getElementById("btn-generate");

async function runGenerate() {
  btn.disabled = true;
  btn.classList.add("generating");
  btn.querySelector(".btn-text").textContent = "Generating…";

  try {
    const bytes = await generatePDF();
    if (!bytes) return;

    state.lastPdfBytes = bytes;
    const [datePrefixYear, datePrefixMonth] = document
      .getElementById("f-date")
      .value.trim()
      .split("-");
    const datePrefix = `${datePrefixYear}${datePrefixMonth}`;
    const certTypeForFile = document.querySelector(
      'input[name="cert-type"]:checked',
    ).value;
    state.lastFilename =
      certTypeForFile === "honorary"
        ? `${datePrefix}_HonoraryDegree_Codestar_${slugName(document.getElementById("f-name").value.trim())}.pdf`
        : `${datePrefix}_AnniversaryCodestar_${slugName(document.getElementById("f-name").value.trim())}.pdf`;

    const blob = new Blob([bytes], { type: "application/pdf" });
    const iframe = document.getElementById("preview");
    iframe.src = URL.createObjectURL(blob);
    iframe.style.display = "block";
    document.getElementById("preview-empty").style.display = "none";
    document.getElementById("preview-actions").style.display = "flex";

    toast("Certificate generated ✓");
  } catch (err) {
    console.error(err);
    toast("Error: " + err.message, true);
  } finally {
    btn.disabled = false;
    btn.classList.remove("generating");
    btn.querySelector(".btn-text").textContent = "Generate Certificate";
  }
}

btn.addEventListener("click", runGenerate);
document
  .getElementById("btn-regenerate")
  .addEventListener("click", runGenerate);
document.getElementById("btn-download").addEventListener("click", () => {
  if (!state.lastPdfBytes) return;
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(
      new Blob([state.lastPdfBytes], { type: "application/pdf" }),
    ),
    download: state.lastFilename || "certificate.pdf",
  });
  a.click();
});

document.getElementById("toast-close").addEventListener("click", () => {
  document.getElementById("toast").className = "";
});

document.querySelectorAll('input[name="cert-type"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const isHonorary = this.value === "honorary";
    document.getElementById("anniversary-only").style.display = isHonorary
      ? "none"
      : "";
  });
});

// Init
document.getElementById("f-date").value = new Date().toISOString().slice(0, 10);
fetchAssets();
