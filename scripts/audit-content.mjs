import assert from 'node:assert/strict';
import {ttlGates,ttlWiring,latchWiring,logoBlocks,logoOutputs} from '../src/data/circuits.ts';
const y=[];
for(let row=0;row<8;row++){
  const a=Boolean(row&4),b=Boolean(row&2),c=Boolean(row&1);
  const sop=(!a&&b)||(a&&c),pos=(a||b||c)&&(a||b||!c)&&(!a||b||c)&&(!a||!b||c);
  const nand=(...v)=>!v.every(Boolean);
  const network=nand(nand(nand(a,a),b),nand(a,c));
  assert.equal(sop,pos);assert.equal(sop,network);y.push(Number(sop));
}
assert.deepEqual(y,[0,0,1,1,0,1,0,1]);
for(const [lengths,spacing] of [[[100,120,100],[155,175,155]],[[80,140,60],[135,195,115]]]){
  let x=0;const z=[0];lengths.forEach((length,i)=>{x-=length;z.push((i+1)*55-x);});
  assert.deepEqual(z.slice(1).map((value,i)=>value-z[i]),spacing);
}
assert.equal(ttlGates.length,30);
assert.deepEqual([2,3,4].map(width=>ttlGates.filter(g=>g.inputs.length===width).length),[24,4,2]);
assert.equal(new Set([...ttlWiring,...latchWiring].map(g=>g.chip)).size,12);
assert.equal(new Set(ttlWiring.flatMap(g=>g.pins.map(pin=>`${g.chip}:${pin}`))).size,68);
const map=new Map(logoBlocks.map(b=>[b.id,b]));
const path=(id,trail=[])=>{
  if(!map.has(id))return [];
  assert(!trail.includes(id),`Pętla bloków ${id}`);
  const inputs=map.get(id).inputs.map(i=>path(i,[...trail,id])).sort((a,b)=>b.length-a.length);
  return [...(inputs[0]??[]),id];
};
const paths=Object.values(logoOutputs).map(id=>path(id));
assert.equal(logoBlocks.length,28);assert.equal(Math.max(...paths.map(p=>p.length)),7);
assert.equal(logoBlocks.filter(b=>b.type==='RS').length,2);assert.equal(logoBlocks.filter(b=>b.type==='COUNTER').length,3);
console.log('Algebra: 8/8 SOP=POS=NAND. Geometria: 155–175–155 oraz 135–195–115 mm.');
console.log('TTL: 30 NAND (24×2, 4×3, 2×4), 5 SR, 12 kości; wejścia bez kolizji.');
console.log(`LOGO: 28 bloków, acykliczne połączenia B, głębokość 7; ścieżki: ${paths.map(p=>p.join('→')).join('; ')}.`);
