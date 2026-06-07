const TABS = [
  { id: "panorama", label: "Panorama", Comp: "Panorama" },
  { id: "explorar", label: "Explorar", Comp: "Explorar" },
  { id: "predecir", label: "Predecir", Comp: "Predecir" },
  { id: "mapa", label: "Mapa", Comp: "Mapa" },
  { id: "reglas", label: "Reglas", Comp: "Reglas" },
  { id: "modelos", label: "Modelos", Comp: "Modelos" }
];
const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "theme": "papel",
    "accent": "#C0391F",
    "density": "regular",
    "animations": true
  }
);
const ACCENTS = {
  "#C0391F": ["#C0391F", "#E05334"],
  // brick (deck)
  "#A6432E": ["#A6432E", "#D06A4A"],
  // terracotta
  "#9E2B25": ["#9E2B25", "#CE4A3A"],
  // crimson
  "#39605E": ["#39605E", "#5E8E8B"]
  // teal (neutral demo)
};
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = useState(() => localStorage.getItem("tpo_tab") || "panorama");
  const mainRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("tpo_tab", tab);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [tab]);
  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("ready")));
    return () => cancelAnimationFrame(r);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme === "tinta" ? "dark" : "light");
    const [a, b] = ACCENTS[t.accent] || ACCENTS["#C0391F"];
    document.documentElement.style.setProperty("--severe", a);
    document.documentElement.style.setProperty("--severe-br", b);
    document.documentElement.classList.toggle("no-anim", !t.animations);
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.theme, t.accent, t.animations, t.density]);
  const D = window.TPO_DATA;
  const Active = window[TABS.find((x) => x.id === tab).Comp];
  return /* @__PURE__ */ React.createElement("div", { id: "app" }, /* @__PURE__ */ React.createElement("aside", { className: "rail" }, /* @__PURE__ */ React.createElement("div", { className: "brand" }, /* @__PURE__ */ React.createElement("div", { className: "kicker" }, "TPO \xB7 Ciencia de Datos"), /* @__PURE__ */ React.createElement("h1", null, "Siniestros Viales", /* @__PURE__ */ React.createElement("br", null), "en CABA"), /* @__PURE__ */ React.createElement("div", { className: "sub" }, nf(D.meta.N), " siniestros \xB7 2021\u20132024")), /* @__PURE__ */ React.createElement("nav", { className: "nav" }, TABS.map((x, i) => /* @__PURE__ */ React.createElement("button", { key: x.id, className: `nav-item ${tab === x.id ? "active" : ""}`, onClick: () => setTab(x.id) }, /* @__PURE__ */ React.createElement("span", { className: "ix" }, String(i + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement("span", null, x.label), /* @__PURE__ */ React.createElement("span", { className: "dotmark" })))), /* @__PURE__ */ React.createElement("div", { className: "rail-foot" }, /* @__PURE__ */ React.createElement("b", null, "Clasificaci\xF3n \xB7 Regresi\xF3n \xB7 No supervisado"), /* @__PURE__ */ React.createElement("br", null), "KDD / CRISP-DM \xB7 semillas fijas \xB7 reproducible", /* @__PURE__ */ React.createElement("button", { className: "tweaks-btn", onClick: () => window.dispatchEvent(new Event("tpo-tweaks-toggle")) }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\u25D0"), " Ajustes \xB7 tema y animaciones"))), /* @__PURE__ */ React.createElement("main", { className: "main", ref: mainRef }, /* @__PURE__ */ React.createElement("div", { key: tab }, /* @__PURE__ */ React.createElement(Active, null))), /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "Direcci\xF3n visual" }), /* @__PURE__ */ React.createElement(TweakRadio, { label: "Tema", value: t.theme, options: ["papel", "tinta"], onChange: (v) => setTweak("theme", v) }), /* @__PURE__ */ React.createElement(TweakColor, { label: "Acento", value: t.accent, options: Object.keys(ACCENTS), onChange: (v) => setTweak("accent", v) }), /* @__PURE__ */ React.createElement(TweakSection, { label: "Presentaci\xF3n" }), /* @__PURE__ */ React.createElement(TweakRadio, { label: "Densidad", value: t.density, options: ["regular", "c\xF3modo"], onChange: (v) => setTweak("density", v) }), /* @__PURE__ */ React.createElement(TweakToggle, { label: "Animaciones", value: t.animations, onChange: (v) => setTweak("animations", v) })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
