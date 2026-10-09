export type CycleState={x:number;phase:number;time:number;start:boolean;emergency:boolean;log:string[]};
export type CycleAction={type:'start';value:boolean}|{type:'emergency';value:boolean}|{type:'step';ms:number}|{type:'stop'};
export function initialCycle():CycleState{return {x:0,phase:0,time:0,start:false,emergency:false,log:[]};}
export function cycleOutputs(s:CycleState):number[]{return s.emergency?[0,0,0,0]:[[0,0,0,0],[1,0,1,0],[1,0,0,1],[1,0,1,0],[0,1,0,1]][s.phase];}
export function cycleAction(previous:CycleState,action:CycleAction):CycleState{
  const s={...previous,log:[...previous.log]};
  const log=(message:string)=>{s.log.push(`${(s.time/1000).toFixed(2)} s · ${message}`);s.log=s.log.slice(-80);};
  if(action.type==='start'){
    if(action.value&&!s.start){
      if(!s.emergency&&s.phase===0&&Math.abs(s.x)<1e-7){s.phase=1;log('START: F1, roboczy w lewo');}
      else log('START pominięty: wymagany postój w początku i zwolniony awaryjny STOP');
    }
    s.start=action.value;
  }else if(action.type==='stop'){s.phase=0;log('STOP: cykl zakończony, wyjścia wyłączone');}
  else if(action.type==='emergency'){s.emergency=action.value;if(action.value)s.phase=0;log(action.value?'Awaryjny STOP: wyjścia wyłączone':'Awaryjny STOP zwolniony: potrzebny nowy START');}
  else{
    if(!Number.isFinite(action.ms)||action.ms<0||action.ms>60000)throw new RangeError('Krok musi być w zakresie 0–60000 ms');
    let remaining=action.ms;
    while(remaining>1e-7&&s.phase&&!s.emergency){
      const speed=s.phase===2||s.phase===4?80:20;
      const target=s.phase===4?[-220,-100,0].find(x=>x>s.x+1e-7)!:[0,-100,-220,-320][s.phase];
      const travel=Math.abs(target-s.x)/speed*1000;
      const used=Math.min(remaining,travel);s.x+=(s.phase===4?1:-1)*speed*used/1000;s.time+=used;remaining-=used;
      if(used>=travel-1e-7){
        s.x=target;
        if(s.phase===4){const sensor=target===-220?'3ŁD':target===-100?'2ŁD':'1ŁD';log(`${sensor}, powrót: ${target===0?'koniec cyklu':'F4 bez zmiany'}`);if(target===0)s.phase=0;}
        else {s.phase++;log(`${s.phase}ŁD: F${s.phase}`);}
      }
    }
    s.time+=remaining;
  }
  return s;
}
export function cycleSensors(s:CycleState):boolean[]{return [0,-100,-220,-320].map(x=>Math.abs(x-s.x)<=3);}
export function nextBoundaryMs(s:CycleState):number{
  if(!s.phase)return 0;
  const target=s.phase===4?[-220,-100,0].find(x=>x>s.x+1e-7)!:[0,-100,-220,-320][s.phase];
  return Math.abs(target-s.x)/(s.phase===2||s.phase===4?80:20)*1000;
}
