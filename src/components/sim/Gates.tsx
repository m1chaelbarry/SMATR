import {useState} from 'react';
import {logicGate,nandExample,type GateKind} from '../../models/gates';
import {Signals,Switch} from './Signals';
export default function Gates(){
  const [mode,choose]=useState<GateKind|'EXAMPLE'>('EXAMPLE'),[a,setA]=useState(false),[b,setB]=useState(false),[c,setC]=useState(false);
  const example=mode==='EXAMPLE',arity=example?3:mode==='NOT'?1:2;
  const row=(Number(a)<<(arity-1))+(arity>=2?(Number(b)<<(arity-2)):0)+(arity===3?Number(c):0);
  const nodes=nandExample(a,b,c);const result=example?nodes.y:logicGate(mode,[a,b]);
  return <section className="simulator" aria-label="Symulator bramek"><h2>4. Bramki i realizacja NAND</h2><div className="controls"><label>Gotowy przykład<select value={mode} onChange={e=>choose(e.target.value as typeof mode)}><option value="EXAMPLE">y=¬a·b+a·c — cztery NAND</option>{(['AND','OR','NOT','XOR','NAND','NOR'] as GateKind[]).map(kind=><option value={kind} key={kind}>{kind}</option>)}</select></label></div>
    <div className="controls"><Switch label="a" value={a} onChange={setA}/>{arity>=2&&<Switch label="b" value={b} onChange={setB}/>} {arity===3&&<Switch label="c" value={c} onChange={setC}/>}</div>
    {example&&<svg viewBox="0 0 620 205" role="img" aria-label="Cztery bramki NAND z wynikami pośrednimi">
      {[[85,100,'n = NAND(a,a)',nodes.n],[275,55,'u = NAND(n,b)',nodes.u],[275,145,'v = NAND(a,c)',nodes.v],[480,100,'y = NAND(u,v)',nodes.y]].map(([x,y,label,value])=><g key={String(label)}><rect x={Number(x)-65} y={Number(y)-24} width="145" height="48" rx="7" fill={value?'#e1f5ec':'#edf0f7'} stroke="#172033"/><text x={Number(x)+6} y={Number(y)-4} textAnchor="middle" fontSize="12">{String(label)}</text><text x={Number(x)+6} y={Number(y)+16} textAnchor="middle">{Number(value)}</text></g>)}<path d="M165 100H190V55H210M355 55H395V90H415M355 145H395V115H415" fill="none" stroke="#1d4ed8" strokeWidth="2"/>
    </svg>}
    <Signals items={example?{n:nodes.n,u:nodes.u,v:nodes.v,y:result,SOP:nodes.sop,POS:nodes.pos}:{y:result}}/>
    <div className="table-scroll"><table><caption>Aktywny wiersz {row} (numerowanie od zera)</caption><thead><tr><th>Nr</th><th>a</th>{arity>=2&&<th>b</th>}{arity===3&&<th>c</th>}<th>y</th></tr></thead><tbody>{Array.from({length:2**arity},(_,n)=>{const aa=Boolean(n&(1<<(arity-1))),bb=arity>=2&&Boolean(n&(1<<(arity-2))),cc=Boolean(n&1);return <tr key={n} className={row===n?'active-row':''}><td>{n}</td><td>{Number(aa)}</td>{arity>=2&&<td>{Number(bb)}</td>}{arity===3&&<td>{Number(cc)}</td>}<td>{Number(example?nandExample(aa,bb,cc).y:logicGate(mode,[aa,bb]))}</td></tr>;})}</tbody></table></div>
    <p className="explain" aria-live="polite">Wiersz {row}: y={Number(result)}. {example?'Przy a=0 wynik jest b; przy a=1 wynik jest c. SOP, POS i NAND dają tę samą wartość. Każda bramka NAND neguje iloczyn swoich wejść.':`Wybrana funkcja ${mode} nie zapamiętuje stanu. Wynik zależy od bieżących wejść.`}</p><p className="limits">Logika idealna bez opóźnień i hazardów. Cztery NAND odpowiadają jednej UCY7400; przypisanie nóżek i pełna sieć cyklu są w lekcjach TTL.</p>
  </section>;
}
