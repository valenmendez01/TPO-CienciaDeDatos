function Perfiles({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const P = D.noSup;
  const [hl, setHl] = useState(null);
  const labelByPerfil = {};
  P.meta.forEach((m) => labelByPerfil[m.perfil] = m.label);
  const maxSev = Math.max(...P.meta.map((m) => m.sevRate));
  const base = P.base;
  const elbow = P.elbow.map((d) => ({ k: d.k, inertia: d.inertia / 1e3 }));
  const scree = P.scree.map((d) => ({ k: d.k, cum: d.cum * 100 }));
  const scatterCard = (
    /* ---- scatter PCA ---- */
    /* @__PURE__ */ React.createElement(
      Card,
      {
        title: "Los 5 perfiles en el espacio de features",
        cap: `k-means k=5 \xB7 proyecci\xF3n PCA`,
        note: slide ? "Proyecci\xF3n PCA a 2D: solo muestra que los 5 perfiles se separan. Los ejes son combinaciones lineales de las 8 variables del perfil \u2014 no variables con nombre. El dato accionable es la severidad por perfil (tarjetas abajo)." : "Cada punto es un siniestro proyectado sobre sus dos componentes principales. Los ejes son combinaciones lineales de las 8 variables del cluster (edad, modo de la v\xEDctima, momento); la proyecci\xF3n solo sirve para ver la separaci\xF3n. Los anillos marcan el centro de cada grupo. Pas\xE1 el cursor por un perfil para aislarlo."
      },
      /* @__PURE__ */ React.createElement(
        Scatter,
        {
          pts: P.scatter,
          centroids: P.centroids,
          colorByPerfil: P.colorByPerfil,
          labelByPerfil,
          highlight: hl,
          onHover: setHl,
          xLabel: slide ? `PC1 \xB7 edad / vulnerab. peatonal \xB7 ${pct(P.pc1Var, 0)}` : `PC1 \xB7 ${pct(P.pc1Var, 0)}`,
          yLabel: slide ? `PC2 \xB7 tipo de veh\xEDculo \xB7 ${pct(P.pc2Var, 0)}` : `PC2 \xB7 ${pct(P.pc2Var, 0)}`,
          height: slide ? 300 : 440
        }
      ),
      /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" } }, P.meta.map((m) => /* @__PURE__ */ React.createElement(
        "span",
        {
          key: m.perfil,
          onMouseEnter: () => setHl(m.perfil),
          onMouseLeave: () => setHl(null),
          style: {
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--ff-mono)",
            fontSize: 11.5,
            color: "var(--mute)",
            cursor: "default",
            opacity: hl == null || hl === m.perfil ? 1 : 0.4,
            transition: "opacity .16s"
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: { width: 11, height: 11, borderRadius: 3, background: m.color, flex: "none" } }),
        m.label
      )))
    )
  );
  const personCards = /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginTop: 20 } }, P.meta.map((m) => {
    const on = hl == null || hl === m.perfil;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: m.perfil,
        className: "card",
        onMouseEnter: () => setHl(m.perfil),
        onMouseLeave: () => setHl(null),
        style: {
          padding: "18px 18px 20px",
          opacity: on ? 1 : 0.5,
          transition: "opacity .16s,box-shadow .16s",
          borderTop: `3px solid ${m.color}`,
          cursor: "default"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 } }, m.label),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--mute-2)", marginTop: 3, lineHeight: 1.35, minHeight: 32 } }, m.sub),
      /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 10.5, letterSpacing: ".04em", color: "var(--mute)", marginTop: 8 } }, "edad ", m.edad, " \xB7 ", nf(m.n), " casos"),
      /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-serif)", fontSize: 38, fontWeight: 500, lineHeight: 1, marginTop: 14, color: m.color } }, /* @__PURE__ */ React.createElement(CountUp, { value: m.sevRate * 100, fmt: (v) => v.toFixed(1).replace(".", ",") }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 } }, "%")),
      /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--ff-mono)", fontSize: 10, color: "var(--mute)", marginTop: 3, textTransform: "uppercase", letterSpacing: ".06em" } }, "severo"),
      /* @__PURE__ */ React.createElement("div", { style: { height: 7, background: "var(--paper-3)", borderRadius: 4, position: "relative", overflow: "hidden", marginTop: 12 } }, /* @__PURE__ */ React.createElement("div", { className: "ch-growx", style: { position: "absolute", left: 0, top: 0, bottom: 0, width: m.sevRate / maxSev * 100 + "%", background: m.color, borderRadius: 4 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: base / maxSev * 100 + "%", top: -2, bottom: -2, width: 1.5, background: "var(--ink)", opacity: 0.55 } }))
    );
  }));
  if (slide) {
    const sevMax = Math.max(...P.meta.map((m) => m.sevRate)), sevMin = Math.min(...P.meta.map((m) => m.sevRate));
    const mult = sevMax / sevMin;
    const fp = (v) => v.toFixed(1).replace(".", ",");
    return /* @__PURE__ */ React.createElement("div", { className: "app-embed perfiles-embed" }, /* @__PURE__ */ React.createElement("div", { className: "perfiles-grid" }, P.meta.map((m) => /* @__PURE__ */ React.createElement("div", { key: m.perfil, className: "card pf-card", style: { borderTop: `4px solid ${m.color}` } }, /* @__PURE__ */ React.createElement("div", { className: "pf-label" }, m.label), /* @__PURE__ */ React.createElement("div", { className: "pf-sub" }, m.sub), /* @__PURE__ */ React.createElement("div", { className: "pf-meta" }, "edad ", m.edad, " \xB7 ", nf(m.n), " casos"), /* @__PURE__ */ React.createElement("div", { className: "pf-pct", style: { color: m.color } }, /* @__PURE__ */ React.createElement(CountUp, { value: m.sevRate * 100, fmt: (v) => v.toFixed(1).replace(".", ",") }), /* @__PURE__ */ React.createElement("span", null, "%")), /* @__PURE__ */ React.createElement("div", { className: "pf-sevlab" }, "severo"), /* @__PURE__ */ React.createElement("div", { className: "pf-bar" }, /* @__PURE__ */ React.createElement("div", { className: "pf-fill", style: { width: m.sevRate / maxSev * 100 + "%", background: m.color } }), /* @__PURE__ */ React.createElement("div", { className: "pf-base", style: { left: base / maxSev * 100 + "%" } }))))), /* @__PURE__ */ React.createElement("div", { className: "pf-spread" }, /* @__PURE__ */ React.createElement("div", { className: "pf-stat" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--severe)" } }, /* @__PURE__ */ React.createElement(CountUp, { value: mult, fmt: (v) => Math.round(v) }), "\xD7"), /* @__PURE__ */ React.createElement("label", null, "entre perfiles")), /* @__PURE__ */ React.createElement("div", { className: "pf-stat" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--slate)" } }, "1,2\xD7"), /* @__PURE__ */ React.createElement("label", null, "entre zonas geogr\xE1ficas")), /* @__PURE__ */ React.createElement("p", { className: "pf-msg" }, "El perfil m\xE1s grave (", /* @__PURE__ */ React.createElement("strong", null, fp(sevMax * 100), "%"), ") es ", /* @__PURE__ */ React.createElement("strong", null, Math.round(mult), " veces"), " m\xE1s severo que el m\xE1s leve (", /* @__PURE__ */ React.createElement("strong", null, fp(sevMin * 100), "%"), "); entre barrios la gravedad es casi pareja. La l\xEDnea marca la base global de ", /* @__PURE__ */ React.createElement("strong", null, pct(base, 1)), ": el ", /* @__PURE__ */ React.createElement("em", null, "qui\xE9n"), " manda sobre el ", /* @__PURE__ */ React.createElement("em", null, "d\xF3nde"), ".")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "view wide" }, /* @__PURE__ */ React.createElement(
    PageHead,
    {
      num: "06",
      kicker: "No supervisado \xB7 k-means + PCA",
      title: "El riesgo es un <em>tipo</em> de siniestro, no un lugar",
      lead: "K-means agrupa los 37.849 siniestros en <strong>5 perfiles</strong> seg\xFAn edad, modo de la v\xEDctima y momento. Entre perfiles la severidad var\xEDa <strong>10,9 puntos</strong> \u2014de 2,0% a 12,9%\u2014; entre comunas apenas 0,9. La gravedad la explica el perfil, no la geograf\xEDa."
    }
  ), scatterCard, personCards, /* @__PURE__ */ React.createElement("div", { className: "note-box", style: { marginTop: 14 } }, "La l\xEDnea vertical marca la base global de ", /* @__PURE__ */ React.createElement("b", null, "5,7%"), ". El perfil ", /* @__PURE__ */ React.createElement("b", null, "Persona mayor"), " la duplica con creces (12,9%); ", /* @__PURE__ */ React.createElement("b", null, "Vehicular leve"), " est\xE1 casi tres veces por debajo (2,0%). El ", /* @__PURE__ */ React.createElement("b", null, "spread de 10,9 pp"), " es lo que hace \xFAtil al clustering: separa el riesgo que el promedio esconde."), /* @__PURE__ */ React.createElement("div", { className: "grid g2", style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "Cu\xE1ntos grupos: m\xE9todo del codo",
      cap: "inercia vs k",
      note: "La ca\xEDda de la inercia se quiebra en k=5: sumar m\xE1s grupos casi no reduce la dispersi\xF3n interna. Cinco perfiles es el punto de equilibrio entre detalle y parsimonia."
    },
    /* @__PURE__ */ React.createElement(
      LineChart,
      {
        data: elbow,
        xKey: "k",
        yKey: "inertia",
        height: 250,
        color: "var(--slate)",
        fmtX: (k) => "k=" + k,
        fmtYTick: (v) => Math.round(v) + "k",
        fmtY: (v) => Math.round(v) + " mil",
        unit: "",
        markers: [{ at: P.chosenK, label: "k=5" }]
      }
    )
  ), /* @__PURE__ */ React.createElement(
    Card,
    {
      title: "PCA: varianza acumulada",
      cap: "\xBFconviene reducir dimensiones?",
      note: "Hacen falta 6 de los 9 componentes para llegar al 80% de la varianza: no hay un eje dominante. Las features son casi ortogonales, as\xED que PCA no sirve para comprimir el dataset \u2014s\xF3lo para proyectarlo y poder ver los grupos en 2D."
    },
    /* @__PURE__ */ React.createElement(
      LineChart,
      {
        data: scree,
        xKey: "k",
        yKey: "cum",
        height: 250,
        color: "var(--severe)",
        fill: false,
        yMax: 100,
        fmtX: (k) => "PC" + k,
        fmtYTick: (v) => Math.round(v) + "%",
        fmtY: (v) => v.toFixed(0) + "%",
        unit: "de la varianza",
        markers: [{ at: P.compFor80, label: "80% \u2192 6 comp." }]
      }
    )
  )));
}
window.Perfiles = Perfiles;
