/* ============ tab-predecir.jsx ============
   Two independent live models. Each is its own component so it can stand alone
   on a deck slide (slide=true → full slide-scale 2-column layout) or sit side by
   side inside the app's Predecir tab (slide=false → compact Card). */

function Gauge({ p, base, size = 240 }) {
  const mounted = useMounted();
  const sw = size/12, r = (size-sw)/2-6, cx = size/2, cy = size/2;
  const C = Math.PI*r; // semicircle
  const arc = (frac)=>frac*C;
  const col = p>=0.25?'var(--severe)':p>=0.10?'var(--amber)':'var(--green)';
  const numF = size*0.245, pctF = size*0.11, labF = Math.max(11, size*0.046);
  return (
    <div style={{position:'relative',width:size,height:size/2+30}}>
      <svg width={size} height={size/2+30} viewBox={`0 0 ${size} ${size/2+30}`}>
        <path d={`M${cx-r},${cy} A${r},${r} 0 0 1 ${cx+r},${cy}`} fill="none" stroke="var(--paper-3)" strokeWidth={sw} strokeLinecap="round"/>
        <path d={`M${cx-r},${cy} A${r},${r} 0 0 1 ${cx+r},${cy}`} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc(Math.min(p/0.6,1))} ${C}`} style={{transition:'stroke-dasharray 1s var(--ease), stroke .4s'}} opacity={mounted?1:0}/>
        {(()=>{const a=Math.PI*(1-Math.min(base/0.6,1)); const x1=cx+(r-sw/2-2)*Math.cos(a),y1=cy-(r-sw/2-2)*Math.sin(a),x2=cx+(r+sw/2+2)*Math.cos(a),y2=cy-(r+sw/2+2)*Math.sin(a);
          return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="2"/>;})()}
      </svg>
      <div style={{position:'absolute',left:0,right:0,bottom:0,textAlign:'center'}}>
        <div style={{fontFamily:'var(--ff-serif)',fontWeight:500,fontSize:numF,lineHeight:1,color:col,letterSpacing:'-.02em'}}>
          <CountUp value={p*100} fmt={v=>v.toFixed(1).replace('.',',')}/><span style={{fontSize:pctF}}>%</span>
        </div>
        <div style={{fontFamily:'var(--ff-mono)',fontSize:labF,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--mute)',marginTop:6}}>prob. de ser severo</div>
      </div>
    </div>
  );
}

/* ---------------- GRAVEDAD: ¿leve o severo? ---------------- */
function PredecirGravedad({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const base = D.lifts.base;
  const liftOf = (arr,k)=>{ const f=arr.find(x=>x.k===k); return f?f.lift:1; };
  const [vic, setVic] = useState('PEATON');
  const [fra, setFra] = useState('MADRUGADA');
  const [via, setVia] = useState('AVENIDA');
  const [age, setAge] = useState('65+');
  const [finde, setFinde] = useState(true);

  const factors = [
    { name:`Víctima: ${vic.toLowerCase()}`, lift: liftOf(D.sevByVictima,vic) },
    { name:`Franja: ${fra.toLowerCase()}`, lift: liftOf(D.sevByFranja,fra) },
    { name:`Vía: ${via==='AV. GRAL. PAZ'?'gral. paz':via.toLowerCase()}`, lift: liftOf(D.sevByCalle,via) },
    { name:`Edad: ${age}`, lift: (D.byAge.find(a=>a.k===age)?.rate||base)/base },
    ...(finde?[{ name:'Fin de semana', lift: D.lifts.finde.lift }]:[]),
  ];
  let logit = Math.log(base/(1-base));
  factors.forEach(f=> logit += Math.log(f.lift||1));
  const p = 1/(1+Math.exp(-logit));

  const inputs = (
    <React.Fragment>
      <div className="pred-fields">
        <Field label="Víctima"><Select value={vic} onChange={setVic} options={D.sevByVictima.filter(v=>v.n>200).map(v=>v.k)}/></Field>
        <Field label="Franja horaria"><Select value={fra} onChange={setFra} options={D.franjaOrder}/></Field>
        <Field label="Tipo de vía"><Select value={via} onChange={setVia} options={D.byCalle.map(c=>c.k)}/></Field>
        <Field label="Edad media"><Select value={age} onChange={setAge} options={D.byAge.map(a=>a.k)}/></Field>
      </div>
      <label className="pred-check">
        <input type="checkbox" checked={finde} onChange={e=>setFinde(e.target.checked)}/>
        Ocurre un fin de semana
      </label>
      <div className="divider" style={{margin:slide?'22px 0':'16px 0'}}/>
      <div className="card-h" style={{marginBottom:8}}><h3>Aporte de cada factor</h3><span className="cap">lift</span></div>
      <div>
        {factors.map((f,i)=>{
          const up=f.lift>=1; const w=Math.min(Math.abs(Math.log(f.lift))/Math.log(2.6)*50,50);
          return <div className="factor-row" key={i}>
            <span className="factor-name">{f.name}</span>
            <div className="factor-bar"><span style={{[up?'left':'right']:'50%',width:w+'%',background:up?'var(--severe)':'var(--green)'}}/></div>
            <span className="factor-lift" style={{color:up?'var(--severe)':'var(--green)'}}>×{f.lift.toFixed(2).replace('.',',')}</span>
          </div>;
        })}
      </div>
    </React.Fragment>
  );

  const result = (
    <div className="pred-result">
      <Gauge p={p} base={base} size={slide?330:240}/>
      <div style={{marginTop:18,display:'flex',alignItems:'center',gap:10,justifyContent:'center'}}>
        <span style={{width:24,height:2,background:'var(--ink)',display:'inline-block'}}/>
        <span className="mono" style={{fontSize:slide?16:11.5,color:'var(--mute)'}}>base global {pct(base,1)}</span>
      </div>
      <p className="pred-blurb">Cada factor multiplica la chance base; el resultado se acota en escala logística — los <strong>lifts de Apriori</strong> combinados equivalen a una regresión logística.</p>
    </div>
  );

  if (slide) return (
    <div className="app-embed pred-slide grav">
      <div className="pred-split"><div className="pred-inputs">{inputs}</div>{result}</div>
      <div className="pred-foot">Modelo <b>explicativo / screening post-siniestro</b>: usa variables conocidas después del hecho. Sirve para priorizar y entender factores, no para predecir antes de que ocurra.</div>
    </div>
  );

  return (
    <Card title="¿Leve o severo?" cap="modelo de lifts · explicable">
      <div style={{display:'flex',gap:24,alignItems:'center',marginBottom:18}}>
        <div style={{flex:'none'}}>{result}</div>
      </div>
      {inputs}
      <div className="card-note">Es un modelo <b>explicativo / screening post-siniestro</b>: usa variables conocidas después del hecho. Sirve para priorizar y entender factores, no para predecir antes de que ocurra.</div>
    </Card>
  );
}

/* ---------------- CANTIDAD: ¿cuántos siniestros mañana? ---------------- */
function PredecirCantidad({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const [dow, setDow] = useState(5);   // sab
  const [fer, setFer] = useState(false);
  const [mm, setMm] = useState(0);
  const [yr, setYr] = useState(2024);
  const R = D.reg;
  const dowBase = R.meanByDow[dow].media;
  const ferDelta = fer ? (R.feriadoEff.feriado - R.feriadoEff.noFeriado) : 0;
  const rainDelta = mm * R.coef.lluvia_mm;
  const trendDelta = R.meanByYear[yr] - R.meanDaily;
  const pred = Math.max(0, dowBase + ferDelta + rainDelta + trendDelta);
  const regParts = [
    { lab:`${D.dowNames[dow]} (base)`, val: dowBase, sign:false },
    { lab: fer?'Feriado':'Día común', val: ferDelta, sign:true, show: fer },
    { lab:`Lluvia ${mm}mm`, val: rainDelta, sign:true, show: mm>0 },
    { lab:`Año ${yr} (exposición)`, val: trendDelta, sign:true, show: Math.abs(trendDelta)>0.3 },
  ].filter(x=>x.show!==false);

  const inputs = (
    <React.Fragment>
      <div className="pred-fields">
        <Field label="Día de la semana"><Select value={dow} onChange={v=>setDow(+v)} options={D.dowNames.map((n,i)=>({v:i,label:n}))}/></Field>
        <Field label="Año (nivel de tránsito)"><Select value={yr} onChange={v=>setYr(+v)} options={[2021,2022,2023,2024].map(y=>({v:y,label:String(y)}))}/></Field>
      </div>
      <Field label={`Lluvia del día — ${mm} mm`}>
        <input type="range" min="0" max="40" value={mm} onChange={e=>setMm(+e.target.value)} style={{width:'100%'}}/>
      </Field>
      <label className="pred-check" style={{marginTop:14}}>
        <input type="checkbox" checked={fer} onChange={e=>setFer(e.target.checked)}/>
        Es feriado <span className="mono" style={{fontSize:slide?13:11,color:'var(--mute)'}}>(driver #1)</span>
      </label>
      <div className="divider" style={{margin:slide?'22px 0':'16px 0'}}/>
      <div className="card-h" style={{marginBottom:8}}><h3>Descomposición</h3><span className="cap">siniestros/día</span></div>
      <div>
        {regParts.map((p2,i)=>(
          <div className="factor-row" key={i}>
            <span className="factor-name">{p2.lab}</span>
            <span className="factor-lift" style={{color: !p2.sign?'var(--ink)': p2.val<0?'var(--green)':'var(--severe)'}}>
              {p2.sign?(p2.val>=0?'+':'−'):''}{p2.sign?Math.abs(p2.val).toFixed(1).replace('.',','):p2.val.toFixed(1).replace('.',',')}
            </span>
          </div>
        ))}
        <div className="factor-row" style={{borderTop:'1.5px solid var(--ink)',marginTop:4}}>
          <span className="factor-name" style={{fontWeight:600}}>Predicción</span>
          <span className="factor-lift" style={{color:'var(--slate)',fontSize:slide?17:14}}>{pred.toFixed(1).replace('.',',')}</span>
        </div>
      </div>
    </React.Fragment>
  );

  const result = (
    <div className="pred-result">
      <div className="pred-bignum" style={{color:'var(--slate)'}}><CountUp value={pred} fmt={v=>Math.round(v)}/></div>
      <div className="mono" style={{fontSize:slide?18:12,color:'var(--mute)',letterSpacing:'.05em',marginTop:4}}>siniestros ese día</div>
      <div style={{marginTop:18,display:'flex',justifyContent:'center'}}>
        <span className="tag" style={{borderColor: pred<R.meanDaily?'var(--green)':'var(--severe)', color: pred<R.meanDaily?'var(--green)':'var(--severe)'}}>
          {pred<R.meanDaily?'▼':'▲'} {Math.abs(pred-R.meanDaily).toFixed(1).replace('.',',')} vs media de {R.meanDaily.toFixed(1).replace('.',',')}/día
        </span>
      </div>
      <p className="pred-blurb">La <strong>regresión lineal</strong> gana porque extrapola la tendencia: los árboles no predicen fuera del rango 2021–23. R² 0,40 sobre 2024 (año nunca visto).</p>
    </div>
  );

  if (slide) return (
    <div className="app-embed pred-slide cant">
      <div className="pred-split"><div className="pred-inputs">{inputs}</div>{result}</div>
      <div className="pred-foot">El feriado es el driver más fuerte — más que cualquier variable climática. Útil para dimensionar recursos (p. ej. guardias de emergencia) sobre un año nunca visto.</div>
    </div>
  );

  return (
    <Card title="¿Cuántos siniestros mañana?" cap="regresión lineal · /día">
      {result}
      {inputs}
      <div className="card-note">La lineal gana porque <b>extrapola la tendencia</b>: los árboles no predicen fuera del rango 2021–23. R² 0,40 sobre 2024 (año nunca visto).</div>
    </Card>
  );
}

/* Composite (app tab): both models side by side. */
function Predecir({ slide = false } = {}) {
  const cards = (
    <div className="grid g2">
      <PredecirGravedad/>
      <PredecirCantidad/>
    </div>
  );
  if (slide) return <div className="app-embed pred-embed">{cards}</div>;
  return (
    <div className="view wide">
      <PageHead num="03" kicker="Predecir · en vivo" title="Armá un siniestro y mirá el <em>riesgo</em>"
        lead="Dos modelos del trabajo, corriendo en el navegador. El de gravedad combina los <strong>lifts de Apriori</strong> en escala log-odds (equivale a una logística); el de cantidad es la <strong>regresión lineal</strong> anclada en los promedios reales." />
      {cards}
    </div>
  );
}

function Field({ label, children }) { return <div><label className="field-lab">{label}</label>{children}</div>; }
function Select({ value, onChange, options }) {
  const opts = options.map(o=> typeof o==='object'? o : {v:o,label:o});
  return <div className="select-wrap" style={{position:'relative'}}>
    <select value={value} onChange={e=>onChange(e.target.value)}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.label}</option>)}
    </select>
    <svg className="select-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>
  </div>;
}
Object.assign(window, { Predecir, PredecirGravedad, PredecirCantidad, Field, Select });
