function Gauge({ p, base, size = 240 }) {
  const mounted = useMounted();
  const sw = size / 12, r = (size - sw) / 2 - 6, cx = size / 2, cy = size / 2;
  const C = Math.PI * r;
  const arc = (frac) => frac * C;
  const col = p >= 0.25 ? "var(--severe)" : p >= 0.1 ? "var(--amber)" : "var(--green)";
  const numF = size * 0.245, pctF = size * 0.11, labF = Math.max(11, size * 0.046);
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
  ), (() => {
    const a = Math.PI * (1 - Math.min(base / 0.6, 1));
    const x1 = cx + (r - sw / 2 - 2) * Math.cos(a), y1 = cy - (r - sw / 2 - 2) * Math.sin(a), x2 = cx + (r + sw / 2 + 2) * Math.cos(a), y2 = cy - (r + sw / 2 + 2) * Math.sin(a);
    return /* @__PURE__ */ React.createElement("line", { x1, y1, x2, y2, stroke: "var(--ink)", strokeWidth: "2" });
  })()), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontWeight: 500, fontSize: numF, lineHeight: 1, color: col, letterSpacing: "-.02em" } }, /* @__PURE__ */ React.createElement(CountUp, { value: p * 100, fmt: (v) => v.toFixed(1).replace(".", ",") }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: pctF } }, "%")), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: labF, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--mute)", marginTop: 6 } }, "prob. de ser severo")));
}
function PredecirGravedad({ slide = false } = {}) {
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
  const inputs = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "pred-fields" }, /* @__PURE__ */ React.createElement(Field, { label: "V\xEDctima" }, /* @__PURE__ */ React.createElement(Select, { value: vic, onChange: setVic, options: D.sevByVictima.filter((v) => v.n > 200).map((v) => v.k) })), /* @__PURE__ */ React.createElement(Field, { label: "Franja horaria" }, /* @__PURE__ */ React.createElement(Select, { value: fra, onChange: setFra, options: D.franjaOrder })), /* @__PURE__ */ React.createElement(Field, { label: "Tipo de v\xEDa" }, /* @__PURE__ */ React.createElement(Select, { value: via, onChange: setVia, options: D.byCalle.map((c) => c.k) })), /* @__PURE__ */ React.createElement(Field, { label: "Edad media" }, /* @__PURE__ */ React.createElement(Select, { value: age, onChange: setAge, options: D.byAge.map((a) => a.k) }))), /* @__PURE__ */ React.createElement("label", { className: "pred-check" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: finde, onChange: (e) => setFinde(e.target.checked) }), "Ocurre un fin de semana"), /* @__PURE__ */ React.createElement("div", { className: "divider", style: { margin: slide ? "22px 0" : "16px 0" } }), /* @__PURE__ */ React.createElement("div", { className: "card-h", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h3", null, "Aporte de cada factor"), /* @__PURE__ */ React.createElement("span", { className: "cap" }, "lift")), /* @__PURE__ */ React.createElement("div", null, factors.map((f, i) => {
    const up = f.lift >= 1;
    const w = Math.min(Math.abs(Math.log(f.lift)) / Math.log(2.6) * 50, 50);
    return /* @__PURE__ */ React.createElement("div", { className: "factor-row", key: i }, /* @__PURE__ */ React.createElement("span", { className: "factor-name" }, f.name), /* @__PURE__ */ React.createElement("div", { className: "factor-bar" }, /* @__PURE__ */ React.createElement("span", { style: { [up ? "left" : "right"]: "50%", width: w + "%", background: up ? "var(--severe)" : "var(--green)" } })), /* @__PURE__ */ React.createElement("span", { className: "factor-lift", style: { color: up ? "var(--severe)" : "var(--green)" } }, "\xD7", f.lift.toFixed(2).replace(".", ",")));
  })));
  const result = /* @__PURE__ */ React.createElement("div", { className: "pred-result" }, /* @__PURE__ */ React.createElement(Gauge, { p, base, size: slide ? 330 : 240 }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 24, height: 2, background: "var(--ink)", display: "inline-block" } }), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: slide ? 16 : 11.5, color: "var(--mute)" } }, "base global ", pct(base, 1))), /* @__PURE__ */ React.createElement("p", { className: "pred-blurb" }, "Cada factor multiplica la chance base; el resultado se acota en escala log\xEDstica \u2014 los ", /* @__PURE__ */ React.createElement("strong", null, "lifts de Apriori"), " combinados equivalen a una regresi\xF3n log\xEDstica."));
  if (slide) return /* @__PURE__ */ React.createElement("div", { className: "app-embed pred-slide grav" }, /* @__PURE__ */ React.createElement("div", { className: "pred-split" }, /* @__PURE__ */ React.createElement("div", { className: "pred-inputs" }, inputs), result), /* @__PURE__ */ React.createElement("div", { className: "pred-foot" }, "Modelo ", /* @__PURE__ */ React.createElement("b", null, "explicativo / screening post-siniestro"), ": usa variables conocidas despu\xE9s del hecho. Sirve para priorizar y entender factores, no para predecir antes de que ocurra."));
  return /* @__PURE__ */ React.createElement(Card, { title: "\xBFLeve o severo?", cap: "modelo de lifts \xB7 explicable" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24, alignItems: "center", marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "none" } }, result)), inputs, /* @__PURE__ */ React.createElement("div", { className: "card-note" }, "Es un modelo ", /* @__PURE__ */ React.createElement("b", null, "explicativo / screening post-siniestro"), ": usa variables conocidas despu\xE9s del hecho. Sirve para priorizar y entender factores, no para predecir antes de que ocurra."));
}
function PredecirCantidad({ slide = false } = {}) {
  const D = window.TPO_DATA;
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
  const inputs = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "pred-fields" }, /* @__PURE__ */ React.createElement(Field, { label: "D\xEDa de la semana" }, /* @__PURE__ */ React.createElement(Select, { value: dow, onChange: (v) => setDow(+v), options: D.dowNames.map((n, i) => ({ v: i, label: n })) })), /* @__PURE__ */ React.createElement(Field, { label: "A\xF1o (nivel de tr\xE1nsito)" }, /* @__PURE__ */ React.createElement(Select, { value: yr, onChange: (v) => setYr(+v), options: [2021, 2022, 2023, 2024].map((y) => ({ v: y, label: String(y) })) }))), /* @__PURE__ */ React.createElement(Field, { label: `Lluvia del d\xEDa \u2014 ${mm} mm` }, /* @__PURE__ */ React.createElement("input", { type: "range", min: "0", max: "40", value: mm, onChange: (e) => setMm(+e.target.value), style: { width: "100%" } })), /* @__PURE__ */ React.createElement("label", { className: "pred-check", style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: fer, onChange: (e) => setFer(e.target.checked) }), "Es feriado ", /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: slide ? 13 : 11, color: "var(--mute)" } }, "(driver #1)")), /* @__PURE__ */ React.createElement("div", { className: "divider", style: { margin: slide ? "22px 0" : "16px 0" } }), /* @__PURE__ */ React.createElement("div", { className: "card-h", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h3", null, "Descomposici\xF3n"), /* @__PURE__ */ React.createElement("span", { className: "cap" }, "siniestros/d\xEDa")), /* @__PURE__ */ React.createElement("div", null, regParts.map((p2, i) => /* @__PURE__ */ React.createElement("div", { className: "factor-row", key: i }, /* @__PURE__ */ React.createElement("span", { className: "factor-name" }, p2.lab), /* @__PURE__ */ React.createElement("span", { className: "factor-lift", style: { color: !p2.sign ? "var(--ink)" : p2.val < 0 ? "var(--green)" : "var(--severe)" } }, p2.sign ? p2.val >= 0 ? "+" : "\u2212" : "", p2.sign ? Math.abs(p2.val).toFixed(1).replace(".", ",") : p2.val.toFixed(1).replace(".", ",")))), /* @__PURE__ */ React.createElement("div", { className: "factor-row", style: { borderTop: "1.5px solid var(--ink)", marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "factor-name", style: { fontWeight: 600 } }, "Predicci\xF3n"), /* @__PURE__ */ React.createElement("span", { className: "factor-lift", style: { color: "var(--slate)", fontSize: slide ? 17 : 14 } }, pred.toFixed(1).replace(".", ",")))));
  const result = /* @__PURE__ */ React.createElement("div", { className: "pred-result" }, /* @__PURE__ */ React.createElement("div", { className: "pred-bignum", style: { color: "var(--slate)" } }, /* @__PURE__ */ React.createElement(CountUp, { value: pred, fmt: (v) => Math.round(v) })), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: slide ? 18 : 12, color: "var(--mute)", letterSpacing: ".05em", marginTop: 4 } }, "siniestros ese d\xEDa"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "tag", style: { borderColor: pred < R.meanDaily ? "var(--green)" : "var(--severe)", color: pred < R.meanDaily ? "var(--green)" : "var(--severe)" } }, pred < R.meanDaily ? "\u25BC" : "\u25B2", " ", Math.abs(pred - R.meanDaily).toFixed(1).replace(".", ","), " vs media de ", R.meanDaily.toFixed(1).replace(".", ","), "/d\xEDa")), /* @__PURE__ */ React.createElement("p", { className: "pred-blurb" }, "La ", /* @__PURE__ */ React.createElement("strong", null, "regresi\xF3n lineal"), " gana porque extrapola la tendencia: los \xE1rboles no predicen fuera del rango 2021\u201323. R\xB2 0,40 sobre 2024 (a\xF1o nunca visto)."));
  if (slide) return /* @__PURE__ */ React.createElement("div", { className: "app-embed pred-slide cant" }, /* @__PURE__ */ React.createElement("div", { className: "pred-split" }, /* @__PURE__ */ React.createElement("div", { className: "pred-inputs" }, inputs), result), /* @__PURE__ */ React.createElement("div", { className: "pred-foot" }, "El feriado es el driver m\xE1s fuerte \u2014 m\xE1s que cualquier variable clim\xE1tica. \xDAtil para dimensionar recursos (p. ej. guardias de emergencia) sobre un a\xF1o nunca visto."));
  return /* @__PURE__ */ React.createElement(Card, { title: "\xBFCu\xE1ntos siniestros ma\xF1ana?", cap: "regresi\xF3n lineal \xB7 /d\xEDa" }, result, inputs, /* @__PURE__ */ React.createElement("div", { className: "card-note" }, "La lineal gana porque ", /* @__PURE__ */ React.createElement("b", null, "extrapola la tendencia"), ": los \xE1rboles no predicen fuera del rango 2021\u201323. R\xB2 0,40 sobre 2024 (a\xF1o nunca visto)."));
}
function Predecir({ slide = false } = {}) {
  const cards = /* @__PURE__ */ React.createElement("div", { className: "grid g2" }, /* @__PURE__ */ React.createElement(PredecirGravedad, null), /* @__PURE__ */ React.createElement(PredecirCantidad, null));
  if (slide) return /* @__PURE__ */ React.createElement("div", { className: "app-embed pred-embed" }, cards);
  return /* @__PURE__ */ React.createElement("div", { className: "view wide" }, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      num: "03",
      kicker: "Predecir \xB7 en vivo",
      title: "Arm\xE1 un siniestro y mir\xE1 el <em>riesgo</em>",
      lead: "Dos modelos del trabajo, corriendo en el navegador. El de gravedad combina los <strong>lifts de Apriori</strong> en escala log-odds (equivale a una log\xEDstica); el de cantidad es la <strong>regresi\xF3n lineal</strong> anclada en los promedios reales."
    }
  ), cards);
}
function Field({ label, children }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "field-lab" }, label), children);
}
function Select({ value, onChange, options }) {
  const opts = options.map((o) => typeof o === "object" ? o : { v: o, label: o });
  return /* @__PURE__ */ React.createElement("div", { className: "select-wrap", style: { position: "relative" } }, /* @__PURE__ */ React.createElement("select", { value, onChange: (e) => onChange(e.target.value) }, opts.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.v, value: o.v }, o.label))), /* @__PURE__ */ React.createElement("svg", { className: "select-chevron", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M4 6l4 4 4-4" })));
}
Object.assign(window, { Predecir, PredecirGravedad, PredecirCantidad, Field, Select });
