import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
export default defineConfig({testDir:'./e2e',workers:1,fullyParallel:false,timeout:30000,
  use:{baseURL:process.env.E2E_URL??'http://127.0.0.1:4321/',headless:true,viewport:{width:1440,height:1000},
    launchOptions:{executablePath:process.env.PW_EXE??(process.platform==='win32'&&existsSync(edge)?edge:undefined)},trace:'retain-on-failure'},
  reporter:[['list'],['html',{open:'never'}]],
  webServer:process.env.CI?{command:'pnpm preview --port 4322',url:process.env.E2E_URL??'http://127.0.0.1:4322/',timeout:60000,reuseExistingServer:false}:undefined,
});
