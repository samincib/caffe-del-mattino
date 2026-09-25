import sharp from 'sharp';
const items = process.argv.slice(3);
const CW=430, CH=300, COLS=3;
const rows = Math.ceil(items.length/COLS);
const comps=[];
for (let i=0;i<items.length;i++){
  const buf = await sharp(`public/images/${items[i]}`).resize(CW,CH,{fit:'contain',background:'#222'}).toBuffer();
  comps.push({input:buf,left:(i%COLS)*CW,top:Math.floor(i/COLS)*CH});
  const lbl = Buffer.from(`<svg width="${CW}" height="30"><rect width="${CW}" height="30" fill="rgba(0,0,0,.8)"/><text x="6" y="22" font-size="19" fill="#fff" font-family="monospace">${items[i]}</text></svg>`);
  comps.push({input:lbl,left:(i%COLS)*CW,top:Math.floor(i/COLS)*CH});
}
await sharp({create:{width:CW*COLS,height:CH*rows,channels:3,background:'#222'}}).composite(comps).jpeg({quality:80}).toFile(process.argv[2]);
console.log('ok');
