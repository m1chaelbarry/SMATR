import {it,expect} from 'vitest';
import {initialSF} from '../src/models/logo';
import {advanceTiming} from '../src/models/timing';
const initial=[{time:0,trg:false,r:false,q:false}];
it('wykres TON zapisuje przełączenie Q dokładnie na końcu T',()=>{
  const input={trg:true,r:false,dir:false};
  const result=advanceTiming(initial,initialSF(),'TON',input,3000,2000);
  expect(result.points.filter(p=>p.q)[0].time).toBe(2000);
  expect(result.points.at(-1)?.time).toBe(3000);
});
it('TOF liczy od opadającego Trg, RETAIN odmierza po puszczeniu i R zeruje',()=>{
  const high={trg:true,r:false,dir:false},low={...high,trg:false};
  let tof=advanceTiming(initial,initialSF(),'TOF',high,0,2000);
  tof=advanceTiming(tof.points,tof.state,'TOF',low,3000,2000);
  expect(tof.points.find(p=>p.time===1900)?.q).toBe(true);
  expect(tof.points.find(p=>p.time===2000)?.q).toBe(false);
  let retain=advanceTiming(initial,initialSF(),'RETAIN',high,0,2000);
  retain=advanceTiming(retain.points,retain.state,'RETAIN',low,2500,2000);
  expect(retain.points.filter(p=>p.q)[0].time).toBe(2000);
  retain=advanceTiming(retain.points,retain.state,'RETAIN',{...low,r:true},0,2000);
  expect(retain.points.at(-1)?.q).toBe(false);
});
