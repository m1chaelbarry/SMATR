import {it,expect} from 'vitest';
import {norMemory,logoRS,type NorState} from '../src/models/memory';
it('NOR wpisuje, podtrzymuje i zeruje',()=>{
  let m:NorState={q:false,nq:true,invalid:false};m=norMemory(m,true,false);expect(m).toEqual({q:true,nq:false,invalid:false});
  expect(norMemory(m,false,false)).toEqual(m);expect(norMemory(m,false,true)).toEqual({q:false,nq:true,invalid:false});
});
it('11 zeruje oba fizyczne wyjścia, po równoczesnym zwolnieniu stan jest nieznany',()=>{
  const invalid=norMemory({q:true,nq:false,invalid:false},true,true);expect(invalid).toEqual({q:false,nq:false,invalid:true});
  const unknown=norMemory(invalid,false,false);expect(unknown).toEqual({q:null,nq:null,invalid:false});expect(norMemory(unknown,false,false)).toEqual(unknown);
  expect(norMemory(unknown,true,false).q).toBe(true);expect(norMemory(unknown,false,true).q).toBe(false);
});
it('sekwencyjne zwolnienie 11 przez jedno wejście ustala wynik, bez losowania',()=>{
  const m=norMemory({q:false,nq:true,invalid:false},true,true);
  expect(norMemory(m,true,false).q).toBe(true);expect(norMemory(m,false,true).q).toBe(false);
});
it('RS LOGO ma priorytet zerowania i pamięta stan przy 00',()=>{
  for(const previous of [false,true])expect(logoRS(previous,true,true)).toBe(false);
  expect(logoRS(true,false,false)).toBe(true);expect(logoRS(false,true,false)).toBe(true);expect(logoRS(true,false,true)).toBe(false);
});
