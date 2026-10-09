import {describe,it,expect} from 'vitest';
import {initialCycle,cycleAction,cycleOutputs} from '../src/models/cycle';
describe('Stanowisko — deterministyczny ruch',()=>{
  it('pełny przejazd zmienia fazy i odczytuje czujniki także na powrocie',()=>{
    let s=cycleAction(initialCycle(),{type:'start',value:true});
    s=cycleAction(s,{type:'start',value:false});
    expect([s.phase,cycleOutputs(s)]).toEqual([1,[1,0,1,0]]);
    for(const [dt,x,phase,outputs] of [[5000,-100,2,[1,0,0,1]],[1500,-220,3,[1,0,1,0]],[5000,-320,4,[0,1,0,1]],[4000,0,0,[0,0,0,0]]] as const){
      s=cycleAction(s,{type:'step',ms:dt});expect(s.x).toBeCloseTo(x);expect(s.phase).toBe(phase);expect(cycleOutputs(s)).toEqual(outputs);
    }
    expect(s.log.filter(l=>l.includes('powrót'))).toEqual(expect.arrayContaining([expect.stringContaining('3ŁD'),expect.stringContaining('2ŁD')]));
  });
  it('duży krok jest równoważny małym krokom, bez pomijania granic',()=>{
    const s=cycleAction(initialCycle(),{type:'start',value:true});
    const big=cycleAction(s,{type:'step',ms:15500});let small=s;
    for(let i=0;i<310;i++)small=cycleAction(small,{type:'step',ms:50});
    expect([big.x,big.phase]).toEqual([small.x,small.phase]);expect(big.phase).toBe(0);
  });
  it('trzymany START nie restartuje; STOP poza początkiem zatrzymuje ruch',()=>{
    let s=cycleAction(initialCycle(),{type:'start',value:true});s=cycleAction(s,{type:'step',ms:15500});
    expect(cycleAction(s,{type:'start',value:true}).phase).toBe(0);
    s=cycleAction(s,{type:'start',value:false});s=cycleAction(s,{type:'start',value:true});s=cycleAction(s,{type:'step',ms:1000});s=cycleAction(s,{type:'stop'});
    expect(cycleOutputs(s)).toEqual([0,0,0,0]);s=cycleAction(s,{type:'start',value:false});
    expect(cycleAction(s,{type:'start',value:true}).phase).toBe(0);
  });
  it('awaryjne zatrzymanie pozostaje nadrzędne do zwolnienia i nowego START',()=>{
    let s=cycleAction(initialCycle(),{type:'emergency',value:true});s=cycleAction(s,{type:'start',value:true});expect(s.phase).toBe(0);
    s=cycleAction(s,{type:'emergency',value:false});expect(s.phase).toBe(0);s=cycleAction(s,{type:'start',value:false});
    expect(cycleAction(s,{type:'start',value:true}).phase).toBe(1);
  });
});
