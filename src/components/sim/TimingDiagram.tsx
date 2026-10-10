import type {TimingPoint} from '../../models/timing';
export default function TimingDiagram({points}:{points:TimingPoint[]}){
  const start=points[0]?.time??0,end=points.at(-1)?.time??0,span=Math.max(1000,end-start);
  const x=(time:number)=>65+(time-start)*620/span;
  return <figure className="timing-diagram"><svg viewBox="0 0 730 240" role="img" aria-label="Przebieg Trg, R i Q względem czasu">
    {Array.from({length:6},(_,i)=><g key={i}><path d={`M${65+i*124} 15V200`} stroke="#dbe1eb"/><text x={65+i*124} y="224" textAnchor="middle" fontSize="12">{((start+span*i/5)/1000).toFixed(2)}</text></g>)}
    {(['trg','r','q'] as const).map((signal,i)=>{
      const y=(value:boolean)=>55+i*65-(value?27:0);
      const path=points.map((p,j)=>j===0?`M${x(p.time)} ${y(p[signal])}`:`H${x(p.time)}V${y(p[signal])}`).join(' ');
      return <g key={signal}><text x="8" y={40+i*65}>{signal==='trg'?'Trg':signal.toUpperCase()}</text><text x="47" y={31+i*65} fontSize="10">1</text><text x="47" y={58+i*65} fontSize="10">0</text><path d={`M65 ${55+i*65}H685`} stroke="#dbe1eb"/><path data-signal={signal} d={path} stroke={['#1d4ed8','#b45309','#047857'][i]} strokeWidth="2.5" fill="none"/></g>;
    })}<text x="710" y="224" textAnchor="middle" fontSize="12">t [s]</text>
  </svg><figcaption>Historia tego ćwiczenia: zmieniaj Trg/R i przesuwaj czas przyciskami. Poziomy 0/1; ostatnie 2000 próbek, krok do 10 ms. Wyzerowanie lub wybór funkcji zaczyna nowy przebieg.</figcaption></figure>;
}
