import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,relative,extname} from 'node:path';
const root=resolve('dist');
const repository=process.env.GITHUB_REPOSITORY??'';
const [owner,repo]=repository.split('/');
const base=(process.env.SITE_BASE??(repo&&repo!==`${owner}.github.io`?`/${repo}`:'/')).replace(/\/$/,'')+'/';
const origin='https://build-check.invalid';
async function files(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const file=resolve(dir,entry.name);if(entry.isDirectory())result.push(...await files(file));else result.push(file);}return result;}
const all=await files(root),pages=all.filter(file=>extname(file)==='.html'),cache=new Map(),errors=[];
let references=0;
function decode(value){return value.replaceAll('&amp;','&').replaceAll('&quot;','"');}
async function html(file){if(!cache.has(file))cache.set(file,await readFile(file,'utf8'));return cache.get(file);}
async function verify(raw,from,isCSS=false){
  if(!raw||/^(data:|mailto:|tel:|javascript:)/i.test(raw))return;
  const path=relative(root,from).replaceAll('\\','/');
  const url=new URL(decode(raw),`${origin}${base}${path.endsWith('index.html')?path.slice(0,-10):path}`);
  if(url.origin!==origin)return;
  references++;
  if(!url.pathname.startsWith(base)){errors.push(`${path}: ścieżka poza bazą ${raw}`);return;}
  let target=resolve(root,decodeURIComponent(url.pathname.slice(base.length))||'index.html');
  if(relative(root,target).startsWith('..')){errors.push(`${path}: zasób poza dist ${raw}`);return;}
  try{const info=await stat(target);if(info.isDirectory())target=resolve(target,'index.html');await stat(target);}catch{errors.push(`${path}: brak zasobu ${raw}`);return;}
  if(url.hash&&!isCSS&&extname(target)==='.html'){
    const ids=[...(await html(target)).matchAll(/\bid=["']([^"']+)["']/g)].map(m=>decode(m[1]));
    if(!ids.includes(decodeURIComponent(url.hash.slice(1))))errors.push(`${path}: brak kotwicy ${raw}`);
  }
}
for(const file of pages){
  const ids=[...(await html(file)).matchAll(/\sid=["']([^"']+)["']/g)].map(m=>decode(m[1]));
  if(new Set(ids).size!==ids.length)errors.push(`${relative(root,file)}: powtórzone identyfikatory HTML/SVG`);
  for(const match of (await html(file)).matchAll(/\b(?:href|src)=["']([^"']+)["']/g))await verify(match[1],file);}
for(const file of all.filter(file=>extname(file)==='.css')){const css=await readFile(file,'utf8');for(const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))await verify(match[1],file,true);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Budowa: ${pages.length} stron HTML, ${references} lokalnych odnośników/zasobów i kotwic — OK, baza ${base}.`);
