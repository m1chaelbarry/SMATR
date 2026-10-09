import {useEffect,useState} from 'react';
import {cycleAction,cycleOutputs,cycleSensors,initialCycle,nextBoundaryMs} from '../../models/cycle';
import {Signals,Switch} from './Signals';
export default function Cycle(){
  const [s,set]=useState(initialCycle),[playing,play]=useState(false),[reduced,setReduced]=useState(false);
  useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(m.matches);if(m.matches)play(false);};update();m.addEventListener('change',update);return ()=>m.removeEventListener('change',update);},[]);
  useEffect(()=>{if(!playing)return;const timer=setInterval(()=>set(p=>cycleAction(p,{type:'step',ms:50})),50);return ()=>clearInterval(timer);},[playing]);
  useEffect(()=>{if(!s.phase||s.emergency)play(false);},[s.phase,s.emergency]);
  const outputs=cycleOutputs(s);const sensors=cycleSensors(s);const px=65+(s.x+320)*1.4;
  return <section className="simulator" aria-label="Symulator stanowiska">
    <h2>1. Stanowisko i cykl</h2><p>START w początku → roboczy lewo → szybki lewo → roboczy lewo → szybki powrót.</p>
    <svg viewBox="0 0 600 175" role="img" aria-label={`Stół x=${s.x.toFixed(1)} mm, faza ${s.phase}`}><path d="M40 100H550" stroke="#91a0b9" strokeWidth="8"/>{[0,-100,-220,-320].map((x,i)=><g key={x}><path d={`M${65+(x+320)*1.4} 112v18`} stroke="#172033"/><text x={65+(x+320)*1.4} y="151" textAnchor="middle">{i+1}ŁD</text></g>)}<rect x={px-25} y="50" width="50" height="48" rx="6" fill="#1d4ed8"/><text x={px} y="35" textAnchor="middle">{s.phase? s.phase===4?'→':'←':'postój'}</text></svg>
    <div className="controls"><button className="primary" onClick={()=>set(p=>cycleAction(cycleAction(p,{type:'start',value:true}),{type:'start',value:false}))} disabled={s.start||s.emergency}>Impuls START</button><Switch label="Trzymaj START" value={s.start} onChange={value=>set(p=>cycleAction(p,{type:'start',value}))}/><button onClick={()=>{play(false);set(p=>cycleAction(p,{type:'stop'}));}}>STOP cyklu</button><Switch label="Awaryjny STOP" value={s.emergency} onChange={value=>set(p=>cycleAction(p,{type:'emergency',value}))}/></div>
    <div className="controls"><button onClick={()=>play(!playing)} disabled={!s.phase||s.emergency||reduced}>{playing?'Pauza animacji':'Odtwarzaj'}</button><button disabled={playing||!s.phase} onClick={()=>set(p=>cycleAction(p,{type:'step',ms:250}))}>Krok 250 ms</button><button disabled={playing||!s.phase} onClick={()=>set(p=>cycleAction(p,{type:'step',ms:nextBoundaryMs(p)}))}>Następna granica</button><button onClick={()=>{play(false);set(initialCycle());}}>Od początku</button></div>
    {reduced&&<p className="limits">Ograniczenie ruchu jest aktywne. Korzystaj z pojedynczych kroków i granic.</p>}
    <Signals items={{Faza:`F${s.phase}`,x:`${s.x.toFixed(1)} mm`,L:outputs[0],P:outputs[1],'1E':outputs[2],'2E':outputs[3],...Object.fromEntries(sensors.map((v,i)=>[`${i+1}ŁD`,v]))}}/>
    <p className="explain" aria-live="polite">{s.phase===0?'Postój. Nowy cykl wymaga świeżego START w x=0.':`F${s.phase}: ${s.phase===4?'prawo':'lewo'}, ${s.phase===2||s.phase===4?'posuw szybki':'posuw roboczy'}. Pamięć fazy utrzymuje ruch po zwolnieniu czujnika.`}</p>
    <ol className="log" aria-label="Dziennik przejść">{s.log.map((line,i)=><li key={i}>{line}</li>)}</ol><p className="limits">Model treningowy: 20 mm/s roboczy, 80 mm/s szybki; czujnik aktywny w umownej strefie ±3 mm. Pauza zamraża czas demonstracji. Nie modelujemy bezwładności ani czasów styczników. „Od początku” resetuje ćwiczenie, nie cofa fizycznej maszyny.</p>
  </section>;
}
