import test from 'node:test';
import assert from 'node:assert/strict';
import { stepLife } from '../src/lib/life.mjs';

function grid(width, height, points) {
  const cells = new Uint8Array(width * height);
  for (const [x, y] of points) cells[y * width + x] = 1;
  return cells;
}

test('a still-life block stays stable and the previous generation is not mutated', () => {
  const cells = grid(6, 6, [
    [2, 2],
    [3, 2],
    [2, 3],
    [3, 3],
  ]);
  const original = cells.slice();
  const next = stepLife(cells, 6, 6);
  assert.deepEqual(next, original);
  assert.deepEqual(cells, original);
  assert.notEqual(next, cells);
});

test('a blinker oscillates over two generations', () => {
  const horizontal = grid(5, 5, [
    [1, 2],
    [2, 2],
    [3, 2],
  ]);
  const vertical = grid(5, 5, [
    [2, 1],
    [2, 2],
    [2, 3],
  ]);
  assert.deepEqual(stepLife(horizontal, 5, 5), vertical);
  assert.deepEqual(stepLife(vertical, 5, 5), horizontal);
});

test('neighbors wrap across world edges', () => {
  const cells = grid(5, 5, [
    [4, 2],
    [0, 2],
    [1, 2],
  ]);
  assert.deepEqual(
    stepLife(cells, 5, 5),
    grid(5, 5, [
      [0, 1],
      [0, 2],
      [0, 3],
    ]),
  );
});

test('isolated cells die and an empty world stays empty', () => {
  assert.deepEqual(stepLife(grid(5, 5, [[2, 2]]), 5, 5), new Uint8Array(25));
  assert.deepEqual(stepLife(new Uint8Array(25), 5, 5), new Uint8Array(25));
});
