export type MachineInputs={start:boolean;stop:boolean;ld:boolean[]};
export function heldCoil(q:boolean,start:boolean,stop:boolean):boolean{return !stop&&(start||q);}
export function relayStep(previous:boolean[],{start,stop,ld}:MachineInputs):boolean[]{
  let k=[...previous];
  for(let i=0;i<24;i++){
    const busy=k.slice(0,4).some(Boolean);
    const next=[!stop&&!k[1]&&(k[0]||(start&&ld[0]&&!busy&&!k[4])),
      !stop&&!k[2]&&(k[1]||(k[0]&&ld[1])),!stop&&!k[3]&&(k[2]||(k[1]&&ld[2])),
      !stop&&!ld[0]&&(k[3]||(k[2]&&ld[3])),start&&(k[4]||busy||stop)];
    if(next.every((value,j)=>value===k[j]))return next;
    k=next;
  }
  throw new Error('Styki nie osiągnęły stanu ustalonego. Sprawdź sprzeczne czujniki.');
}
export function decodePhases(k:boolean[]):number[]{
  const fast=k[1]||k[3];return [Number((k[0]||k[1]||k[2])&&!k[3]),Number(k[3]),Number((k[0]||k[2])&&!fast),Number(fast)];
}
export function interlocked(prev:boolean[],left:boolean,right:boolean,stop:boolean):{coils:boolean[];conflict:boolean}{
  const l=!stop&&!prev[1]&&(left||prev[0]),r=!stop&&!prev[0]&&(right||prev[1]);
  return {coils:l&&r?[false,false]:[l,r],conflict:l&&r};
}
