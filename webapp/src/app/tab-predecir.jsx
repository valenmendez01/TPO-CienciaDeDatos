/* ============ tab-predecir.jsx ============ */
function Gauge({ p, base }) {
  const mounted = useMounted();
  const size=240, sw=20, r=(size-sw)/2-6, cx=size/2, cy=size/2;
  const C=Math.PI*r; // semicircle
  const arc=(frac)=>frac*C;
  const col = p>=0.25?'var(--severe)':p>=0.10?'var(--amber)':'var(--green)';
  return (
    <div style={{position:'relative',width:size,height:size/2+30}}>
      <svg width={size} height={size/2+30} viewBox={`0 0 ${size} ${size/2+30}`}>
        <path d={`M${cx-r},${cy} A${r},${r} 0 0 1 ${cx+r},${cy}`} fill="none" stroke="var(--paper-3)" strokeWidth={sw} strokeLinecap="round"/>
        <path d={`M${cx-r},${cy} A${r},${r} 0 0 1 ${cx+r},${cy}`} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc(Math.min(p/0.6,1))} ${C}`} style={{transition:'stroke-dasharray 1s var(--ease), stroke .4s'}} opacity={mounted?1:0}/>
        {/* base marker */}
        <line x1={cx-(r+sw/2+3)} x2={cx-(r-sw/2-3)} y1={cy} y2={cy} stroke="transparent"/>
        {(()=>{const a=Math.PI*(1-Math.min(base/0.6,1)); const x1=cx+(r-sw/2-2)*Math.cos(a),y1=cy-(r-sw/2-2)*Math.sin(a),x2=cx+(r+sw/2+2)*Math.cos(a),y2=cy-(r+sw/2+2)*Math.sin(a);
          return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="2"/>;})()}
      </svg>
      <div style={{position:'absolute',left:0,right:0,bottom:0,textAlign:'center'}}>
        <div style={{fontFamily:'var(--ff-serif)',fontWeight:500,fontSize:58,lineHeight:1,color:col,letterSpacing:'-.02em'}}>
          <CountUp value={p*100} fmt={v=>v.toFixed(1).replace('.',',')}/><span style={{fontSize:26}}>%</span>
        </div>
        <div style={{fontFamily:'var(--ff-mono)',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--mute)',marginTop:6}}>prob. de ser severo</div>
      </div>
    </div>
  );
}

function Predecir() {
  const D = window.TPO_DATA;
  const base = D.lifts.base;
  const liftOf = (arr,k)=>{ const f=arr.find(x=>x.k===k); return f?f.lift:1; };
  // ---- gravedad predictor state ----
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
  // log-odds combination (= logistic with coef = ln(lift))
  let logit = Math.log(base/(1-base));
  factors.forEach(f=> logit += Math.log(f.lift||1));
  const p = 1/(1+Math.exp(-logit));
  const maxLift = Math.max(...factors.map(f=>f.lift),1/Math.min(...factors.map(f=>f.lift)));

  // ---- cantidad diaria predictor ----
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

  return (
    <div className="view wide">
      <PageHead num="03" kicker="Predecir · en vivo" title="Armá un siniestro y mirá el <em>riesgo</em>"
        lead="Dos modelos del trabajo, corriendo en el navegador. El de gravedad combina los <strong>lifts de Apriori</strong> en escala log-odds (equivale a una logística); el de cantidad es la <strong>regresión lineal</strong> anclada en los promedios reales." />

      <div className="grid g2">
        {/* ---------------- GRAVEDAD ---------------- */}
        <Card title="¿Leve o severo?" cap="modelo de lifts · explicable">
          <div style={{display:'flex',gap:24,alignItems:'center',marginBottom:18}}>
            <div style={{flex:'none'}}><Gauge p={p} base={base}/></div>
            <div style={{flex:1,fontSize:12.5,lineHeight:1.55,color:'var(--ink-2)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}><span style={{width:18,height:2,background:'var(--ink)',display:'inline-block'}}/><span className="mono" style={{fontSize:11}}>base global {pct(base,1)}</span></div>
              Cada factor multiplica la chance base. El resultado se acota en escala logística — por eso combinaciones extremas no superan el 100%.
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 18px',marginBottom:18}}>
            <Field label="Víctima"><Select value={vic} onChange={setVic} options={D.sevByVictima.filter(v=>v.n>200).map(v=>v.k)}/></Field>
            <Field label="Franja horaria"><Select value={fra} onChange={setFra} options={D.franjaOrder}/></Field>
            <Field label="Tipo de vía"><Select value={via} onChange={setVia} options={D.byCalle.map(c=>c.k)}/></Field>
            <Field label="Edad media"><Select value={age} onChange={setAge} options={D.byAge.map(a=>a.k)}/></Field>
          </div>
          <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13.5,marginBottom:6}}>
            <input type="checkbox" checked={finde} onChange={e=>setFinde(e.target.checked)} style={{width:16,height:16,accentColor:'var(--severe)'}}/>
            Ocurre un fin de semana
          </label>
          <div className="divider" style={{margin:'16px 0'}}/>
          <div className="card-h" style={{marginBottom:10}}><h3>Aporte de cada factor</h3><span className="cap">lift</span></div>
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
          <div className="card-note">Es un modelo <b>explicativo / screening post-siniestro</b>: usa variables conocidas después del hecho. Sirve para priorizar y entender factores, no para predecir antes de que ocurra.</div>
        </Card>

        {/* ---------------- CANTIDAD ---------------- */}
        <Card title="¿Cuántos siniestros mañana?" cap="regresión lineal · /día">
          <div style={{display:'flex',alignItems:'baseline',gap:14,justifyContent:'center',padding:'14px 0 18px'}}>
            <div style={{fontFamily:'var(--ff-serif)',fontWeight:500,fontSize:84,lineHeight:.9,letterSpacing:'-.02em',color:'var(--slate)'}}><CountUp value={pred} fmt={v=>Math.round(v)}/></div>
            <div style={{fontFamily:'var(--ff-mono)',fontSize:12,color:'var(--mute)',letterSpacing:'.05em'}}>siniestros<br/>ese día</div>
          </div>
          <div style={{display:'flex',justifyContent:'center',marginBottom:20}}>
            <span className="tag" style={{borderColor: pred<R.meanDaily?'var(--green)':'var(--severe)', color: pred<R.meanDaily?'var(--green)':'var(--severe)'}}>
              {pred<R.meanDaily?'▼':'▲'} {Math.abs(pred-R.meanDaily).toFixed(1).replace('.',',')} vs media de {R.meanDaily.toFixed(1).replace('.',',')}/día
            </span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px 18px',marginBottom:18}}>
            <Field label="Día de la semana"><Select value={dow} onChange={v=>setDow(+v)} options={D.dowNames.map((n,i)=>({v:i,label:n}))}/></Field>
            <Field label="Año (nivel de tránsito)"><Select value={yr} onChange={v=>setYr(+v)} options={[2021,2022,2023,2024].map(y=>({v:y,label:String(y)}))}/></Field>
          </div>
          <Field label={`Lluvia del día — ${mm} mm`}>
            <input type="range" min="0" max="40" value={mm} onChange={e=>setMm(+e.target.value)} style={{width:'100%',accentColor:'var(--slate)'}}/>
          </Field>
          <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:13.5,margin:'14px 0 4px'}}>
            <input type="checkbox" checked={fer} onChange={e=>setFer(e.target.checked)} style={{width:16,height:16,accentColor:'var(--slate)'}}/>
            Es feriado <span className="mono" style={{fontSize:11,color:'var(--mute)'}}>(driver #1)</span>
          </label>
          <div className="divider" style={{margin:'16px 0'}}/>
          <div className="card-h" style={{marginBottom:10}}><h3>Descomposición</h3><span className="cap">siniestros/día</span></div>
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
              <span className="factor-lift" style={{color:'var(--slate)',fontSize:14}}>{pred.toFixed(1).replace('.',',')}</span>
            </div>
          </div>
          <div className="card-note">La lineal gana porque <b>extrapola la tendencia</b>: los árboles no predicen fuera del rango 2021–23. R² 0,40 sobre 2024 (año nunca visto).</div>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }) { return <div><label className="field-lab">{label}</label>{children}</div>; }
function Select({ value, onChange, options }) {
  const opts = options.map(o=> typeof o==='object'? o : {v:o,label:o});
  return <div className="select-wrap" style={{position:'relative'}}>
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:'100%',appearance:'none',font:'500 13.5px var(--ff-sans)',color:'var(--ink)',background:'var(--paper-2)',border:'1px solid var(--hair-2)',borderRadius:8,padding:'9px 30px 9px 12px',cursor:'pointer'}}>
      {opts.map(o=><option key={o.v} value={o.v}>{o.label}</option>)}
    </select>
    <span style={{position:'absolute',right:11,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--mute)',fontSize:11}}>▼</span>
  </div>;
}
Object.assign(window, { Predecir, Field, Select });
