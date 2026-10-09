import type {MachineInputs} from './relays';
import {ttlGates} from '../data/circuits';
export type GateKind='AND'|'OR'|'NOT'|'XOR'|'NAND'|'NOR';
export function logicGate(kind:GateKind,input:boolean[]):boolean{
  switch(kind){case 'AND':return input.every(Boolean);case 'OR':return input.some(Boolean);case 'NAND':return !input.every(Boolean);case 'NOR':return !input.some(Boolean);case 'NOT':return !input[0];case 'XOR':return input[0]!==input[1];}
}
export function nandExample(a:boolean,b:boolean,c:boolean):Record<string,boolean>{
  const n=logicGate('NAND',[a,a]),u=logicGate('NAND',[n,b]),v=logicGate('NAND',[a,c]),y=logicGate('NAND',[u,v]);
  return {n,u,v,y,sop:(!a&&b)||(a&&c),pos:(a||b||c)&&(a||b||!c)&&(!a||b||c)&&(!a||!b||c)};
}
export function evaluateTTL(k:boolean[],input:MachineInputs):Record<string,boolean>{
  const net:Record<string,boolean>={START:input.start,STOP:input.stop};
  input.ld.forEach((value,i)=>net[`${i+1}ŁD`]=value);
  k.forEach((value,i)=>{net[`K${i+1}`]=value;net[`¬K${i+1}`]=!value;});
  for(const g of ttlGates)net[g.name]=logicGate('NAND',g.inputs.map(name=>{if(!(name in net))throw new Error(`Brak sieci ${name}`);return net[name];}));
  return net;
}
export function ttlStep(previous:boolean[],input:MachineInputs):{k:boolean[];net:Record<string,boolean>;error:string}{
  let k=[...previous];
  for(let i=0;i<24;i++){
    const net=evaluateTTL(k,input);const next=[...k];
    for(let latch=0;latch<5;latch++){
      const s=net[`S${latch+1}`],r=latch===4?net.nStart:net[`R${latch+1}`];
      if(s&&r)return {k,net,error:`K${latch+1}: S=R=1 — niedozwolony SR. Zatrzymaj i zainicjuj ćwiczenie.`};
      next[latch]=r?false:s?true:k[latch];
    }
    if(next.every((value,j)=>value===k[j]))return {k:next,net,error:''};k=next;
  }
  return {k,net:evaluateTTL(k,input),error:'Nie ustaliły się sprzężenia SR. Sprawdź czujniki.'};
}
