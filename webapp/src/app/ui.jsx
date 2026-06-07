/* ============ ui.jsx — shared layout helpers ============ */
function PageHead({ num, kicker, title, lead }) {
  return (
    <div className="page-head">
      <div className="eyebrow"><span className="num">{num}</span><span>{kicker}</span><span className="line"/></div>
      <h2 className="page-title" dangerouslySetInnerHTML={{__html:title}}/>
      {lead && <p className="page-lead" dangerouslySetInnerHTML={{__html:lead}}/>}
    </div>
  );
}
function Card({ title, cap, note, children, className='', style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {(title||cap) && <div className="card-h">{title&&<h3>{title}</h3>}{cap&&<span className="cap">{cap}</span>}</div>}
      {children}
      {note && <div className="card-note">{note}</div>}
    </div>
  );
}
function StatRow({ items }) {
  return <div className="statrow">{items.map((it,i)=>(
    <div className="statcell" key={i}>
      <div className={`stat-num ${it.sev?'sev':''}`}>{it.render? it.render : <CountUp value={it.value} fmt={it.fmt||((v)=>nf(Math.round(v)))}/>}{it.unit&&<span className="u">{it.unit}</span>}</div>
      <div className="stat-lab">{it.label}</div>
      {it.sub&&<div className="stat-sub">{it.sub}</div>}
    </div>
  ))}</div>;
}
function Legend({ items }) {
  return <div className="legend">{items.map((it,i)=>(
    <span className="lg" key={i}>{it.line? <span className="swatch-line" style={{background:it.color}}/> : <span className="sw" style={{background:it.color}}/>}{it.label}</span>
  ))}</div>;
}
function Seg({ value, options, onChange }) {
  return <div className="seg">{options.map(o=>(
    <button key={o.v} className={value===o.v?'on':''} onClick={()=>onChange(o.v)}>{o.label}</button>
  ))}</div>;
}
function Chips({ value, options, onChange, multi, sev }) {
  const arr = multi ? (value||[]) : [value];
  const toggle = (v)=>{ if(multi){ const s=new Set(value||[]); s.has(v)?s.delete(v):s.add(v); onChange([...s]); } else onChange(v); };
  return <div className="chips">{options.map(o=>{
    const on = arr.includes(o.v ?? o);
    return <button key={o.v??o} className={`chip ${on?'on':''} ${sev&&on?'sev':''}`} onClick={()=>toggle(o.v??o)}>{o.label??o}</button>;
  })}</div>;
}
Object.assign(window, { PageHead, Card, StatRow, Legend, Seg, Chips });
