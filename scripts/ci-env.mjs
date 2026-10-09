import {appendFileSync} from 'node:fs';
const [owner,repo]=(process.env.GITHUB_REPOSITORY??'').split('/');
if(!owner||!repo||!process.env.GITHUB_ENV)throw new Error('Brak kontekstu GitHub Actions');
const base=repo.toLowerCase()===`${owner}.github.io`.toLowerCase()?'/':`/${repo}/`;
appendFileSync(process.env.GITHUB_ENV,`SITE_BASE=${base}\nSITE_URL=https://${owner}.github.io\nE2E_URL=http://127.0.0.1:4322${base}\n`);
