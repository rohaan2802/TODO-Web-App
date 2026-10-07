import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await (
  await browser.newContext({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 })
).newPage();

await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('.filter-group');
await page.addStyleTag({
  content: 'html,body,main{background:transparent!important;margin:0!important;padding:0!important;}',
});
await page.click('.filter-btn[data-filter="high"]');
await page.waitForTimeout(250);
await page.evaluate(() => {
  const group = document.querySelector('.filter-group');
  const clear = document.querySelector('#clearCompleted');
  const card = document.querySelector('.todo-card');
  const wrap = document.createElement('div');
  wrap.id = 'shot-filters';
  wrap.style.cssText =
    'display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px;border-radius:14px;width:max-content;max-width:100%;';
  wrap.style.background = getComputedStyle(card).backgroundColor;
  wrap.appendChild(group.cloneNode(true));
  wrap.appendChild(clear.cloneNode(true));
  document.body.appendChild(wrap);
});
await page.locator('#shot-filters').screenshot({
  path: 'docs/screenshots/09-filters-high-priority.png',
  omitBackground: true,
});
console.log('09 done');
await browser.close();
