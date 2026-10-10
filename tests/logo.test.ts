import {it,expect} from 'vitest';
import {logoBlocks,logoOutputs,type LogoBlock} from '../src/data/circuits';
import {initialLogo,logoScan,validateProgram,initialSF,specialStep,clockExample,panelAction,initialPanel} from '../src/models/logo';
it('własny program spełnia wszystkie ograniczenia starego LOGO',()=>{
  const v=validateProgram(logoBlocks,logoOutputs);expect(v).toEqual({count:28,depth:7,memory:[6,8,0],errors:[]});
});
it('walidator wykrywa brak połączenia, nadmiar bloków, ścieżkę 8 i cykl',()=>{
  const long:LogoBlock[]=Array.from({length:8},(_,i)=>({id:`B${i+1}`,type:'NOT',inputs:[i?`B${i}`:'I1'],purpose:'test'}));
  expect(validateProgram(long,{Q1:'B8'}).errors.join(' ')).toContain('7');
  expect(validateProgram([...logoBlocks,...[31,32,33].map(n=>({id:`B${n}`,type:'NOT' as const,inputs:['I1'],purpose:'test'}))],logoOutputs).errors.join(' ')).toContain('30');
  expect(validateProgram([{id:'B1',type:'NOT',inputs:['?'],purpose:'test'}],{Q1:'B1'}).errors.join(' ')).toContain('?');
  expect(validateProgram([{id:'B1',type:'NOT',inputs:['B1'],purpose:'test'}],{Q1:'B1'}).errors.join(' ')).toContain('Pętla');
  expect(validateProgram([{id:'B1',type:'NOT',inputs:['I7'],purpose:'test'}],{Q1:'B1'}).errors.join(' ')).toContain('I7');
});
it('LOGO wykonuje pełny cykl, powrót i blokadę trzymanego START',()=>{
  let state=initialLogo();const scan=(input:boolean[])=>{for(let n=0;n<5;n++)state=logoScan(state,input,true);};
  const outputs=[[1,0,1,0],[1,0,0,1],[1,0,1,0],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,0,0]];
  [0,1,2,3,2,1,0].forEach((sensor,i)=>{scan([true,false,...[0,1,2,3].map(j=>j===sensor)]);expect(state.q.map(Number)).toEqual(outputs[i]);scan([true,false,false,false,false,false]);});
  scan([true,false,true,false,false,false]);expect(state.q.map(Number)).toEqual([0,0,0,0]);
  scan([false,false,true,false,false,false]);scan([true,false,true,false,false,false]);expect(state.q.map(Number)).toEqual([1,0,1,0]);
});
it('maszynowy STOP kasuje ruch, STOP sterownika otwiera wyjścia i nie oblicza bloków',()=>{
  let s=initialLogo();for(let i=0;i<4;i++)s=logoScan(s,[true,false,true,false,false,false],true);
  const stopped=logoScan(s,[true,false,true,false,false,false],false);expect(stopped.q).toEqual([false,false,false,false]);expect(stopped.rs).toEqual(s.rs);expect(stopped.time).toBe(s.time);
  for(let i=0;i<4;i++)s=logoScan(s,[true,true,true,false,false,false],true);
  for(let i=0;i<4;i++)s=logoScan(s,[true,false,true,false,false,false],true);
  expect(s.q).toEqual([false,false,false,false]);
});
it('OR czujników wymaga przerwy — równoczesne dwa czujniki dają jedno zbocze',()=>{
  let s=initialLogo();for(let n=0;n<4;n++)s=logoScan(s,[true,false,true,false,false,false],true);
  for(let n=0;n<10;n++)s=logoScan(s,[false,false,false,true,true,false],true);
  expect(s.counters.B06.count).toBe(1);expect(s.q.map(Number)).toEqual([1,0,0,1]);
});
it('TON kasuje za krótki impuls, załączenie z pamięcią kontynuuje i R ma priorytet',()=>{
  let ton=specialStep(initialSF(),'TON',{trg:true,r:false,dir:false},1000,2000);
  ton=specialStep(ton,'TON',{trg:false,r:false,dir:false},1000,2000);expect([ton.q,ton.elapsed]).toEqual([false,0]);
  let retain=specialStep(initialSF(),'RETAIN',{trg:true,r:false,dir:false},200,2000);
  retain=specialStep(retain,'RETAIN',{trg:false,r:false,dir:false},1800,2000);expect(retain.q).toBe(true);
  expect(specialStep(retain,'RETAIN',{trg:true,r:true,dir:false},2000,2000).q).toBe(false);
});
it('TOF, impulsowy, generator i licznik mają określone przebiegi',()=>{
  const input={trg:true,r:false,dir:false};let s=specialStep(initialSF(),'TOF',input,100,2000);expect(s.q).toBe(true);
  s=specialStep(s,'TOF',{...input,trg:false},1000,2000);expect(s.q).toBe(true);expect(specialStep(s,'TOF',{...input,trg:false},1000,2000).q).toBe(false);
  s=specialStep(initialSF(),'PULSE',input,0,1);expect(s.q).toBe(true);s=specialStep(s,'PULSE',input,0,1);expect(s.q).toBe(true);s=specialStep(s,'PULSE',{...input,trg:false},0,1);expect(specialStep(s,'PULSE',input,0,1).q).toBe(false);
  expect(specialStep(initialSF(),'GEN',input,500,1000).q).toBe(true);expect(specialStep(initialSF(),'GEN',input,1500,1000).q).toBe(false);
  s=initialSF();for(let n=0;n<3;n++){s=specialStep(s,'COUNTER',input,0,3);s=specialStep(s,'COUNTER',{...input,trg:false},0,3);}expect([s.count,s.q]).toEqual([3,true]);
  s=specialStep(s,'COUNTER',{...input,dir:true},0,3);expect([s.count,s.q]).toEqual([2,false]);
  expect(specialStep(s,'COUNTER',{...input,r:true},0,3).count).toBe(0);
});
it('czasowy przykład pn–pt 08:00–13:00 i panel blokujący ?',()=>{
  expect(clockExample(0,8*60)).toBe(true);expect(clockExample(4,13*60)).toBe(false);expect(clockExample(5,10*60)).toBe(false);
  let p=initialPanel();expect(panelAction(p,'run').run).toBe(false);
  for(let i=0;i<7;i++)p=panelAction(p,'next');expect(p.hole).toBe(true);expect(panelAction(p,'run').run).toBe(false);
  p=panelAction(p,'repair');p=panelAction(p,'next');p=panelAction(p,'run');expect(p.run).toBe(true);expect(panelAction(p,'stop').run).toBe(false);
});

it('koszty RS i licznika zgadzają się z tabelą Siemens, s. 163',()=>{
  const rs:LogoBlock={id:'B1',type:'RS',inputs:['I1','I2'],purpose:'test'};
  const counter:LogoBlock={id:'B2',type:'COUNTER',inputs:['I1','I2','lo'],par:1,purpose:'test'};
  expect(validateProgram([rs],{Q1:'B1'}).memory).toEqual([0,1,0]);
  expect(validateProgram([counter],{Q1:'B2'}).memory).toEqual([2,2,0]);
  const counters=Array.from({length:13},(_,i)=>({...counter,id:`B${i+1}`}));
  expect(validateProgram(counters,{Q1:'B1'}).errors).toContain('Przekroczono pamięć 27/24/10');
});
