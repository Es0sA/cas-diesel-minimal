import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Es0sA/.gemini/antigravity-cli/brain/29eae2cf-9751-4b2d-ad40-18bb04e696a1';
const LIVE_URL = 'https://es0sa.github.io/cas-diesel-minimal/';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Desktop Viewport
  console.log('1. Capturing Minimal Desktop Hero View...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1366, height: 850 }
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(LIVE_URL, { waitUntil: 'networkidle' });
  const cookieAccept = await desktopPage.$('text="Accept Cookies"');
  if (cookieAccept) {
    await cookieAccept.click();
    await desktopPage.waitForTimeout(300);
  }
  await desktopPage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'minimal_desktop_proof.png')
  });

  // 2. Mobile Viewport
  console.log('2. Capturing Minimal Mobile View...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(LIVE_URL, { waitUntil: 'networkidle' });
  const mobileCookie = await mobilePage.$('text="Accept Cookies"');
  if (mobileCookie) {
    await mobileCookie.click();
    await mobilePage.waitForTimeout(300);
  }
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'minimal_mobile_proof.png')
  });

  console.log('Screenshots captured successfully.');
  await browser.close();
}

run().catch((err) => {
  console.error('Playwright capture error:', err);
  process.exit(1);
});
