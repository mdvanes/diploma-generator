// Shared mutable application state.
// All asset buffers are populated by assets.js after page load.

export const state = {
  template: null, // ArrayBuffer
  templateHonorary: null, // ArrayBuffer
  font: null, // ArrayBuffer
  seal: null, // { buffer: ArrayBuffer, isPng: boolean }
  stars: {
    bronze: null, // { buffer: ArrayBuffer, isPng: boolean }
    silver: null,
    gold: null,
  },
  lastPdfBytes: null, // Uint8Array — most recently generated PDF
  lastFilename: null, // string — suggested download filename
  blankScriptFont: null, // ArrayBuffer
};
