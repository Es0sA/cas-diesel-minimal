import { chromium } from 'playwright';
import path from 'path';

const outDir = '/home/ubuntu/.gemini/antigravity-cli/brain/cf6a1f5a-15f0-4f24-82ea-fefb0f7ac1fb';

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:4173/cas-diesel-minimal/login ...');
  await page.goto('http://localhost:4173/cas-diesel-minimal/login', { waitUntil: 'networkidle' });

  // Dismiss Cookie Banner if present
  const acceptBtn = await page.$('text="Accept Cookies"');
  if (acceptBtn) {
    console.log('Accepting cookies...');
    await acceptBtn.click();
    await page.waitForTimeout(300);
  }

  // 1. Buyer View (Default)
  console.log('Capturing Buyer view...');
  await page.screenshot({ path: path.join(outDir, 'login_buyer.png') });

  // 2. Click Marketer Tab
  console.log('Switching to Marketer tab...');
  await page.click('button:has-text("Marketer")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'login_marketer.png') });

  // 3. Click Driver Tab
  console.log('Switching to Driver tab...');
  await page.click('button:has-text("Driver")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'login_driver.png') });

  // 4. Mobile View
  console.log('Capturing Mobile view...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('button:has-text("Buyer")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, 'login_mobile.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
