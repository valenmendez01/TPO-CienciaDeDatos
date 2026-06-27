function Modelos() {
  const D = window.TPO_DATA;
  const base = D.lifts.base;
  const ops = {
    "\xC1rbol d=4": { recall: 0.79, prec: 0.111 },
    "\xC1rbol d=7": { recall: 0.73, prec: 0.125 },
    "Reg. Log\xEDstica": { recall: 0.75, prec: 0.137 },
    "Random Forest": { recall: 0.65, prec: 0.157 },
    "RF + zona k-means": { recall: 0.64, prec: 0.166 }
  };
  const [sel, setSel] = useState("Random Forest");
  const Ntest = 7570, sev = Math.round(Ntest * base);
  const op = ops[sel];
  const tp = Math.round(sev * op.recall), fn = sev - tp;
  const fp = Math.round(tp * (1 - op.prec) / op.prec), tn = Ntest - sev - fp;
  const acc = (tp + tn) / Ntest;
  const cells = [
    { lab: "Verdaderos severos", v: tp, c: "var(--green)", sub: "detectados", tone: "good" },
    { lab: "Severos perdidos", v: fn, c: "var(--severe)", sub: "falsos negativos", tone: "bad" },
    { lab: "Falsa alarma", v: fp, c: "var(--amber)", sub: "falsos positivos", tone: "meh" },
    { lab: "Leves correctos", v: tn, c: "var(--slate)", sub: "verdaderos negativos", tone: "good" }
  ];
  const rocMax = 0.86;
  return /* @__PURE__ */ React.createElement("div", { className: "view wide" }, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      num: "07",
      kicker: "Modelos",
      title: "Cinco modelos, un mismo protocolo, un <em>ganador</em>",
      lead: "Validaci\xF3n cruzada estratificada de 5 folds. No se ordena por accuracy \u2014acertar el 94% es predecir 'siempre leve'\u2014 sino por capacidad de <strong>detectar severos</strong> (recall y ROC-AUC)."
    }
  ), /* @__PURE__ */ React.createElement(Card, { title: "Comparaci\xF3n de modelos", cap: "CV 5-fold \xB7 binario LEVE vs SEVERO" }, /* @__PURE__ */ React.createElement("table", { className: "tbl" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Modelo"), /* @__PURE__ */ React.createElement("th", null, "Tipo"), /* @__PURE__ */ React.createElement("th", null, "F1 severo"), /* @__PURE__ */ React.createElement("th", null, "ROC-AUC"), /* @__PURE__ */ React.createElement("th", null, "Recall severo"), /* @__PURE__ */ React.createElement("th", null))), /* @__PURE__ */ React.createElement("tbody", null, D.models.map((m, i) => /* @__PURE__ */ React.createElement("tr", { key: i, className: m.final ? "final" : "" }, /* @__PURE__ */ React.createElement("td", null, m.name), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "left", color: "var(--mute)", fontSize: 13 } }, m.tipo), /* @__PURE__ */ React.createElement("td", { className: "m" }, m.f1.toFixed(3).replace(".", ",")), /* @__PURE__ */ React.createElement("td", { className: "m" }, m.roc.toFixed(3).replace(".", ",")), /* @__PURE__ */ React.createElement("td", { className: "m", style: { color: m.recall > 0.78 ? "var(--green)" : "var(--ink)" } }, m.recall.toFixed(2).replace(".", ",")), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "left", color: "var(--mute)", fontSize: 12 } }, m.nota))))), /* @__PURE__ */ React.createElement("div", { className: "card-note" }, "El \xE1rbol gana en ", /* @__PURE__ */ React.createElement("b", null, "recall"), " (0,79): ideal para screening, no perder casos graves. El ", /* @__PURE__ */ React.createElement("b", null, "Random Forest"), " gana en F1 de severo (0,253) y discriminaci\xF3n global (ROC-AUC 0,811). Excluimos los flags ", /* @__PURE__ */ React.createElement("b", null, "*_DESCONOCIDO"), " (sesgo de registro): sacarlos cuesta solo \u22120,015 de ROC-AUC. Sumar la zona geogr\xE1fica (k-means) da +0,005 ROC-AUC, dentro del ruido \u2014 ", /* @__PURE__ */ React.createElement("b", null, "no entr\xF3 al modelo final"), ".")), /* @__PURE__ */ React.createElement("div", { className: "grid g-2-1", style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement(Card, { title: "Matriz de confusi\xF3n", cap: `${sel} \xB7 punto de screening` }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement(Seg, { value: sel, onChange: setSel, options: Object.keys(ops).map((k) => ({ v: k, label: k.replace("RF + zona k-means", "RF + k-means").replace("Reg. Log\xEDstica", "Log\xEDstica") })) })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "90px 1fr 1fr", gridTemplateRows: "auto 1fr 1fr", gap: 8, alignItems: "stretch" } }, /* @__PURE__ */ React.createElement("div", null), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontFamily: "var(--ff-mono)", fontSize: 10.5, letterSpacing: ".06em", color: "var(--mute)", textTransform: "uppercase", paddingBottom: 4 } }, "Predijo severo"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontFamily: "var(--ff-mono)", fontSize: 10.5, letterSpacing: ".06em", color: "var(--mute)", textTransform: "uppercase", paddingBottom: 4 } }, "Predijo leve"), [["Es severo", cells[0], cells[1]], ["Es leve", cells[2], cells[3]]].map((row, ri) => /* @__PURE__ */ React.createElement(React.Fragment, { key: ri }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", fontFamily: "var(--ff-mono)", fontSize: 10.5, letterSpacing: ".06em", color: "var(--mute)", textTransform: "uppercase", paddingRight: 8 } }, row[0]), [row[1], row[2]].map((c, ci) => /* @__PURE__ */ React.createElement("div", { key: ci, style: { background: `color-mix(in srgb, ${c.c} 14%, var(--card))`, border: `1px solid color-mix(in srgb, ${c.c} 40%, transparent)`, borderRadius: 10, padding: "18px 16px", minHeight: 96, display: "flex", flexDirection: "column", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 34, fontWeight: 500, color: c.c, lineHeight: 1 } }, /* @__PURE__ */ React.createElement(CountUp, { value: c.v, fmt: nf })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, marginTop: 6 } }, c.lab), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 10.5, color: "var(--mute)", marginTop: 2 } }, c.sub))))))), /* @__PURE__ */ React.createElement("div", { className: "grid", style: { gridTemplateColumns: "1fr", gap: 20 } }, /* @__PURE__ */ React.createElement(Card, { title: "Recall de severos", cap: "prioridad del modelo" }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 50, fontWeight: 500, color: "var(--green)", lineHeight: 1 } }, /* @__PURE__ */ React.createElement(CountUp, { value: op.recall * 100, fmt: (v) => Math.round(v) }), "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--mute)", marginTop: 6 } }, "de cada 100 severos reales, detecta ", Math.round(op.recall * 100))), /* @__PURE__ */ React.createElement(Card, { title: "Precisi\xF3n", cap: "costo del screening" }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 50, fontWeight: 500, color: "var(--amber)", lineHeight: 1 } }, /* @__PURE__ */ React.createElement(CountUp, { value: op.prec * 100, fmt: (v) => Math.round(v) }), "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--mute)", marginTop: 6 } }, "marca de m\xE1s para no perder casos graves \u2014 tolerable en priorizaci\xF3n, no en predicci\xF3n puntual")), /* @__PURE__ */ React.createElement(Card, { title: "Accuracy", cap: "por qu\xE9 no se usa" }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 50, fontWeight: 500, color: "var(--slate)", lineHeight: 1 } }, /* @__PURE__ */ React.createElement(CountUp, { value: acc * 100, fmt: (v) => Math.round(v) }), "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--mute)", marginTop: 6 } }, '"siempre leve" ya dar\xEDa 94%: por eso la accuracy enga\xF1a con clases desbalanceadas')))), /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "Poder discriminante: ROC-AUC",
      cap: "\xE1rea bajo la curva",
      style: { marginTop: 20 },
      note: "Chequeo de robustez declarado: re-evaluado solo sobre el 57% de casos con datos completos, el ROC-AUC baja a 0,74 \u2014 ese es el poder discriminante real, descontando el sesgo de registro (los casos graves se documentan m\xE1s completos)."
    },
    /* @__PURE__ */ React.createElement(
      Bars,
      {
        data: D.models.map((m) => ({ k: m.name, v: m.roc })),
        yKey: "v",
        color: "var(--slate)",
        maxN: rocMax,
        fmtVal: (v) => v.toFixed(3).replace(".", ","),
        showRate: false,
        barH: 28,
        gap: 11
      }
    )
  ));
}
window.Modelos = Modelos;
