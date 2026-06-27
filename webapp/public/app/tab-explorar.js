function Explorar({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const [metric, setMetric] = useState("vol");
  const [comMode, setComMode] = useState("n");
  const [yearF, setYearF] = useState("todos");
  const isSev = metric === "sev";
  const barColor = isSev ? "var(--severe)" : "var(--slate)";
  if (slide) return /* @__PURE__ */ React.createElement("div", { className: "app-embed explorar-embed" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 18, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Seg, { value: metric, onChange: setMetric, options: [{ v: "vol", label: "Volumen" }, { v: "sev", label: "% Severo" }] }), /* @__PURE__ */ React.createElement(Legend, { items: isSev ? [{ color: "var(--severe)", label: "% que termina severo" }] : [{ color: "var(--slate)", label: "Cantidad de siniestros" }, { color: "var(--severe)", line: true, label: "% severo (eje der.)" }] })), /* @__PURE__ */ React.createElement("div", { className: "grid g2" }, /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "Cu\xE1ndo: siniestros por hora del d\xEDa",
      cap: isSev ? "% severo" : "volumen + % severo",
      note: "El volumen pica en la hora pico vespertina (17\u201319h). Pero la franja m\xE1s severa es la madrugada: pocos siniestros, mucha gravedad \u2014 velocidad real en calles vac\xEDas. No es ruido por pocos casos: aun con intervalo de confianza al 95%, el piso de la madrugada (12,6% a las 3h) duplica al techo de la tarde (~4%)."
    },
    /* @__PURE__ */ React.createElement(Columns, { data: D.byHour, yKey: "n", rateKey: "rate", height: 300, color: "var(--slate)", fmtX: (h) => h + "h" })
  ), /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "D\xEDa \xD7 franja horaria",
      cap: isSev ? "% severo" : "volumen",
      note: "Madrugada de s\xE1bado y domingo: el doble de siniestros que un martes, y 12,1% severos vs 5,5% del resto."
    },
    /* @__PURE__ */ React.createElement(
      Heat,
      {
        matrix: D.heat,
        rows: D.dowNames,
        cols: D.franjaOrder,
        metric: isSev ? "rate" : "n",
        fmt: isSev ? (v) => (v * 100).toFixed(0) : (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : n
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Legend, { items: [{ color: "var(--paper-2)", label: "menos" }, { color: "var(--severe)", label: isSev ? "m\xE1s severo" : "m\xE1s volumen" }] }))
  )));
  const serie = yearF === "todos" ? D.serie : D.serie.filter((d) => d.ym.startsWith(yearF));
  const victs = D.byVictima.slice(0, 8);
  const comunaData = [...D.byComuna].sort((a, b) => comMode === "tasa" ? b.tasa - a.tasa : comMode === "rate" ? b.rate - a.rate : b.n - a.n).map((c) => ({ k: "Comuna " + c.comuna, n: c.n, rate: c.rate, tasa: c.tasa }));
  return /* @__PURE__ */ React.createElement("div", { className: "view wide" }, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      num: "02",
      kicker: "Explorar",
      title: "El retrato de un siniestro t\xEDpico",
      lead: "Moto, hora pico, avenida. Cambi\xE1 el lente entre <strong>volumen</strong> (cu\xE1ntos) y <strong>% severo</strong> (cu\xE1n graves) \u2014 casi nunca coinciden, y ah\xED est\xE1 el hallazgo."
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 22, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Seg, { value: metric, onChange: setMetric, options: [{ v: "vol", label: "Volumen" }, { v: "sev", label: "% Severo" }] }), /* @__PURE__ */ React.createElement(Legend, { items: isSev ? [{ color: "var(--severe)", label: "% que termina severo" }] : [{ color: "var(--slate)", label: "Cantidad de siniestros" }, { color: "var(--severe)", line: true, label: "% severo (eje der.)" }] })), /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "Siniestros por hora del d\xEDa",
      cap: "0h \u2014 23h",
      note: "El volumen pica en la hora pico vespertina (17\u201319h). Pero la franja m\xE1s severa es la madrugada: pocos siniestros, mucha gravedad \u2014 velocidad real en calles vac\xEDas. No es ruido por pocos casos: aun con intervalo de confianza al 95%, el piso de la madrugada (12,6% a las 3h) duplica al techo de la tarde (~4%)."
    },
    /* @__PURE__ */ React.createElement(
      Columns,
      {
        data: D.byHour,
        yKey: "n",
        rateKey: "rate",
        height: 250,
        color: "var(--slate)",
        fmtX: (h) => h + "h"
      }
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "grid g2", style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "Cu\xE1ndo: d\xEDa \xD7 franja horaria",
      cap: isSev ? "% severo" : "volumen",
      note: "Madrugada de s\xE1bado y domingo: el doble de siniestros que un martes, y 12,1% severos vs 5,5% del resto."
    },
    /* @__PURE__ */ React.createElement(
      Heat,
      {
        matrix: D.heat,
        rows: D.dowNames,
        cols: D.franjaOrder,
        metric: isSev ? "rate" : "n",
        fmt: isSev ? (v) => (v * 100).toFixed(0) : (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : n
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Legend, { items: [{ color: "var(--paper-2)", label: "menos" }, { color: "color-mix(in srgb,var(--severe) 50%,var(--paper-2))", label: "m\xE1s" }, { color: "var(--severe)", label: isSev ? "m\xE1s severo" : "m\xE1s volumen" }] }))
  ), /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "La velocidad de la v\xEDa ordena la severidad",
      cap: "% severo por tipo de v\xEDa",
      note: "Gradiente mon\xF3tono: a mayor velocidad permitida, m\xE1s severidad. No hay dato de velocidad medida; el tipo de v\xEDa fija el l\xEDmite legal."
    },
    /* @__PURE__ */ React.createElement(
      Columns,
      {
        data: D.byCalle.map((c) => ({ k: c.k === "AV. GRAL. PAZ" ? "GRAL. PAZ" : c.k, n: c.rate * 100, rate: c.rate })),
        yKey: "n",
        height: 250,
        color: "var(--severe)",
        fmtVal: (v) => v.toFixed(1).replace(".", ",") + "%",
        fmtX: (k) => k.toLowerCase()
      }
    )
  )), /* @__PURE__ */ React.createElement("div", { className: "grid g2", style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement(
    Card,
    {
      title: isSev ? "Qui\xE9n: severidad por modo de la v\xEDctima" : "Qui\xE9n: v\xEDctimas por modo de desplazamiento",
      cap: isSev ? "% severo" : "cantidad",
      note: "La moto domina el volumen (1 de cada 3). Pero el peat\xF3n \u2014y sobre todo el peat\xF3n mayor\u2014 domina la severidad."
    },
    /* @__PURE__ */ React.createElement(
      Bars,
      {
        data: isSev ? [...victs].sort((a, b) => b.rate - a.rate) : victs,
        yKey: isSev ? "rate" : "n",
        rateKey: "rate",
        showRate: !isSev,
        color: barColor,
        fmtVal: isSev ? (v) => pct(v, 1) : nf,
        maxN: isSev ? Math.max(...victs.map((v) => v.rate)) : void 0
      }
    )
  ), /* @__PURE__ */ React.createElement(Card, { title: "D\xF3nde: por comuna", cap: comMode === "tasa" ? "tasa /100k hab/a\xF1o" : comMode === "rate" ? "% severo" : "cantidad" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Seg, { value: comMode, onChange: setComMode, options: [{ v: "n", label: "Volumen" }, { v: "tasa", label: "Per c\xE1pita" }, { v: "rate", label: "% Severo" }] })), /* @__PURE__ */ React.createElement(
    Bars,
    {
      data: comunaData.slice(0, 10),
      yKey: comMode === "tasa" ? "tasa" : comMode === "rate" ? "rate" : "n",
      color: comMode === "rate" ? "var(--severe)" : "var(--slate)",
      fmtVal: comMode === "tasa" ? (v) => Math.round(v) : comMode === "rate" ? (v) => pct(v, 1) : nf,
      barH: 26,
      gap: 9
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "card-note" }, comMode === "tasa" ? "La Comuna 1 (Microcentro) lidera per c\xE1pita \u2014 pero su poblaci\xF3n residente no es la exposici\xF3n real: entran cientos de miles por d\xEDa." : comMode === "rate" ? "La severidad es geogr\xE1ficamente plana: el volumen se concentra, la gravedad no." : "El volumen se concentra en el corredor oeste motero y el Microcentro."))), /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "La banda cr\xEDtica de edad es 65+, no los j\xF3venes",
      cap: "% severo por edad media de las v\xEDctimas",
      style: { marginTop: 20 },
      note: "La curva es en J: cae entre los j\xF3venes y adultos (la franja de m\xE1s exposici\xF3n) y se dispara en los 65+ \u201413,1% severo, m\xE1s del doble de la base. Los j\xF3venes aportan volumen; los mayores, vulnerabilidad."
    },
    /* @__PURE__ */ React.createElement(
      LineChart,
      {
        data: D.byAge.map((a) => ({ k: a.k, rate: +(a.rate * 100).toFixed(2) })),
        xKey: "k",
        yKey: "rate",
        height: 230,
        color: "var(--severe)",
        fmtX: (k) => k,
        fmtYTick: (v) => Math.round(v) + "%",
        fmtY: (v) => v.toFixed(1).replace(".", ",") + "%",
        unit: "severo",
        fmtTip: (k) => "Edad " + k
      }
    )
  ));
}
window.Explorar = Explorar;
