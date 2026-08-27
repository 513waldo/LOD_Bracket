/*
 * Live regression for:
 *   deciding match -> champion recorded -> refresh -> completed bracket restored
 *
 * Required environment:
 *   TEST_USERNAME, TEST_PASSWORD, PLAYWRIGHT_CORE_PATH
 * Optional:
 *   TEST_BASE_URL, TEST_API_BASE_URL, TEST_ASSISTANT_PASSWORD,
 *   PLAYWRIGHT_EXECUTABLE_PATH
 */
const { chromium } = require(process.env.PLAYWRIGHT_CORE_PATH || 'playwright-core');

const baseUrl = String(process.env.TEST_BASE_URL || 'https://ocheoperations.com').replace(/\/$/, '');
const apiBaseUrl = String(process.env.TEST_API_BASE_URL || 'https://lod-bracket-api.lod-bracket.workers.dev').replace(/\/$/, '');
const username = String(process.env.TEST_USERNAME || '').trim();
const password = String(process.env.TEST_PASSWORD || '');
const assistantPassword = String(process.env.TEST_ASSISTANT_PASSWORD || '');

if (!username || !password || !assistantPassword) {
  throw new Error('Set TEST_USERNAME, TEST_PASSWORD, and TEST_ASSISTANT_PASSWORD before running this regression.');
}

async function readSnapshot(code, token) {
  const response = await fetch(`${apiBaseUrl}/api/lod/${code}`, {
    cache: 'no-store',
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
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
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'prompt') await dialog.accept(assistantPassword);
    else await dialog.dismiss();
  });
  try {
    await page.goto(`${baseUrl}/login.html?next=bracket.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#signInUsername').fill(username);
    await page.locator('#signInPassword').fill(password);
    await Promise.all([
      page.waitForURL(/\/bracket(?:\.html)?(?:\?|$)/, { timeout: 20000 }),
      page.locator('#signInForm button[type="submit"]').click(),
    ]);
    await page.goto(`${baseUrl}/bracket.html`, { waitUntil: 'domcontentloaded' });
    await page.locator('#barName').waitFor({ state: 'visible', timeout: 30000 });
    const token = await page.evaluate(() => JSON.parse(localStorage.getItem('lodBracketSession:v1') || '{}').token || '');
    assert(token, 'The organizer session token was not available.');
    await page.locator('#newLodCode').click();
    const players = ['Completion Regression Player 1', 'Completion Regression Player 2', 'Completion Regression Player 3'];
    await page.locator('#totalPlayers').fill('3');
    await page.locator('#playersPerGroup').fill('1');
    await page.locator('#refreshNames').click();
    const nameInputs = page.locator('#nameList input[data-player-number]');
    for (let index = 0; index < players.length; index += 1) await nameInputs.nth(index).fill(players[index]);
    await page.locator('#generatePlayers').click();
    await page.waitForTimeout(500);
    await page.locator('#buildBracket').click();
    await page.locator('#bracket').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1800);
    const code = (await page.locator('#lodCodeText').innerText()).replace(/^LOD:\s*/i, '').trim();

    const match1Button = page.locator('#bracket button[data-match-id="1"][data-player]:not([disabled])').first();
    await match1Button.click();
    await page.waitForTimeout(700);
    const match2Button = page.locator('#bracket button[data-match-id="2"][data-player]:not([disabled])').first();
    await match2Button.click();
    await page.waitForTimeout(700);
    const match3Button = page.locator('#bracket button[data-match-id="3"][data-player]:not([disabled])').first();
    const match3Winner = await match3Button.getAttribute('data-player');
    await match3Button.click();
    await page.waitForTimeout(700);
    const match4Button = page.locator(`#bracket button[data-match-id="4"][data-player="${match3Winner}"]:not([disabled])`);
    assert(await match4Button.count() === 1, 'Losers Game 3 winner was not placed in Match 4.');
    await match4Button.click();
    await page.waitForTimeout(900);
    assert((await page.locator('.champion-box-name').innerText()).trim() === 'Pending', 'Champion was declared before the deciding match.');
    const decidingButton = page.locator('#bracket button[data-match-id="5"][data-player]:not([disabled])').first();
    assert(await decidingButton.count() === 1, 'Deciding match was not created.');
    const champion = await decidingButton.getAttribute('data-player');
    const decidingPlayers = await page.locator('#bracket button[data-match-id="5"][data-player]').evaluateAll((buttons) => buttons.map((button) => button.dataset.player));
    const runnerUp = decidingPlayers.find((player) => player !== champion);
    await decidingButton.click();
    await page.waitForTimeout(1200);
    assert((await page.locator('.champion-box-name').innerText()).trim() === champion, 'Deciding match did not declare a champion.');

    const completedSnapshot = await readSnapshot(code, token);
    assert(completedSnapshot.state?.champion === champion, 'Completed champion was not saved by the Worker.');
    assert(completedSnapshot.state?.matchesById?.['5']?.loser === runnerUp, 'Runner-up was not saved in the completed match.');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#bracket').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(2500);
    assert((await page.locator('.champion-box-name').innerText()).trim() === champion, 'Champion was not restored after refresh.');
    assert(await page.locator(`#bracket button[data-match-id="5"][data-player="${champion}"].winner`).count() === 1, 'Completed winner was not restored after refresh.');
    assert(await page.locator(`#bracket button[data-match-id="5"][data-player="${runnerUp}"].loser`).count() === 1, 'Runner-up was not restored after refresh.');
    const completedUi = {
      enabledPlayerButtons: await page.locator('#bracket button.player-button:not([disabled])').count(),
      enabledFixButtons: await page.locator('#bracket button.reset-match:not([disabled])').count(),
    };
    assert(completedUi.enabledPlayerButtons === 0, `Completed tournament still has enabled result controls (${completedUi.enabledPlayerButtons}).`);
    assert(completedUi.enabledFixButtons === 0, `Completed tournament still has enabled Fix controls (${completedUi.enabledFixButtons}).`);

    const completedBeforeAttempts = await readSnapshot(code, token);
    const changedResultSnapshot = JSON.parse(JSON.stringify(completedBeforeAttempts));
    changedResultSnapshot.state.champion = runnerUp;
    if (changedResultSnapshot.state.matchesById?.['5']) {
      changedResultSnapshot.state.matchesById['5'].winner = runnerUp;
      changedResultSnapshot.state.matchesById['5'].loser = champion;
    }
    const changedFinalMatch = changedResultSnapshot.state.matches?.find((match) => String(match.id) === '5');
    if (changedFinalMatch) {
      changedFinalMatch.winner = runnerUp;
      changedFinalMatch.loser = champion;
    }
    const resultAttempt = await fetch(`${apiBaseUrl}/api/lod/${code}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(changedResultSnapshot),
    });
    assert(resultAttempt.status === 409, `Worker accepted a completed result change (${resultAttempt.status}).`);
    assert(/TOURNAMENT_COMPLETED/.test(await resultAttempt.text()), 'Worker returned the wrong completed-result protection response.');
    const afterResultAttempt = await readSnapshot(code, token);
    assert(JSON.stringify(afterResultAttempt.state) === JSON.stringify(completedBeforeAttempts.state), 'Completed snapshot changed after result mutation attempt.');

    const nullSnapshot = { ...completedBeforeAttempts, state: null };
    const rejected = await fetch(`${apiBaseUrl}/api/lod/${code}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(nullSnapshot),
    });
    assert(rejected.status === 409, `Worker accepted a null replacement for completed state (${rejected.status}).`);
    assert(/TOURNAMENT_COMPLETED/.test(await rejected.text()), 'Worker returned the wrong completed-state protection response.');
    const preserved = await readSnapshot(code, token);
    assert(preserved.state?.champion === champion, 'Completed snapshot changed after null replacement attempt.');
    const secondPage = await context.newPage();
    secondPage.on('dialog', async (dialog) => {
      if (dialog.type() === 'prompt') await dialog.accept(assistantPassword);
      else await dialog.dismiss();
    });
    await secondPage.goto(`${baseUrl}/bracket.html?lod=${code}`, { waitUntil: 'domcontentloaded' });
    await secondPage.locator('#bracket').waitFor({ state: 'visible', timeout: 30000 });
    await secondPage.waitForTimeout(2500);
    assert((await secondPage.locator('.champion-box-name').innerText()).trim() === champion, 'Completed champion was not restored in a fresh page context.');
    assert(await secondPage.locator(`#bracket button[data-match-id="5"][data-player="${champion}"].winner`).count() === 1, 'Completed winner was not restored in a fresh page context.');
    await secondPage.close();
    const finalPreserved = await readSnapshot(code, token);
    assert(finalPreserved.state?.champion === champion, 'Fresh page load overwrote the completed snapshot.');
    console.log(JSON.stringify({ status: 'PASS', code, champion, runnerUp, refreshRestored: true, freshPageRestored: true, uiEditingBlocked: true, completedResultRejected: true, nullReplacementRejected: true }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error.stack || error); process.exit(1); });
