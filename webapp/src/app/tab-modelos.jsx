/* ============ tab-modelos.jsx ============ */
function Modelos() {
  const D = window.TPO_DATA;
  const base = D.lifts.base;
  // operating points (recall / precision) per model — documented screening points
  const ops = {
    'Árbol d=4': { recall:0.79, prec:0.111 },
    'Árbol d=7': { recall:0.73, prec:0.125 },
    'Reg. Logística': { recall:0.75, prec:0.137 },
    'Random Forest': { recall:0.65, prec:0.157 },
    'RF + zona k-means': { recall:0.64, prec:0.166 },
  };
  const [sel, setSel] = useState('Random Forest');
  const Ntest = 7570, sev = Math.round(Ntest*base);
  const op = ops[sel];
  const tp = Math.round(sev*op.recall), fn = sev-tp;
  const fp = Math.round(tp*(1-op.prec)/op.prec), tn = Ntest-sev-fp;
  const acc = (tp+tn)/Ntest;
  const cells = [
    { lab:'Verdaderos severos', v:tp, c:'var(--green)', sub:'detectados', tone:'good' },
    { lab:'Severos perdidos', v:fn, c:'var(--severe)', sub:'falsos negativos', tone:'bad' },
    { lab:'Falsa alarma', v:fp, c:'var(--amber)', sub:'falsos positivos', tone:'meh' },
    { lab:'Leves correctos', v:tn, c:'var(--slate)', sub:'verdaderos negativos', tone:'good' },
  ];
  const rocMax = 0.86;

  return (
    <div className="view wide">
      <PageHead num="07" kicker="Modelos" title="Cinco modelos, un mismo protocolo, un <em>ganador</em>"
        lead="Validación cruzada estratificada de 5 folds. No se ordena por accuracy —acertar el 94% es predecir 'siempre leve'— sino por capacidad de <strong>detectar severos</strong> (recall y ROC-AUC)." />

      <Card title="Comparación de modelos" cap="CV 5-fold · binario LEVE vs SEVERO">
        <table className="tbl">
          <thead><tr><th>Modelo</th><th>Tipo</th><th>F1 severo</th><th>ROC-AUC</th><th>Recall severo</th><th></th></tr></thead>
          <tbody>
            {D.models.map((m,i)=>(
              <tr key={i} className={m.final?'final':''}>
                <td>{m.name}</td>
                <td style={{textAlign:'left',color:'var(--mute)',fontSize:13}}>{m.tipo}</td>
                <td className="m">{m.f1.toFixed(3).replace('.',',')}</td>
                <td className="m">{m.roc.toFixed(3).replace('.',',')}</td>
                <td className="m" style={{color: m.recall>0.78?'var(--green)':'var(--ink)'}}>{m.recall.toFixed(2).replace('.',',')}</td>
                <td style={{textAlign:'left',color:'var(--mute)',fontSize:12}}>{m.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card-note">El árbol gana en <b>recall</b> (0,79): ideal para screening, no perder casos graves. El <b>Random Forest</b> gana en F1 de severo (0,253) y discriminación global (ROC-AUC 0,811). Excluimos los flags <b>*_DESCONOCIDO</b> (sesgo de registro): sacarlos cuesta solo −0,015 de ROC-AUC. Sumar la zona geográfica (k-means) da +0,005 ROC-AUC, dentro del ruido — <b>no entró al modelo final</b>.</div>
      </Card>

      <div className="grid g-2-1" style={{marginTop:20}}>
        <Card title="Matriz de confusión" cap={`${sel} · punto de screening`}>
          <div style={{marginBottom:18}}><Seg value={sel} onChange={setSel} options={Object.keys(ops).map(k=>({v:k,label:k.replace('RF + zona k-means','RF + k-means').replace('Reg. Logística','Logística')}))}/></div>
          <div style={{display:'grid',gridTemplateColumns:'90px 1fr 1fr',gridTemplateRows:'auto 1fr 1fr',gap:8,alignItems:'stretch'}}>
            <div></div>
            <div style={{textAlign:'center',fontFamily:'var(--ff-mono)',fontSize:10.5,letterSpacing:'.06em',color:'var(--mute)',textTransform:'uppercase',paddingBottom:4}}>Predijo severo</div>
            <div style={{textAlign:'center',fontFamily:'var(--ff-mono)',fontSize:10.5,letterSpacing:'.06em',color:'var(--mute)',textTransform:'uppercase',paddingBottom:4}}>Predijo leve</div>
            {[['Es severo',cells[0],cells[1]],['Es leve',cells[2],cells[3]]].map((row,ri)=>(
              <React.Fragment key={ri}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',fontFamily:'var(--ff-mono)',fontSize:10.5,letterSpacing:'.06em',color:'var(--mute)',textTransform:'uppercase',paddingRight:8}}>{row[0]}</div>
                {[row[1],row[2]].map((c,ci)=>(
                  <div key={ci} style={{background:`color-mix(in srgb, ${c.c} 14%, var(--card))`,border:`1px solid color-mix(in srgb, ${c.c} 40%, transparent)`,borderRadius:10,padding:'18px 16px',minHeight:96,display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <div style={{fontFamily:'var(--ff-serif)',fontSize:34,fontWeight:500,color:c.c,lineHeight:1}}><CountUp value={c.v} fmt={nf}/></div>
                    <div style={{fontSize:12.5,fontWeight:600,marginTop:6}}>{c.lab}</div>
                    <div style={{fontFamily:'var(--ff-mono)',fontSize:10.5,color:'var(--mute)',marginTop:2}}>{c.sub}</div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </Card>
        <div className="grid" style={{gridTemplateColumns:'1fr',gap:20}}>
          <Card title="Recall de severos" cap="prioridad del modelo">
            <div style={{fontFamily:'var(--ff-serif)',fontSize:50,fontWeight:500,color:'var(--green)',lineHeight:1}}><CountUp value={op.recall*100} fmt={v=>Math.round(v)}/>%</div>
            <div style={{fontSize:13,color:'var(--mute)',marginTop:6}}>de cada 100 severos reales, detecta {Math.round(op.recall*100)}</div>
          </Card>
          <Card title="Precisión" cap="costo del screening">
            <div style={{fontFamily:'var(--ff-serif)',fontSize:50,fontWeight:500,color:'var(--amber)',lineHeight:1}}><CountUp value={op.prec*100} fmt={v=>Math.round(v)}/>%</div>
            <div style={{fontSize:13,color:'var(--mute)',marginTop:6}}>marca de más para no perder casos graves — tolerable en priorización, no en predicción puntual</div>
          </Card>
          <Card title="Accuracy" cap="por qué no se usa">
            <div style={{fontFamily:'var(--ff-serif)',fontSize:50,fontWeight:500,color:'var(--slate)',lineHeight:1}}><CountUp value={acc*100} fmt={v=>Math.round(v)}/>%</div>
            <div style={{fontSize:13,color:'var(--mute)',marginTop:6}}>"siempre leve" ya daría 94%: por eso la accuracy engaña con clases desbalanceadas</div>
          </Card>
        </div>
      </div>

      <Card title="Poder discriminante: ROC-AUC" cap="área bajo la curva" style={{marginTop:20}}
        note="Chequeo de robustez declarado: re-evaluado solo sobre el 57% de casos con datos completos, el ROC-AUC baja a 0,74 — ese es el poder discriminante real, descontando el sesgo de registro (los casos graves se documentan más completos).">
        <Bars data={D.models.map(m=>({k:m.name,v:m.roc}))} yKey="v" color="var(--slate)" maxN={rocMax}
          fmtVal={(v)=>v.toFixed(3).replace('.',',')} showRate={false} barH={28} gap={11}/>
      </Card>
    </div>
  );
}
window.Modelos = Modelos;
