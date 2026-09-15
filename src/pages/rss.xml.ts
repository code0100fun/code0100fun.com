import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedPosts } from '../lib/posts';
export async function GET(context: APIContext) {
  return rss({
    title: 'code0100fun — Notes from the workbench',
    description:
      'Elixir, Zig, Rust, C, and everything between software and silicon.',
    site: context.site!,
    items: (await publishedPosts()).map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/writing/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
