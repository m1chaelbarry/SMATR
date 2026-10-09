import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';

const repo = process.env.GITHUB_REPOSITORY?.split('/');
const base = process.env.SITE_BASE ?? (repo && repo[1] !== `${repo[0]}.github.io` ? `/${repo[1]}` : '/');
export default defineConfig({
  output: 'static', trailingSlash: 'always',
  site: process.env.SITE_URL ?? (repo ? `https://${repo[0]}.github.io` : 'http://localhost:4321'),
  base,
  integrations: [react(), mdx()],
  vite: {cacheDir:process.argv.includes('dev')?'.cache/vite-dev':'.cache/vite-build'},
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
});
