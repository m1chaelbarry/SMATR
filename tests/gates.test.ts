import {it,expect} from 'vitest';
import {logicGate,nandExample,ttlStep,evaluateTTL} from '../src/models/gates';
it('podstawowe bramki mają prawidłowe wszystkie wiersze',()=>{
  for(const [kind,expected] of [['AND',[0,0,0,1]],['OR',[0,1,1,1]],['NAND',[1,1,1,0]],['NOR',[1,0,0,0]],['XOR',[0,1,1,0]]] as const)
    expect([0,1,2,3].map(n=>Number(logicGate(kind,[Boolean(n&2),Boolean(n&1)])))).toEqual(expected);
  expect([false,true].map(v=>Number(logicGate('NOT',[v])))).toEqual([1,0]);
});
it('SOP, POS i cztery NAND zgadzają się ze źródłową tabelą, każdy węzeł jest poprawny',()=>{
  const nodes=[[1,1,1,0],[1,1,1,0],[1,0,1,1],[1,0,1,1],[0,1,1,0],[0,1,0,1],[0,1,1,0],[0,1,0,1]];
  for(let n=0;n<8;n++){const result=nandExample(Boolean(n&4),Boolean(n&2),Boolean(n&1));expect([result.n,result.u,result.v,result.y].map(Number)).toEqual(nodes[n]);expect(result.sop).toBe(result.y);expect(result.pos).toBe(result.y);}
});
it('pełna fizyczna lista NAND odpowiada funkcjom wzbudzania dla wszystkich wejść i pamięci',()=>{
  for(let memory=0;memory<32;memory++)for(let mask=0;mask<64;mask++){
    const k=[0,1,2,3,4].map(i=>Boolean(memory&(1<<i))),start=Boolean(mask&1),stop=Boolean(mask&2),ld=[2,3,4,5].map(i=>Boolean(mask&(1<<i)));
    const net=evaluateTTL(k,{start,stop,ld});const busy=k.slice(0,4).some(Boolean);
    expect([net.S1,net.S2,net.S3,net.S4,net.S5]).toEqual([start&&ld[0]&&!busy&&!stop&&!k[4],k[0]&&ld[1]&&!stop,k[1]&&ld[2]&&!stop,k[2]&&ld[3]&&!stop,start&&(busy||stop)]);
    expect([net.R1,net.R2,net.R3,net.R4,net.nStart]).toEqual([stop||k[1],stop||k[2],stop||k[3],stop||ld[0],!start]);
  }
});
it('NAND/SR realizuje cały cykl, powrót, STOP i blokadę trzymanego START',()=>{
  let k=Array(5).fill(false);
  for(const [sensor,expected] of [[0,[1,0,1,0]],[1,[1,0,0,1]],[2,[1,0,1,0]],[3,[0,1,0,1]],[2,[0,1,0,1]],[1,[0,1,0,1]],[0,[0,0,0,0]]] as const){
    const r=ttlStep(k,{start:true,stop:false,ld:[0,1,2,3].map(i=>i===sensor)});expect(r.error).toBe('');k=r.k;expect([r.net.L,k[3],r.net.W,r.net.F].map(Number)).toEqual(expected);
    const release=ttlStep(k,{start:true,stop:false,ld:[false,false,false,false]});k=release.k;
  }
  expect(ttlStep(k,{start:true,stop:false,ld:[true,false,false,false]}).k.slice(0,4)).toEqual([false,false,false,false]);
  expect(ttlStep(k,{start:true,stop:true,ld:[false,false,false,false]}).k.slice(0,4)).toEqual([false,false,false,false]);
});
it('wykrywa zabronione SR zamiast przypisywać priorytet R',()=>{
  const r=ttlStep([false,false,true,false,false],{start:false,stop:false,ld:[true,false,false,true]});expect(r.error).toContain('S=R=1');
});
