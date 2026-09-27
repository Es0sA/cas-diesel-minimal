import { chromium } from 'playwright';
import path from 'path';

const outDir = '/home/ubuntu/.gemini/antigravity-cli/brain/cf6a1f5a-15f0-4f24-82ea-fefb0f7ac1fb';

async function testInteractions() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4173/cas-diesel-minimal/login', { waitUntil: 'networkidle' });

  // Dismiss cookie banner
  const acceptBtn = await page.$('text="Accept Cookies"');
  if (acceptBtn) {
    await acceptBtn.click();
    await page.waitForTimeout(300);
  }

  // 1. Click "Forgot password?" to trigger assistance modal
  console.log('Testing Assistance Modal...');
  await page.click('button:has-text("Forgot password?")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'login_assistance_modal.png') });

  // Close modal
  await page.click('button:has-text("Got It, Return to Login")');
  await page.waitForTimeout(300);

  // 2. Click "Demo fill"
  console.log('Testing Demo fill...');
  await page.click('button:has-text("Demo fill")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'login_demo_filled.png') });

  console.log('Interaction tests captured successfully!');
  await browser.close();
}

testInteractions().catch((err) => {
  console.error('Error during interaction testing:', err);
  process.exit(1);
});
