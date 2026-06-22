/* ============ tab-reglas.jsx ============ */
function Reglas({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const base = D.lifts.base;
  const [minLift, setMinLift] = useState(1.2);
  const [conseq, setConseq] = useState('SEVERO');
  const sevRules = D.apriori.map(r=>({...r, prob:base*r.lift}));
  const leveRules = [
    { ante:'TRANSPORTE PÚBLICO + HORA PICO', lift:9.9, niche:true },
    { ante:'AUTO vs AUTO + TARDE', lift:1.04 },
    { ante:'BICICLETA + DÍA HÁBIL', lift:1.02 },
  ];
  const rules = (conseq==='SEVERO'?sevRules:leveRules).filter(r=>r.lift>=minLift);
  const maxLift = conseq==='SEVERO'?2.4:Math.max(...leveRules.map(r=>r.lift));

  const explorer = (
    <div className="grid g-1-2">
        <Card title="Cómo leer el lift" cap="base 5,7%">
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <div style={{fontFamily:'var(--ff-mono)',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--mute)',marginBottom:6}}>probabilidad base de severo</div>
              <div style={{fontFamily:'var(--ff-serif)',fontSize:40,fontWeight:500}}>{pct(base,1)}</div>
            </div>
            <div className="note-box">Lift <b>×2,1</b> sobre la base significa que esa combinación llega a <b>~12%</b> de severos: más del doble. Se filtran reglas con consecuente exactamente <span className="mono">{`{${conseq}}`}</span> y lift ≥ 1,2, excluyendo tautologías.</div>
            <div>
              <label className="field-lab">Lift mínimo — {minLift.toFixed(1).replace('.',',')}</label>
              <input type="range" min="1" max="2.3" step="0.1" value={minLift} onChange={e=>setMinLift(+e.target.value)} style={{width:'100%',accentColor:'var(--severe)'}}/>
            </div>
            <div>
              <label className="field-lab">Consecuente</label>
              <Seg value={conseq} onChange={setConseq} options={[{v:'SEVERO',label:'→ Severo'},{v:'LEVE',label:'→ Leve'}]}/>
            </div>
          </div>
        </Card>

        <Card title={`Reglas → ${conseq}`} cap={`${rules.length} regla${rules.length!==1?'s':''} · lift ≥ ${minLift.toFixed(1).replace('.',',')}`}>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {rules.length===0 && <div style={{color:'var(--mute)',fontSize:13,padding:'20px 0',textAlign:'center'}}>No hay reglas por encima de ese lift.</div>}
            {rules.map((r,i)=>{
              const w=Math.min((r.lift-1)/(maxLift-1)*100,100);
              return <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:7,gap:12}}>
                  <span style={{fontSize:14,fontWeight:500}}>{r.ante} {r.niche && <span className="badge leve" style={{marginLeft:6}}>nicho leve</span>}</span>
                  <span style={{fontFamily:'var(--ff-mono)',fontWeight:600,fontSize:14,color:conseq==='SEVERO'?'var(--severe)':'var(--green)'}}>×{r.lift.toFixed(2).replace('.',',')}</span>
                </div>
                <div style={{height:12,background:'var(--paper-3)',borderRadius:6,position:'relative',overflow:'hidden'}}>
                  <div className="grow-x" style={{position:'absolute',left:0,top:0,bottom:0,width:w+'%',background:conseq==='SEVERO'?'var(--severe)':'var(--green)',borderRadius:6,transition:`width .8s var(--ease) ${i*0.05}s`}}/>
                </div>
                {r.prob && <div style={{fontFamily:'var(--ff-mono)',fontSize:11,color:'var(--mute)',marginTop:5}}>→ {pct(r.prob,1)} de severos · soporte {pct(r.sup,1)}</div>}
                {r.niche && <div style={{fontFamily:'var(--ff-mono)',fontSize:11,color:'var(--mute)',marginTop:5}}>cohorte muy cohesiva de siniestros leves en hora pico</div>}
              </div>;
            })}
          </div>
          {conseq==='SEVERO' && <div className="card-note">El valor sobre el clasificador: estas reglas son <b>directamente accionables</b>. "Un peatón atropellado en avenida tiene el doble de chances de terminar grave" no necesita modelo para comunicarse — y es la base del predictor en vivo.</div>}
        </Card>
      </div>
  );

  if (slide) return <div className="app-embed reglas-embed">{explorer}</div>;

  return (
    <div className="view wide">
      <PageHead num="05" kicker="Reglas de asociación · Apriori" title="Combinaciones que <em>duplican</em> el riesgo"
        lead="Cada siniestro es una canasta de ítems (franja, vía, víctima, contraparte, finde). Apriori encuentra qué combinaciones aparecen junto a <strong>SEVERO</strong> más de lo esperado. El <strong>lift</strong> es cuánto multiplican la probabilidad base." />

      {explorer}

      <div className="grid g3" style={{marginTop:20}}>
        {[{t:'Peatón en avenida',v:'×2,2',d:'La regla más accionable: cruce peatonal en vía rápida.',c:'severe'},
          {t:'Madrugada',v:'×2,2',d:'Pocos siniestros, mucha gravedad: velocidad real sin tránsito.',c:'severe'},
          {t:'Transporte público',v:'×9,9',d:'Hacia LEVE: nicho cohesivo de choques de tráfico en hora pico.',c:'green'}].map((x,i)=>(
          <Card key={i} title={x.t} cap="lift">
            <div style={{fontFamily:'var(--ff-serif)',fontSize:46,fontWeight:500,color:`var(--${x.c})`,lineHeight:1}}>{x.v}</div>
            <div style={{fontSize:13,color:'var(--mute)',marginTop:8,lineHeight:1.45}}>{x.d}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
window.Reglas = Reglas;
