type Node={kind:'contact';device:string;nc:boolean}|{kind:'series'|'parallel';nodes:Node[]};
const no=(device:string):Node=>({kind:'contact',device,nc:false});
const nc=(device:string):Node=>({kind:'contact',device,nc:true});
const series=(...nodes:Node[]):Node=>({kind:'series',nodes});
const parallel=(...nodes:Node[]):Node=>({kind:'parallel',nodes});
const phaseBusy=()=>parallel(no('K1'),no('K2'),no('K3'),no('K4'));
export const relayRungs:Record<string,Node>={
  K1:series(nc('Z'),nc('K2'),parallel(no('K1'),series(no('START'),no('1ŁD'),nc('K1'),nc('K2'),nc('K3'),nc('K4'),nc('K5')))),
  K2:series(nc('Z'),nc('K3'),parallel(no('K2'),series(no('K1'),no('2ŁD')))),
  K3:series(nc('Z'),nc('K4'),parallel(no('K3'),series(no('K2'),no('3ŁD')))),
  K4:series(nc('Z'),nc('1ŁD'),parallel(no('K4'),series(no('K3'),no('4ŁD')))),
  K5:series(no('START'),parallel(no('K5'),phaseBusy(),no('Z'))),
  '1S':series(parallel(no('K1'),no('K2'),no('K3')),nc('K4'),nc('2S')),
  '2S':series(no('K4'),nc('1S')),
  '3S':series(parallel(no('K1'),no('K3')),nc('K2'),nc('K4'),nc('4S')),
  '4S':series(parallel(no('K2'),no('K4')),nc('3S')),
};
export type WireContact={device:string;label:string;kind:string;from:number;to:number;rung:string};
export const relayContacts:WireContact[]=[];
export const relayCoils:{device:string;from:number;to:number}[]=[];
let network=10;const contactCounts:Record<string,number>={};
const compile=(node:Node,from:number,to:number,rung:string)=>{
  if(node.kind==='contact'){
    contactCounts[node.device]=(contactCounts[node.device]??0)+1;
    relayContacts.push({device:node.device,label:`${node.device}.${contactCounts[node.device]}`,kind:node.nc?'NC':'NO',from,to,rung});
  }else if(node.kind==='parallel')node.nodes.forEach(n=>compile(n,from,to,rung));
  else{let previous=from;node.nodes.forEach((n,i)=>{const next=i===node.nodes.length-1?to:network++;compile(n,previous,next,rung);previous=next;});}
};
for(const [device,node] of Object.entries(relayRungs)){
  const end=network++;compile(node,device.startsWith('K')?1:2,end,device);relayCoils.push({device,from:end,to:0});
}
export const relayInventory=Object.keys(contactCounts).map(device=>({device,NO:relayContacts.filter(c=>c.device===device&&c.kind==='NO').length,NC:relayContacts.filter(c=>c.device===device&&c.kind==='NC').length}));
