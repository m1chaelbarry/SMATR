import {specialStep,type SFKind,type SFState} from './logo';
export type TimingPoint={time:number;trg:boolean;r:boolean;q:boolean};
export function advanceTiming(points:TimingPoint[],previous:SFState,kind:SFKind,input:{trg:boolean;r:boolean;dir:boolean},ms:number,par:number):{state:SFState;points:TimingPoint[]}{
  if(!Number.isFinite(ms)||ms<0)throw new RangeError('Krok czasu musi być skończony i nieujemny.');
  // Zmiana wejścia jest zdarzeniem w bieżącej chwili, przed upływem czasu.
  let time=points.at(-1)?.time??0;
  let state=specialStep(previous,kind,input,0,par);
  const added:TimingPoint[]=[{time,trg:input.trg,r:input.r,q:state.q}];
  let remaining=ms;
  while(remaining>0){
    let step=Math.min(10,remaining);
    const timingActive=(kind==='TON'&&input.trg)||(kind==='RETAIN'&&state.active)||(kind==='TOF'&&state.active);
    if(timingActive&&state.elapsed<par)step=Math.min(step,par-state.elapsed);
    state=specialStep(state,kind,input,step,par);time+=step;remaining-=step;
    added.push({time,trg:input.trg,r:input.r,q:state.q});
  }
  return {state,points:[...points,...added].slice(-2000)};
}
