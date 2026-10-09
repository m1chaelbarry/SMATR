export type Gate = {name: string; inputs: string[]};
export const ttlGates: Gate[] = [
  ['nZ','STOP','STOP'],['nStart','START','START'],['nLD1','1ŁD','1ŁD'],
  ['B','¬K1','¬K2','¬K3','¬K4'],['nB','B','B'],['BZ','nB','nZ'],
  ['nA','START','1ŁD','nB','nZ'],['A','nA','nA'],['nS1','A','¬K5'],['S1','nS1','nS1'],
  ['nS2','K1','2ŁD','nZ'],['S2','nS2','nS2'],['nS3','K2','3ŁD','nZ'],['S3','nS3','nS3'],
  ['nS4','K3','4ŁD','nZ'],['S4','nS4','nS4'],['R1','nZ','¬K2'],['R2','nZ','¬K3'],
  ['R3','nZ','¬K4'],['R4','nZ','nLD1'],['nS5','START','BZ'],['S5','nS5','nS5'],
  ['Lraw','¬K1','¬K2','¬K3'],['nL','Lraw','¬K4'],['L','nL','nL'],['F','¬K2','¬K4'],
  ['nF','F','F'],['Wraw','¬K1','¬K3'],['nW','Wraw','nF'],['W','nW','nW'],
].map(([name,...inputs])=>({name,inputs}));

const pinMaps: Record<number,{type:string;first:number;slots:number[][]}> = {
  2:{type:'UCY7400',first:1,slots:[[1,2,3],[4,5,6],[9,10,8],[12,13,11]]},
  3:{type:'UCY7410',first:7,slots:[[1,2,13,12],[3,4,5,6],[9,10,11,8]]},
  4:{type:'UCY7420',first:9,slots:[[1,2,4,5,6],[9,10,12,13,8]]},
};
const used: Record<number,number> = {2:0,3:0,4:0};
export const ttlWiring = ttlGates.map(g=>{
  const map=pinMaps[g.inputs.length]; const index=used[g.inputs.length]++;
  const pins=map.slots[index%map.slots.length];
  return {...g,chip:`U${map.first+Math.floor(index/map.slots.length)}`,type:map.type,
    pins:pins.slice(0,-1),output:pins.at(-1)!};
});
export const latchWiring = Array.from({length:5},(_,i)=>({name:`K${i+1}`,chip:`U${10+Math.floor(i/2)}`,
  s:i%2?12:6,r:i%2?8:2,q:i%2?10:1,nq:i%2?13:4,
  set:`S${i+1}`,reset:i===4?'nStart':`R${i+1}`}));

export type LogoBlock = {id:string;type:'AND'|'OR'|'NOR'|'NOT'|'RS'|'COUNTER';inputs:string[];par?:number;purpose:string};
export const logoBlocks: LogoBlock[] = [
  {id:'B01',type:'OR',inputs:['I4','I5','I6'],purpose:'Granica odcinka'},
  {id:'B02',type:'NOT',inputs:['B08'],purpose:'Jeszcze nie powrót'},
  {id:'B03',type:'AND',inputs:['B29','B01','B30'],purpose:'Impuls licznika podczas ruchu w lewo'},
  {id:'B04',type:'NOR',inputs:['Q1','Q2','lo'],purpose:'Brak ruchu bez dodatkowej gałęzi B29'},
  {id:'B05',type:'OR',inputs:['I2','B04','lo'],purpose:'Zerowanie liczników'},
  {id:'B06',type:'COUNTER',inputs:['B05','B03','lo'],par:1,purpose:'Przejechano pierwszą granicę'},
  {id:'B07',type:'COUNTER',inputs:['B05','B03','lo'],par:2,purpose:'Przejechano drugą granicę'},
  {id:'B08',type:'COUNTER',inputs:['B05','B03','lo'],par:3,purpose:'Przejechano trzecią granicę'},
  {id:'B09',type:'AND',inputs:['Q2','I3','hi'],purpose:'Powrót do początku'},
  {id:'B10',type:'OR',inputs:['I2','B09','lo'],purpose:'Zerowanie RUN'},
  {id:'B12',type:'NOR',inputs:['B19','I2','lo'],purpose:'Zwolniona blokada START i STOP=0'},
  {id:'B13',type:'AND',inputs:['I1','I3','B12'],purpose:'START w pozycji początkowej'},
  {id:'B15',type:'RS',inputs:['B13','B10'],purpose:'Pamięć RUN (S,R)'},
  {id:'B16',type:'OR',inputs:['Q1','Q2','I2'],purpose:'Ruch lub STOP bez dodatkowej gałęzi B29'},
  {id:'B17',type:'AND',inputs:['I1','B16','hi'],purpose:'Wpisanie LOCK'},
  {id:'B18',type:'NOT',inputs:['I1'],purpose:'Zwolnienie START'},
  {id:'B19',type:'RS',inputs:['B17','B18'],purpose:'Pamięć LOCK (S,R)'},
  {id:'B20',type:'AND',inputs:['B15','B02','hi'],purpose:'Q1: lewo'},
  {id:'B21',type:'AND',inputs:['B15','B08','hi'],purpose:'Q2: prawo'},
  {id:'B22',type:'NOT',inputs:['B06'],purpose:'Przed pierwszą granicą'},
  {id:'B23',type:'OR',inputs:['B22','B07','lo'],purpose:'Odcinek roboczy'},
  {id:'B24',type:'AND',inputs:['B15','B23','B02'],purpose:'Q3: sprzęgło robocze'},
  {id:'B25',type:'NOT',inputs:['B07'],purpose:'Przed drugą granicą'},
  {id:'B26',type:'AND',inputs:['B06','B25','hi'],purpose:'Szybki odcinek w lewo'},
  {id:'B27',type:'OR',inputs:['B26','B08','lo'],purpose:'Odcinek szybki'},
  {id:'B28',type:'AND',inputs:['B15','B27','hi'],purpose:'Q4: sprzęgło szybkie'},
  {id:'B29',type:'OR',inputs:['Q1','Q2','lo'],purpose:'Ruch z zacisków Q'},
  {id:'B30',type:'NOT',inputs:['Q2'],purpose:'Zliczanie wyłączone przy powrocie'},
];
export const logoOutputs: Record<string,string> = {Q1:'B20',Q2:'B21',Q3:'B24',Q4:'B28'};
