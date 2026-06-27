/* ============ tab-perfiles.jsx — No supervisado: k-means + PCA ============ */
function Perfiles({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const P = D.noSup;
  const [hl, setHl] = useState(null);            // perfil resaltado (compartido scatter + tarjetas)
  const labelByPerfil = {}; P.meta.forEach(m => labelByPerfil[m.perfil] = m.label);
  const maxSev = Math.max(...P.meta.map(m => m.sevRate));
  const base = P.base;

  const elbow = P.elbow.map(d => ({ k: d.k, inertia: d.inertia / 1000 }));
  const scree = P.scree.map(d => ({ k: d.k, cum: d.cum * 100 }));

  const scatterCard = (
      /* ---- scatter PCA ---- */
      <Card title="Los 5 perfiles en el espacio de features"
        cap={`k-means k=5 · proyección PCA`}
        note={slide
          ? "Proyección PCA a 2D: solo muestra que los 5 perfiles se separan. Los ejes son combinaciones lineales de las 8 variables del perfil — no variables con nombre. El dato accionable es la severidad por perfil (tarjetas abajo)."
          : "Cada punto es un siniestro proyectado sobre sus dos componentes principales. Los ejes son combinaciones lineales de las 8 variables del cluster (edad, modo de la víctima, momento); la proyección solo sirve para ver la separación. Los anillos marcan el centro de cada grupo. Pasá el cursor por un perfil para aislarlo."}>
        <Scatter pts={P.scatter} centroids={P.centroids} colorByPerfil={P.colorByPerfil}
          labelByPerfil={labelByPerfil} highlight={hl} onHover={setHl}
          xLabel={slide ? `PC1 · edad / vulnerab. peatonal · ${pct(P.pc1Var,0)}` : `PC1 · ${pct(P.pc1Var,0)}`}
          yLabel={slide ? `PC2 · tipo de vehículo · ${pct(P.pc2Var,0)}` : `PC2 · ${pct(P.pc2Var,0)}`}
          height={slide ? 300 : 440} />
        <div style={{marginTop:14,display:'flex',gap:18,flexWrap:'wrap',alignItems:'center'}}>
          {P.meta.map(m=>(
            <span key={m.perfil} onMouseEnter={()=>setHl(m.perfil)} onMouseLeave={()=>setHl(null)}
              style={{display:'flex',alignItems:'center',gap:7,fontFamily:'var(--ff-mono)',fontSize:11.5,
                color:'var(--mute)',cursor:'default',opacity:hl==null||hl===m.perfil?1:0.4,transition:'opacity .16s'}}>
              <span style={{width:11,height:11,borderRadius:3,background:m.color,flex:'none'}}/>{m.label}
            </span>
          ))}
        </div>
      </Card>
  );

  /* ---- tarjetas de personas ---- */
  const personCards = (
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:16,marginTop:20}}>
        {P.meta.map(m=>{
          const on = hl==null || hl===m.perfil;
          return (
            <div key={m.perfil} className="card" onMouseEnter={()=>setHl(m.perfil)} onMouseLeave={()=>setHl(null)}
              style={{padding:'18px 18px 20px',opacity:on?1:0.5,transition:'opacity .16s,box-shadow .16s',
                borderTop:`3px solid ${m.color}`,cursor:'default'}}>
              <div style={{fontSize:14.5,fontWeight:600,color:'var(--ink)',lineHeight:1.2}}>{m.label}</div>
              <div style={{fontSize:12,color:'var(--mute-2)',marginTop:3,lineHeight:1.35,minHeight:32}}>{m.sub}</div>
              <div style={{fontFamily:'var(--ff-mono)',fontSize:10.5,letterSpacing:'.04em',color:'var(--mute)',marginTop:8}}>
                edad {m.edad} · {nf(m.n)} casos
              </div>
              <div style={{fontFamily:'var(--ff-serif)',fontSize:38,fontWeight:500,lineHeight:1,marginTop:14,color:m.color}}>
                <CountUp value={m.sevRate*100} fmt={v=>v.toFixed(1).replace('.',',')}/><span style={{fontSize:18}}>%</span>
              </div>
              <div style={{fontFamily:'var(--ff-mono)',fontSize:10,color:'var(--mute)',marginTop:3,textTransform:'uppercase',letterSpacing:'.06em'}}>severo</div>
              <div style={{height:7,background:'var(--paper-3)',borderRadius:4,position:'relative',overflow:'hidden',marginTop:12}}>
                <div className="ch-growx" style={{position:'absolute',left:0,top:0,bottom:0,width:(m.sevRate/maxSev*100)+'%',background:m.color,borderRadius:4}}/>
                <div style={{position:'absolute',left:(base/maxSev*100)+'%',top:-2,bottom:-2,width:1.5,background:'var(--ink)',opacity:.55}}/>
              </div>
            </div>
          );
        })}
      </div>
  );

  if (slide) {
    const sevMax = Math.max(...P.meta.map(m=>m.sevRate)), sevMin = Math.min(...P.meta.map(m=>m.sevRate));
    const mult = sevMax / sevMin;
    const fp = v => v.toFixed(1).replace('.', ',');
    return (
      <div className="app-embed perfiles-embed">
        <div className="perfiles-grid">
          {P.meta.map(m=>(
            <div key={m.perfil} className="card pf-card">
              <div className="pf-label">{m.label}</div>
              <div className="pf-sub">{m.sub}</div>
              <div className="pf-meta">edad {m.edad} · {nf(m.n)} casos</div>
              <div className="pf-pct" style={{color:m.color}}>
                <CountUp value={m.sevRate*100} fmt={v=>v.toFixed(1).replace('.',',')}/><span>%</span>
              </div>
              <div className="pf-sevlab">severo</div>
              <div className="pf-bar">
                <div className="pf-fill" style={{width:(m.sevRate/maxSev*100)+'%',background:m.color}}/>
                <div className="pf-base" style={{left:(base/maxSev*100)+'%'}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="pf-spread">
          <div className="pf-stat"><span style={{color:'var(--severe)'}}><CountUp value={mult} fmt={v=>Math.round(v)}/>×</span><label>entre perfiles</label></div>
          <div className="pf-stat"><span style={{color:'var(--slate)'}}>1,2×</span><label>entre zonas geográficas</label></div>
          <p className="pf-msg">El perfil más grave (<strong>{fp(sevMax*100)}%</strong>) es <strong>{Math.round(mult)} veces</strong> más severo que el más leve (<strong>{fp(sevMin*100)}%</strong>); entre barrios la gravedad es casi pareja. La línea marca la base global de <strong>{pct(base,1)}</strong>: el <em>quién</em> manda sobre el <em>dónde</em>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view wide">
      <PageHead num="06" kicker="No supervisado · k-means + PCA"
        title="El riesgo es un <em>tipo</em> de siniestro, no un lugar"
        lead="K-means agrupa los 37.849 siniestros en <strong>5 perfiles</strong> según edad, modo de la víctima y momento. Entre perfiles la severidad varía <strong>10,9 puntos</strong> —de 2,0% a 12,9%—; entre comunas apenas 0,9. La gravedad la explica el perfil, no la geografía." />

      {scatterCard}
      {personCards}
      <div className="note-box" style={{marginTop:14}}>La línea vertical marca la base global de <b>5,7%</b>. El perfil <b>Persona mayor</b> la duplica con creces (12,9%); <b>Vehicular leve</b> está casi tres veces por debajo (2,0%). El <b>spread de 10,9 pp</b> es lo que hace útil al clustering: separa el riesgo que el promedio esconde.</div>

      {/* ---- elección de k + PCA ---- */}
      <div className="grid g2" style={{marginTop:20}}>
        <Card title="Cuántos grupos: método del codo" cap="inercia vs k"
          note="La caída de la inercia se quiebra en k=5: sumar más grupos casi no reduce la dispersión interna. Cinco perfiles es el punto de equilibrio entre detalle y parsimonia.">
          <LineChart data={elbow} xKey="k" yKey="inertia" height={250} color="var(--slate)"
            fmtX={k=>'k='+k} fmtYTick={v=>Math.round(v)+'k'} fmtY={v=>Math.round(v)+' mil'} unit=""
            markers={[{at:P.chosenK,label:'k=5'}]} />
        </Card>
        <Card title="PCA: varianza acumulada" cap="¿conviene reducir dimensiones?"
          note="Hacen falta 6 de los 9 componentes para llegar al 80% de la varianza: no hay un eje dominante. Las features son casi ortogonales, así que PCA no sirve para comprimir el dataset —sólo para proyectarlo y poder ver los grupos en 2D.">
          <LineChart data={scree} xKey="k" yKey="cum" height={250} color="var(--severe)" fill={false} yMax={100}
            fmtX={k=>'PC'+k} fmtYTick={v=>Math.round(v)+'%'} fmtY={v=>v.toFixed(0)+'%'} unit="de la varianza"
            markers={[{at:P.compFor80,label:'80% → 6 comp.'}]} />
        </Card>
      </div>
    </div>
  );
}
window.Perfiles = Perfiles;
