/**
 * Reads the layout configuration from the DOM inputs.
 * @returns {object} layout
 */
export function getLayout() {
  const n = (id) => parseFloat(document.getElementById(id).value) || 0;
  return {
    anniv: {
      x: n("lx-anniv-x"),
      y: n("lx-anniv-y"),
      size: n("lx-anniv-size"),
      align: "center",
    },
    name: {
      x: n("lx-name-x"),
      y: n("lx-name-y"),
      size: n("lx-name-size"),
      align: "center",
    },
    years: {
      x: n("lx-years-x"),
      y: n("lx-years-y"),
      size: n("lx-years-size"),
      align: "center",
    },
    date: {
      x: n("lx-date-x"),
      y: n("lx-date-y"),
      size: n("lx-date-size"),
      align: "center",
    },
    star: {
      x: n("lx-star-x"),
      y: n("lx-star-y"),
      size: n("lx-star-size"),
    },
    seal: {
      x: n("lx-seal-x"),
      y: n("lx-seal-y"),
      size: n("lx-seal-size"),
    },
    sig: {
      x: n("lx-sig-x"),
      y: n("lx-sig-y"),
      size: n("lx-sig-size"),
      align: "center",
    },
  };
}
