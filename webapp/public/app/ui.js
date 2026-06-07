function PageHead({ num, kicker, title, lead }) {
  return /* @__PURE__ */ React.createElement("div", { className: "page-head" }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, /* @__PURE__ */ React.createElement("span", { className: "num" }, num), /* @__PURE__ */ React.createElement("span", null, kicker), /* @__PURE__ */ React.createElement("span", { className: "line" })), /* @__PURE__ */ React.createElement("h2", { className: "page-title", dangerouslySetInnerHTML: { __html: title } }), lead && /* @__PURE__ */ React.createElement("p", { className: "page-lead", dangerouslySetInnerHTML: { __html: lead } }));
}
function Card({ title, cap, note, children, className = "", style }) {
  return /* @__PURE__ */ React.createElement("div", { className: `card ${className}`, style }, (title || cap) && /* @__PURE__ */ React.createElement("div", { className: "card-h" }, title && /* @__PURE__ */ React.createElement("h3", null, title), cap && /* @__PURE__ */ React.createElement("span", { className: "cap" }, cap)), children, note && /* @__PURE__ */ React.createElement("div", { className: "card-note" }, note));
}
function StatRow({ items }) {
  return /* @__PURE__ */ React.createElement("div", { className: "statrow" }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { className: "statcell", key: i }, /* @__PURE__ */ React.createElement("div", { className: `stat-num ${it.sev ? "sev" : ""}` }, it.render ? it.render : /* @__PURE__ */ React.createElement(CountUp, { value: it.value, fmt: it.fmt || ((v) => nf(Math.round(v))) }), it.unit && /* @__PURE__ */ React.createElement("span", { className: "u" }, it.unit)), /* @__PURE__ */ React.createElement("div", { className: "stat-lab" }, it.label), it.sub && /* @__PURE__ */ React.createElement("div", { className: "stat-sub" }, it.sub))));
}
function Legend({ items }) {
  return /* @__PURE__ */ React.createElement("div", { className: "legend" }, items.map((it, i) => /* @__PURE__ */ React.createElement("span", { className: "lg", key: i }, it.line ? /* @__PURE__ */ React.createElement("span", { className: "swatch-line", style: { background: it.color } }) : /* @__PURE__ */ React.createElement("span", { className: "sw", style: { background: it.color } }), it.label)));
}
function Seg({ value, options, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "seg" }, options.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.v, className: value === o.v ? "on" : "", onClick: () => onChange(o.v) }, o.label)));
}
function Chips({ value, options, onChange, multi, sev }) {
  const arr = multi ? value || [] : [value];
  const toggle = (v) => {
    if (multi) {
      const s = new Set(value || []);
      s.has(v) ? s.delete(v) : s.add(v);
      onChange([...s]);
    } else onChange(v);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "chips" }, options.map((o) => {
    const on = arr.includes(o.v ?? o);
    return /* @__PURE__ */ React.createElement("button", { key: o.v ?? o, className: `chip ${on ? "on" : ""} ${sev && on ? "sev" : ""}`, onClick: () => toggle(o.v ?? o) }, o.label ?? o);
  }));
}
Object.assign(window, { PageHead, Card, StatRow, Legend, Seg, Chips });
