export function Signals({items}:{items:Record<string,boolean|number|string|null>}){
  return <div className="signal-grid">{Object.entries(items).map(([name,value])=><span className={`signal ${value===true||value===1?'on':''} ${value===null?'invalid':''}`} key={name}>{name}: <strong>{value===null?'?':typeof value==='boolean'?Number(value):value}</strong></span>)}</div>;
}
export function Switch({label,value,onChange}:{label:string;value:boolean;onChange:(value:boolean)=>void}){
  return <label><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/>{label}</label>;
}
