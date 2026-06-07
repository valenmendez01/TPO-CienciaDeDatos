/* ============ tab-panorama.jsx ============ */
function Panorama() {
  const D = window.TPO_DATA;
  const serie = D.serie.map(d=>({ ...d, ym:d.ym }));
  const concl = [
    { t:'El +35% es 2/3 exposición', d:'Los siniestros crecieron 35% (2021→24), pero el tránsito subió 22%. La tasa por millón de vehículos solo +10%: dos tercios es más autos, no más riesgo.', a:'amber' },
    { t:'La gravedad es un perfil, no un lugar', d:'k-means geográfico: severidad homogénea (4,7–5,6%). k-means de perfiles: spread de 10,9 pp. Un peatón mayor multiplica ×2,3 la chance de quedar grave.', a:'severe' },
    { t:'La velocidad de la vía ordena la severidad', d:'Calle 3,8% < Avenida 5,4% < Autopista 14,1% severos. Gradiente monótono — el límite legal por tipo de vía es proxy de velocidad.', a:'slate' },
    { t:'La lluvia trae menos siniestros, no más graves', d:'Días de lluvia: −8% de siniestros (−21% con >20mm). La gravedad individual no cambia (5,7% vs 5,9%). Triangulado en 3 fuentes.', a:'slate' },
    { t:'Feriado: el driver #1 de la cantidad diaria', d:'Regresión lineal (gana por extrapolar la tendencia): un feriado baja −9,6 siniestros/día; el finde −5,3. Clima: efecto chico.', a:'green' },
    { t:'29 esquinas concentran el 4,6%', d:'DBSCAN (60 m): micro-hotspots accionables. El mayor: 153 siniestros en un acceso de la Gral. Paz. Lo más accionable del análisis geográfico.', a:'severe' },
  ];
  return (
    <div className="view wide">
      <PageHead num="01" kicker="Panorama" title="Tres preguntas sobre <em>37.849</em> siniestros en cuatro años"
        lead="Analizamos la <strong>gravedad</strong> de cada siniestro (¿leve o severo?), la <strong>cantidad</strong> diaria, y los <strong>factores de riesgo</strong> — con los datos abiertos de la Ciudad y nueve fuentes externas validadas una por una." />

      <StatRow items={[
        { value:D.meta.N, label:'Siniestros · 2021–2024', sub:'Dataset oficial de CABA, integrado con víctimas' },
        { value:D.meta.base*100, fmt:v=>v.toFixed(1).replace('.',',')+'%', label:'Terminan severos', sev:true, sub:'Grave o mortal · clase minoritaria' },
        { render:<span><CountUp value={35} fmt={v=>'+'+Math.round(v)}/>%</span>, label:'Crecimiento 2021→2024', sub:'Rebote post-pandemia' },
        { render:<span>r&nbsp;<CountUp value={0.88} dur={1100} fmt={v=>v.toFixed(2).replace('.',',')}/></span>, label:'Siniestros ↔ tránsito', sub:'Se mueven juntos (48 meses)' },
      ]}/>

      <div className="grid g-2-1" style={{marginTop:22}}>
        <Card title="Siniestros por mes" cap="2021 — 2024"
          note="Serie nativa del dataset. La caída de mediados de 2021 es el rebote desde el piso pandémico; la tendencia es creciente y sostenida.">
          <LineChart data={serie} xKey="ym" yKey="n" height={262} color="var(--slate)"
            fmtX={(ym)=> ym.endsWith('-01')||ym.endsWith('-07') ? ym.slice(0,4)+(ym.endsWith('-07')?'·jul':'') : '' }
            fmtTip={(ym)=>{ const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']; const [y,m]=ym.split('-'); return `${MES[+m-1]} ${y}`; }}
            markers={[{at:'2024-03', label:''}]} />
        </Card>
        <Card title="Distribución de gravedad" cap="binario LEVE vs SEVERO">
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18,padding:'8px 0'}}>
            <Donut size={188} thickness={28} segments={[
              {v:D.meta.N-D.meta.sevTot,color:'var(--green)'},
              {v:D.meta.sevTot,color:'var(--severe)'},
            ]} center={<><div style={{fontFamily:'var(--ff-serif)',fontSize:38,fontWeight:500,color:'var(--severe)',lineHeight:1}}><CountUp value={5.7} fmt={v=>v.toFixed(1).replace('.',',')}/>%</div><div style={{fontFamily:'var(--ff-mono)',fontSize:10,letterSpacing:'.1em',color:'var(--mute)',textTransform:'uppercase',marginTop:4}}>severos</div></>}/>
            <Legend items={[{color:'var(--green)',label:`LEVE · ${nf(D.meta.N-D.meta.sevTot)}`},{color:'var(--severe)',label:`SEVERO · ${nf(D.meta.sevTot)}`}]}/>
            <div className="note-box" style={{fontSize:11.5}}>Acertar el 94% es predecir "siempre leve". Por eso el modelo se optimiza por <b>recall de severos</b>, no por accuracy.</div>
          </div>
        </Card>
      </div>

      <div style={{margin:'40px 0 18px'}}>
        <div className="eyebrow"><span className="num">→</span><span>Seis conclusiones</span><span className="line"/></div>
      </div>
      <div className="grid g3">
        {concl.map((c,i)=>(
          <div className="card reveal" key={i} style={{animationDelay:`${i*0.06}s`,display:'flex',flexDirection:'column',gap:11}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontFamily:'var(--ff-mono)',fontSize:12,fontWeight:600,color:`var(--${c.a})`}}>{String(i+1).padStart(2,'0')}</span>
              <span className="dot" style={{background:`var(--${c.a})`}}/>
            </div>
            <h3 className="serif" style={{fontSize:21,fontWeight:500,lineHeight:1.18,letterSpacing:'-.01em'}}>{c.t}</h3>
            <p style={{fontSize:13.5,lineHeight:1.5,color:'var(--ink-2)'}}>{c.d}</p>
          </div>
        ))}
      </div>

      <Card style={{marginTop:22}} title="Perfiles de riesgo" cap="k-means · spread de severidad 10,9 pp">
        <div style={{display:'flex',gap:0,alignItems:'stretch',flexWrap:'wrap'}}>
          {D.perfiles.map((p,i)=>{
            const max=D.perfiles[0].rate;
            return <div key={i} style={{flex:'1 1 0',minWidth:140,padding:'4px 18px',borderRight:i<D.perfiles.length-1?'1px solid var(--hair)':'none'}}>
              <div style={{height:96,display:'flex',alignItems:'flex-end',marginBottom:12}}>
                <div className="grow-bar" style={{width:'100%',borderRadius:'5px 5px 0 0',background:`color-mix(in srgb, var(--severe) ${30+p.rate/max*60}%, var(--slate))`,height:`${p.rate/max*100}%`,transition:'height .8s var(--ease)',animationDelay:`${i*0.1}s`}}/>
              </div>
              <div style={{fontFamily:'var(--ff-serif)',fontSize:22,fontWeight:500,color:'var(--severe)'}}>{pct(p.rate,1)}</div>
              <div style={{fontSize:13.5,fontWeight:600,margin:'4px 0 3px'}}>{p.k}</div>
              <div style={{fontSize:11.5,color:'var(--mute)',lineHeight:1.4}}>{p.desc}</div>
            </div>;
          })}
        </div>
      </Card>
    </div>
  );
}
window.Panorama = Panorama;
