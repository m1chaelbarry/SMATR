import {it,expect} from 'vitest';
import {cycleProjects} from '../src/data/projects';
import {bumperGeometry} from '../src/models/bumpers';
it('trzy projekty mają inne długości i inne układy prędkości',()=>{
  expect(cycleProjects.length).toBe(3);
  expect(cycleProjects.map(p=>bumperGeometry(p.lengths,-1).spacing)).toEqual([[115,145,205],[175,135,215],[205,125,165]]);
  expect(new Set(cycleProjects.map(p=>p.speeds.join('/'))).size).toBe(3);
});
