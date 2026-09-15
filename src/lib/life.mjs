export function stepLife(cells, width, height) {
  const next = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          neighbors +=
            cells[
              ((y + dy + height) % height) * width + ((x + dx + width) % width)
            ];
        }
      }
      const index = y * width + x;
      next[index] =
        neighbors === 3 || (cells[index] === 1 && neighbors === 2) ? 1 : 0;
    }
  }
  return next;
}
