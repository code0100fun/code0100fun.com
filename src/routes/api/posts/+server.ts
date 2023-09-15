import { getPosts } from '$lib/posts'
import { json } from '@sveltejs/kit'

export async function GET() {
  const posts = await getPosts()
  return json(posts)
}