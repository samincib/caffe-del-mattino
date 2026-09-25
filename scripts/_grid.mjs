import sharp from 'sharp';
const out = process.argv[2];
const files = process.argv.slice(3);
const CW = 340, COLS = files.length <= 3 ? files.length : 4;
const tiles = [];
let maxH = 0;
for (const f of files) {
  const buf = await sharp(f).resize({ width: CW }).toBuffer();
  const m = await sharp(buf).metadata();
  maxH = Math.max(maxH, m.height);
  tiles.push(buf);
}
const rows = Math.ceil(tiles.length / COLS);
const comps = tiles.map((b, i) => ({ input: b, left: (i % COLS) * CW, top: Math.floor(i / COLS) * maxH }));
await sharp({ create: { width: CW * COLS, height: maxH * rows, channels: 3, background: '#2a2a2a' } })
  .composite(comps).jpeg({ quality: 82 }).toFile(out);
console.log('ok');
