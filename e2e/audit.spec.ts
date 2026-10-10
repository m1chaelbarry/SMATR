import {test,expect} from '@playwright/test';
import {openSim} from './helpers';
test('TTL: pełny cykl, powrotne czujniki, niedozwolone SR i reset',async({page})=>{
  await openSim(page,'ttl/cykl-ttl/');const sim=page.getByRole('region',{name:'Symulator pełnego cyklu TTL'});
  await sim.getByRole('button',{name:'Impuls START TTL',exact:true}).click();
  await expect(sim.locator('.signal-grid').last()).toContainText('L — lewo: 1');
  for(const sensor of [2,3,4,3,2])await sim.getByRole('button',{name:`Tylko ${sensor}ŁD`,exact:true}).click();
  await expect(sim.locator('.signal-grid').first()).toContainText('K4: 1');
  await sim.getByRole('button',{name:'Tylko 1ŁD',exact:true}).click();
  await expect(sim.locator('.signal-grid').last()).toContainText('P — prawo: 0');
  await sim.getByRole('button',{name:'Impuls START TTL',exact:true}).click();
  for(const sensor of [2,3])await sim.getByRole('button',{name:`Tylko ${sensor}ŁD`,exact:true}).click();
  await sim.getByLabel('1ŁD TTL',{exact:true}).check();await sim.getByLabel('4ŁD TTL',{exact:true}).check();
  await expect(sim.getByRole('alert')).toContainText('S=R=1');
  await expect(sim.getByLabel('START TTL',{exact:true})).toBeDisabled();
  await sim.getByRole('button',{name:'Wyzeruj TTL',exact:true}).click();await expect(sim.getByRole('alert')).toHaveCount(0);
});
test('LOGO: prawidłowa pamięć i przebiegi TON, TOF, załączenia z pamięcią',async({page})=>{
  await openSim(page,'logo/panel-logo/');const sim=page.getByRole('region',{name:'Prowadzony symulator LOGO'});
  await sim.getByRole('button',{name:'Pełny cykl',exact:true}).click();await expect(sim.locator('.badge')).toContainText('6/8/0');
  await sim.getByRole('button',{name:'Wczytaj prowadzony cykl'}).click();await sim.getByRole('button',{name:'RUN — Start w menu'}).click();
  await sim.getByRole('button',{name:'Funkcje i parametry'}).click();
  for(const kind of ['TON','TOF','RETAIN']){
    await sim.getByLabel('Funkcja specjalna').selectOption(kind);
    await sim.getByLabel('Trg',{exact:true}).check();
    if(kind!=='TON')await sim.getByLabel('Trg',{exact:true}).uncheck();
    await sim.getByRole('button',{name:'Krok SF 1 s',exact:true}).click();await sim.getByRole('button',{name:'Krok SF 1 s',exact:true}).click();
    await expect(sim.locator('.signal-grid')).toContainText(`SF Q: ${kind==='TOF'?0:1}`);
    await expect(sim.getByRole('img',{name:'Przebieg Trg, R i Q względem czasu'})).toBeVisible();
    await expect(sim.locator('path[data-signal="q"]')).toHaveAttribute('d',/V/);
  }
  await sim.getByLabel('R funkcji',{exact:true}).check();await expect(sim.locator('.signal-grid')).toContainText('SF Q: 0');
});
test('projekty działają bez skryptów, a druk ma unikalne ID',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:test.info().project.use.baseURL});const page=await context.newPage();
  await page.goto('trening/');await expect(page.locator('.project')).toHaveCount(3);
  const project=page.locator('#projekt-1');await expect(project.locator('.answer')).not.toBeVisible();
  await project.getByText('Sprawdź kompletny projekt',{exact:true}).click();await expect(project.locator('.answer')).toContainText('115, 145, 205');
  await page.goto('druk/');const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));expect(new Set(ids).size).toBe(ids.length);
  await expect(page.locator('.project .answer')).toHaveCount(3);for(const answer of await page.locator('.project .answer').all())await expect(answer).toBeVisible();
  await context.close();
});
test('telefon: nowe symulatory i projekty mieszczą się na ekranie',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const path of ['ttl/cykl-ttl/','logo/panel-logo/','trening/']){
    await page.goto(path);if(path.startsWith('ttl/'))await page.locator('.simulator').scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),path).toBe(true);
  }
});
