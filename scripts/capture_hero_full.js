import { chromium } from 'playwright';
import path from 'path';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = 'C:/Users/Es0sA/.gemini/antigravity-cli/brain/29eae2cf-9751-4b2d-ad40-18bb04e696a1';
const DIST_DIR = path.resolve(__dirname, '../dist');

function startServer(port = 4174) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/' || reqPath === '/cas-diesel/' || reqPath === '/cas-diesel') {
        reqPath = '/index.html';
      } else if (reqPath.startsWith('/cas-diesel/')) {
        reqPath = reqPath.replace('/cas-diesel/', '/');
      }

      const filePath = path.join(DIST_DIR, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.svg': 'image/svg+xml',
          '.png': 'image/png'
        }[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(DIST_DIR, 'index.html')).pipe(res);
      }
    });

    server.listen(port, () => {
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer(4174);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 1000 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
  
  const acceptBtn = await page.$('text="Accept Cookies"');
  if (acceptBtn) {
    await acceptBtn.click();
    await page.waitForTimeout(200);
  }
  
  // Screenshot the entire Hero section element
  const heroElement = await page.$('section.bg-white');
  if (heroElement) {
    await heroElement.screenshot({
      path: path.join(ARTIFACTS_DIR, 'desktop_hero_section_proof.png')
    });
    console.log('Saved desktop_hero_section_proof.png');
  }

  // Also capture full page on desktop laptop
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'desktop_laptop_full_proof.png'),
    clip: { x: 0, y: 0, width: 1366, height: 900 }
  });
  console.log('Saved desktop_laptop_full_proof.png');

  await browser.close();
  server.close();
}

run().catch(console.error);
