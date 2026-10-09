import {expect,type Page} from '@playwright/test';
export async function openSim(page:Page,path:string){
  await page.goto(path);await page.locator('.simulator').scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island').first()).not.toHaveAttribute('ssr','');
}
