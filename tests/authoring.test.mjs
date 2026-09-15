import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createPost } from '../scripts/new-post.mjs';

test('new posts are drafts, safely named, and never overwrite existing work', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'code0100fun-authoring-'));
  try {
    const path = await createPost('../A "tiny" experiment', {
      directory,
      date: new Date('2026-09-15'),
    });
    assert.equal(dirname(path), directory);
    assert.ok(path.endsWith('a-tiny-experiment.md'));
    const content = await readFile(path, 'utf8');
    assert.match(content, /draft: true/);
    assert.match(content, /date: 2026-09-15/);
    assert.match(content, /title: "\.\.\/A \\"tiny\\" experiment"/);
    await assert.rejects(createPost('../A "tiny" experiment', { directory }), {
      code: 'EEXIST',
    });
    await assert.rejects(
      createPost('../A "tiny" experiment', { directory, mdx: true }),
      { code: 'EEXIST' },
    );
    assert.equal(await readFile(path, 'utf8'), content);
    const mdx = await createPost('An interactive widget', {
      directory,
      mdx: true,
    });
    assert.ok(mdx.endsWith('.mdx'));
    await assert.rejects(createPost('!!!', { directory }), /Latin letter/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
