import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {openSim} from './helpers';
test('nawigacja i wszystkie odnośniki lokalne mają bazę oraz istnieją',async({page,request,baseURL})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('');
  await expect(page.getByRole('heading',{level:1})).toContainText('Zrozum cykl.');
  const urls=await page.locator('a[href]').evaluateAll(nodes=>[...new Set(nodes.map(n=>(n as HTMLAnchorElement).href))]);
  const base=new URL(baseURL!);const internal=urls.filter(link=>new URL(link).origin===base.origin&&!link.includes('#'));
  for(const link of internal){expect(new URL(link).pathname.startsWith(base.pathname)).toBe(true);expect((await request.get(link)).status(),link).toBe(200);}
  await page.getByRole('link',{name:'Trening',exact:true}).click();await expect(page.locator('.exercise')).toHaveCount(35);
  await page.locator('.exercise').first().getByText('Rozwiązanie i uzasadnienie', {exact:true}).click();await expect(page.locator('.exercise').first().locator('.answer')).toBeVisible();expect(errors).toEqual([]);
});
test('telefon, powiększenie schematu i klawiatura',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('podstawa/stanowisko/');
  await expect(page.locator('.toc')).not.toHaveAttribute('open','');await page.locator('.toc>summary').click();await expect(page.locator('.toc')).toHaveAttribute('open','');
  await page.getByRole('button',{name:'Powiększ schemat 1',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await mkdir('.cache/qa',{recursive:true});await page.screenshot({path:'.cache/qa/mobile-lesson.png'});
  await page.goto('');await page.keyboard.press('Tab');await expect(page.locator('.skip')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
});
test('ograniczenie ruchu pozostawia działające pojedyncze kroki',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await openSim(page,'podstawa/cykl/');
  await page.getByRole('button',{name:'Impuls START',exact:true}).click();await expect(page.getByRole('button',{name:'Odtwarzaj',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Następna granica'}).click();await expect(page.locator('.simulator .explain')).toContainText('F2:');
  await mkdir('.cache/qa',{recursive:true});await page.locator('.simulator').screenshot({path:'.cache/qa/cycle-desktop.png'});
});
test('treść działa bez JavaScript; wydruk otwiera wszystkie rozwiązania',async({browser,page})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL:test.info().project.use.baseURL});const staticPage=await context.newPage();await staticPage.goto('ttl/algebra/');
  await expect(staticPage.locator('h1')).toContainText('algebra');await expect(staticPage.locator('.katex')).not.toHaveCount(0);await staticPage.locator('.exercise').first().getByText('Rozwiązanie i uzasadnienie',{exact:true}).click();await expect(staticPage.locator('.answer').first()).toBeVisible();
  await staticPage.goto('druk/');await staticPage.emulateMedia({media:'print'});
  await expect(staticPage.locator('.answer')).toHaveCount(35);
  for(const answer of await staticPage.locator('.answer').all())await expect(answer).toBeVisible();
  for(const hint of await staticPage.locator('.exercise details>p').all())await expect(hint).toBeVisible();
  await context.close();
  await page.goto('druk/');await expect(page.locator('.print-lesson')).toHaveCount(16);await expect(page.locator('.exercise')).toHaveCount(35);
  await page.emulateMedia({media:'print'});await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));await expect(page.locator('.answer').last()).toBeVisible();await expect(page.locator('.topbar')).not.toBeVisible();
  await mkdir('.cache/qa',{recursive:true});await page.pdf({path:'.cache/qa/print-check.pdf',format:'A4',printBackground:true});
});
test('pulpit: podgląd i brak błędów zasobów',async({page})=>{
  const bad:string[]=[];page.on('response',response=>{if(response.status()>=400&&new URL(response.url()).hostname==='127.0.0.1')bad.push(`${response.status()} ${response.url()}`);});page.on('pageerror',e=>bad.push(e.message));
  await page.goto('');await mkdir('.cache/qa',{recursive:true});await page.screenshot({path:'.cache/qa/home-desktop.png',fullPage:true});await openSim(page,'logo/panel-logo/');await page.locator('.simulator').screenshot({path:'.cache/qa/logo-desktop.png'});expect(bad).toEqual([]);
});
