import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dist = resolve('dist');
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(join(directory, entry.name))
          : join(directory, entry.name),
      ),
    )
  ).flat();
}

test('every built internal page, script, stylesheet, and image link resolves', async () => {
  const pages = (await files(dist)).filter((path) => path.endsWith('.html'));
  assert.ok(pages.length >= 4);
  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    for (const match of html.matchAll(
      /(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g,
    )) {
      const pathname = decodeURIComponent(match[1]);
      if (pathname.startsWith('//')) continue;
      const file = join(
        dist,
        pathname,
        pathname.endsWith('/') ? 'index.html' : '',
      );
      await assert.doesNotReject(
        access(file),
        `${page} contains broken link ${pathname}`,
      );
    }
  }
});

test('article content, canonical metadata, RSS, and sitemap are emitted', async () => {
  const article = await readFile(
    join(dist, 'writing/tiny-universe/index.html'),
    'utf8',
  );
  assert.match(article, /Three rules, one world/);
  assert.match(article, /<life-playground/);
  assert.match(article, /class="astro-code/);
  assert.match(article, /https:\/\/code0100fun\.com\/writing\/tiny-universe\//);
  assert.match(article, /BlogPosting/);
  const rss = await readFile(join(dist, 'rss.xml'), 'utf8');
  assert.match(rss, /<rss/);
  assert.match(rss, /writing\/tiny-universe/);
  const sitemap = await readFile(join(dist, 'sitemap-0.xml'), 'utf8');
  assert.match(sitemap, /https:\/\/code0100fun\.com\/projects\//);
});
