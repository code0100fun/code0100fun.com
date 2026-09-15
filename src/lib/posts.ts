import { getCollection, type CollectionEntry } from 'astro:content';

export async function publishedPosts() {
  return (
    await getCollection(
      'posts',
      ({ data }) => !data.draft && data.date <= new Date(),
    )
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export function readingTime(post: CollectionEntry<'posts'>) {
  return Math.max(1, Math.ceil((post.body ?? '').split(/\s+/).length / 200));
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
