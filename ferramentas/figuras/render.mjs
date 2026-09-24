/* Fotografa cada figura de figuras.html e grava o PNG em assets/figuras/.
   deviceScaleFactor alto porque o destino é impressão. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const saida = join(aqui, '..', '..', 'assets', 'figuras');
mkdirSync(saida, { recursive: true });

const html = readFileSync(join(aqui, 'figuras.html'), 'utf8');
const ids = [...html.matchAll(/class="f" id="([^"]+)"/g)].map(m => m[1]);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1000, height: 900 }, deviceScaleFactor: 3 });
await p.goto('file://' + join(aqui, 'figuras.html'));
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
for (const id of ids) await p.locator('#' + id).screenshot({ path: join(saida, id + '.png') });
await b.close();
console.log(ids.length + ' figuras gravadas em assets/figuras/');
