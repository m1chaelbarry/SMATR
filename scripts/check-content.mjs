import {readFile,readdir} from 'node:fs/promises';
import {tasks} from '../src/data/tasks.ts';
import {requirements,corrections} from '../src/data/reference.ts';
const files=(await readdir('src/content/lessons')).filter(f=>f.endsWith('.mdx'));
const errors=[]; const assigned=[]; const order=[]; const groups={};
for(const file of files){
  const text=await readFile(`src/content/lessons/${file}`,'utf8');
  const front=text.split('---')[1]??'';
  const part=front.match(/^part: (.+)$/m)?.[1]; groups[part]=(groups[part]??0)+1;
  order.push(Number(front.match(/^order: (\d+)/m)?.[1]));
  for(const field of ['title:','goal:','sources:','tasks:'])if(!front.includes(field))errors.push(`${file}: brak ${field}`);
  assigned.push(...(front.match(/^tasks: \[(.*?)\]/m)?.[1]??'').split(',').map(t=>t.trim()));
  if(!/typowy błąd/i.test(text))errors.push(`${file}: brak typowego błędu`);
}
if(files.length!==16)errors.push('Liczba lekcji musi wynosić 16');
if(tasks.length!==32||new Set(tasks.map(t=>t.id)).size!==32)errors.push('Wymagane 32 unikalne zadania');
for(const t of tasks){if(!t.question||!t.hint||!t.answer)errors.push(`Niekompletne ${t.id}`);if(assigned.filter(id=>id===t.id).length!==1)errors.push(`${t.id}: przypisanie do lekcji musi być jedno`);}
for(const p of ['podstawa','przekazniki','ttl','logo'])if(groups[p]!==4)errors.push(`${p}: cztery lekcje`);
if(new Set(order).size!==16||order.some(n=>n<1||n>16))errors.push('Niepoprawna kolejność');
for(const r of requirements)if(r[3].includes('/')&&!files.includes(`${r[3].split('/')[1]}.mdx`))errors.push(`Brak lekcji ${r[3]}`);
if(corrections.some(c=>Object.values(c).some(v=>!v)))errors.push('Niekompletny rejestr korekt');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Treść: ${files.length} lekcji, ${tasks.length} pełnych zadań, ${requirements.length} grup wymagań, ${corrections.length} korekt — kontrola struktury OK.`);
