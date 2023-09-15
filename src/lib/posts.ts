import type { Post, PostsResults } from '$lib/types.js'

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts()
  return posts.find((post) => post.slug === slug)
}

export async function getPosts(): Promise<Post[]> {
  const paths: PostsResults = import.meta.glob('/src/posts/*.md', { eager: true })
  return Object.entries(paths).map(([path, file]) => {
    const slug = path.split('/').at(-1)?.replace('.md', '')
    if (!slug) {
      throw new Error('Failed to parse post slug')
    }
    return { slug, content: file.default, ...file.metadata } satisfies Post
  }).sort(function (a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}