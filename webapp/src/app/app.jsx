/* ============ app.jsx — shell + nav + tweaks ============ */
const TABS = [
  { id:'panorama', label:'Panorama', Comp:'Panorama' },
  { id:'explorar', label:'Explorar', Comp:'Explorar' },
  { id:'predecir', label:'Predecir', Comp:'Predecir' },
  { id:'mapa', label:'Mapa', Comp:'Mapa' },
  { id:'reglas', label:'Reglas', Comp:'Reglas' },
  { id:'perfiles', label:'Perfiles', Comp:'Perfiles' },
  { id:'modelos', label:'Modelos', Comp:'Modelos' },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "papel",
  "accent": "#C0391F",
  "density": "regular",
  "animations": true
}/*EDITMODE-END*/;

const ACCENTS = {
  '#C0391F': ['#C0391F','#E05334'],   // brick (deck)
  '#A6432E': ['#A6432E','#D06A4A'],   // terracotta
  '#9E2B25': ['#9E2B25','#CE4A3A'],   // crimson
  '#39605E': ['#39605E','#5E8E8B'],   // teal (neutral demo)
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = useState(() => localStorage.getItem('tpo_tab') || 'panorama');
  const mainRef = useRef(null);

  useEffect(()=>{ localStorage.setItem('tpo_tab', tab); if(mainRef.current) mainRef.current.scrollTop=0; }, [tab]);

  // enable entrance animations only once the page is actually painting (rAF fires)
  useEffect(()=>{ const r=requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add('ready'))); return ()=>cancelAnimationFrame(r); }, []);

  // theme + accent
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', t.theme==='tinta'?'dark':'light');
    const [a,b] = ACCENTS[t.accent] || ACCENTS['#C0391F'];
    document.documentElement.style.setProperty('--severe', a);
    document.documentElement.style.setProperty('--severe-br', b);
    document.documentElement.classList.toggle('no-anim', !t.animations);
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.theme, t.accent, t.animations, t.density]);

  const D = window.TPO_DATA;
  const Active = window[TABS.find(x=>x.id===tab).Comp];

  return (
    <div id="app">
      <aside className="rail">
        <div className="brand">
          <div className="kicker">TPO · Ciencia de Datos</div>
          <h1>Siniestros Viales<br/>en CABA</h1>
          <div className="sub">{nf(D.meta.N)} siniestros · 2021–2024</div>
        </div>
        <nav className="nav">
          {TABS.map((x,i)=>(
            <button key={x.id} className={`nav-item ${tab===x.id?'active':''}`} onClick={()=>setTab(x.id)}>
              <span className="ix">{String(i+1).padStart(2,'0')}</span>
              <span>{x.label}</span>
              <span className="dotmark"/>
            </button>
          ))}
        </nav>
        <div className="rail-foot">
          <b>Clasificación · Regresión · No supervisado</b><br/>
          KDD / CRISP-DM · semillas fijas · reproducible
          <button className="tweaks-btn" onClick={()=>window.dispatchEvent(new Event('tpo-tweaks-toggle'))}>
            <span aria-hidden="true">◐</span> Ajustes · tema y animaciones
          </button>
        </div>
      </aside>

      <main className="main" ref={mainRef}>
        <div key={tab}><Active/></div>
      </main>

      <TweaksPanel>
        <TweakSection label="Dirección visual"/>
        <TweakRadio label="Tema" value={t.theme} options={['papel','tinta']} onChange={v=>setTweak('theme',v)}/>
        <TweakColor label="Acento" value={t.accent} options={Object.keys(ACCENTS)} onChange={v=>setTweak('accent',v)}/>
        <TweakSection label="Presentación"/>
        <TweakRadio label="Densidad" value={t.density} options={['regular','cómodo']} onChange={v=>setTweak('density',v)}/>
        <TweakToggle label="Animaciones" value={t.animations} onChange={v=>setTweak('animations',v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
