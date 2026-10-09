import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({ title: z.string(), part: z.enum(['podstawa','przekazniki','ttl','logo']), order: z.number(), goal: z.string(), sources: z.array(z.string()), tasks: z.array(z.string()), simulator: z.string().optional() }),
});
export const collections = { lessons };
