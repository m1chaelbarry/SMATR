import {it,expect} from 'vitest';
import {bumperGeometry} from '../src/models/bumpers';
it('odtwarza oba zestawy z rysunku wymiarowego, ze współrzędnymi',()=>{
  expect(bumperGeometry([100,120,100],-1)).toEqual({table:[0,-100,-220,-320],bumpers:[0,155,330,485],spacing:[155,175,155]});
  expect(bumperGeometry([80,140,60],-1).spacing).toEqual([135,195,115]);
});
it('kontakt ma tę samą współrzędną jak czujnik także przy ruchu w prawo',()=>{
  const g=bumperGeometry([100,120,100],1);
  expect(g.bumpers).toEqual([0,-45,-110,-155]);
  expect(g.table.map((x,i)=>x+g.bumpers[i])).toEqual([0,55,110,165]);
});
it('odrzuca niepełne, ujemne i nieliczbowe dane',()=>{
  for(const lengths of [[0,120,100],[-5,120,100],[NaN,1,2],[1,2],[Infinity,1,2]])expect(()=>bumperGeometry(lengths,-1)).toThrow(RangeError);
});
