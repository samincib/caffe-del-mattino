import { chromium } from 'playwright-core';
const [out, ...rest] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (const spec of rest) {
  const [w, h, anchor, name] = spec.split(':');
  const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(process.env.TARGET || 'http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  if (anchor && anchor !== '-') { await p.locator(anchor).scrollIntoViewIfNeeded(); await p.waitForTimeout(900); }
  await p.screenshot({ path: `${out}/${name}.png` });
  await ctx.close();
}
await browser.close();
console.log('ok');
