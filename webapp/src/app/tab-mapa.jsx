/* ============ tab-mapa.jsx ============ */
function Mapa({ slide = false } = {}) {
  const D = window.TPO_DATA;
  const [mode, setMode] = useState(slide ? 'hotspots' : 'comunas');   // comunas | hotspots | calor
  const [metric, setMetric] = useState('tasa');  // tasa | rate | n
  const mapRef = useRef(null);
  const elRef = useRef(null);
  const layerRef = useRef(null);
  const geoRef = useRef(null);
  const labelRef = useRef(null);

  // init map once
  useEffect(() => {
    const dark = document.documentElement.getAttribute('data-theme')==='dark';
    const map = L.map(elRef.current, { zoomControl:true, scrollWheelZoom:true, attributionControl:false }).setView([-34.615,-58.445], 12);
    L.control.attribution({prefix:false}).addAttribution('© OpenStreetMap · CARTO · Datos: GCBA').addTo(map);
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${dark?'dark_all':'rastertiles/voyager_nolabels'}/{z}/{x}/{y}{r}.png`, { subdomains:'abcd', maxZoom:19 }).addTo(map);
    mapRef.current = map;
    fetch((window.TPO_ASSET_BASE||'') + 'data/comunas.geojson').then(r=>r.json()).then(gj=>{ geoRef.current = gj; draw(); });
    setTimeout(()=>map.invalidateSize(), 200);
    // When embedded in a hidden deck slide, Leaflet sizes itself before the
    // slide is shown; recompute on activation so tiles fill the container.
    const onSlide = (e)=>{ if(e.detail && e.detail.slide && e.detail.slide.contains(elRef.current)) setTimeout(()=>map.invalidateSize(), 60); };
    if (slide) document.addEventListener('slidechange', onSlide);
    return ()=>{ map.remove(); if (slide) document.removeEventListener('slidechange', onSlide); };
  }, []);

  useEffect(()=>{ if(geoRef.current) draw(); }, [mode, metric]);

  const comById = {}; D.byComuna.forEach(c=>comById[c.comuna]=c);
  function valFor(c){ return metric==='tasa'?c.tasa : metric==='rate'?c.rate*100 : c.n; }
  function centroid(geom){
    let xs=0,ys=0,n=0;
    const walk=(co)=>{ if(typeof co[0]==='number'){xs+=co[0];ys+=co[1];n++;} else co.forEach(walk); };
    walk(geom.coordinates); return [ys/n, xs/n];
  }
  function scale(v, vmin, vmax){ return (v-vmin)/(vmax-vmin||1); }

  function draw(){
    const map=mapRef.current; if(!map) return;
    [layerRef,geoRef.layer,labelRef].forEach(()=>{});
    if(layerRef.current){ map.removeLayer(layerRef.current); layerRef.current=null; }
    if(labelRef.current){ map.removeLayer(labelRef.current); labelRef.current=null; }
    if(map._heat){ map.removeLayer(map._heat); map._heat=null; }
    if(map._geo){ map.removeLayer(map._geo); map._geo=null; }

    if(mode==='comunas'){
      const vals=D.byComuna.map(valFor); const vmin=Math.min(...vals),vmax=Math.max(...vals);
      const color=(c)=>{ const t=scale(valFor(c),vmin,vmax); return metric==='rate'
        ? `color-mix(in srgb, var(--severe) ${(15+t*78).toFixed(0)}%, var(--paper-2))`
        : `color-mix(in srgb, var(--slate) ${(15+t*80).toFixed(0)}%, var(--paper-2))`; };
      const geo=L.geoJSON(geoRef.current,{
        style:(f)=>{ const c=comById[f.properties.comuna]; return { fillColor: c?color(c):'#ccc', fillOpacity:.82, color:'var(--card)', weight:1.5 }; },
        onEachFeature:(f,lyr)=>{ const c=comById[f.properties.comuna]; if(!c) return;
          lyr.on('mouseover',()=>lyr.setStyle({weight:3,color:'var(--ink)'}));
          lyr.on('mouseout',()=>lyr.setStyle({weight:1.5,color:'var(--card)'}));
          lyr.bindPopup(`<div class="popup-t">Comuna ${c.comuna}</div><div class="popup-n">${metric==='tasa'?Math.round(c.tasa):metric==='rate'?pct(c.rate,1):nf(c.n)}</div><div style="font-size:12px;color:var(--mute)">${metric==='tasa'?'siniestros /100k hab/año':metric==='rate'?'terminan severos':'siniestros 2021–24'}</div><div style="font-size:11.5px;color:var(--mute);margin-top:6px;font-family:var(--ff-mono)">${nf(c.n)} siniestros · ${pct(c.rate,1)} severos</div>`);
        }
      }).addTo(map); map._geo=geo;
      // labels
      const lg=L.layerGroup(); geoRef.current.features.forEach(f=>{ const c=comById[f.properties.comuna]; if(!c) return;
        const ll=centroid(f.geometry);
        L.marker(ll,{interactive:false,icon:L.divIcon({className:'',html:`<div style="font-family:var(--ff-mono);font-size:13px;font-weight:600;color:var(--ink);text-shadow:0 1px 3px var(--card),0 0 4px var(--card);text-align:center;white-space:nowrap">${metric==='tasa'?Math.round(c.tasa):metric==='rate'?(c.rate*100).toFixed(1):c.n}</div>`,iconSize:[40,16]})}).addTo(lg);
      }); lg.addTo(map); labelRef.current=lg;
    }

    if(mode==='hotspots'){
      const geo=L.geoJSON(geoRef.current,{style:{fillColor:'transparent',color:'var(--hair-2)',weight:1,fillOpacity:0}}).addTo(map); map._geo=geo;
      const grp=L.layerGroup();
      D.hotspots.forEach((h,i)=>{
        const rad=6+Math.sqrt(h.n)*1.5;
        const col=h.rate>0.10?'var(--severe)':h.rate>0.06?'var(--amber)':'var(--slate)';
        L.circleMarker([h.lat,h.lon],{radius:rad,fillColor:col,color:'var(--card)',weight:1.5,fillOpacity:.62})
          .bindPopup(`<div class="popup-t">Hotspot #${i+1}</div><div class="popup-n">${h.n}</div><div style="font-size:12px;color:var(--mute)">siniestros en ~60 m</div><div style="font-size:11.5px;color:var(--mute);margin-top:6px;font-family:var(--ff-mono)">${pct(h.rate,1)} severos</div>`)
          .addTo(grp);
      });
      grp.addTo(map); layerRef.current=grp;
    }

    if(mode==='calor'){
      const geo=L.geoJSON(geoRef.current,{style:{fillColor:'transparent',color:'var(--hair-2)',weight:1,fillOpacity:0}}).addTo(map); map._geo=geo;
      const pts=D.pts.map(p=>[p[0],p[1],0.6]);
      map._heat=L.heatLayer(pts,{radius:14,blur:20,maxZoom:15,minOpacity:.25,
        gradient:{0.2:'#3E5A66',0.45:'#C28A2C',0.7:'#E05334',1:'#C0391F'}}).addTo(map);
    }
  }

  const legendItems = mode==='hotspots'
    ? [{c:'var(--slate)',t:'< 6% severo'},{c:'var(--amber)',t:'6–10%'},{c:'var(--severe)',t:'> 10%'}]
    : mode==='calor' ? [{c:'var(--slate)',t:'menos denso'},{c:'var(--severe)',t:'más denso'}]
    : [{c:'var(--paper-3)',t:'menos'},{c:metric==='rate'?'var(--severe)':'var(--slate)',t:'más'}];

  const body = (
    <React.Fragment>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:18,flexWrap:'wrap'}}>
        <Seg value={mode} onChange={setMode} options={[{v:'comunas',label:'Comunas'},{v:'hotspots',label:'Hotspots DBSCAN'},{v:'calor',label:'Mapa de calor'}]}/>
        {mode==='comunas' && <Seg value={metric} onChange={setMetric} options={[{v:'tasa',label:'Per cápita'},{v:'rate',label:'% Severo'},{v:'n',label:'Volumen'}]}/>}
      </div>

      <div style={{position:'relative'}}>
        <div ref={elRef} className="leaflet-wrap"/>
        <div className="map-legend" style={{position:'absolute',bottom:16,left:16,zIndex:500}}>
          <div style={{fontWeight:600,marginBottom:6,fontSize:14,letterSpacing:'.08em',textTransform:'uppercase'}}>
            {mode==='comunas'?(metric==='tasa'?'Tasa /100k hab/año':metric==='rate'?'% que termina severo':'Siniestros 2021–24'):mode==='hotspots'?'Severidad del hotspot':'Densidad de siniestros'}
          </div>
          {legendItems.map((l,i)=><div key={i}><i style={{background:l.c}}/>{l.t}</div>)}
        </div>
      </div>

      <div className="grid g3" style={{marginTop:20}}>
        <Card title="Hotspot principal" cap="DBSCAN · 60 m">
          <div style={{fontFamily:'var(--ff-serif)',fontSize:44,fontWeight:500,color:'var(--severe)',lineHeight:1}}><CountUp value={D.hotspots[0].n}/></div>
          <div style={{fontSize:15,color:'var(--mute)',marginTop:6,lineHeight:1.4}}>siniestros en un acceso · Gral. Paz, Comuna 12</div>
        </Card>
        <Card title="Concentración" cap="29 hotspots">
          <div style={{fontFamily:'var(--ff-serif)',fontSize:44,fontWeight:500,color:'var(--amber)',lineHeight:1}}><CountUp value={4.6} fmt={v=>v.toFixed(1).replace('.',',')}/>%</div>
          <div style={{fontSize:15,color:'var(--mute)',marginTop:6}}>de todos los siniestros caen en 29 micro-esquinas</div>
        </Card>
        <Card title="Severidad entre comunas" cap="casi pareja">
          <div style={{fontFamily:'var(--ff-serif)',fontSize:44,fontWeight:500,color:'var(--slate)',lineHeight:1}}>1,2×</div>
          <div style={{fontSize:15,color:'var(--mute)',marginTop:6}}>vs 6× entre perfiles: la gravedad es un perfil, no un barrio</div>
        </Card>
      </div>
    </React.Fragment>
  );

  if (slide) return <div className="app-embed mapa-embed">{body}</div>;

  return (
    <div className="view wide">
      <PageHead num="04" kicker="Mapa" title="La gravedad <em>no</em> se concentra en un lugar"
        lead="El volumen sí: el corredor oeste motero y el Microcentro. Pero la severidad es geográficamente plana. Lo accionable son las <strong>29 esquinas</strong> que el DBSCAN aísla." />
      {body}
    </div>
  );
}
window.Mapa = Mapa;
