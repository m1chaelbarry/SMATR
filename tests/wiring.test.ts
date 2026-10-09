import {it,expect} from 'vitest';
import {relayContacts,relayCoils} from '../src/data/relay-wiring';
import {ttlWiring,latchWiring} from '../src/data/circuits';
it('montaż styków odtwarza każdą gałąź schematu dla 2048 kombinacji',()=>{
  for(let memory=0;memory<32;memory++)for(let mask=0;mask<64;mask++){
    const k=[0,1,2,3,4].map(i=>Boolean(memory&(1<<i))),start=Boolean(mask&1),z=Boolean(mask&2),ld=[2,3,4,5].map(i=>Boolean(mask&(1<<i)));
    const values:Record<string,boolean>={START:start,Z:z,'1S':false,'2S':false,'3S':false,'4S':false};k.forEach((v,i)=>values[`K${i+1}`]=v);ld.forEach((v,i)=>values[`${i+1}ŁD`]=v);
    const live=new Set([1,2]);let size=0;
    while(size!==live.size){size=live.size;for(const c of relayContacts){const closed=c.kind==='NO'?values[c.device]:!values[c.device];if(!closed)continue;if(live.has(c.from))live.add(c.to);if(live.has(c.to))live.add(c.from);}}
    const busy=k.slice(0,4).some(Boolean),fast=k[1]||k[3];
    const expected=[!z&&!k[1]&&(k[0]||(start&&ld[0]&&!busy&&!k[4])),!z&&!k[2]&&(k[1]||(k[0]&&ld[1])),!z&&!k[3]&&(k[2]||(k[1]&&ld[2])),!z&&!ld[0]&&(k[3]||(k[2]&&ld[3])),start&&(k[4]||busy||z),(k[0]||k[1]||k[2])&&!k[3],k[3],(k[0]||k[2])&&!fast,fast];
    expect(relayCoils.map(coil=>live.has(coil.from))).toEqual(expected);
  }
});
it('wyprowadzenia kości są unikalne i poza zasilaniem, a NOR mają właściwe pary',()=>{
  const connections=ttlWiring.flatMap(g=>[...g.pins,g.output].map(pin=>`${g.chip}:${pin}`));expect(new Set(connections).size).toBe(connections.length);
  for(const g of ttlWiring)expect([...g.pins,g.output].some(p=>p===7||p===14)).toBe(false);
  expect(latchWiring.slice(0,2).map(l=>[l.s,l.r,l.q,l.nq])).toEqual([[6,2,1,4],[12,8,10,13]]);
});
