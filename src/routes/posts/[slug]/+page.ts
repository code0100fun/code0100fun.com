import { getPostBySlug } from '$lib/posts.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  try {
    const post = await getPostBySlug(params.slug)
    if (post) {
      return { post }
    } else {
      throw new Error()
    }
  } catch (e) {
    throw error(404, `Could not find post ${params.slug}`)
  }
}

export const ssr = true;
export const csr = true;