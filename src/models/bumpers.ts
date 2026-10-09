export function bumperGeometry(lengths:number[],direction:-1|1):{table:number[];bumpers:number[];spacing:number[]}{
  if(lengths.length!==3||lengths.some(n=>!Number.isFinite(n)||n<=0)||(direction!==-1&&direction!==1))throw new RangeError('Podaj trzy dodatnie, skończone odcinki.');
  const table=[0];lengths.forEach(n=>table.push(table.at(-1)!+direction*n));
  const bumpers=table.map((x,i)=>i*55-x);
  return {table,bumpers,spacing:bumpers.slice(1).map((z,i)=>z-bumpers[i])};
}
