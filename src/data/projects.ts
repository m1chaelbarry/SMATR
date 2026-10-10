export type CycleProject={id:string;title:string;lengths:number[];speeds:('W'|'F')[]};
// Własne zadania projektowe, nie dodatkowe warianty z instrukcji producenta.
export const cycleProjects:CycleProject[]=[
  {id:'projekt-1',title:'Dwa odcinki robocze, potem szybki',lengths:[60,90,150],speeds:['W','W','F','F']},
  {id:'projekt-2',title:'Szybki wyjazd i roboczy powrót',lengths:[120,80,160],speeds:['F','W','F','W']},
  {id:'projekt-3',title:'Jeden odcinek roboczy, dwa szybkie',lengths:[150,70,110],speeds:['W','F','F','F']},
];
