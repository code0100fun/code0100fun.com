import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
    featured: z.boolean().default(false),
    art: z
      .enum(['cells', 'memory', 'beam', 'bits', 'terminal'])
      .default('terminal'),
  }),
});

export const collections = { posts };
