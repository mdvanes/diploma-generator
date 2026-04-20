import { ASSETS } from "./config.js";
import { state } from "./state.js";
import { setAssetStatus, isPng, fetchBinary } from "./helpers.js";

export async function fetchAssets() {
  const btn = document.getElementById("btn-generate");

  async function load(assetId, url, onSuccess) {
    setAssetStatus(assetId, "loading");
    try {
      const buf = await fetchBinary(url);
      onSuccess(buf);
      setAssetStatus(assetId, "ok");
    } catch (e) {
      console.warn(`[assets] Failed to fetch "${url}":`, e.message);
      setAssetStatus(assetId, "err");
    }
  }

  await Promise.all([
    load("template", ASSETS.template, (buf) => {
      state.template = buf;
    }),
    load("template-honorary", ASSETS.templateHonorary, (buf) => {
      state.templateHonorary = buf;
    }),
    load("font", ASSETS.font, (buf) => {
      state.font = buf;
    }),
    load("seal", ASSETS.seal, (buf) => {
      state.seal = { buffer: buf, isPng: isPng(ASSETS.seal) };
    }),
    load("star-bronze", ASSETS.starBronze, (buf) => {
      state.stars.bronze = { buffer: buf, isPng: isPng(ASSETS.starBronze) };
    }),
    load("star-silver", ASSETS.starSilver, (buf) => {
      state.stars.silver = { buffer: buf, isPng: isPng(ASSETS.starSilver) };
    }),
    load("star-gold", ASSETS.starGold, (buf) => {
      state.stars.gold = { buffer: buf, isPng: isPng(ASSETS.starGold) };
    }),
    load("blank-script", ASSETS.blankScript, (buf) => {
      state.blankScriptFont = buf;
    }),
  ]);

  if (state.template && state.font) {
    btn.disabled = false;
    btn.querySelector(".btn-text").textContent = "Generate Certificate";
  } else {
    btn.querySelector(".btn-text").textContent = "Missing assets — see console";
  }
}
