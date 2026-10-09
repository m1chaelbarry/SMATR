import {test,expect} from '@playwright/test';
import {openSim} from './helpers';
test('Stanowisko: krokami do końca i dziennik powrotu',async({page})=>{
  await openSim(page,'podstawa/cykl/');const sim=page.getByRole('region',{name:'Symulator stanowiska'});
  await sim.getByRole('button',{name:'Impuls START',exact:true}).click();
  await expect(sim.locator('.explain')).toContainText('F1:');
  for(let i=0;i<6;i++)await sim.getByRole('button',{name:'Następna granica'}).click();
  await expect(sim.locator('.explain')).toContainText('Postój');
  await expect(sim.getByRole('list',{name:'Dziennik przejść'})).toContainText('3ŁD, powrót');
  await expect(sim.getByRole('list',{name:'Dziennik przejść'})).toContainText('2ŁD, powrót');
});
test('Zderzaki: zestaw treningowy i walidacja',async({page})=>{
  await openSim(page,'podstawa/zderzaki/');const sim=page.getByRole('region',{name:'Kalkulator zderzaków'});
  await expect(sim.locator('.explain')).toContainText('155 · 175 · 155');
  await sim.getByRole('button',{name:'80–140–60',exact:true}).click();await expect(sim.locator('.explain')).toContainText('135 · 195 · 115');
  await sim.getByLabel('Odcinek 1 [mm]',{exact:true}).fill('0');await expect(sim.getByRole('alert')).toContainText('trzy dodatnie');
});
test('Przekaźnik: START podtrzymuje, STOP przerywa drogę',async({page})=>{
  await openSim(page,'przekazniki/styki/');const sim=page.getByRole('region',{name:'Symulator przekaźników'});
  await sim.getByLabel('START',{exact:true}).check();await sim.getByLabel('START',{exact:true}).uncheck();await expect(sim.locator('.explain')).toContainText('podtrzymuje');
  await expect(sim.locator('path[data-branch="start"]')).toHaveAttribute('stroke','#91a0b9');
  await expect(sim.locator('path[data-branch="hold"]')).toHaveAttribute('stroke','#047857');
  await expect(sim.locator('g[data-contact="NO START"] path[data-bridge]')).toHaveCount(0);
  await sim.getByLabel('STOP',{exact:true}).check();await expect(sim.locator('.explain')).toContainText('cewka zwalnia');
  await sim.getByLabel('Gotowy układ').selectOption('cycle');await sim.getByRole('button',{name:'Impuls START',exact:true}).click();
  await sim.getByRole('button',{name:'2ŁD',exact:true}).click();await expect(sim.locator('.signal-grid')).toContainText('K2: 1');
});
test('NAND: aktywny wiersz i wyniki kolejnych bramek',async({page})=>{
  await openSim(page,'ttl/nand/');const sim=page.getByRole('region',{name:'Symulator bramek'});
  await sim.getByLabel('a',{exact:true}).check();await sim.getByLabel('c',{exact:true}).check();
  await expect(sim.locator('tr.active-row')).toHaveText('51011');await expect(sim.locator('.signal-grid')).toContainText('y: 1');
  await sim.getByLabel('Gotowy przykład').selectOption('NOR');await expect(sim.locator('.explain')).toContainText('y=0');
});
test('Pamięć: kombinacja zabroniona i nieznany stan po zwolnieniu',async({page})=>{
  await openSim(page,'ttl/sr/');const sim=page.getByRole('region',{name:'Porównanie pamięci SR i RS'});
  await sim.getByRole('button',{name:'S=R=1',exact:true}).click();await expect(sim.locator('.explain')).toContainText('stan niedozwolony');
  await sim.getByRole('button',{name:'S=R=0',exact:true}).click();await expect(sim.locator('.signal-grid')).toContainText('NOR Q: ?');
  await sim.getByRole('button',{name:'Wpisz 10',exact:true}).click();await expect(sim.locator('.signal-grid')).toContainText('NOR Q: 1');
});
test('LOGO: panel naprawia ?, wykonuje cykl i STOP otwiera wyjścia',async({page})=>{
  await openSim(page,'logo/panel-logo/');const sim=page.getByRole('region',{name:'Prowadzony symulator LOGO'});
  for(let i=0;i<7;i++)await sim.getByRole('button',{name:'OK — kolejny krok'}).click();
  await sim.getByRole('button',{name:'RUN — Start w menu'}).click();await expect(sim.locator('.explain')).toContainText('RUN zablokowany');
  await sim.getByRole('button',{name:'Napraw ?: Co → lo'}).click();await sim.getByRole('button',{name:'OK — kolejny krok'}).click();
  await sim.getByRole('button',{name:'Pełny cykl',exact:true}).click();await sim.getByRole('button',{name:'Wczytaj prowadzony cykl'}).click();await sim.getByRole('button',{name:'RUN — Start w menu'}).click();
  await sim.getByRole('button',{name:'Impuls START maszyny'}).click();await expect(sim.locator('.signal-grid')).toContainText('Q1: 1');
  for(const sensor of [2,3,4,3,2,1])await sim.getByRole('button',{name:`Impuls ${sensor}ŁD`,exact:true}).click();await expect(sim.locator('.signal-grid')).toContainText('RUN: 0');
  await sim.getByRole('button',{name:'STOP sterownika'}).click();await expect(sim.locator('.signal-grid')).toContainText('Q1: 0');
});
