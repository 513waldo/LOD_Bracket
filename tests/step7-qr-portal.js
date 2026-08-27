/*
 * Live regression for:
 *   active LOD -> generate QR -> scan/open branded URL -> venue/tournament -> read-only bracket
 *
 * Required environment:
 *   TEST_USERNAME, TEST_PASSWORD, TEST_ASSISTANT_PASSWORD, PLAYWRIGHT_CORE_PATH
 * Optional:
 *   TEST_LOD_CODE, TEST_EXPECTED_BAR_NAME, TEST_EXPECTED_EVENT_NAME,
 *   TEST_BASE_URL, TEST_API_BASE_URL, PLAYWRIGHT_EXECUTABLE_PATH
 */
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');

const baseUrl = String(process.env.TEST_BASE_URL || 'https://ocheoperations.com').replace(/\/$/, '');
const apiBaseUrl = String(process.env.TEST_API_BASE_URL || 'https://lod-bracket-api.lod-bracket.workers.dev').replace(/\/$/, '');
const username = String(process.env.TEST_USERNAME || '').trim();
const password = String(process.env.TEST_PASSWORD || '');
const assistantPassword = String(process.env.TEST_ASSISTANT_PASSWORD || '');
const lodCode = String(process.env.TEST_LOD_CODE || 'TBN8T8').trim().toUpperCase();
const expectedBarName = String(process.env.TEST_EXPECTED_BAR_NAME || 'Step 4 Clean Bar A').trim();
const expectedEventName = String(process.env.TEST_EXPECTED_EVENT_NAME || 'Normal LOD').trim();

if (!username || !password || !assistantPassword || !lodCode) {
  throw new Error('Set TEST_USERNAME, TEST_PASSWORD, TEST_ASSISTANT_PASSWORD, and TEST_LOD_CODE before running this regression.');
}

async function readSnapshot(code) {
  const response = await fetch(`${apiBaseUrl}/api/public/lod/${encodeURIComponent(code)}`, { cache: 'no-store' });
  const snapshot = await response.json();
  if (!response.ok) {
    throw new Error(`Snapshot read failed (${response.status}): ${JSON.stringify(snapshot)}`);
  }
  return snapshot;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-crash-reporter'],
    env: { ...process.env, LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH || '/tmp/libasound-local/usr/lib/x86_64-linux-gnu' },
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const organizer = await context.newPage();
  organizer.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') await dialog.accept(assistantPassword);
    else await dialog.dismiss();
  });
  try {
    const apiSnapshot = await readSnapshot(lodCode);
    assert(apiSnapshot.barName === expectedBarName, `Stored venue mismatch: ${apiSnapshot.barName}`);
    assert(apiSnapshot.eventName === expectedEventName, `Stored tournament mismatch: ${apiSnapshot.eventName}`);
    assert(apiSnapshot.state?.champion, 'The QR regression requires the completed LOD snapshot.');

    await organizer.goto(`${baseUrl}/login.html?next=bracket.html`, { waitUntil: 'domcontentloaded' });
    await organizer.locator('#signInUsername').fill(username);
    await organizer.locator('#signInPassword').fill(password);
    await Promise.all([
      organizer.waitForURL(/\/bracket(?:\.html)?(?:\?|$)/, { timeout: 20000 }),
      organizer.locator('#signInForm button[type="submit"]').click(),
    ]);
    await organizer.goto(`${baseUrl}/bracket.html?lod=${encodeURIComponent(lodCode)}`, { waitUntil: 'domcontentloaded' });
    await organizer.locator('#barName').waitFor({ state: 'visible', timeout: 30000 });
    await organizer.waitForFunction((code) => document.querySelector('#lodCodeText')?.textContent?.trim() === `LOD: ${code}`, lodCode, { timeout: 30000 });
    await organizer.waitForFunction(() => {
      const qr = document.querySelector('#portalQrCode');
      return Boolean(qr && qr.src && !qr.src.startsWith('data:image/gif'));
    }, { timeout: 30000 });
    await organizer.waitForFunction(() => {
      const qr = document.querySelector('#portalQrCode');
      return Boolean(qr && qr.complete && qr.naturalWidth > 0);
    }, { timeout: 30000 });

    const qrData = await organizer.locator('#portalQrCode').getAttribute('src');
    assert(qrData, 'QR image source was not generated.');
    const qrUrl = new URL(qrData);
    const scannedUrl = qrUrl.searchParams.get('data');
    assert(scannedUrl, 'QR image did not contain a destination URL.');
    const brandedUrl = new URL(scannedUrl);
    assert(brandedUrl.origin === new URL(baseUrl).origin, `QR destination is not branded: ${brandedUrl.origin}`);
    assert(brandedUrl.searchParams.get('lod') === lodCode, `QR destination has the wrong LOD: ${brandedUrl.searchParams.get('lod')}`);

    const phone = await context.newPage();
    await phone.goto(brandedUrl.toString(), { waitUntil: 'domcontentloaded' });
    await phone.locator('#portalBracket').waitFor({ state: 'visible', timeout: 30000 });
    await phone.waitForFunction((code) => document.querySelector('#lodCodeText')?.textContent?.trim() === code, lodCode, { timeout: 30000 });
    await phone.waitForFunction((bar) => document.querySelector('#barNameText')?.textContent?.trim() === bar, expectedBarName, { timeout: 30000 });
    await phone.waitForFunction((eventName) => document.querySelector('#eventNameText')?.textContent?.trim() === eventName, expectedEventName, { timeout: 30000 });

    const portalText = await phone.locator('body').innerText();
    assert(portalText.includes(apiSnapshot.state.champion), 'Portal did not show the champion.');
    const finalMatch = apiSnapshot.state.matches?.find((match) => String(match.id) === '5') || apiSnapshot.state.resetFinal;
    assert(finalMatch?.loser && portalText.includes(finalMatch.loser), 'Portal did not show the runner-up.');
    assert(portalText.includes('Bracket'), 'Portal bracket section is missing.');
    assert(await phone.locator('.player-button').count() === 0, 'Player portal exposed result controls.');
    assert(await phone.locator('.reset-match').count() === 0, 'Player portal exposed Fix controls.');
    assert(await phone.locator('[data-board-assignment]').count() === 0, 'Player portal exposed board-edit controls.');

    console.log(JSON.stringify({
      status: 'PASS',
      lodCode,
      qrGenerated: true,
      qrImageLoaded: true,
      brandedUrl: brandedUrl.toString(),
      venue: expectedBarName,
      tournament: expectedEventName,
      champion: apiSnapshot.state.champion,
      runnerUp: finalMatch.loser,
      readOnly: true,
    }, null, 2));
    await phone.close();
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error.stack || error); process.exit(1); });
