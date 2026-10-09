import {it,expect} from 'vitest';
import {heldCoil,relayStep,decodePhases,interlocked} from '../src/models/relays';
it('samopodtrzymanie przechowuje impuls, STOP je przerywa',()=>{
  expect(heldCoil(false,true,false)).toBe(true);expect(heldCoil(true,false,false)).toBe(true);expect(heldCoil(true,true,true)).toBe(false);
});
it('pełny cykl styków przechodzi granice i ignoruje powrotne czujniki',()=>{
  let k=[false,false,false,false,false];
  const inputs=(start=false,ld=[false,false,false,false],stop=false)=>({start,stop,ld});
  const events=[inputs(true,[true,false,false,false]),inputs(),inputs(false,[false,true,false,false]),inputs(),inputs(false,[false,false,true,false]),inputs(),inputs(false,[false,false,false,true]),inputs(),inputs(false,[false,false,true,false]),inputs(false,[false,true,false,false]),inputs(false,[true,false,false,false])];
  const expected=[[1,0,1,0],[1,0,1,0],[1,0,0,1],[1,0,0,1],[1,0,1,0],[1,0,1,0],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,0,0]];
  events.forEach((e,i)=>{k=relayStep(k,e);expect(decodePhases(k)).toEqual(expected[i]);});
});
it('STOP i trzymany START kasują cykl, ale blokują ponowny start',()=>{
  let k=relayStep([false,false,false,false,false],{start:true,stop:false,ld:[true,false,false,false]});
  k=relayStep(k,{start:true,stop:true,ld:[true,false,false,false]});expect(k).toEqual([false,false,false,false,true]);
  k=relayStep(k,{start:true,stop:false,ld:[true,false,false,false]});expect(decodePhases(k)).toEqual([0,0,0,0]);
  k=relayStep(k,{start:false,stop:false,ld:[true,false,false,false]});
  expect(decodePhases(relayStep(k,{start:true,stop:false,ld:[true,false,false,false]}))).toEqual([1,0,1,0]);
});
it('dekoder blokuje kierunki i sprzęgła również dla nakładających się pamięci',()=>{
  for(let mask=0;mask<16;mask++){const y=decodePhases([0,1,2,3].map(i=>Boolean(mask&(1<<i))));expect(y[0]+y[1]).toBeLessThanOrEqual(1);expect(y[2]+y[3]).toBeLessThanOrEqual(1);}
});
it('blokada przeciwnego kierunku i jednoczesne polecenia',()=>{
  expect(interlocked([true,false],false,true,false)).toEqual({coils:[true,false],conflict:false});
  expect(interlocked([false,false],true,true,false)).toEqual({coils:[false,false],conflict:true});
  expect(interlocked([true,false],true,true,true).coils).toEqual([false,false]);
});
