/* ============ tab-explorar.jsx ============ */
function Explorar({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const [metric, setMetric] = useState('vol');     // vol | sev
  const [comMode, setComMode] = useState('n');     // n | tasa | rate
  const [yearF, setYearF] = useState('todos');
  const isSev = metric==='sev';
  const barColor = isSev ? 'var(--severe)' : 'var(--slate)';

  if (slide) return (
    <div className="app-embed explorar-embed">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:18,flexWrap:'wrap'}}>
        <Seg value={metric} onChange={setMetric} options={[{v:'vol',label:'Volumen'},{v:'sev',label:'% Severo'}]}/>
        <Legend items={isSev
          ? [{color:'var(--severe)',label:'% que termina severo'}]
          : [{color:'var(--slate)',label:'Cantidad de siniestros'},{color:'var(--severe)',line:true,label:'% severo (eje der.)'}]}/>
      </div>
      <div className="grid g2">
        <Card title="Cuándo: siniestros por hora del día" cap={isSev?'% severo':'volumen + % severo'}
          note="El volumen pica en la hora pico vespertina (17–19h). Pero la franja más severa es la madrugada: pocos siniestros, mucha gravedad — velocidad real en calles vacías. No es ruido por pocos casos: aun con intervalo de confianza al 95%, el piso de la madrugada (12,6% a las 3h) duplica al techo de la tarde (~4%).">
          <Columns data={D.byHour} yKey="n" rateKey="rate" height={300} color="var(--slate)" fmtX={(h)=>h+'h'} />
        </Card>
        <Card title="Día × franja horaria" cap={isSev?'% severo':'volumen'}
          note="Madrugada de sábado y domingo: el doble de siniestros que un martes, y 12,1% severos vs 5,5% del resto.">
          <Heat matrix={D.heat} rows={D.dowNames} cols={D.franjaOrder} metric={isSev?'rate':'n'}
            fmt={isSev? (v)=>(v*100).toFixed(0) : (n)=>n>=1000?(n/1000).toFixed(1)+'k':n}/>
          <div style={{marginTop:14}}><Legend items={[{color:'var(--paper-2)',label:'menos'},{color:'var(--severe)',label:isSev?'más severo':'más volumen'}]}/></div>
        </Card>
      </div>
    </div>
  );

  const serie = yearF==='todos' ? D.serie : D.serie.filter(d=>d.ym.startsWith(yearF));
  const victs = D.byVictima.slice(0,8);
  const comunaData = [...D.byComuna].sort((a,b)=> comMode==='tasa'? b.tasa-a.tasa : comMode==='rate'? b.rate-a.rate : b.n-a.n)
    .map(c=>({ k:'Comuna '+c.comuna, n:c.n, rate:c.rate, tasa:c.tasa }));

  return (
    <div className="view wide">
      <PageHead num="02" kicker="Explorar" title="El retrato de un siniestro típico"
        lead="Moto, hora pico, avenida. Cambiá el lente entre <strong>volumen</strong> (cuántos) y <strong>% severo</strong> (cuán graves) — casi nunca coinciden, y ahí está el hallazgo." />

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:22,flexWrap:'wrap'}}>
        <Seg value={metric} onChange={setMetric} options={[{v:'vol',label:'Volumen'},{v:'sev',label:'% Severo'}]}/>
        <Legend items={isSev
          ? [{color:'var(--severe)',label:'% que termina severo'}]
          : [{color:'var(--slate)',label:'Cantidad de siniestros'},{color:'var(--severe)',line:true,label:'% severo (eje der.)'}]}/>
      </div>

      <Card title="Siniestros por hora del día" cap="0h — 23h"
        note="El volumen pica en la hora pico vespertina (17–19h). Pero la franja más severa es la madrugada: pocos siniestros, mucha gravedad — velocidad real en calles vacías. No es ruido por pocos casos: aun con intervalo de confianza al 95%, el piso de la madrugada (12,6% a las 3h) duplica al techo de la tarde (~4%).">
        <Columns data={D.byHour} yKey="n" rateKey="rate" height={250} color="var(--slate)"
          fmtX={(h)=>h+'h'} />
      </Card>

      <div className="grid g2" style={{marginTop:20}}>
        <Card title="Cuándo: día × franja horaria" cap={isSev?'% severo':'volumen'}
          note="Madrugada de sábado y domingo: el doble de siniestros que un martes, y 12,1% severos vs 5,5% del resto.">
          <Heat matrix={D.heat} rows={D.dowNames} cols={D.franjaOrder} metric={isSev?'rate':'n'}
            fmt={isSev? (v)=>(v*100).toFixed(0) : (n)=>n>=1000?(n/1000).toFixed(1)+'k':n}/>
          <div style={{marginTop:14}}><Legend items={[{color:'var(--paper-2)',label:'menos'},{color:'color-mix(in srgb,var(--severe) 50%,var(--paper-2))',label:'más'},{color:'var(--severe)',label:isSev?'más severo':'más volumen'}]}/></div>
        </Card>
        <Card title="La velocidad de la vía ordena la severidad" cap="% severo por tipo de vía"
          note="Gradiente monótono: a mayor velocidad permitida, más severidad. No hay dato de velocidad medida; el tipo de vía fija el límite legal.">
          <Columns data={D.byCalle.map(c=>({k:c.k==='AV. GRAL. PAZ'?'GRAL. PAZ':c.k, n:c.rate*100, rate:c.rate}))} yKey="n" height={250} color="var(--severe)"
            fmtVal={(v)=>v.toFixed(1).replace('.',',')+'%'} fmtX={(k)=>k.toLowerCase()}/>
        </Card>
      </div>

      <div className="grid g2" style={{marginTop:20}}>
        <Card title={isSev?'Quién: severidad por modo de la víctima':'Quién: víctimas por modo de desplazamiento'} cap={isSev?'% severo':'cantidad'}
          note="La moto domina el volumen (1 de cada 3). Pero el peatón —y sobre todo el peatón mayor— domina la severidad.">
          <Bars data={isSev ? [...victs].sort((a,b)=>b.rate-a.rate) : victs}
            yKey={isSev?'rate':'n'} rateKey="rate" showRate={!isSev}
            color={barColor} fmtVal={isSev?(v)=>pct(v,1):nf} maxN={isSev?Math.max(...victs.map(v=>v.rate)):undefined}/>
        </Card>
        <Card title="Dónde: por comuna" cap={comMode==='tasa'?'tasa /100k hab/año':comMode==='rate'?'% severo':'cantidad'}>
          <div style={{marginBottom:16}}><Seg value={comMode} onChange={setComMode} options={[{v:'n',label:'Volumen'},{v:'tasa',label:'Per cápita'},{v:'rate',label:'% Severo'}]}/></div>
          <Bars data={comunaData.slice(0,10)} yKey={comMode==='tasa'?'tasa':comMode==='rate'?'rate':'n'} color={comMode==='rate'?'var(--severe)':'var(--slate)'}
            fmtVal={comMode==='tasa'?(v)=>Math.round(v):comMode==='rate'?(v)=>pct(v,1):nf} barH={26} gap={9}/>
          <div className="card-note">{comMode==='tasa'?'La Comuna 1 (Microcentro) lidera per cápita — pero su población residente no es la exposición real: entran cientos de miles por día.':comMode==='rate'?'La severidad es geográficamente plana: el volumen se concentra, la gravedad no.':'El volumen se concentra en el corredor oeste motero y el Microcentro.'}</div>
        </Card>
      </div>

      <Card title="La banda crítica de edad es 65+, no los jóvenes" cap="% severo por edad media de las víctimas" style={{marginTop:20}}
        note="La curva es en J: cae entre los jóvenes y adultos (la franja de más exposición) y se dispara en los 65+ —13,1% severo, más del doble de la base. Los jóvenes aportan volumen; los mayores, vulnerabilidad.">
        <LineChart data={D.byAge.map(a=>({k:a.k,rate:+(a.rate*100).toFixed(2)}))} xKey="k" yKey="rate" height={230} color="var(--severe)"
          fmtX={(k)=>k} fmtYTick={(v)=>Math.round(v)+'%'} fmtY={(v)=>v.toFixed(1).replace('.',',')+'%'} unit="severo" fmtTip={(k)=>'Edad '+k}/>
      </Card>
    </div>
  );
}
window.Explorar = Explorar;
