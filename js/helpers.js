// ── UI helpers ──────────────────────────────────────────────────────────────

export function toast(msg, isError = false) {
  const el = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  el.className = "show" + (isError ? " error" : "");
  clearTimeout(el._t);
  if (!isError) {
    el._t = setTimeout(() => (el.className = ""), 3200);
  }
}

export function setAssetStatus(id, status) {
  const el = document.getElementById("as-" + id);
  if (el) el.className = "asset-item " + status;
}

// ── Formatting ───────────────────────────────────────────────────────────────

export function formatDate(raw) {
  if (!raw) return "";
  const d = new Date(raw + "T00:00:00");
  return isNaN(d.getTime())
    ? raw
    : "On " +
        d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
}

export function yearsLabel(y) {
  const n = parseInt(y);
  return n === 1 ? "1 Year at Codestar" : `${n} Years at Codestar`;
}

export function slugName(name) {
  return (name || "certificate")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

// ── Asset utilities ───────────────────────────────────────────────────────────

export function isPng(url) {
  return url.toLowerCase().endsWith(".png");
}

export async function fetchBinary(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.arrayBuffer();
}
