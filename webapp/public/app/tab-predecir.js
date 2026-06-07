function Gauge({ p, base }) {
  const mounted = useMounted();
  const size = 240, sw = 20, r = (size - sw) / 2 - 6, cx = size / 2, cy = size / 2;
  const C = Math.PI * r;
  const arc = (frac) => frac * C;
  const col = p >= 0.25 ? "var(--severe)" : p >= 0.1 ? "var(--amber)" : "var(--green)";
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: size, height: size / 2 + 30 } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size / 2 + 30, viewBox: `0 0 ${size} ${size / 2 + 30}` }, /* @__PURE__ */ React.createElement("path", { d: `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`, fill: "none", stroke: "var(--paper-3)", strokeWidth: sw, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement(
    "path",
    {
      d: `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`,
      fill: "none",
      stroke: col,
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeDasharray: `${arc(Math.min(p / 0.6, 1))} ${C}`,
      style: { transition: "stroke-dasharray 1s var(--ease), stroke .4s" },
      opacity: mounted ? 1 : 0
    }
  ), /* @__PURE__ */ React.createElement("line", { x1: cx - (r + sw / 2 + 3), x2: cx - (r - sw / 2 - 3), y1: cy, y2: cy, stroke: "transparent" }), (() => {
    const a = Math.PI * (1 - Math.min(base / 0.6, 1));
    const x1 = cx + (r - sw / 2 - 2) * Math.cos(a), y1 = cy - (r - sw / 2 - 2) * Math.sin(a), x2 = cx + (r + sw / 2 + 2) * Math.cos(a), y2 = cy - (r + sw / 2 + 2) * Math.sin(a);
    return /* @__PURE__ */ React.createElement("line", { x1, y1, x2, y2, stroke: "var(--ink)", strokeWidth: "2" });
  })()), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontWeight: 500, fontSize: 58, lineHeight: 1, color: col, letterSpacing: "-.02em" } }, /* @__PURE__ */ React.createElement(CountUp, { value: p * 100, fmt: (v) => v.toFixed(1).replace(".", ",") }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 26 } }, "%")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--mute)", marginTop: 6 } }, "prob. de ser severo")));
}
function Predecir() {
  const D = window.TPO_DATA;
  const base = D.lifts.base;
  const liftOf = (arr, k) => {
    const f = arr.find((x) => x.k === k);
    return f ? f.lift : 1;
  };
  const [vic, setVic] = useState("PEATON");
  const [fra, setFra] = useState("MADRUGADA");
  const [via, setVia] = useState("AVENIDA");
  const [age, setAge] = useState("65+");
  const [finde, setFinde] = useState(true);
  const factors = [
    { name: `V\xEDctima: ${vic.toLowerCase()}`, lift: liftOf(D.sevByVictima, vic) },
    { name: `Franja: ${fra.toLowerCase()}`, lift: liftOf(D.sevByFranja, fra) },
    { name: `V\xEDa: ${via === "AV. GRAL. PAZ" ? "gral. paz" : via.toLowerCase()}`, lift: liftOf(D.sevByCalle, via) },
    { name: `Edad: ${age}`, lift: (D.byAge.find((a) => a.k === age)?.rate || base) / base },
    ...finde ? [{ name: "Fin de semana", lift: D.lifts.finde.lift }] : []
  ];
  let logit = Math.log(base / (1 - base));
  factors.forEach((f) => logit += Math.log(f.lift || 1));
  const p = 1 / (1 + Math.exp(-logit));
  const maxLift = Math.max(...factors.map((f) => f.lift), 1 / Math.min(...factors.map((f) => f.lift)));
  const [dow, setDow] = useState(5);
  const [fer, setFer] = useState(false);
  const [mm, setMm] = useState(0);
  const [yr, setYr] = useState(2024);
  const R = D.reg;
  const dowBase = R.meanByDow[dow].media;
  const ferDelta = fer ? R.feriadoEff.feriado - R.feriadoEff.noFeriado : 0;
  const rainDelta = mm * R.coef.lluvia_mm;
  const trendDelta = R.meanByYear[yr] - R.meanDaily;
  const pred = Math.max(0, dowBase + ferDelta + rainDelta + trendDelta);
  const regParts = [
    { lab: `${D.dowNames[dow]} (base)`, val: dowBase, sign: false },
    { lab: fer ? "Feriado" : "D\xEDa com\xFAn", val: ferDelta, sign: true, show: fer },
    { lab: `Lluvia ${mm}mm`, val: rainDelta, sign: true, show: mm > 0 },
    { lab: `A\xF1o ${yr} (exposici\xF3n)`, val: trendDelta, sign: true, show: Math.abs(trendDelta) > 0.3 }
  ].filter((x) => x.show !== false);
  return /* @__PURE__ */ React.createElement("div", { className: "view wide" }, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      num: "03",
      kicker: "Predecir \xB7 en vivo",
      title: "Arm\xE1 un siniestro y mir\xE1 el <em>riesgo</em>",
      lead: "Dos modelos del trabajo, corriendo en el navegador. El de gravedad combina los <strong>lifts de Apriori</strong> en escala log-odds (equivale a una log\xEDstica); el de cantidad es la <strong>regresi\xF3n lineal</strong> anclada en los promedios reales."
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "grid g2" }, /* @__PURE__ */ React.createElement(Card, { title: "\xBFLeve o severo?", cap: "modelo de lifts \xB7 explicable" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "center", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "none" } }, /* @__PURE__ */ React.createElement(Gauge, { p, base })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-2)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 18, height: 2, background: "var(--ink)", display: "inline-block" } }), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11 } }, "base global ", pct(base, 1))), "Cada factor multiplica la chance base. El resultado se acota en escala log\xEDstica \u2014 por eso combinaciones extremas no superan el 100%.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px", marginBottom: 18 } }, /* @__PURE__ */ React.createElement(Field, { label: "V\xEDctima" }, /* @__PURE__ */ React.createElement(Select, { value: vic, onChange: setVic, options: D.sevByVictima.filter((v) => v.n > 200).map((v) => v.k) })), /* @__PURE__ */ React.createElement(Field, { label: "Franja horaria" }, /* @__PURE__ */ React.createElement(Select, { value: fra, onChange: setFra, options: D.franjaOrder })), /* @__PURE__ */ React.createElement(Field, { label: "Tipo de v\xEDa" }, /* @__PURE__ */ React.createElement(Select, { value: via, onChange: setVia, options: D.byCalle.map((c) => c.k) })), /* @__PURE__ */ React.createElement(Field, { label: "Edad media" }, /* @__PURE__ */ React.createElement(Select, { value: age, onChange: setAge, options: D.byAge.map((a) => a.k) }))), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: finde, onChange: (e) => setFinde(e.target.checked), style: { width: 16, height: 16, accentColor: "var(--severe)" } }), "Ocurre un fin de semana"), /* @__PURE__ */ React.createElement("div", { className: "divider", style: { margin: "16px 0" } }), /* @__PURE__ */ React.createElement("div", { className: "card-h", style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("h3", null, "Aporte de cada factor"), /* @__PURE__ */ React.createElement("span", { className: "cap" }, "lift")), /* @__PURE__ */ React.createElement("div", null, factors.map((f, i) => {
    const up = f.lift >= 1;
    const w = Math.min(Math.abs(Math.log(f.lift)) / Math.log(2.6) * 50, 50);
    return /* @__PURE__ */ React.createElement("div", { className: "factor-row", key: i }, /* @__PURE__ */ React.createElement("span", { className: "factor-name" }, f.name), /* @__PURE__ */ React.createElement("div", { className: "factor-bar" }, /* @__PURE__ */ React.createElement("span", { style: { [up ? "left" : "right"]: "50%", width: w + "%", background: up ? "var(--severe)" : "var(--green)" } })), /* @__PURE__ */ React.createElement("span", { className: "factor-lift", style: { color: up ? "var(--severe)" : "var(--green)" } }, "\xD7", f.lift.toFixed(2).replace(".", ",")));
  })), /* @__PURE__ */ React.createElement("div", { className: "card-note" }, "Es un modelo ", /* @__PURE__ */ React.createElement("b", null, "explicativo / screening post-siniestro"), ": usa variables conocidas despu\xE9s del hecho. Sirve para priorizar y entender factores, no para predecir antes de que ocurra.")), /* @__PURE__ */ React.createElement(Card, { title: "\xBFCu\xE1ntos siniestros ma\xF1ana?", cap: "regresi\xF3n lineal \xB7 /d\xEDa" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 14, justifyContent: "center", padding: "14px 0 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontWeight: 500, fontSize: 84, lineHeight: 0.9, letterSpacing: "-.02em", color: "var(--slate)" } }, /* @__PURE__ */ React.createElement(CountUp, { value: pred, fmt: (v) => Math.round(v) })), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 12, color: "var(--mute)", letterSpacing: ".05em" } }, "siniestros", /* @__PURE__ */ React.createElement("br", null), "ese d\xEDa")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("span", { className: "tag", style: { borderColor: pred < R.meanDaily ? "var(--green)" : "var(--severe)", color: pred < R.meanDaily ? "var(--green)" : "var(--severe)" } }, pred < R.meanDaily ? "\u25BC" : "\u25B2", " ", Math.abs(pred - R.meanDaily).toFixed(1).replace(".", ","), " vs media de ", R.meanDaily.toFixed(1).replace(".", ","), "/d\xEDa")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 18px", marginBottom: 18 } }, /* @__PURE__ */ React.createElement(Field, { label: "D\xEDa de la semana" }, /* @__PURE__ */ React.createElement(Select, { value: dow, onChange: (v) => setDow(+v), options: D.dowNames.map((n, i) => ({ v: i, label: n })) })), /* @__PURE__ */ React.createElement(Field, { label: "A\xF1o (nivel de tr\xE1nsito)" }, /* @__PURE__ */ React.createElement(Select, { value: yr, onChange: (v) => setYr(+v), options: [2021, 2022, 2023, 2024].map((y) => ({ v: y, label: String(y) })) }))), /* @__PURE__ */ React.createElement(Field, { label: `Lluvia del d\xEDa \u2014 ${mm} mm` }, /* @__PURE__ */ React.createElement("input", { type: "range", min: "0", max: "40", value: mm, onChange: (e) => setMm(+e.target.value), style: { width: "100%", accentColor: "var(--slate)" } })), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, margin: "14px 0 4px" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: fer, onChange: (e) => setFer(e.target.checked), style: { width: 16, height: 16, accentColor: "var(--slate)" } }), "Es feriado ", /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11, color: "var(--mute)" } }, "(driver #1)")), /* @__PURE__ */ React.createElement("div", { className: "divider", style: { margin: "16px 0" } }), /* @__PURE__ */ React.createElement("div", { className: "card-h", style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("h3", null, "Descomposici\xF3n"), /* @__PURE__ */ React.createElement("span", { className: "cap" }, "siniestros/d\xEDa")), /* @__PURE__ */ React.createElement("div", null, regParts.map((p2, i) => /* @__PURE__ */ React.createElement("div", { className: "factor-row", key: i }, /* @__PURE__ */ React.createElement("span", { className: "factor-name" }, p2.lab), /* @__PURE__ */ React.createElement("span", { className: "factor-lift", style: { color: !p2.sign ? "var(--ink)" : p2.val < 0 ? "var(--green)" : "var(--severe)" } }, p2.sign ? p2.val >= 0 ? "+" : "\u2212" : "", p2.sign ? Math.abs(p2.val).toFixed(1).replace(".", ",") : p2.val.toFixed(1).replace(".", ",")))), /* @__PURE__ */ React.createElement("div", { className: "factor-row", style: { borderTop: "1.5px solid var(--ink)", marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "factor-name", style: { fontWeight: 600 } }, "Predicci\xF3n"), /* @__PURE__ */ React.createElement("span", { className: "factor-lift", style: { color: "var(--slate)", fontSize: 14 } }, pred.toFixed(1).replace(".", ",")))), /* @__PURE__ */ React.createElement("div", { className: "card-note" }, "La lineal gana porque ", /* @__PURE__ */ React.createElement("b", null, "extrapola la tendencia"), ": los \xE1rboles no predicen fuera del rango 2021\u201323. R\xB2 0,40 sobre 2024 (a\xF1o nunca visto)."))));
}
function Field({ label, children }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "field-lab" }, label), children);
}
function Select({ value, onChange, options }) {
  const opts = options.map((o) => typeof o === "object" ? o : { v: o, label: o });
  return /* @__PURE__ */ React.createElement("div", { className: "select-wrap", style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value,
      onChange: (e) => onChange(e.target.value),
      style: { width: "100%", appearance: "none", font: "500 13.5px var(--ff-sans)", color: "var(--ink)", background: "var(--paper-2)", border: "1px solid var(--hair-2)", borderRadius: 8, padding: "9px 30px 9px 12px", cursor: "pointer" }
    },
    opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.v, value: o.v }, o.label))
  ), /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--mute)", fontSize: 11 } }, "\u25BC"));
}
Object.assign(window, { Predecir, Field, Select });
