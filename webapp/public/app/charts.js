const { useState, useEffect, useRef, useMemo } = React;
function CountUp({ value, dur = 900, fmt = (v) => Math.round(v), className, style }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    let raf, raf2;
    raf = requestAnimationFrame(() => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setV(value * e);
        if (p < 1) raf2 = requestAnimationFrame(tick);
        else setV(value);
      };
      raf2 = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
    };
  }, [value]);
  return /* @__PURE__ */ React.createElement("span", { className, style }, fmt(v));
}
function useMounted() {
  return true;
}
const COL = { severe: "var(--severe)", slate: "var(--slate)", amber: "var(--amber)", green: "var(--green)", ink: "var(--ink)", mute: "var(--mute)" };
const nf = (n) => n.toLocaleString("es-AR");
const pct = (x, d = 1) => (x * 100).toFixed(d).replace(".", ",") + "%";
function LineChart({ data, xKey, yKey, height = 260, color = "var(--slate)", fill = true, fmtX, fmtTip, markers = [] }) {
  const W = 900, H = height, padL = 46, padR = 18, padT = 18, padB = 34;
  const ys = data.map((d) => d[yKey]);
  const maxY = Math.max(...ys) * 1.12, minY = 0;
  const px = (i) => padL + i / (data.length - 1) * (W - padL - padR);
  const py = (vv) => H - padB - (vv - minY) / (maxY - minY) * (H - padT - padB);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(d[yKey]).toFixed(1)}`).join(" ");
  const area = `${line} L${px(data.length - 1)},${H - padB} L${padL},${H - padB} Z`;
  const yticks = 4;
  const [hover, setHover] = useState(null);
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      viewBox: `0 0 ${W} ${H}`,
      width: "100%",
      style: { display: "block" },
      onMouseLeave: () => setHover(null),
      onMouseMove: (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const xr = (e.clientX - r.left) / r.width * W;
        let best = 0, bd = 1e9;
        data.forEach((d, i) => {
          const dd = Math.abs(px(i) - xr);
          if (dd < bd) {
            bd = dd;
            best = i;
          }
        });
        setHover(best);
      }
    },
    Array.from({ length: yticks + 1 }).map((_, i) => {
      const vv = maxY * i / yticks, y = py(vv);
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: padL, x2: W - padR, y1: y, y2: y, className: "grid-line", opacity: i === 0 ? 0 : 0.6 }), /* @__PURE__ */ React.createElement("text", { x: padL - 9, y: y + 4, textAnchor: "end", className: "axis-lab" }, Math.round(vv)));
    }),
    fill && /* @__PURE__ */ React.createElement("path", { d: area, fill: color, opacity: ".10" }),
    /* @__PURE__ */ React.createElement("path", { className: "ch-line", d: line, pathLength: "1", fill: "none", stroke: color, strokeWidth: "2.5", strokeLinejoin: "round", strokeLinecap: "round", strokeDasharray: "1" }),
    markers.map((m, i) => {
      const idx = data.findIndex((d) => d[xKey] === m.at);
      if (idx < 0) return null;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: px(idx), x2: px(idx), y1: padT, y2: H - padB, stroke: "var(--severe)", strokeWidth: "1", strokeDasharray: "3 3", opacity: ".5" }), /* @__PURE__ */ React.createElement("text", { x: px(idx) + 6, y: padT + 12, className: "axis-lab", fill: "var(--severe)" }, m.label));
    }),
    data.map((d, i) => (i % Math.ceil(data.length / 8) === 0 || i === data.length - 1) && /* @__PURE__ */ React.createElement("text", { key: i, x: px(i), y: H - 12, textAnchor: "middle", className: "axis-lab" }, fmtX ? fmtX(d[xKey]) : d[xKey])),
    hover != null && /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("line", { x1: px(hover), x2: px(hover), y1: padT, y2: H - padB, stroke: "var(--ink)", strokeWidth: "1", opacity: ".25" }), /* @__PURE__ */ React.createElement("circle", { cx: px(hover), cy: py(data[hover][yKey]), r: "4.5", fill: color, stroke: "var(--card)", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("g", { transform: `translate(${Math.min(px(hover) + 10, W - 150)},${padT + 6})` }, /* @__PURE__ */ React.createElement("rect", { width: "142", height: "46", rx: "7", fill: "var(--ink)", opacity: ".94" }), /* @__PURE__ */ React.createElement("text", { x: "12", y: "19", fill: "var(--paper)", style: { font: "600 12px var(--ff-mono)" } }, fmtTip ? fmtTip(data[hover][xKey]) : fmtX ? fmtX(data[hover][xKey]) : data[hover][xKey]), /* @__PURE__ */ React.createElement("text", { x: "12", y: "36", fill: "var(--paper)", style: { font: "500 12px var(--ff-sans)", opacity: 0.85 } }, nf(data[hover][yKey]), " siniestros")))
  );
}
function Columns({ data, yKey = "n", height = 260, color = "var(--slate)", rateKey, fmtX, fmtVal = nf, gap = 0.28 }) {
  const W = 900, H = height, padL = 46, padR = rateKey ? 46 : 18, padT = 20, padB = 34;
  const maxY = Math.max(...data.map((d) => d[yKey])) * 1.14;
  const maxR = rateKey ? Math.max(...data.map((d) => d[rateKey])) * 1.25 : 1;
  const bw = (W - padL - padR) / data.length, barW = bw * (1 - gap);
  const py = (vv) => H - padB - vv / maxY * (H - padT - padB);
  const pr = (vv) => H - padB - vv / maxR * (H - padT - padB);
  const [hover, setHover] = useState(null);
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", style: { display: "block" } }, Array.from({ length: 5 }).map((_, i) => {
    const vv = maxY * i / 4, y = py(vv);
    return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: padL, x2: W - padR, y1: y, y2: y, className: "grid-line", opacity: i === 0 ? 0 : 0.55 }), /* @__PURE__ */ React.createElement("text", { x: padL - 9, y: y + 4, textAnchor: "end", className: "axis-lab" }, Math.round(vv)));
  }), data.map((d, i) => {
    const x = padL + i * bw + (bw - barW) / 2, h = H - padB - py(d[yKey]), y = py(d[yKey]);
    return /* @__PURE__ */ React.createElement("g", { key: i, onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null) }, /* @__PURE__ */ React.createElement(
      "rect",
      {
        className: "ch-col",
        x,
        y,
        width: barW,
        height: Math.max(0, h),
        rx: "2.5",
        fill: color,
        opacity: hover == null || hover === i ? 1 : 0.45,
        style: { animationDelay: `${i * 0.025}s` }
      }
    ), hover === i && /* @__PURE__ */ React.createElement("text", { x: x + barW / 2, y: y - 7, textAnchor: "middle", className: "val-lab" }, fmtVal(d[yKey])));
  }), rateKey && /* @__PURE__ */ React.createElement("g", null, Array.from({ length: 5 }).map((_, i) => {
    const vv = maxR * i / 4;
    return /* @__PURE__ */ React.createElement("text", { key: i, x: W - padR + 9, y: pr(vv) + 4, textAnchor: "start", className: "axis-lab", fill: "var(--severe)" }, (vv * 100).toFixed(0), "%");
  }), /* @__PURE__ */ React.createElement("path", { className: "ch-line", pathLength: "1", strokeDasharray: "1", d: data.map((d, i) => `${i === 0 ? "M" : "L"}${padL + i * bw + bw / 2},${pr(d[rateKey])}`).join(" "), fill: "none", stroke: "var(--severe)", strokeWidth: "2" }), data.map((d, i) => /* @__PURE__ */ React.createElement("circle", { key: i, className: "ch-dot", cx: padL + i * bw + bw / 2, cy: pr(d[rateKey]), r: "3", fill: "var(--severe)", style: { animationDelay: `${0.5 + i * 0.02}s` } }))), data.map((d, i) => (data.length <= 14 || i % Math.ceil(data.length / 12) === 0) && /* @__PURE__ */ React.createElement("text", { key: i, x: padL + i * bw + bw / 2, y: H - 12, textAnchor: "middle", className: "axis-lab" }, fmtX ? fmtX(d.k) : d.k)));
}
function Bars({ data, yKey = "n", labelKey = "k", rateKey, color = "var(--slate)", fmtVal = nf, maxN, barH = 30, gap = 12, showRate = true }) {
  const max = maxN || Math.max(...data.map((d) => d[yKey]));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap } }, data.map((d, i) => {
    const w = d[yKey] / max * 100;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "118px 1fr auto", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, textAlign: "right", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, d[labelKey]), /* @__PURE__ */ React.createElement("div", { style: { height: barH, background: "var(--paper-3)", borderRadius: 4, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { className: "ch-growx", style: { position: "absolute", left: 0, top: 0, bottom: 0, width: w + "%", background: color, borderRadius: 4, animationDelay: `${i * 0.04}s` } }), rateKey && showRate && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", right: 9, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: "var(--ff-mono)", fontSize: 11, fontWeight: 600, color: "var(--severe)" } }, pct(d[rateKey], 1), " sev.")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 13, fontWeight: 600, minWidth: 54, textAlign: "right" } }, /* @__PURE__ */ React.createElement(CountUp, { value: d[yKey], fmt: fmtVal })));
  }));
}
function Heat({ matrix, rows, cols, metric = "rate", fmt }) {
  const flat = matrix.flat();
  const vals = flat.map((c) => metric === "rate" ? c.n ? c.s / c.n : 0 : c.n);
  const max = Math.max(...vals), min = Math.min(...vals);
  const [hover, setHover] = useState(null);
  const color = (vv) => {
    const t = (vv - min) / (max - min || 1);
    return `color-mix(in srgb, var(--severe) ${(8 + t * 82).toFixed(0)}%, var(--paper-2))`;
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: `58px repeat(${cols.length},1fr)`, gap: 6 } }, /* @__PURE__ */ React.createElement("div", null), cols.map((c, j) => /* @__PURE__ */ React.createElement("div", { key: j, style: { fontFamily: "var(--ff-mono)", fontSize: 10.5, letterSpacing: ".04em", color: "var(--mute)", textAlign: "center", textTransform: "capitalize" } }, c.toLowerCase())), rows.map((r, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 11.5, color: "var(--mute)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 } }, r), cols.map((c, j) => {
    const cell = matrix[i][j];
    const vv = metric === "rate" ? cell.n ? cell.s / cell.n : 0 : cell.n;
    const on = hover && hover[0] === i && hover[1] === j;
    const t = (vv - min) / (max - min || 1);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: j,
        className: "ch-heat",
        onMouseEnter: () => setHover([i, j]),
        onMouseLeave: () => setHover(null),
        style: {
          aspectRatio: "1.7/1",
          borderRadius: 6,
          background: color(vv),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--ff-mono)",
          fontSize: 11.5,
          fontWeight: 600,
          color: t > 0.55 ? "#fff" : "var(--ink)",
          cursor: "default",
          outline: on ? "2px solid var(--ink)" : "none",
          outlineOffset: -2,
          animationDelay: `${(i * cols.length + j) * 0.012}s`
        }
      },
      fmt ? fmt(metric === "rate" ? vv : cell.n) : metric === "rate" ? (vv * 100).toFixed(1) : nf(cell.n)
    );
  }))));
}
function Donut({ segments, size = 180, thickness = 26, center }) {
  const r = (size - thickness) / 2, C = 2 * Math.PI * r, cx = size / 2;
  let acc = 0;
  const total = segments.reduce((a, s) => a + s.v, 0);
  return /* @__PURE__ */ React.createElement("div", { className: "ch-pop", style: { position: "relative", width: size, height: size } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, style: { transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx, cy: cx, r, fill: "none", stroke: "var(--paper-3)", strokeWidth: thickness }), segments.map((s, i) => {
    const frac = s.v / total, dash = frac * C, off = acc * C;
    acc += frac;
    return /* @__PURE__ */ React.createElement("circle", { key: i, cx, cy: cx, r, fill: "none", stroke: s.color, strokeWidth: thickness, strokeDasharray: `${dash} ${C}`, strokeDashoffset: -off });
  })), center && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } }, center));
}
Object.assign(window, { CountUp, useMounted, LineChart, Columns, Bars, Heat, Donut, COL, nf, pct });
