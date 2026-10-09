import {logoBlocks,logoOutputs,type LogoBlock} from '../data/circuits';
import {logicGate} from './gates';
import {logoRS} from './memory';
export type LogoState={q:boolean[];rs:Record<string,boolean>;counters:Record<string,{count:number;previous:boolean}>;signals:Record<string,boolean>;time:number};
export function initialLogo():LogoState{return {q:[false,false,false,false],rs:{},counters:{},signals:{},time:0};}
export function logoScan(previous:LogoState,input:boolean[],run:boolean):LogoState{
  if(!run)return {...previous,q:[false,false,false,false]};
  if(input.length!==6)throw new RangeError('LOGO wymaga sześciu wejść');
  const state:LogoState={q:[],rs:{...previous.rs},counters:{...previous.counters},signals:{hi:true,lo:false},time:previous.time+50};
  input.forEach((value,i)=>state.signals[`I${i+1}`]=value);
  previous.q.forEach((value,i)=>state.signals[`Q${i+1}`]=value);
  const blocks=new Map(logoBlocks.map(b=>[b.id,b]));
  const evaluate=(id:string):boolean=>{
    if(id in state.signals)return state.signals[id];const block=blocks.get(id);if(!block)throw new Error(`Brak bloku ${id}`);
    const values=block.inputs.map(evaluate);let value:boolean;
    if(block.type==='RS'){value=logoRS(previous.rs[id]??false,values[0],values[1]);state.rs[id]=value;}
    else if(block.type==='COUNTER'){
      const last=previous.counters[id]??{count:0,previous:false};let count=last.count;
      if(values[0])count=0;else if(values[1]&&!last.previous)count=Math.min(9999,Math.max(0,count+(values[2]?-1:1)));
      state.counters[id]={count,previous:values[1]};value=!values[0]&&count>=block.par!;
    }else value=logicGate(block.type,values);
    state.signals[id]=value;return value;
  };
  state.q=Object.values(logoOutputs).map(evaluate);
  // Oblicz również wszystkie gałęzie listy raz na krok, z zachowaniem memoizacji.
  logoBlocks.forEach(block=>evaluate(block.id));return state;
}
export function validateProgram(blocks:LogoBlock[],outputs:Record<string,string>):{count:number;depth:number;memory:number[];errors:string[]}{
  const errors:string[]=[],map=new Map(blocks.map(b=>[b.id,b])),memory=[0,0,0];
  if(blocks.length>30)errors.push('Przekroczono 30 bloków');if(map.size!==blocks.length)errors.push('Powtórzone etykiety bloków');
  const terminal=(id:string)=>/^(I[1-6]|Q[1-4]|hi|lo|x)$/.test(id);
  for(const b of blocks){
    const arity=b.type==='NOT'?1:b.type==='RS'?2:3;
    if(b.inputs.length!==arity)errors.push(`${b.id}: wymagane ${arity} wejść`);
    for(const input of b.inputs)if(!terminal(input)&&!map.has(input))errors.push(`${b.id}: nieuzupełnione lub nieznane połączenie ${input||'?'}`);
    if(b.type==='COUNTER'){
      if(!Number.isInteger(b.par)||b.par!<0||b.par!>9999)errors.push(`${b.id}: Par 0–9999`);
      memory[0]++;memory[1]+=2;memory[2]+=2;
    }else if(b.type==='RS'){memory[0]++;memory[2]++;}
  }
  const depthOf=(id:string,path:string[]=[]):number=>{
    if(terminal(id)||!map.has(id))return 0;
    if(path.includes(id)){errors.push(`Pętla bloków przy ${id}`);return 0;}
    return 1+Math.max(0,...map.get(id)!.inputs.map(input=>depthOf(input,[...path,id])));
  };
  const depth=Math.max(0,...blocks.map(b=>depthOf(b.id)));
  for(const [output,input] of Object.entries(outputs))if(!/^Q[1-4]$/.test(output)||(!terminal(input)&&!map.has(input)))errors.push(`Nieznane wyjście ${output} ← ${input}`);
  if(depth>7)errors.push('Przekroczono 7 bloków na ścieżce');
  if(memory.some((n,i)=>n>[27,24,10][i]))errors.push('Przekroczono pamięć 27/24/10');
  return {count:blocks.length,depth,memory,errors:[...new Set(errors)]};
}
export type SFKind='TON'|'TOF'|'RETAIN'|'PULSE'|'GEN'|'COUNTER';
export type SFState={q:boolean;elapsed:number;active:boolean;previous:boolean;count:number};
export function initialSF():SFState{return {q:false,elapsed:0,active:false,previous:false,count:0};}
export function specialStep(previous:SFState,kind:SFKind,{trg,r,dir}:{trg:boolean;r:boolean;dir:boolean},ms:number,par:number):SFState{
  if(!Number.isFinite(ms)||ms<0||!Number.isFinite(par)|| (kind==='COUNTER'?(par<0||par>9999||!Number.isInteger(par)):kind!=='PULSE'&&par<100))throw new RangeError('T ≥ 100 ms; Par licznika: całkowite 0–9999; krok nieujemny.');
  const s={...previous,previous:trg};const rising=trg&&!previous.previous;
  if(r&&kind!=='TON'&&kind!=='GEN')return {...initialSF(),previous:trg};
  switch(kind){
    case 'TON':s.elapsed=trg?Math.min(par,s.elapsed+ms):0;s.q=trg&&s.elapsed>=par;break;
    case 'RETAIN':if(rising)s.active=true;if(s.active)s.elapsed=Math.min(par,s.elapsed+ms);s.q=s.elapsed>=par;break;
    case 'TOF':if(trg){s.q=true;s.elapsed=0;s.active=false;}else{if(previous.previous)s.active=true;if(s.active){s.elapsed=Math.min(par,s.elapsed+ms);s.q=s.elapsed<par;}}break;
    case 'PULSE':if(rising)s.q=!s.q;break;
    case 'GEN':s.elapsed=trg?(s.elapsed+ms)%(2*par):0;s.q=trg&&s.elapsed<par;break;
    case 'COUNTER':if(rising)s.count=Math.min(9999,Math.max(0,s.count+(dir?-1:1)));s.q=s.count>=par;break;
  }
  return s;
}
export function clockExample(day:number,minute:number):boolean{return day>=0&&day<5&&minute>=480&&minute<780;}
export type PanelState={step:number;hole:boolean;run:boolean;message:string};
export function initialPanel():PanelState{return {step:0,hole:false,run:false,message:'Otwórz programowanie: lewo+prawo+OK.'};}
export const panelSteps=[
  'Otwórz programowanie: lewo+prawo+OK.',
  'Program → Edit Prg → Q1. OK wybiera GF OR: powstaje B01.',
  'Od pierwszego wejścia OR wybierz GF AND: B02.',
  'Pierwsze wejście B02 → GF NOT B03 → Co I1.',
  'Drugie wejście B02 → Co I2; trzecie → hi.',
  'Drugie wejście OR → GF AND B04 → I1, I3, hi.',
  'Trzecie wejście OR pozostawiono jako ?. ESC wykryje brak.',
  'Niekompletne połączenie B01:3 = ?. Wybierz Co → lo i zatwierdź OK.',
  'Program kompletny: B01 OR(B02,B04,lo), B02 AND(B03,I2,hi), B03 NOT(I1), B04 AND(I1,I3,hi). ESC → Start → OK uruchamia RUN.',
];
export function panelAction(p:PanelState,action:'next'|'repair'|'run'|'stop'|'hole'|'cycle'):PanelState{
  if(action==='stop')return {...p,run:false,message:'STOP sterownika: wyjścia otwarte. Edycja połączeń jest dostępna w STOP.'};
  if(action==='run')return {...p,run:p.step===8&&!p.hole,message:p.step===8&&!p.hole?'RUN: program wykonuje się. START maszyny jest osobnym wejściem.':'RUN zablokowany — uzupełnij program i każde ?.'};
  if(p.run)return {...p,message:'Najpierw wybierz STOP sterownika, aby edytować połączenia.'};
  if(action==='cycle')return {step:8,hole:false,run:false,message:'Gotowy cykl: 28 bloków, ścieżka 7. Wybierz RUN, następnie START maszyny.'};
  if(action==='hole')return {step:7,hole:true,run:false,message:panelSteps[7]};
  if(action==='repair')return {...p,hole:false,message:'B01:3 → lo. Połączenie uzupełnione; ESC wraca do menu.'};
  if(p.hole)return {...p,message:'ESC wskazuje ? — uzupełnij połączenie przed dalszym krokiem.'};
  const step=Math.min(8,p.step+1);return {...p,step,hole:step===7,message:panelSteps[step]};
}
