import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function createPost(
  title,
  { directory, mdx = false, date = new Date() } = {},
) {
  if (!title?.trim())
    throw new Error('Provide a title: npm run new:post -- "My project notes"');
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
    .replace(/-$/, '');
  if (!slug)
    throw new Error(
      'Use a title with at least one Latin letter or number for the URL.',
    );
  const postsDirectory =
    directory ??
    resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/posts');
  const path = resolve(postsDirectory, `${slug}.${mdx ? 'mdx' : 'md'}`);
  const alternatePath = resolve(
    postsDirectory,
    `${slug}.${mdx ? 'md' : 'mdx'}`,
  );
  const alternateExists = await access(alternatePath).then(
    () => true,
    (error) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    },
  );
  if (alternateExists)
    throw Object.assign(new Error('A post with this URL already exists.'), {
      code: 'EEXIST',
    });
  const content = `---\ntitle: ${JSON.stringify(title.trim())}\ndescription: "A short summary for readers and search engines."\ndate: ${date.toISOString().slice(0, 10)}\ntags: []\ndraft: true\nfeatured: false\nart: terminal\n---\n\nStart with the interesting bit.\n\n## What I built\n\n\n## What I learned\n\n`;
  await mkdir(postsDirectory, { recursive: true });
  await writeFile(path, content, { flag: 'wx' });
  return path;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const mdx = args.includes('--mdx');
  try {
    const path = await createPost(
      args.filter((arg) => arg !== '--mdx').join(' '),
      { mdx },
    );
    console.log(
      `Created draft: ${path}\nSet draft: false when you are ready to publish.`,
    );
  } catch (error) {
    console.error(
      error.code === 'EEXIST'
        ? 'A post with this URL already exists. Choose another title.'
        : error.message,
    );
    process.exitCode = 1;
  }
}
