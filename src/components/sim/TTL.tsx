import {useState} from 'react';
import {ttlStep,evaluateTTL} from '../../models/gates';
import type {MachineInputs} from '../../models/relays';
import {Signals,Switch} from './Signals';
const initialInput:MachineInputs={start:false,stop:false,ld:[true,false,false,false]};
const initialK=[false,false,false,false,false];
export default function TTL(){
  const [input,setInput]=useState(initialInput),[k,setK]=useState(initialK),[net,setNet]=useState(()=>evaluateTTL(initialK,initialInput)),[eventNet,setEventNet]=useState(()=>evaluateTTL(initialK,initialInput)),[error,setError]=useState(''),[log,setLog]=useState<string[]>([]);
  const update=(next:MachineInputs,label:string)=>{
    if(error)return;
    const commands=evaluateTTL(k,next),result=ttlStep(k,next);
    setInput(next);setK(result.k);setNet(result.net);setEventNet(commands);setError(result.error);
    setLog(old=>[...old,`${label}: K=${result.k.map(Number).join('')}${result.error?' — błąd SR':''}`].slice(-30));
  };
  const reset=()=>{setInput(initialInput);setK(initialK);setNet(evaluateTTL(initialK,initialInput));setEventNet(evaluateTTL(initialK,initialInput));setError('');setLog([]);};
  return <section className="simulator" aria-label="Symulator pełnego cyklu TTL"><h2>7. Pełny cykl TTL — NAND i SR</h2>
    <p>Własny układ z lekcji: wymuszaj wejścia i obserwuj K1–K5, S/R oraz napęd. Przejdź 1ŁD → 2ŁD → 3ŁD → 4ŁD → 3ŁD → 2ŁD → 1ŁD; na powrocie czujniki pośrednie nie zmieniają fazy. START musi zostać zwolniony przed kolejnym cyklem.</p>
    <div className="controls"><button onClick={reset}>Wyzeruj TTL</button><button disabled={Boolean(error)||input.start} onClick={()=>{
      const pressed=ttlStep(k,{...input,start:true});
      if(pressed.error){update({...input,start:true},'START=1');return;}
      const released=ttlStep(pressed.k,{...input,start:false});
      setK(released.k);setNet(released.net);setEventNet(evaluateTTL(k,{...input,start:true}));setError(released.error);setLog(old=>[...old,`Impuls START: K=${released.k.map(Number).join('')}`].slice(-30));
    }}>Impuls START TTL</button></div>
    <fieldset disabled={Boolean(error)}><legend>Wejścia TTL</legend><div className="controls"><Switch label="START TTL" value={input.start} onChange={start=>update({...input,start},`START=${Number(start)}`)}/><Switch label="STOP TTL" value={input.stop} onChange={stop=>update({...input,stop},`STOP=${Number(stop)}`)}/>{input.ld.map((value,i)=><Switch key={i} label={`${i+1}ŁD TTL`} value={value} onChange={value=>update({...input,ld:input.ld.map((v,j)=>i===j?value:v)},`${i+1}ŁD=${Number(value)}`)}/>)}</div>
    <div className="controls">{input.ld.map((_,i)=><button key={i} onClick={()=>update({...input,ld:input.ld.map((_,j)=>i===j)},`Tylko ${i+1}ŁD`)}>Tylko {i+1}ŁD</button>)}<button onClick={()=>update({...input,ld:[false,false,false,false]},'Zwolnij czujniki')}>Zwolnij czujniki TTL</button></div></fieldset>
    <Signals items={Object.fromEntries(k.map((v,i)=>[`K${i+1}`,v]))}/>
    <div className="table-scroll"><table><caption>S/R przy ostatniej zmianie wejść i po ustaleniu sprzężeń</caption><thead><tr><th>Pamięć</th><th>S przed</th><th>R przed</th><th>S teraz</th><th>R teraz</th><th>Q</th></tr></thead><tbody>{k.map((q,i)=>{
      const s=`S${i+1}`,r=i===4?'nStart':`R${i+1}`;
      return <tr key={i}><th>K{i+1}</th><td>{Number(eventNet[s])}</td><td>{Number(eventNet[r])}</td><td>{Number(net[s])}</td><td>{Number(net[r])}</td><td>{error?'niepewne':Number(q)}</td></tr>;
    })}</tbody></table></div>
    <Signals items={{'L — lewo':!error&&net.L,'P — prawo':!error&&k[3],'1E — robocze':!error&&net.W,'2E — szybkie':!error&&net.F}}/>
    {error?<p className="note error" role="alert">{error} Podgląd K pokazuje ostatni obliczony stan, nie pewny stan fizyczny. Wyjścia ćwiczenia zablokowano. Użyj „Wyzeruj TTL”.</p>:<p className="explain" aria-live="polite">{k.slice(0,4).some(Boolean)?`Aktywna faza: F${k.slice(0,4).findIndex(Boolean)+1}.`:'Postój.'} K5={Number(k[4])}. Tabela pokazuje również krótkie żądania S/R przed zmianą pamięci.</p>}
    <ol className="log" aria-label="Dziennik TTL">{log.map((line,i)=><li key={i}>{line}</li>)}</ol><p className="limits">Model korzysta z pełnej listy NAND i pięciu SR z NOR. Oblicza stan ustalony, bez opóźnień bramek i drgań styków. Dowolne wymuszanie pozwala sprawdzić sprzeczne czujniki: S=R=1 jest błędem bez priorytetu R.</p>
  </section>;
}
