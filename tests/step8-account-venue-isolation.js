/*
 * Live regression for Step 8:
 *   owner organizer read -> other-account organizer read -> logged-out read
 *   -> public sanitized read -> rejected requests preserve the owner snapshot.
 *
 * Required environment:
 *   TEST_BAR_A_USERNAME, TEST_BAR_A_PASSWORD,
 *   TEST_BAR_B_USERNAME, TEST_BAR_B_PASSWORD,
 *   TEST_ASSISTANT_PASSWORD, PLAYWRIGHT_CORE_PATH
 * Optional:
 *   TEST_BASE_URL, TEST_API_BASE_URL, PLAYWRIGHT_EXECUTABLE_PATH
 */
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');

const baseUrl = String(process.env.TEST_BASE_URL || 'https://ocheoperations.com').replace(/\/$/, '');
const apiBaseUrl = String(process.env.TEST_API_BASE_URL || 'https://lod-bracket-api.lod-bracket.workers.dev').replace(/\/$/, '');
const barAUsername = String(process.env.TEST_BAR_A_USERNAME || '').trim();
const barAPassword = String(process.env.TEST_BAR_A_PASSWORD || '');
const barBUsername = String(process.env.TEST_BAR_B_USERNAME || '').trim();
const barBPassword = String(process.env.TEST_BAR_B_PASSWORD || '');
const assistantPassword = String(process.env.TEST_ASSISTANT_PASSWORD || '');

if (!barAUsername || !barAPassword || !barBUsername || !barBPassword || !assistantPassword) {
  throw new Error('Set both test account credentials and TEST_ASSISTANT_PASSWORD before running this regression.');
}

const allowedPublicKeys = new Set([
  'version', 'exportedAt', 'lodCode', 'expiresAt', 'barName', 'eventType', 'eventName', 'eventDate',
  'portalNotice', 'portalNoticeAt', 'portalAutoNotice', 'portalAutoNoticeAt',
  'portalBullshootNotice', 'portalBullshootNoticeAt', 'state',
]);
const forbiddenPublicKeys = new Set([
  'owner', 'playerList', 'nameMap', 'currentTeams', 'hasGeneratedTeams', 'blockedGenerateCount',
  'outShots', 'mysteryOut', 'diceValues', 'payout', 'splitPot', 'bullseyeShoot',
  'portalSupportNotice', 'portalSupportNoticeAt', 'portalSupportMessages', 'matchesById',
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function login(page, username, password, next = 'bracket.html') {
  await page.goto(`${baseUrl}/login.html?next=${encodeURIComponent(next)}`, { waitUntil: 'domcontentloaded' });
  await page.locator('#signInUsername').fill(username);
  await page.locator('#signInPassword').fill(password);
  await Promise.all([
    page.waitForURL(/\/bracket(?:\.html)?(?:\?|$)/, { timeout: 20000 }),
    page.locator('#signInForm button[type="submit"]').click(),
  ]);
}

async function apiJson(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, options);
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

async function waitForApi(path, options, predicate, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let result = null;
  while (Date.now() < deadline) {
    result = await apiJson(path, options);
    if (predicate(result)) return result;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return result;
}

function findForbiddenKey(value, path = '$') {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const found = findForbiddenKey(value[index], `${path}[${index}]`);
      if (found) return found;
    }
    return null;
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  for (const [key, child] of Object.entries(value)) {
    if (forbiddenPublicKeys.has(key)) return `${path}.${key}`;
    const found = findForbiddenKey(child, `${path}.${key}`);
    if (found) return found;
  }
  return null;
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-crash-reporter'],
    env: { ...process.env, LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH || '/tmp/libasound-local/usr/lib/x86_64-linux-gnu' },
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') await dialog.accept(assistantPassword);
    else await dialog.dismiss();
  });

  let lodCode = '';
  let ownerSnapshot = null;
  let barAToken = '';
  try {
    // Create a fresh active LOD under Bar A.
    await login(page, barAUsername, barAPassword);
    await page.goto(`${baseUrl}/bracket.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#barName').waitFor({ state: 'visible', timeout: 30000 });
    const barAName = await page.locator('#barName').inputValue();
    barAToken = await page.evaluate(() => JSON.parse(localStorage.getItem('lodBracketSession:v1') || '{}').token || '');
    assert(barAToken, 'Bar A session token was not available.');

    await page.locator('#totalPlayers').fill('3');
    await page.locator('#playersPerGroup').fill('1');
    await page.locator('#refreshNames').click();
    const players = ['Step 8 Isolation A Player 1', 'Step 8 Isolation A Player 2', 'Step 8 Isolation A Player 3'];
    const nameInputs = page.locator('#nameList input[data-player-number]');
    for (let index = 0; index < players.length; index += 1) await nameInputs.nth(index).fill(players[index]);
    await page.locator('#generatePlayers').click();
    await page.locator('#buildBracket').click();
    await page.locator('#bracket').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction(() => /^LOD: [A-Z0-9]{6}$/.test((document.querySelector('#lodCodeText')?.textContent || '').trim()), { timeout: 30000 });
    lodCode = (await page.locator('#lodCodeText').innerText()).replace(/^LOD:\s*/i, '').trim();

    const ownerRead = await waitForApi(`/api/lod/${encodeURIComponent(lodCode)}`, {
      headers: { authorization: `Bearer ${barAToken}` },
    }, (result) => result.status === 200);
    assert(ownerRead.status === 200, `Bar A organizer request failed: ${ownerRead.status}`);
    ownerSnapshot = ownerRead.body;
    assert(ownerSnapshot.barName === barAName, `Bar A organizer venue mismatch: ${ownerSnapshot.barName}`);
    assert(ownerSnapshot.playerList, 'Organizer response did not include the full player list.');

    const publicRead = await apiJson(`/api/public/lod/${encodeURIComponent(lodCode)}`);
    assert(publicRead.status === 200, `Public portal request failed: ${publicRead.status}`);
    assert(Object.keys(publicRead.body).every((key) => allowedPublicKeys.has(key)), 'Public response exposed an unexpected top-level field.');
    const forbiddenPath = findForbiddenKey(publicRead.body);
    assert(!forbiddenPath, `Public response exposed staff-only data at ${forbiddenPath}.`);
    assert(publicRead.body.barName === barAName, 'Public response venue mismatch.');
    assert(publicRead.body.state?.originalPlayers?.length === 3, 'Public response did not include the public bracket players.');

    const loggedOutOrganizerRead = await apiJson(`/api/lod/${encodeURIComponent(lodCode)}`);
    assert(loggedOutOrganizerRead.status === 401, `Logged-out organizer request was not rejected with 401 (${loggedOutOrganizerRead.status}).`);

    // Log out through the application and sign in as Bar B.
    await page.goto(`${baseUrl}/attendance.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#attendanceLogoutButton').click();
    await page.waitForURL(/\/login(?:\.html)?(?:\?|$)/, { timeout: 20000 });
    assert(await page.evaluate(() => !localStorage.getItem('lodBracketSession:v1')), 'Account logout did not clear the session.');
    await login(page, barBUsername, barBPassword, `bracket.html?lod=${encodeURIComponent(lodCode)}`);

    await page.locator('#organizerAccessDenied').waitFor({ state: 'visible', timeout: 30000 });
    assert((await page.locator('#organizerAccessDenied h2').innerText()).trim() === 'Access denied', 'Unauthorized organizer view did not show Access denied.');
    assert(await page.locator('.top-workspace').isHidden(), 'Unauthorized organizer setup controls remained visible.');
    assert(await page.locator('.bracket-workspace').isHidden(), 'Unauthorized organizer bracket controls remained visible.');
    assert((await page.locator('body').innerText()).includes('Step 8 Isolation A Player 1') === false, 'Bar A player data appeared in the denied organizer UI.');

    const barBSession = await page.evaluate(() => JSON.parse(localStorage.getItem('lodBracketSession:v1') || 'null'));
    const barBToken = String(barBSession?.token || '');
    assert(barBToken, 'Bar B session token was not available.');
    const otherAccountRead = await apiJson(`/api/lod/${encodeURIComponent(lodCode)}`, {
      headers: { authorization: `Bearer ${barBToken}` },
    });
    assert(otherAccountRead.status === 403, `Bar B organizer request was not rejected with 403 (${otherAccountRead.status}).`);

    const attempted = JSON.parse(JSON.stringify(ownerSnapshot));
    attempted.portalNotice = 'Rejected Bar B mutation';
    const otherAccountMutation = await apiJson(`/api/lod/${encodeURIComponent(lodCode)}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${barBToken}` },
      body: JSON.stringify(attempted),
    });
    assert(otherAccountMutation.status === 403, `Bar B mutation was not rejected with 403 (${otherAccountMutation.status}).`);

    const afterRejectedRequests = await apiJson(`/api/lod/${encodeURIComponent(lodCode)}`, {
      headers: { authorization: `Bearer ${barAToken}` },
    });
    assert(afterRejectedRequests.status === 200, `Bar A snapshot could not be reread after rejected requests (${afterRejectedRequests.status}).`);
    assert(JSON.stringify(afterRejectedRequests.body) === JSON.stringify(ownerSnapshot), 'Bar A snapshot changed after rejected requests.');

    const portal = await context.newPage();
    await portal.goto(`${baseUrl}/portal.html?lod=${encodeURIComponent(lodCode)}`, { waitUntil: 'domcontentloaded' });
    await portal.locator('#portalBracket').waitFor({ state: 'visible', timeout: 30000 });
    await portal.waitForFunction((bar) => document.querySelector('#barNameText')?.textContent?.trim() === bar, barAName, { timeout: 30000 });
    assert(await portal.locator('.player-button, .reset-match, [data-board-assignment]').count() === 0, 'Public portal exposed organizer controls.');
    await portal.close();

    console.log(JSON.stringify({
      status: 'PASS',
      lodCode,
      ownerOrganizerRead: 200,
      otherAccountOrganizerRead: otherAccountRead.status,
      loggedOutOrganizerRead: loggedOutOrganizerRead.status,
      publicPortalRead: publicRead.status,
      publicFieldsSanitized: true,
      organizerAccessDeniedUi: true,
      publicPortalReadOnly: true,
      rejectedRequestsPreservedOwnerData: true,
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error.stack || error); process.exit(1); });
