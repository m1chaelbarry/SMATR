export type NorState={q:boolean|null;nq:boolean|null;invalid:boolean};
export function norMemory(previous:NorState,s:boolean,r:boolean):NorState{
  if(s&&r)return {q:false,nq:false,invalid:true};
  if(r)return {q:false,nq:true,invalid:false};
  if(s)return {q:true,nq:false,invalid:false};
  return previous.invalid?{q:null,nq:null,invalid:false}:{...previous};
}
export function logoRS(q:boolean,s:boolean,r:boolean):boolean{return r?false:s?true:q;}
