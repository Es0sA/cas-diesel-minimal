import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTIFACTS_DIR = 'C:/Users/Es0sA/.gemini/antigravity-cli/brain/29eae2cf-9751-4b2d-ad40-18bb04e696a1';
const DIST_DIR = path.resolve(__dirname, '../dist');

function startServer(port = 4173) {
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
  const server = await startServer(4173);
  const BASE_URL = 'http://localhost:4173';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  // 1. Mobile View (matching picture 1)
  console.log('1. Capturing Mobile Hero View...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const cookieBtn = await mobilePage.$('text="Accept Cookies"');
  if (cookieBtn) {
    await cookieBtn.click();
    await mobilePage.waitForTimeout(300);
  }
  await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile_hero_fixed.png') });
  await mobileContext.close();

  // 2. Desktop Laptop View (matching picture 2: 1366x768 / 1440x900 standard laptop screen)
  console.log('2. Capturing Desktop Laptop Hero View...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const desktopCookieBtn = await desktopPage.$('text="Accept Cookies"');
  if (desktopCookieBtn) {
    await desktopCookieBtn.click();
    await desktopPage.waitForTimeout(300);
  }
  await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_laptop_hero_fixed.png') });
  await desktopContext.close();

  console.log('All verification captures completed successfully.');
  await browser.close();
  server.close();
}

run().catch((err) => {
  console.error('Playwright error:', err);
  process.exit(1);
});
