function Panorama() {
  const D = window.TPO_DATA;
  const serie = D.serie.map((d) => ({ ...d, ym: d.ym }));
  const concl = [
    { t: "El +35% es 2/3 exposici\xF3n", d: "Los siniestros crecieron 35% (2021\u219224), pero el tr\xE1nsito subi\xF3 22%. La tasa por mill\xF3n de veh\xEDculos solo +10%: dos tercios es m\xE1s autos, no m\xE1s riesgo.", a: "amber" },
    { t: "La gravedad es un perfil, no un lugar", d: "k-means geogr\xE1fico: severidad homog\xE9nea (4,7\u20135,6%). k-means de perfiles: spread de 10,9 pp. Un peat\xF3n mayor multiplica \xD72,3 la chance de quedar grave.", a: "severe" },
    { t: "La velocidad de la v\xEDa ordena la severidad", d: "Calle 3,8% < Avenida 5,4% < Autopista 14,1% severos. Gradiente mon\xF3tono \u2014 el l\xEDmite legal por tipo de v\xEDa es proxy de velocidad.", a: "slate" },
    { t: "La lluvia trae menos siniestros, no m\xE1s graves", d: "D\xEDas de lluvia: \u22128% de siniestros (\u221221% con >20mm). La gravedad individual no cambia (5,7% vs 5,9%). Triangulado en 3 fuentes.", a: "slate" },
    { t: "Feriado: el driver #1 de la cantidad diaria", d: "Regresi\xF3n lineal (gana por extrapolar la tendencia): un feriado baja \u22129,6 siniestros/d\xEDa; el finde \u22125,3. Clima: efecto chico.", a: "green" },
    { t: "29 esquinas concentran el 4,6%", d: "DBSCAN (60 m): micro-hotspots accionables. El mayor: 153 siniestros en un acceso de la Gral. Paz. Lo m\xE1s accionable del an\xE1lisis geogr\xE1fico.", a: "severe" }
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "view wide" }, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      num: "01",
      kicker: "Panorama",
      title: "Tres preguntas sobre <em>37.849</em> siniestros en cuatro a\xF1os",
      lead: "Analizamos la <strong>gravedad</strong> de cada siniestro (\xBFleve o severo?), la <strong>cantidad</strong> diaria, y los <strong>factores de riesgo</strong> \u2014 con los datos abiertos de la Ciudad y nueve fuentes externas validadas una por una."
    }
  ), /* @__PURE__ */ React.createElement(StatRow, { items: [
    { value: D.meta.N, label: "Siniestros \xB7 2021\u20132024", sub: "Dataset oficial de CABA, integrado con v\xEDctimas" },
    { value: D.meta.base * 100, fmt: (v) => v.toFixed(1).replace(".", ",") + "%", label: "Terminan severos", sev: true, sub: "Grave o mortal \xB7 clase minoritaria" },
    { render: /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(CountUp, { value: 35, fmt: (v) => "+" + Math.round(v) }), "%"), label: "Crecimiento 2021\u21922024", sub: "Rebote post-pandemia" },
    { render: /* @__PURE__ */ React.createElement("span", null, "r\xA0", /* @__PURE__ */ React.createElement(CountUp, { value: 0.88, dur: 1100, fmt: (v) => v.toFixed(2).replace(".", ",") })), label: "Siniestros \u2194 tr\xE1nsito", sub: "Se mueven juntos (48 meses)" }
  ] }), /* @__PURE__ */ React.createElement("div", { className: "grid g-2-1", style: { marginTop: 22 } }, /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "Siniestros por mes",
      cap: "2021 \u2014 2024",
      note: "Serie nativa del dataset. La ca\xEDda de mediados de 2021 es el rebote desde el piso pand\xE9mico; la tendencia es creciente y sostenida."
    },
    /* @__PURE__ */ React.createElement(
      LineChart,
      {
        data: serie,
        xKey: "ym",
        yKey: "n",
        height: 262,
        color: "var(--slate)",
        fmtX: (ym) => ym.endsWith("-01") || ym.endsWith("-07") ? ym.slice(0, 4) + (ym.endsWith("-07") ? "\xB7jul" : "") : "",
        fmtTip: (ym) => {
          const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
          const [y, m] = ym.split("-");
          return `${MES[+m - 1]} ${y}`;
        },
        markers: [{ at: "2024-03", label: "" }]
      }
    )
  ), /* @__PURE__ */ React.createElement(Card, { title: "Distribuci\xF3n de gravedad", cap: "binario LEVE vs SEVERO" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "8px 0" } }, /* @__PURE__ */ React.createElement(Donut, { size: 188, thickness: 28, segments: [
    { v: D.meta.N - D.meta.sevTot, color: "var(--green)" },
    { v: D.meta.sevTot, color: "var(--severe)" }
  ], center: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 38, fontWeight: 500, color: "var(--severe)", lineHeight: 1 } }, /* @__PURE__ */ React.createElement(CountUp, { value: 5.7, fmt: (v) => v.toFixed(1).replace(".", ",") }), "%"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 10, letterSpacing: ".1em", color: "var(--mute)", textTransform: "uppercase", marginTop: 4 } }, "severos")) }), /* @__PURE__ */ React.createElement(Legend, { items: [{ color: "var(--green)", label: `LEVE \xB7 ${nf(D.meta.N - D.meta.sevTot)}` }, { color: "var(--severe)", label: `SEVERO \xB7 ${nf(D.meta.sevTot)}` }] }), /* @__PURE__ */ React.createElement("div", { className: "note-box", style: { fontSize: 11.5 } }, 'Acertar el 94% es predecir "siempre leve". Por eso el modelo se optimiza por ', /* @__PURE__ */ React.createElement("b", null, "recall de severos"), ", no por accuracy.")))), /* @__PURE__ */ React.createElement("div", { style: { margin: "40px 0 18px" } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, /* @__PURE__ */ React.createElement("span", { className: "num" }, "\u2192"), /* @__PURE__ */ React.createElement("span", null, "Seis conclusiones"), /* @__PURE__ */ React.createElement("span", { className: "line" }))), /* @__PURE__ */ React.createElement("div", { className: "grid g3" }, concl.map((c, i) => /* @__PURE__ */ React.createElement("div", { className: "card reveal", key: i, style: { animationDelay: `${i * 0.06}s`, display: "flex", flexDirection: "column", gap: 11 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--ff-mono)", fontSize: 12, fontWeight: 600, color: `var(--${c.a})` } }, String(i + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: `var(--${c.a})` } })), /* @__PURE__ */ React.createElement("h3", { className: "serif", style: { fontSize: 21, fontWeight: 500, lineHeight: 1.18, letterSpacing: "-.01em" } }, c.t), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13.5, lineHeight: 1.5, color: "var(--ink-2)" } }, c.d)))), /* @__PURE__ */ React.createElement(Card, { style: { marginTop: 22 }, title: "Perfiles de riesgo", cap: "k-means \xB7 spread de severidad 10,9 pp" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, alignItems: "stretch", flexWrap: "wrap" } }, D.perfiles.map((p, i) => {
    const max = D.perfiles[0].rate;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: "1 1 0", minWidth: 140, padding: "4px 18px", borderRight: i < D.perfiles.length - 1 ? "1px solid var(--hair)" : "none" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 96, display: "flex", alignItems: "flex-end", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "grow-bar", style: { width: "100%", borderRadius: "5px 5px 0 0", background: `color-mix(in srgb, var(--severe) ${30 + p.rate / max * 60}%, var(--slate))`, height: `${p.rate / max * 100}%`, transition: "height .8s var(--ease)", animationDelay: `${i * 0.1}s` } })), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 22, fontWeight: 500, color: "var(--severe)" } }, pct(p.rate, 1)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600, margin: "4px 0 3px" } }, p.k), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--mute)", lineHeight: 1.4 } }, p.desc));
  }))));
}
window.Panorama = Panorama;
