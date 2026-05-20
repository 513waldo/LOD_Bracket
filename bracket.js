const playerList = document.querySelector("#playerList");
const totalPlayers = document.querySelector("#totalPlayers");
const playersPerGroup = document.querySelector("#playersPerGroup");
const message = document.querySelector("#message");
const groupsOutput = document.querySelector("#groupsOutput");
const bracketOutput = document.querySelector("#bracket");
const championOutput = document.querySelector("#champion");
const nameList = document.querySelector("#nameList");
const backupList = document.querySelector("#backupList");
const paperBackup = document.querySelector("#paperBackup");
const redrawWarning = document.querySelector("#redrawWarning");
const teamDrawWarning = document.querySelector("#teamDrawWarning");
const nameBackupList = document.querySelector("#nameBackupList");
const outShotSheet = document.querySelector("#outShotSheet");
const rollDiceButton = document.querySelector("#rollDice");
const dieButtons = Array.from(document.querySelectorAll("[data-die-index]"));
const diceTotal = document.querySelector("#diceTotal");
const generateMysteryOutButton = document.querySelector("#generateMysteryOut");
const resetMysteryOutButton = document.querySelector("#resetMysteryOut");
const mysteryOutValue = document.querySelector("#mysteryOutValue");
const mysteryOutModeInputs = Array.from(document.querySelectorAll("[data-mystery-out-mode]"));
const mysteryOutWinner = document.querySelector("#mysteryOutWinner");
const mysteryOutWinnerTitle = document.querySelector("#mysteryOutWinnerTitle");
const mysteryOutWinnerBody = document.querySelector("#mysteryOutWinnerBody");
const highestOutRecordBody = document.querySelector("#highestOutRecordBody");
const payoutTeams = document.querySelector("#payoutTeams");
const payoutEntry = document.querySelector("#payoutEntry");
const payoutAdded = document.querySelector("#payoutAdded");
const payoutPlaces = document.querySelector("#payoutPlaces");
const clearPayoutButton = document.querySelector("#clearPayout");
const payoutPercentInputs = document.querySelector("#payoutPercentInputs");
const payoutPercentStatus = document.querySelector("#payoutPercentStatus");
const payoutSummary = document.querySelector("#payoutSummary");
const payoutResults = document.querySelector("#payoutResults");
const splitPotNameInput = document.querySelector("#splitPotName");
const splitPotTicketsInput = document.querySelector("#splitPotTickets");
const addSplitPotEntryButton = document.querySelector("#addSplitPotEntry");
const splitPotSummary = document.querySelector("#splitPotSummary");
const splitPotEntriesOutput = document.querySelector("#splitPotEntries");
const drawSplitPotWinnerButton = document.querySelector("#drawSplitPotWinner");
const clearSplitPotWinnerButton = document.querySelector("#clearSplitPotWinner");
const clearSplitPotEntriesButton = document.querySelector("#clearSplitPotEntries");
const splitPotWinnerOutput = document.querySelector("#splitPotWinner");
const bullseyeShootNameInput = document.querySelector("#bullseyeShootName");
const bullseyeShootTicketsInput = document.querySelector("#bullseyeShootTickets");
const bullseyeShootCurrentPotInput = document.querySelector("#bullseyeShootCurrentPot");
const addBullseyeShootEntryButton = document.querySelector("#addBullseyeShootEntry");
const bullseyeShootSummary = document.querySelector("#bullseyeShootSummary");
const bullseyeShootEntriesOutput = document.querySelector("#bullseyeShootEntries");
const drawBullseyeShootWinnerButton = document.querySelector("#drawBullseyeShootWinner");
const clearBullseyeShootWinnerButton = document.querySelector("#clearBullseyeShootWinner");
const clearBullseyeShootEntriesButton = document.querySelector("#clearBullseyeShootEntries");
const bullseyeShootWinnerOutput = document.querySelector("#bullseyeShootWinner");
const pdfLayoutSelect = document.querySelector("#pdfLayoutSelect");
const pdfColumnMirror = document.querySelector("#pdfColumnMirror");
const copyPortalLinkButton = document.querySelector("#copyPortalLink");
const newLodCodeButton = document.querySelector("#newLodCode");
const portalQrCode = document.querySelector("#portalQrCode");
const lodCodeText = document.querySelector("#lodCodeText");
const lodCodeInput = document.querySelector("#lodCodeInput");
const loadLodCodeButton = document.querySelector("#loadLodCode");
const clearLodCodeButton = document.querySelector("#clearLodCode");
const portalNoticeInput = document.querySelector("#portalNoticeInput");
const portalAutoNoticeInput = document.querySelector("#portalAutoNoticeInput");
const portalAutoNoticeStatus = document.querySelector("#portalAutoNoticeStatus");
const portalBullshootNoticeInput = document.querySelector("#portalBullshootNoticeInput");
const portalBullshootNoticeStatus = document.querySelector("#portalBullshootNoticeStatus");
const sendPortalNoticeButton = document.querySelector("#sendPortalNotice");
const clearPortalNoticeButton = document.querySelector("#clearPortalNotice");
const portalNoticeStatus = document.querySelector("#portalNoticeStatus");
const lodRegistryList = document.querySelector("#lodRegistryList");
const refreshRegistryButton = document.querySelector("#refreshRegistry");
const API_BASE_URLS = getApiBaseUrls();
const API_PUBLISH_DEBOUNCE_MS = 300;
const REGISTRY_REFRESH_DEBOUNCE_MS = 300;
const backupIndexKey = "dartsTournamentBracketBackupIndex";
const backupKeyPrefix = "dartsTournamentBracketBackup:";
const maxBracketBackups = 25;
const nameBackupIndexKey = "dartsTournamentPlayerNameBackupIndex";
const nameBackupKeyPrefix = "dartsTournamentPlayerNameBackup:";
const outShotStorageKey = "dartsTournamentOutShots";
const splitPotStorageKey = "dartsTournamentSplitPot";
const bullseyeShootStorageKey = "dartsTournamentBullseyeShoot";
const portalSnapshotStorageKey = "dartsTournamentPortalSnapshot";
const bracketDraftStorageKey = "dartsTournamentBracketDraft";
const bracketCleanupStorageKey = "dartsTournamentBracketCleanupAt";
const lodCodeStorageKey = "dartsTournamentLodCode";
const lodCodeClearedValue = "__CLEARED__";
const bracketCleanupDurationMs = 60 * 60 * 1000;
const outShotSlotCount = 100;
const splitPotFirstTicketNumber = 100;
const splitPotMaxPurchaseAmount = 50;
const dartScores = [
  ...Array.from({ length: 20 }, (_, index) => index + 1),
  ...Array.from({ length: 20 }, (_, index) => (index + 1) * 2),
  ...Array.from({ length: 20 }, (_, index) => (index + 1) * 3),
  25,
  50,
];
const doubleOutFinishes = [
  ...Array.from({ length: 20 }, (_, index) => (index + 1) * 2),
  50,
];
const masterOutFinishes = [
  ...doubleOutFinishes,
  ...Array.from({ length: 20 }, (_, index) => (index + 1) * 3),
];
const mysteryOutExclusions = {
  open: [179],
  double: [159, 162, 163, 165, 166, 168, 169],
  master: [163, 166, 169, 172, 173, 175, 176, 178, 179],
};
const mysteryOutRanges = {
  open: { min: 1, max: 180 },
  double: { min: 2, max: 170 },
  master: { min: 2, max: 180 },
};
const diceValues = [1, 1];
const diceRollTimers = [null, null];
const pdfBracketLayouts = {
  3: { pdf: "3teamdouble.pdf", winner: "G1 / G2 / G4", loser: "G3 / G5", final: "G4", reset: "G5 from L4" },
  4: { pdf: "4teamDouble.pdf", winner: "G1,G2 / G3 / G6", loser: "G4 / G5 / G7", final: "G6", reset: "G7 from L6" },
  5: { pdf: "5teamDouble.pdf", winner: "G1 / G2,G3 / G5 / G8", loser: "G4 / G6 / G7 / G9", final: "G8", reset: "G9 from L8" },
  6: { pdf: "6teamDouble.pdf", winner: "G1,G2 / G3,G4 / G7 / G10", loser: "G5,G6 / G8 / G9 / G11", final: "G10", reset: "G11 from L10" },
  7: { pdf: "7teamDouble.pdf", winner: "G1,G2,G3 / G4,G5 / G9 / G12", loser: "G6 / G8,G7 / G10 / G11 / G13", final: "G12", reset: "G13 from L12" },
  8: { pdf: "8teamDouble.pdf", winner: "G1,G2,G3,G4 / G7,G8 / G11 / G14", loser: "G5,G6 / G9,G10 / G12 / G13 / G15", final: "G14", reset: "G15 from L14" },
  9: { pdf: "9teamdouble.pdf", winner: "G1 / G2,G3,G5,G4 / G9,G10 / G13 / G16", loser: "G6 / G8,G7 / G12,G11 / G14 / G15 / G17", final: "G16", reset: "G17 from L16" },
  10: { pdf: "10teamDouble.pdf", winner: "G1,G2 / G3,G5,G6,G4 / G11,G12 / G15 / G18", loser: "G7,G8 / G9,G10 / G13,G14 / G16 / G17 / G19", final: "G18", reset: "G19 from L18" },
  11: { pdf: "11teamdouble.pdf", winner: "G1,G2,G3 / G4,G5,G6,G7 / G13,G14 / G17 / G20", loser: "G8,G9,G10 / G11,G12 / G16,G15 / G18 / G19 / G21", final: "G20", reset: "G21 from L20" },
  12: { pdf: "12teamdouble.pdf", winner: "G1,G2,G3,G4 / G5,G6,G7,G8 / G13,G14 / G19 / G22", loser: "G9,G10,G11,G12 / G15,G16 / G17,G18 / G20 / G21 / G23", final: "G22", reset: "G23 from L22" },
  13: { pdf: "13teamdouble.pdf", winner: "G1,G2,G3,G4,G5 / G6,G7,G9,G8 / G15,G16 / G21 / G24", loser: "G10 / G14,G11,G12,G13 / G17,G18 / G19,G20 / G22 / G23 / G25", final: "G24", reset: "G25 from L24" },
  14: { pdf: "14teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6 / G7,G8,G9,G10 / G17,G18 / G23 / G26", loser: "G11,G12 / G15,G13,G14,G16 / G19,G20 / G21,G22 / G24 / G25 / G27", final: "G26", reset: "G27 from L26" },
  15: { pdf: "15teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6,G7 / G8,G9,G10,G11 / G19,G20 / G25 / G28", loser: "G12,G13,G14 / G16,G17,G15,G18 / G21,G22 / G23,G24 / G26 / G27 / G29", final: "G28", reset: "G29 from L28" },
  16: { pdf: "16teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6,G7,G8 / G13,G14,G15,G16 / G21,G22 / G27 / G30", loser: "G9,G10,G11,G12 / G17,G18,G19,G20 / G23,G24 / G25,G26 / G28 / G29 / G31", final: "G30", reset: "G31 from L30" },
  17: { pdf: "17-team-double.pdf", winner: "G1 / G9,G2,G3,G4,G5,G6,G7,G8 / G15,G16,G17,G18 / G23,G24 / G29 / G32", loser: "G10 / G14,G11,G12,G13 / G19,G20,G21,G22 / G25,G26 / G27,G28 / G30 / G31 / G33", final: "G32", reset: "G33 from L32" },
  18: { pdf: "18-team-double.pdf", winner: "G1,G2 / G9,G3,G4,G5,G10,G6,G7,G8 / G17,G18,G19,G20 / G25,G26 / G31 / G34", loser: "G11,G12 / G15,G13,G16,G14 / G21,G22,G23,G24 / G27,G28 / G29,G30 / G32 / G33 / G35", final: "G34", reset: "G35 from L34" },
  19: { pdf: "19-team-double.pdf", winner: "G1,G2,G3 / G9,G4,G5,G6,G10,G7,G11,G8 / G19,G20,G21,G22 / G27,G28 / G33 / G36", loser: "G12,G13,G14 / G16,G15,G17,G18 / G23,G24,G25,G26 / G29,G30 / G31,G32 / G34 / G35 / G37", final: "G36", reset: "G37 from L36" },
  20: { pdf: "20-team-double.pdf", winner: "G1,G2,G3,G4 / G9,G5,G10,G6,G11,G7,G12,G8 / G21,G22,G23,G24 / G29,G30 / G35 / G38", loser: "G13,G14,G15,G16 / G17,G18,G19,G20 / G25,G26,G27,G28 / G31,G32 / G33,G34 / G36 / G37 / G39", final: "G38", reset: "G39 from L38" },
  21: { pdf: "21-team-double.pdf", winner: "G1,G2,G3,G4,G5 / G9,G6,G10,G11,G12,G7,G13,G8 / G23,G24,G25,G26 / G31,G32 / G37 / G40", loser: "G14,G15,G16,G17,G18 / G19,G22,G20,G21 / G27,G28,G29,G30 / G33,G34 / G35,G36 / G38 / G39 / G41", final: "G40", reset: "G41 from L40" },
  22: { pdf: "22teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6 / G9,G7,G10,G11,G12,G8,G13,G14 / G25,G26,G27,G28 / G33,G34 / G39 / G42", loser: "G15,G16,G17,G18,G19,G20 / G21,G23,G22,G24 / G29,G30,G31,G32 / G35,G36 / G37,G38 / G40 / G41 / G43", final: "G42", reset: "G43 from L42" },
  23: { pdf: "23teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6,G7 / G9,G8,G10,G11,G12,G13,G14,G15 / G27,G28,G29,G30 / G35,G36 / G41 / G44", loser: "G16,G17,G18,G19,G20,G21,G22 / G23,G24,G25,G26 / G31,G32,G33,G34 / G37,G38 / G39,G40 / G42 / G43 / G45", final: "G44", reset: "G45 from L44" },
  24: { pdf: "24teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6,G7,G8 / G9,G10,G11,G12,G13,G14,G15,G16 / G29,G30,G31,G32 / G37,G38 / G43 / G46", loser: "G17,G18,G19,G20,G21,G22,G23,G24 / G25,G26,G27,G28 / G33,G34,G35,G36 / G39,G40 / G41,G42 / G44 / G45 / G47", final: "G46", reset: "G47 from L46" },
};
let learnedPdfGraphs = null;
let learnedPdfGraphsPromise = null;

let state = null;
let currentTeams = [];
let hasGeneratedTeams = false;
let blockedGenerateCount = 0;
let advancingMatchId = null;
let mysteryOut = "";
let mysteryOutDrawAnimation = null;
let portalNotice = "";
let portalNoticeAt = "";
let portalNoticeDraft = "";
let portalAutoNotice = "";
let portalAutoNoticeAt = "";
let portalBullshootNotice = "";
let portalBullshootNoticeAt = "";
let splitPotEntries = [];
let splitPotWinner = null;
let bullseyeShootEntries = [];
let bullseyeShootWinner = null;
let bullseyeShootCurrentPot = 0;
let splitPotDrawAnimation = null;
let bullseyeShootDrawAnimation = null;
const storedLodCode = getStoredLodCode();
let lodCode = storedLodCode === null ? generateLodCode() : storedLodCode;
let portalPublishTimer = null;
let lastPublishedPortalSnapshot = "";
let registryRefreshTimer = null;
let bracketDraftSaveTimer = null;
let bracketCleanupTimer = null;

saveStoredLodCode(lodCode);
renderPortalLink();

renderNameInputs(Number(totalPlayers.value));
renderBackups();
renderNameBackups();
renderOutShotSheet();
renderDice();
renderMysteryOut();
loadSplitPot();
renderSplitPotPurchaseOptions();
renderSplitPot();
loadBullseyeShoot();
renderBullseyeShootPurchaseOptions();
renderBullseyeShoot();
syncPayoutTeamsFromPlayerCount();
updatePayoutCalculator();
renderPdfLayoutOptions();
renderPdfColumnMirror(8);
restoreBracketDraft();
loadActiveLodCodes();

totalPlayers.addEventListener("change", () => {
  renderNameInputs(Number(totalPlayers.value));
  syncPdfLayoutToTeamCount(Number(totalPlayers.value));
  syncPayoutTeamsFromPlayerCount();
  updatePayoutCalculator();
});

playersPerGroup.addEventListener("change", () => {
  syncPayoutTeamsFromPlayerCount();
  updatePayoutCalculator();
});

document.querySelector("#refreshNames").addEventListener("click", () => {
  renderNameInputs(Number(totalPlayers.value));
  queueBracketDraftSave();
});

if (pdfLayoutSelect) {
  pdfLayoutSelect.addEventListener("change", () => {
    renderPdfColumnMirror(Number(pdfLayoutSelect.value));
    queueBracketDraftSave();
  });
}

refreshRegistryButton?.addEventListener("click", () => {
  loadActiveLodCodes(true);
});

document.addEventListener("input", (event) => {
  if (event.target?.matches?.("input:not([type='file']), textarea, select")) {
    queueBracketDraftSave();
  }
});

document.addEventListener("change", (event) => {
  if (event.target?.matches?.("input:not([type='file']), textarea, select")) {
    queueBracketDraftSave();
  }
});

document.querySelector("#saveCurrentBackup").addEventListener("click", () => {
  if (!state) {
    showMessage("Build a bracket before saving a backup.");
    return;
  }

  saveBracketBackup({ selectedWinner: "", manual: true });
  showMessage("Current bracket backup saved.");
});

document.querySelector("#downloadPortalSnapshot").addEventListener("click", () => {
  if (!state) {
    showMessage("Build a bracket before downloading a portal snapshot.");
    return;
  }

  downloadPortalSnapshot();
  showMessage(`Portal snapshot downloaded as lod-${lodCode}.json.`);
});

newLodCodeButton?.addEventListener("click", () => {
  lodCode = generateLodCode();
  saveStoredLodCode(lodCode);
  renderPortalLink();
  savePortalSnapshotToLocalStorage();
  queueActiveLodCodesRefresh();
  showMessage(`New LOD code generated: ${lodCode}.`);
});

loadLodCodeButton?.addEventListener("click", () => {
  const code = normalizeLodCode(lodCodeInput?.value || "");

  if (!code) {
    lodCode = "";
    saveStoredLodCode("");
    renderPortalLink();
    queueActiveLodCodesRefresh();
    showMessage("LOD code cleared.");
    return;
  }

  lodCode = code;
  saveStoredLodCode(lodCode);
  renderPortalLink();
  queueActiveLodCodesRefresh();
  showMessage(`Loaded LOD code: ${lodCode}.`);
});

clearLodCodeButton?.addEventListener("click", () => {
  const previousCode = lodCode;
  lodCode = "";
  saveStoredLodCode("");
  renderPortalLink();

  if (canUseLocalStorage() && previousCode) {
    localStorage.removeItem(`${portalSnapshotStorageKey}:${previousCode}`);
  }

  queueActiveLodCodesRefresh();
  showMessage("LOD code cleared.");
});

portalNoticeInput?.addEventListener("input", () => {
  portalNoticeDraft = portalNoticeInput.value || "";
  queueBracketDraftSave();
});

sendPortalNoticeButton?.addEventListener("click", () => {
  portalNotice = portalNoticeDraft || "";
  portalNoticeAt = portalNotice ? new Date().toISOString() : "";
  const didPublish = savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
  const stamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (portalNoticeStatus) {
    portalNoticeStatus.textContent = portalNotice
      ? (didPublish ? `Sent at ${stamp}.` : `Message ready at ${stamp}; set an LOD code to publish.`)
      : `Cleared at ${stamp}.`;
  }
  showMessage(portalNotice
    ? (didPublish ? `Board call sent to players portal at ${stamp}.` : `Board call saved at ${stamp}; set an LOD code to publish.`)
    : `Board call cleared at ${stamp}.`);
});

clearPortalNoticeButton?.addEventListener("click", () => {
  portalNotice = "";
  portalNoticeAt = "";
  portalNoticeDraft = "";
  if (portalNoticeInput) {
    portalNoticeInput.value = "";
  }
  if (portalNoticeStatus) {
    portalNoticeStatus.textContent = "";
  }
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
  showMessage("Portal message cleared.");
});

copyPortalLinkButton?.addEventListener("click", async () => {
  const link = getPortalLink();

  try {
    await navigator.clipboard.writeText(link);
    showMessage("Portal link copied.");
  } catch {
    window.prompt("Copy the portal link:", link);
  }
});

document.querySelector("#printPaperBackup").addEventListener("click", () => {
  updatePaperBackup();
  window.print();
});

document.querySelector("#deleteBackups").addEventListener("click", () => {
  deleteAllBackups();
  showMessage("Saved bracket backups deleted.");
});

document.querySelector("#saveOutShots").addEventListener("click", () => {
  saveOutShots();
  showMessage("Out shots saved.");
});

document.querySelector("#clearOutShots").addEventListener("click", () => {
  clearOutShots();
  showMessage("Out shot sheet cleared.");
});

outShotSheet.addEventListener("input", (event) => {
  preventDuplicateOutShotNumber(event.target);
  updateOutShotWinners();
  renderHighestOutRecord();
  renderMysteryOutWinner();
  saveOutShots();
});

rollDiceButton.addEventListener("click", () => {
  rollDice();
});

dieButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rollDie(Number(button.dataset.dieIndex));
  });
});

generateMysteryOutButton.addEventListener("click", () => {
  generateMysteryOut();
});

resetMysteryOutButton.addEventListener("click", () => {
  resetMysteryOut();
});

mysteryOutModeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (mysteryOut) {
      setMysteryOutMode(mysteryOut.mode);
    }
  });
});

[payoutTeams, payoutEntry, payoutAdded, payoutPlaces].forEach((input) => {
  input?.addEventListener("input", updatePayoutCalculator);
  input?.addEventListener("change", updatePayoutCalculator);
});

payoutPercentInputs?.addEventListener("input", (event) => {
  updatePayoutCalculator();
});

clearPayoutButton?.addEventListener("click", clearPayoutInputs);

addSplitPotEntryButton?.addEventListener("click", addSplitPotEntry);

splitPotTicketsInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addSplitPotEntry();
  }
});

drawSplitPotWinnerButton?.addEventListener("click", drawSplitPotWinner);

clearSplitPotWinnerButton?.addEventListener("click", () => {
  stopSplitPotDrawAnimation();
  splitPotWinner = null;
  saveSplitPot();
  renderSplitPot();
});

clearSplitPotEntriesButton?.addEventListener("click", () => {
  stopSplitPotDrawAnimation();
  splitPotEntries = [];
  splitPotWinner = null;
  saveSplitPot();
  renderSplitPot();
  showMessage("Split The Pot entries cleared.");
});

addBullseyeShootEntryButton?.addEventListener("click", addBullseyeShootEntry);

bullseyeShootTicketsInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addBullseyeShootEntry();
  }
});

drawBullseyeShootWinnerButton?.addEventListener("click", drawBullseyeShootWinner);

bullseyeShootCurrentPotInput?.addEventListener("input", () => {
  bullseyeShootCurrentPot = getBullseyeShootCurrentPot();
  saveBullseyeShoot();
  renderBullseyeShoot();
  queueBracketDraftSave();
});

bullseyeShootCurrentPotInput?.addEventListener("change", () => {
  bullseyeShootCurrentPot = getBullseyeShootCurrentPot();
  saveBullseyeShoot();
  renderBullseyeShoot();
  queueBracketDraftSave();
});

clearBullseyeShootWinnerButton?.addEventListener("click", () => {
  stopBullseyeShootDrawAnimation();
  bullseyeShootWinner = null;
  saveBullseyeShoot();
  renderBullseyeShoot();
});

clearBullseyeShootEntriesButton?.addEventListener("click", () => {
  stopBullseyeShootDrawAnimation();
  bullseyeShootEntries = [];
  bullseyeShootWinner = null;
  saveBullseyeShoot();
  renderBullseyeShoot();
  showMessage("Bullseye Shoot entries cleared.");
});

playerList.addEventListener("input", () => {
  syncPayoutTeams();
  updatePayoutCalculator();
});

document.querySelector("#generatePlayers").addEventListener("click", () => {
  const count = Number(totalPlayers.value);
  const groupSize = Number(playersPerGroup.value);

  if (hasGeneratedTeams) {
    blockedGenerateCount += 1;
    showTeamDrawWarning(`SHAME...SHAME...SHAME!!! Teams were already generated. This is blocked to prevent a redraw. Attempt ${blockedGenerateCount + 1}.`);
    showMessage("Teams were already generated. Use the existing draw.");
    return;
  }

  if (!Number.isInteger(count) || count < 2 || count > 200) {
    showMessage("Enter 2 to 200 players.");
    return;
  }

  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > count) {
    showMessage("Players per team must be at least 1 and no more than the player count.");
    return;
  }

  const players = Array.from({ length: count }, (_, index) => String(index + 1));
  const teams = chunk(shuffle(players), groupSize);
  savePlayerNameBackup(count);
  currentTeams = teams;
  hasGeneratedTeams = true;
  blockedGenerateCount = 0;
  hideTeamDrawWarning();
  renderTeams(currentTeams);
  syncPayoutTeams(teams.length);
  updatePayoutCalculator();
  showMessage(`Generated ${teams.length} random team${teams.length === 1 ? "" : "s"}.`);
});

// document.querySelector("#drawGroups").addEventListener("click", () => {
//   const groupSize = Number(playersPerGroup.value);
//   const count = Number(totalPlayers.value);
//
//   if (!Number.isInteger(count) || count < 2 || count > 64) {
//     showMessage("Enter 2 to 64 players.");
//     return;
//   }
//
//   if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > count) {
//     showMessage("Players per team must be at least 1 and no more than the player count.");
//     return;
//   }
//
//   const players = Array.from({ length: count }, (_, index) => String(index + 1));
//   currentTeams = chunk(shuffle(players), groupSize);
//   hasGeneratedTeams = true;
//   renderTeams(currentTeams);
//   showMessage(`Redrew ${currentTeams.length} random team${currentTeams.length === 1 ? "" : "s"}.`);
// });

document.querySelector("#buildBracket").addEventListener("click", async () => {
  const players = getPlayers();

  if (players.length < 2) {
    showMessage("Add at least 2 players to build a bracket.");
    return;
  }

  if (players.length > 100) {
    showMessage("Bracket supports up to 100 teams.");
    return;
  }

  const pdfGraphs = await loadPdfBracketGraphs();
  if (players.length >= 3 && players.length <= 24 && !pdfGraphs?.[players.length]) {
    showMessage("The learned PDF bracket graph could not be loaded. Try refreshing the page.");
    return;
  }

  state = createBracketGraph(players);
  renderBracket();
  queueActiveLodCodesRefresh();
  syncPdfLayoutToTeamCount(players.length);
  syncPayoutTeams(players.length);
  updatePayoutCalculator();
  showMessage(`Bracket built for ${players.length} player${players.length === 1 ? "" : "s"}.`);
});

document.querySelector("#resetBracket").addEventListener("click", () => {
  resetTournament();
});

bracketOutput.addEventListener("click", (event) => {
  const resetButton = event.target.closest("[data-reset-match]");

  if (resetButton) {
    saveBracketBackup({
      resetMatch: resetButton.dataset.resetMatch,
      selectedWinner: "",
    });
    if (state?.matchesById) {
      resetMatchResult(Number(resetButton.dataset.matchId));
    } else {
      resetMatchResultLegacy(
        resetButton.dataset.matchType,
        Number(resetButton.dataset.roundIndex),
        Number(resetButton.dataset.matchIndex),
      );
    }
    return;
  }

  const button = event.target.closest("[data-match-type]");

  if (!button) {
    return;
  }

  saveBracketBackup({
    matchId: Number(button.dataset.matchId),
    selectedWinner: button.dataset.player,
  });

  if (state?.matchesById) {
    chooseWinner(Number(button.dataset.matchId), button.dataset.player);
  } else {
    chooseWinnerLegacy(
      button.dataset.matchType,
      Number(button.dataset.roundIndex),
      Number(button.dataset.matchIndex),
      button.dataset.player,
    );
  }
  queueActiveLodCodesRefresh();
});

bracketOutput.addEventListener("change", (event) => {
  const boardSelect = event.target.closest("[data-board-assignment]");

  if (!boardSelect || !state?.matchesById) {
    return;
  }

  const matchId = Number(boardSelect.dataset.matchId);
  const match = state.matchesById[matchId];
  if (!match) {
    return;
  }

  match.boardAssignment = boardSelect.value ? Number(boardSelect.value) : null;
  saveBracketBackup({
    matchId,
    boardAssignment: match.boardAssignment,
  });
  renderBracket();
  queueActiveLodCodesRefresh();
});

backupList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-backup-id]");

  if (deleteButton) {
    deleteBackup(deleteButton.dataset.deleteBackupId);
    showMessage("Backup deleted.");
    return;
  }

  const button = event.target.closest("[data-backup-id]");

  if (!button) {
    return;
  }

  const backup = readBackup(button.dataset.backupId);

  if (!backup) {
    showMessage("That backup could not be loaded.");
    renderBackups();
    return;
  }

  state = backup.state;
  if (state.mode === "graph") {
    rebuildGraphMatchIndex(state);
    refreshGraphSources(state);
  } else {
    refreshGameNumbersAndSources(state);
  }
  renderBracket();
  queueActiveLodCodesRefresh();
  showMessage(`Restored backup from ${formatBackupTime(backup.createdAt)}.`);
});

nameBackupList.addEventListener("click", (event) => {
  const mergeButton = event.target.closest("[data-merge-name-backup-id]");

  if (mergeButton) {
    mergePlayerNameBackup(mergeButton.dataset.mergeNameBackupId);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-name-backup-id]");

  if (deleteButton) {
    deletePlayerNameBackup(deleteButton.dataset.deleteNameBackupId);
    showMessage("Player name backup deleted.");
  }
});

function getPlayers() {
  return playerList.value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function renderTeams(teams) {
  playerList.value = "";
  groupsOutput.innerHTML = "";
  playerList.value = teams.map(formatTeam).join("\n");
  renderGroups(teams);
  syncPdfLayoutToTeamCount(teams.length);
  syncPayoutTeams(teams.length);
  updatePayoutCalculator();
  queueBracketDraftSave();
}

function syncPayoutTeams(teamCount = getPlayers().length) {
  if (!payoutTeams) {
    return;
  }

  payoutTeams.value = String(teamCount || 0);
}

function syncPayoutTeamsFromPlayerCount() {
  const playerCount = Math.max(0, Number(totalPlayers.value) || 0);
  const groupSize = Math.max(1, Number(playersPerGroup.value) || 1);
  syncPayoutTeams(Math.ceil(playerCount / groupSize));
}

function clearPayoutInputs() {
  if (payoutEntry) {
    payoutEntry.value = "";
  }
  if (payoutAdded) {
    payoutAdded.value = "";
  }
  if (payoutPlaces) {
    payoutPlaces.value = "auto";
  }
  if (payoutPercentInputs) {
    payoutPercentInputs.dataset.placeCount = "";
  }
  updatePayoutCalculator();
}

function updatePayoutCalculator() {
  if (!payoutSummary || !payoutResults) {
    return;
  }

  const teams = Math.max(0, Number(payoutTeams?.value) || 0);
  const entry = Math.max(0, Number(payoutEntry?.value) || 0);
  const added = Math.max(0, Number(payoutAdded?.value) || 0);
  const pot = teams * entry + added;
  const placeCount = getPaidPlaces(teams, payoutPlaces?.value || "auto");
  renderPayoutPercentInputs(placeCount);
  const customSplit = getCustomPayoutSplit(placeCount);
  const split = customSplit || getPayoutSplit(teams, payoutPlaces?.value || "auto");

  payoutSummary.innerHTML = `
    <div>
      <span>Total pot</span>
      <strong>${formatMoney(pot)}</strong>
    </div>
    <div>
      <span>Teams</span>
      <strong>${teams}</strong>
    </div>
  `;

  if (!teams || !pot) {
    payoutResults.innerHTML = `<p class="payout-empty">Enter teams and entry money to calculate payouts.</p>`;
    return;
  }

  const splitTotal = split.reduce((sum, percent) => sum + percent, 0);
  const shouldBalanceToPot = Math.abs(splitTotal - 1) <= 0.0005;
  const amounts = shouldBalanceToPot
    ? getBalancedPayoutAmounts(pot, split)
    : split.map((percent) => Math.round(pot * percent));

  payoutResults.innerHTML = split.map((percent, index) => {
    const amount = amounts[index];
    const displayedAmount = amount;
    const displayedPercent = percent * 100;
    const halfAmount = amount / 2;
    return `
      <div class="payout-row">
        <span>${formatPlace(index + 1)}</span>
        <strong>${formatMoneyExact(displayedAmount)}</strong>
        <small>Per team half ${formatMoneyExact(halfAmount)}</small>
        <small>${formatPercentValue(displayedPercent)}%</small>
      </div>
    `;
  }).join("");
}

function getBalancedPayoutAmounts(pot, split) {
  const roundedPot = Math.round(pot);
  const amounts = split.map((percent) => Math.floor(pot * percent));
  const allocated = amounts.reduce((sum, amount) => sum + amount, 0);
  amounts[0] += roundedPot - allocated;
  return amounts;
}

function getPayoutSplit(teamCount, placeSetting) {
  const places = getPaidPlaces(teamCount, placeSetting);

  return getPayoutSplitByPlaces(places);
}

function getPaidPlaces(teamCount, placeSetting) {
  const places = placeSetting === "auto" ? getAutoPaidPlaces(teamCount) : Number(placeSetting);
  return Math.max(1, Math.min(8, Number.isFinite(places) ? places : 1));
}

function getPayoutSplitByPlaces(places) {
  if (places >= 8) {
    return [0.36, 0.21, 0.15, 0.1, 0.07, 0.05, 0.03, 0.03];
  }
  if (places === 7) {
    return [0.38, 0.22, 0.15, 0.1, 0.07, 0.05, 0.03];
  }
  if (places === 6) {
    return [0.43, 0.23, 0.13, 0.09, 0.06, 0.06];
  }
  if (places === 5) {
    return [0.46, 0.25, 0.14, 0.09, 0.06];
  }
  if (places >= 4) {
    return [0.5, 0.25, 0.15, 0.1];
  }
  if (places === 3) {
    return [0.5, 0.3, 0.2];
  }
  if (places === 2) {
    return [0.7, 0.3];
  }
  return [1];
}

function getAutoPaidPlaces(teamCount) {
  if (teamCount >= 48) {
    return 8;
  }
  if (teamCount >= 24) {
    return 6;
  }
  if (teamCount >= 10) {
    return 4;
  }
  if (teamCount >= 4) {
    return 3;
  }
  return 2;
}

function renderPayoutPercentInputs(placeCount) {
  if (!payoutPercentInputs) {
    return;
  }

  const currentCount = Number(payoutPercentInputs.dataset.placeCount) || 0;
  if (currentCount === placeCount) {
    return;
  }

  const defaultSplit = getPayoutSplitByPlaces(placeCount);
  payoutPercentInputs.dataset.placeCount = String(placeCount);
  payoutPercentInputs.innerHTML = defaultSplit.map((percent, index) => `
    <label>
      ${formatPlace(index + 1)}
      <input
        type="number"
        inputmode="decimal"
        min="0"
        max="100"
        step="0.1"
        value="${formatPercentValue(percent * 100)}"
        data-payout-index="${index}"
        data-payout-percent
      >
    </label>
  `).join("");
}

function getCustomPayoutSplit(placeCount) {
  const inputs = Array.from(document.querySelectorAll("[data-payout-percent]"));
  if (!inputs.length || inputs.length !== placeCount) {
    setPayoutPercentStatus("Using automatic split");
    return null;
  }

  const values = inputs.map((input) => Math.max(0, Number(input.value) || 0));
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!total) {
    setPayoutPercentStatus("Using automatic split");
    return null;
  }

  setPayoutPercentStatus(
    Math.abs(total - 100) <= 0.05
      ? "Using custom split"
      : `Using custom split. Current total: ${formatPercentValue(total)}%`
  );
  return values.map((value) => value / total);
}

function setPayoutPercentStatus(text) {
  if (payoutPercentStatus) {
    payoutPercentStatus.textContent = text;
  }
}

function formatPercentValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function formatPlace(place) {
  return `${place}${place === 1 ? "st" : place === 2 ? "nd" : place === 3 ? "rd" : "th"} place`;
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatMoneyExact(value) {
  const amount = Number(value) || 0;
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function getSplitPotPrizeAmount() {
  const ticketRows = getSplitPotEntryRows();
  const pot = ticketRows.reduce((sum, row) => sum + row.amountPaid, 0);
  return pot / 2;
}

function formatPayoutAmount(value) {
  const amount = Math.max(0, Number(value) || 0);
  const rounded = Math.round(amount * 100) / 100;
  if (Number.isInteger(rounded)) {
    return `$${rounded.toLocaleString()}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

function startTicketDrawAnimation({ tickets, durationMs, onFrame, onComplete }) {
  if (!tickets.length) {
    return null;
  }

  const state = {
    active: true,
    ticket: null,
    timerId: null,
    durationMs,
  };
  const startAt = performance.now();

  const step = () => {
    if (!state.active) {
      return;
    }

    const elapsed = performance.now() - startAt;
    const progress = Math.min(1, elapsed / durationMs);
    const ticket = tickets[getRandomIndex(tickets.length)];
    state.ticket = ticket;
    onFrame(ticket, progress);

    if (progress >= 1) {
      const finalTicket = tickets[getRandomIndex(tickets.length)];
      state.ticket = finalTicket;
      onFrame(finalTicket, 1);
      state.active = false;
      state.timerId = null;
      onComplete(finalTicket);
      return;
    }

    const nextDelay = getTicketDrawDelay(progress);
    state.timerId = window.setTimeout(step, nextDelay);
  };

  state.timerId = window.setTimeout(step, 0);
  return state;
}

function startMysteryOutDrawAnimation({ values, durationMs, onFrame, onComplete }) {
  if (!values.length) {
    return null;
  }

  const rollValues = shuffleValues(values);
  const state = {
    active: true,
    value: null,
    index: 0,
    timerId: null,
    durationMs,
  };
  const startAt = performance.now();

  const step = () => {
    if (!state.active) {
      return;
    }

    const elapsed = performance.now() - startAt;
    const progress = Math.min(1, elapsed / durationMs);
    const value = rollValues[state.index % rollValues.length];
    state.value = value;
    state.index += 1;
    onFrame(value, progress);

    if (progress >= 1) {
      const finalValue = rollValues[getRandomIndex(rollValues.length)];
      state.value = finalValue;
      onFrame(finalValue, 1);
      state.active = false;
      state.timerId = null;
      onComplete(finalValue);
      return;
    }

    state.timerId = window.setTimeout(step, getTicketDrawDelay(progress));
  };

  state.timerId = window.setTimeout(step, 0);
  return state;
}

function shuffleValues(values) {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function pickRollingValue(values, previousValue) {
  if (!values.length) {
    return null;
  }

  if (values.length === 1) {
    return values[0];
  }

  let nextValue = values[getRandomIndex(values.length)];
  let attempts = 0;
  while (nextValue === previousValue && attempts < 8) {
    nextValue = values[getRandomIndex(values.length)];
    attempts += 1;
  }

  return nextValue;
}

function getTicketDrawDelay(progress) {
  const t = Math.max(0, Math.min(1, Number(progress) || 0));

  if (t < 0.2) {
    return Math.round(420 - (t / 0.2) * 220);
  }

  if (t < 0.72) {
    const mid = (t - 0.2) / 0.52;
    return Math.round(200 - (mid * 120));
  }

  if (t < 0.88) {
    const tail = (t - 0.72) / 0.16;
    return Math.round(80 + (tail * 180));
  }

  if (t < 0.96) {
    const finalStretch = (t - 0.88) / 0.08;
    return Math.round(260 + (finalStretch * 360));
  }

  const lastTicket = Math.min(1, (t - 0.96) / 0.04);
  return Math.round(620 + (lastTicket * 580));
}

function stopSplitPotDrawAnimation() {
  if (splitPotDrawAnimation?.timerId) {
    clearTimeout(splitPotDrawAnimation.timerId);
  }
  splitPotDrawAnimation = null;
}

function stopBullseyeShootDrawAnimation() {
  if (bullseyeShootDrawAnimation?.timerId) {
    clearTimeout(bullseyeShootDrawAnimation.timerId);
  }
  bullseyeShootDrawAnimation = null;
}

function stopMysteryOutDrawAnimation() {
  if (mysteryOutDrawAnimation?.timerId) {
    clearTimeout(mysteryOutDrawAnimation.timerId);
  }
  mysteryOutDrawAnimation = null;
}

function addSplitPotEntry() {
  const name = String(splitPotNameInput?.value || "").trim();
  const amountPaid = Math.floor(Number(splitPotTicketsInput?.value) || 0);
  const ticketCount = getSplitPotTicketsForAmount(amountPaid);

  if (!name) {
    showMessage("Enter a Split The Pot name.");
    splitPotNameInput?.focus();
    return;
  }

  if (!Number.isInteger(amountPaid) || amountPaid < 1) {
    showMessage("Choose at least $1 for Split The Pot.");
    splitPotTicketsInput?.focus();
    return;
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    amountPaid,
    ticketCount,
    createdAt: new Date().toISOString(),
  };
  splitPotEntries.push(entry);
  splitPotWinner = null;
  saveSplitPot();
  renderSplitPot();
  const didSendNotice = sendSplitPotPortalNotice();

  if (splitPotNameInput) {
    splitPotNameInput.value = "";
    splitPotNameInput.focus();
  }
  if (splitPotTicketsInput) {
    splitPotTicketsInput.value = "0";
  }

  showMessage(`${formatMoney(amountPaid)} added for ${name}: ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}.${didSendNotice ? " Player portal message sent." : " Set an LOD code to send player portal messages."}`);
}

function drawSplitPotWinner() {
  const tickets = getSplitPotTickets();

  if (!tickets.length) {
    showMessage("Add Split The Pot tickets before drawing.");
    return;
  }

  stopSplitPotDrawAnimation();
  splitPotDrawAnimation = startTicketDrawAnimation({
    tickets,
    durationMs: 20000,
    onFrame: (ticket) => {
      if (splitPotDrawAnimation) {
        splitPotDrawAnimation.ticket = ticket;
        splitPotDrawAnimation.active = true;
      }
      renderSplitPotWinnerDisplay();
    },
    onComplete: (winnerTicket) => {
      if (splitPotDrawAnimation) {
        splitPotDrawAnimation.active = false;
      }
      stopSplitPotDrawAnimation();
      splitPotWinner = {
        ...winnerTicket,
        drawnAt: new Date().toISOString(),
      };
      saveSplitPot();
      renderSplitPot();
      const didSendNotice = sendSplitPotPortalNotice({ winner: winnerTicket });
      showMessage(`Split The Pot winner: ${winnerTicket.name}, ticket ${winnerTicket.ticketLabel}.${didSendNotice ? " Player portal message sent." : " Set an LOD code to send player portal messages."}`);
    },
  });
}

function addBullseyeShootEntry() {
  const name = String(bullseyeShootNameInput?.value || "").trim();
  const amountPaid = Math.floor(Number(bullseyeShootTicketsInput?.value) || 0);
  const ticketCount = getSplitPotTicketsForAmount(amountPaid);

  if (!name) {
    showMessage("Enter a Bullseye Shoot name.");
    bullseyeShootNameInput?.focus();
    return;
  }

  if (!Number.isInteger(amountPaid) || amountPaid < 1) {
    showMessage("Choose at least $1 for Bullseye Shoot.");
    bullseyeShootTicketsInput?.focus();
    return;
  }

  bullseyeShootEntries.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    amountPaid,
    ticketCount,
    createdAt: new Date().toISOString(),
  });
  bullseyeShootWinner = null;
  saveBullseyeShoot();
  renderBullseyeShoot();
  const didSendNotice = sendBullseyeShootPortalNotice();

  if (bullseyeShootNameInput) {
    bullseyeShootNameInput.value = "";
    bullseyeShootNameInput.focus();
  }
  if (bullseyeShootTicketsInput) {
    bullseyeShootTicketsInput.value = "0";
  }

  showMessage(`${formatMoney(amountPaid)} added for ${name}: ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}.${didSendNotice ? " Player portal message sent." : " Set an LOD code to send player portal messages."}`);
}

function drawBullseyeShootWinner() {
  const tickets = getBullseyeShootTickets();

  if (!tickets.length) {
    showMessage("Add Bullseye Shoot tickets before drawing.");
    return;
  }

  stopBullseyeShootDrawAnimation();
  bullseyeShootDrawAnimation = startTicketDrawAnimation({
    tickets,
    durationMs: 20000,
    onFrame: (ticket) => {
      if (bullseyeShootDrawAnimation) {
        bullseyeShootDrawAnimation.ticket = ticket;
        bullseyeShootDrawAnimation.active = true;
      }
      renderBullseyeShootWinnerDisplay();
    },
    onComplete: (winnerTicket) => {
      if (bullseyeShootDrawAnimation) {
        bullseyeShootDrawAnimation.active = false;
      }
      stopBullseyeShootDrawAnimation();
      bullseyeShootWinner = {
        ...winnerTicket,
        drawnAt: new Date().toISOString(),
      };
      saveBullseyeShoot();
      renderBullseyeShoot();
      const didSendNotice = sendBullseyeShootPortalNotice({ winner: winnerTicket });
      showMessage(`Bullseye Shoot winner: ${winnerTicket.name}, ticket ${winnerTicket.ticketLabel}.${didSendNotice ? " Player portal message sent." : " Set an LOD code to send player portal messages."}`);
    },
  });
}

function renderSplitPot() {
  if (!splitPotSummary || !splitPotEntriesOutput || !splitPotWinnerOutput) {
    return;
  }

  const ticketRows = getSplitPotEntryRows();
  const ticketTotal = ticketRows.reduce((sum, row) => sum + row.ticketCount, 0);
  const pot = ticketRows.reduce((sum, row) => sum + row.amountPaid, 0);

  splitPotSummary.innerHTML = `
    <div>
      <span>Tickets sold</span>
      <strong>${ticketTotal}</strong>
    </div>
    <div>
      <span>Total pot</span>
      <strong>${formatMoney(pot)}</strong>
    </div>
    <div>
      <span>Next ticket</span>
      <strong>${formatTicketNumber(splitPotFirstTicketNumber + ticketTotal)}</strong>
    </div>
  `;

  if (!ticketRows.length) {
    splitPotEntriesOutput.innerHTML = `<p class="split-pot-empty">No Split The Pot tickets entered yet.</p>`;
  } else {
    splitPotEntriesOutput.innerHTML = ticketRows.map((row) => `
      <article class="split-pot-entry">
        <div class="split-pot-entry-heading">
          <div>
            <strong>${escapeHtml(row.name)}</strong>
            <span>${formatMoney(row.amountPaid)} • ${row.ticketCount} ticket${row.ticketCount === 1 ? "" : "s"}</span>
          </div>
          <button class="danger" type="button" data-split-pot-delete="${escapeAttribute(row.id)}">Delete</button>
        </div>
        <div class="split-pot-ticket-list" aria-label="Tickets for ${escapeAttribute(row.name)}">
          <code>${escapeHtml(formatSplitPotTicketRange(row))}</code>
        </div>
      </article>
    `).join("");
  }

  renderSplitPotWinnerDisplay();
}

function renderBullseyeShoot() {
  if (!bullseyeShootSummary || !bullseyeShootEntriesOutput || !bullseyeShootWinnerOutput) {
    return;
  }

  const ticketRows = getBullseyeShootEntryRows();
  const ticketTotal = ticketRows.reduce((sum, row) => sum + row.ticketCount, 0);
  const ticketSales = ticketRows.reduce((sum, row) => sum + row.amountPaid, 0);
  const currentPot = getBullseyeShootCurrentPot();
  const pot = currentPot + ticketSales;

  bullseyeShootSummary.innerHTML = `
    <div>
      <span>Tickets sold</span>
      <strong>${ticketTotal}</strong>
    </div>
    <div>
      <span>Ticket sales</span>
      <strong>${formatMoney(ticketSales)}</strong>
    </div>
    <div>
      <span>Total pot</span>
      <strong>${formatMoney(pot)}</strong>
    </div>
    <div>
      <span>Next ticket</span>
      <strong>${formatTicketNumber(splitPotFirstTicketNumber + ticketTotal)}</strong>
    </div>
  `;

  if (!ticketRows.length) {
    bullseyeShootEntriesOutput.innerHTML = `<p class="split-pot-empty">No Bullseye Shoot tickets entered yet.</p>`;
  } else {
    bullseyeShootEntriesOutput.innerHTML = ticketRows.map((row) => `
      <article class="split-pot-entry">
        <div class="split-pot-entry-heading">
          <div>
            <strong>${escapeHtml(row.name)}</strong>
            <span>${formatMoney(row.amountPaid)} • ${row.ticketCount} ticket${row.ticketCount === 1 ? "" : "s"}</span>
          </div>
          <button class="danger" type="button" data-bullseye-shoot-delete="${escapeAttribute(row.id)}">Delete</button>
        </div>
        <div class="split-pot-ticket-list" aria-label="Tickets for ${escapeAttribute(row.name)}">
          <code>${escapeHtml(formatSplitPotTicketRange(row))}</code>
        </div>
      </article>
    `).join("");
  }

  renderBullseyeShootWinnerDisplay();
}

function renderSplitPotWinnerDisplay() {
  if (!splitPotWinnerOutput) {
    return;
  }

  const animationTicket = splitPotDrawAnimation?.active ? splitPotDrawAnimation.ticket : null;
  if (animationTicket) {
    splitPotWinnerOutput.className = "split-pot-winner rolling";
    splitPotWinnerOutput.innerHTML = `
      <span>Drawing winner</span>
      <strong>${escapeHtml(animationTicket.ticketLabel)}</strong>
      <b>${escapeHtml(animationTicket.name)}</b>
    `;
    return;
  }

  if (!splitPotWinner) {
    splitPotWinnerOutput.className = "split-pot-winner empty";
    splitPotWinnerOutput.textContent = "No winner drawn.";
    return;
  }

  splitPotWinnerOutput.className = "split-pot-winner";
  const prizeAmount = getSplitPotPrizeAmount();
  splitPotWinnerOutput.innerHTML = `
    <span>Winning ticket</span>
    <strong>${escapeHtml(splitPotWinner.ticketLabel)}</strong>
    <b>${escapeHtml(splitPotWinner.name)} wins ${escapeHtml(formatPayoutAmount(prizeAmount))}</b>
  `;
}

function renderBullseyeShootWinnerDisplay() {
  if (!bullseyeShootWinnerOutput) {
    return;
  }

  const animationTicket = bullseyeShootDrawAnimation?.active ? bullseyeShootDrawAnimation.ticket : null;
  if (animationTicket) {
    bullseyeShootWinnerOutput.className = "split-pot-winner rolling";
    bullseyeShootWinnerOutput.innerHTML = `
      <span>Drawing winner</span>
      <strong>${escapeHtml(animationTicket.ticketLabel)}</strong>
      <b>${escapeHtml(animationTicket.name)}</b>
    `;
    return;
  }

  if (!bullseyeShootWinner) {
    bullseyeShootWinnerOutput.className = "split-pot-winner empty";
    bullseyeShootWinnerOutput.textContent = "No winner drawn.";
    return;
  }

  bullseyeShootWinnerOutput.className = "split-pot-winner";
  bullseyeShootWinnerOutput.innerHTML = `
    <span>Winning ticket</span>
    <strong>${escapeHtml(bullseyeShootWinner.ticketLabel)}</strong>
    <b>${escapeHtml(bullseyeShootWinner.name)}</b>
  `;
}

function getSplitPotEntryRows() {
  let nextTicketNumber = splitPotFirstTicketNumber;

  return splitPotEntries.map((entry) => {
    const amountPaid = Math.max(0, Math.floor(Number(entry.amountPaid ?? calculateSplitPotAmount(entry.ticketCount)) || 0));
    const ticketCount = getSplitPotTicketsForAmount(amountPaid);
    const tickets = Array.from({ length: ticketCount }, (_, index) => {
      const ticketNumber = nextTicketNumber + index;
      return {
        entryId: entry.id,
        name: entry.name,
        ticketNumber,
        ticketLabel: formatTicketNumber(ticketNumber),
      };
    });
    nextTicketNumber += ticketCount;

    return {
      ...entry,
      amountPaid,
      ticketCount,
      tickets,
    };
  }).filter((entry) => entry.ticketCount > 0);
}

function getSplitPotTickets() {
  return getSplitPotEntryRows().flatMap((entry) => entry.tickets);
}

function getBullseyeShootEntryRows() {
  let nextTicketNumber = splitPotFirstTicketNumber;

  return bullseyeShootEntries.map((entry) => {
    const amountPaid = Math.max(0, Math.floor(Number(entry.amountPaid ?? calculateSplitPotAmount(entry.ticketCount)) || 0));
    const ticketCount = getSplitPotTicketsForAmount(amountPaid);
    const tickets = Array.from({ length: ticketCount }, (_, index) => {
      const ticketNumber = nextTicketNumber + index;
      return {
        entryId: entry.id,
        name: entry.name,
        ticketNumber,
        ticketLabel: formatTicketNumber(ticketNumber),
      };
    });
    nextTicketNumber += ticketCount;

    return {
      ...entry,
      amountPaid,
      ticketCount,
      tickets,
    };
  }).filter((entry) => entry.ticketCount > 0);
}

function getBullseyeShootTickets() {
  return getBullseyeShootEntryRows().flatMap((entry) => entry.tickets);
}

function getBullseyeShootCurrentPot() {
  return Math.max(0, Math.floor(Number(bullseyeShootCurrentPotInput?.value ?? bullseyeShootCurrentPot) || 0));
}

function sendSplitPotPortalNotice({ winner = null } = {}) {
  const rows = getSplitPotEntryRows();
  if (!rows.length) {
    return false;
  }

  const ticketTotal = rows.reduce((sum, entry) => sum + entry.ticketCount, 0);
  const pot = rows.reduce((sum, entry) => sum + entry.amountPaid, 0);
  const prizeAmount = pot / 2;
  const ticketList = rows.map((entry) => {
    const ticketLabel = entry.ticketCount === 1 ? "ticket" : "tickets";
    return `${entry.name}: ${formatSplitPotTicketRange(entry)} (${entry.ticketCount} ${ticketLabel}, ${formatMoney(entry.amountPaid)})`;
  });
  const message = [
    winner
      ? `Split The Pot winner - ${winner.name} - ${winner.ticketLabel} -wins ${formatPayoutAmount(prizeAmount)}`
      : `Split The Pot Tickets - Pot ${formatMoney(pot)} - ${ticketTotal} ticket${ticketTotal === 1 ? "" : "s"}`,
    ...(winner ? [`Pot ${formatMoney(pot)} - ${ticketTotal} ticket${ticketTotal === 1 ? "" : "s"}`] : []),
    ...ticketList,
  ].join("\n");
  return setAutomatedPortalNotice(message);
}

function sendBullseyeShootPortalNotice({ winner = null } = {}) {
  const rows = getBullseyeShootEntryRows();
  if (!rows.length) {
    return false;
  }

  const ticketTotal = rows.reduce((sum, entry) => sum + entry.ticketCount, 0);
  const pot = getBullseyeShootCurrentPot() + rows.reduce((sum, entry) => sum + entry.amountPaid, 0);
  const ticketList = rows.map((entry) => {
    const ticketLabel = entry.ticketCount === 1 ? "ticket" : "tickets";
    return `${entry.name}: ${formatSplitPotTicketRange(entry)} (${entry.ticketCount} ${ticketLabel}, ${formatMoney(entry.amountPaid)})`;
  });
  const message = [
    winner
      ? `Bullshoot winner - ${winner.name} - ${winner.ticketLabel}`
      : `Bullseye Shoot Tickets - Pot ${formatMoney(pot)} - ${ticketTotal} ticket${ticketTotal === 1 ? "" : "s"}`,
    ...(winner ? [`Pot ${formatMoney(pot)} - ${ticketTotal} ticket${ticketTotal === 1 ? "" : "s"}`] : []),
    ...ticketList,
  ].join("\n");
  return setBullshootPortalNotice(message);
}

function setAutomatedPortalNotice(message) {
  const text = String(message || "").trim();
  portalAutoNotice = text;
  portalAutoNoticeAt = text ? new Date().toISOString() : "";
  if (portalAutoNoticeInput) {
    portalAutoNoticeInput.innerHTML = renderAdminNoticeMarkup(text, /^Split The Pot winner\b/i);
  }
  const didPublish = savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
  const stamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (portalAutoNoticeStatus) {
    portalAutoNoticeStatus.textContent = text
      ? (didPublish ? `Split The Pot message sent at ${stamp}.` : `Split The Pot message ready at ${stamp}; set an LOD code to publish.`)
      : "";
  }
  return didPublish;
}

function setBullshootPortalNotice(message) {
  const text = String(message || "").trim();
  portalBullshootNotice = text;
  portalBullshootNoticeAt = text ? new Date().toISOString() : "";
  if (portalBullshootNoticeInput) {
    portalBullshootNoticeInput.innerHTML = renderAdminNoticeMarkup(text, /^Bullshoot winner\b/i);
  }
  const didPublish = savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
  const stamp = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (portalBullshootNoticeStatus) {
    portalBullshootNoticeStatus.textContent = text
      ? (didPublish ? `Bullshoot message sent at ${stamp}.` : `Bullshoot message ready at ${stamp}; set an LOD code to publish.`)
      : "";
  }
  return didPublish;
}

function renderAdminNoticeMarkup(text, winnerPattern) {
  const value = String(text || "").trim();
  if (!value) {
    return "";
  }

  const lines = value.split("\n");
  if (!winnerPattern.test(lines[0] || "")) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  const [firstLine, ...rest] = lines;
  const winnerLine = `<span class="winner-line">${escapeHtml(firstLine)}</span>`;
  const remainder = rest.length ? `<br>${escapeHtml(rest.join("\n")).replace(/\n/g, "<br>")}` : "";
  return `${winnerLine}${remainder}`;
}

function sendBracketLegWinnerPortalNotice(match, winnerName) {
  if (!match || !winnerName || !state || state.mode !== "graph") {
    return false;
  }

  const winnerLine = `Bracket leg winner: ${formatMatchTitle(match)} - ${winnerName}`;
  return setAutomatedPortalNotice(winnerLine);
}

function formatSplitPotTicketRange(row) {
  if (!row?.tickets?.length) {
    return "";
  }

  return `${row.tickets[0].ticketLabel} - ${row.tickets[row.tickets.length - 1].ticketLabel}`;
}

function calculateSplitPotAmount(ticketCount) {
  const count = Math.max(0, Math.floor(Number(ticketCount) || 0));
  return Math.floor(count / 6) * 5 + (count % 6);
}

function getSplitPotTicketsForAmount(amountPaid) {
  const dollars = Math.max(0, Math.min(splitPotMaxPurchaseAmount, Math.floor(Number(amountPaid) || 0)));
  return dollars < 5 ? dollars : Math.floor(dollars / 5) * 6;
}

function renderSplitPotPurchaseOptions() {
  if (splitPotTicketsInput) {
    splitPotTicketsInput.title = buildPurchaseReferenceText();
  }
}

function renderBullseyeShootPurchaseOptions() {
  if (bullseyeShootTicketsInput) {
    bullseyeShootTicketsInput.title = buildPurchaseReferenceText();
  }
}

function buildPurchaseReferenceText() {
  const refs = [
    ...Array.from({ length: 4 }, (_, index) => {
      const amount = index + 1;
      const ticketCount = getSplitPotTicketsForAmount(amount);
      return `${formatMoney(amount)} = ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}`;
    }),
    ...Array.from({ length: splitPotMaxPurchaseAmount / 5 }, (_, index) => {
      const amount = (index + 1) * 5;
      const ticketCount = getSplitPotTicketsForAmount(amount);
      return `${formatMoney(amount)} = ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}`;
    }),
  ];

  return `Reference: ${refs.join(", ")}`;
}

function formatTicketNumber(number) {
  return String(Math.max(0, Number(number) || 0)).padStart(6, "0");
}

function getRandomIndex(length) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }

  return Math.floor(Math.random() * length);
}

function saveSplitPot() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(splitPotStorageKey, JSON.stringify({
      version: 1,
      entries: splitPotEntries,
      winner: splitPotWinner,
    }));
  } catch {
    showMessage("Split The Pot could not be saved in this browser.");
  }
}

function loadSplitPot() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const data = JSON.parse(localStorage.getItem(splitPotStorageKey) || "null");
    if (!data || typeof data !== "object") {
      return;
    }

    splitPotEntries = Array.isArray(data.entries)
      ? data.entries.map((entry) => ({
        id: String(entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        name: String(entry.name || "").trim(),
        amountPaid: Math.max(0, Math.floor(Number(entry.amountPaid ?? calculateSplitPotAmount(entry.ticketCount)) || 0)),
        ticketCount: Math.max(0, Math.floor(Number(entry.ticketCount) || 0)),
        createdAt: String(entry.createdAt || ""),
      })).filter((entry) => entry.name && entry.amountPaid > 0)
      : [];
    splitPotWinner = data.winner && typeof data.winner === "object" ? data.winner : null;
  } catch {
    splitPotEntries = [];
    splitPotWinner = null;
  }
}

function saveBullseyeShoot() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(bullseyeShootStorageKey, JSON.stringify({
      version: 1,
      currentPot: getBullseyeShootCurrentPot(),
      entries: bullseyeShootEntries,
      winner: bullseyeShootWinner,
    }));
  } catch {
    showMessage("Bullseye Shoot could not be saved in this browser.");
  }
}

function loadBullseyeShoot() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const data = JSON.parse(localStorage.getItem(bullseyeShootStorageKey) || "null");
    if (!data || typeof data !== "object") {
      return;
    }

    bullseyeShootCurrentPot = Math.max(0, Math.floor(Number(data.currentPot ?? data.currentPotAmount ?? 0) || 0));
    bullseyeShootEntries = Array.isArray(data.entries)
      ? data.entries.map((entry) => ({
        id: String(entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        name: String(entry.name || "").trim(),
        amountPaid: Math.max(0, Math.floor(Number(entry.amountPaid ?? calculateSplitPotAmount(entry.ticketCount)) || 0)),
        ticketCount: Math.max(0, Math.floor(Number(entry.ticketCount) || 0)),
        createdAt: String(entry.createdAt || ""),
      })).filter((entry) => entry.name && entry.amountPaid > 0)
      : [];
    bullseyeShootWinner = data.winner && typeof data.winner === "object" ? data.winner : null;
    if (bullseyeShootCurrentPotInput) {
      bullseyeShootCurrentPotInput.value = String(bullseyeShootCurrentPot);
    }
  } catch {
    bullseyeShootCurrentPot = 0;
    bullseyeShootEntries = [];
    bullseyeShootWinner = null;
    if (bullseyeShootCurrentPotInput) {
      bullseyeShootCurrentPotInput.value = "0";
    }
  }
}

splitPotEntriesOutput?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-split-pot-delete]");
  if (!deleteButton) {
    return;
  }

  splitPotEntries = splitPotEntries.filter((entry) => entry.id !== deleteButton.dataset.splitPotDelete);
  stopSplitPotDrawAnimation();
  splitPotWinner = null;
  saveSplitPot();
  renderSplitPot();
  showMessage("Split The Pot entry deleted.");
});

bullseyeShootEntriesOutput?.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-bullseye-shoot-delete]");
  if (!deleteButton) {
    return;
  }

  bullseyeShootEntries = bullseyeShootEntries.filter((entry) => entry.id !== deleteButton.dataset.bullseyeShootDelete);
  stopBullseyeShootDrawAnimation();
  bullseyeShootWinner = null;
  saveBullseyeShoot();
  renderBullseyeShoot();
  showMessage("Bullseye Shoot entry deleted.");
});

function showTeamDrawWarning(text) {
  teamDrawWarning.hidden = false;
  teamDrawWarning.textContent = text;
}

function hideTeamDrawWarning() {
  teamDrawWarning.hidden = true;
  teamDrawWarning.textContent = "";
}

function resetTournament() {
  stopSplitPotDrawAnimation();
  stopBullseyeShootDrawAnimation();
  clearTournamentState({ preserveLodCode: false, clearDraft: true, code: lodCode });

  if (totalPlayers) {
    totalPlayers.value = "0";
  }
  if (playersPerGroup) {
    playersPerGroup.value = "2";
  }
  renderNameInputs(0);

  clearPayoutInputs();
  if (payoutTeams) {
    payoutTeams.value = "0";
  }
  updatePayoutCalculator();

  if (pdfLayoutSelect) {
    pdfLayoutSelect.value = "8";
    renderPdfColumnMirror(8);
  }

  setDieValue(0, 1);
  setDieValue(1, 1);

  splitPotEntries = [];
  splitPotWinner = null;
  if (splitPotNameInput) {
    splitPotNameInput.value = "";
  }
  if (splitPotTicketsInput) {
    splitPotTicketsInput.value = "0";
  }
  saveSplitPot();
  renderSplitPot();

  bullseyeShootEntries = [];
  bullseyeShootWinner = null;
  bullseyeShootCurrentPot = 0;
  if (bullseyeShootNameInput) {
    bullseyeShootNameInput.value = "";
  }
  if (bullseyeShootTicketsInput) {
    bullseyeShootTicketsInput.value = "0";
  }
  if (bullseyeShootCurrentPotInput) {
    bullseyeShootCurrentPotInput.value = "0";
  }
  saveBullseyeShoot();
  renderBullseyeShoot();

  clearOutShots();
  renderMysteryOut();
  showMessage("All page fields reset.");
}

function clearPlayerNames() {
  nameList.querySelectorAll("[data-player-number]").forEach((input) => {
    input.value = "";
  });
}

function renderOutShotSheet() {
  const savedRows = readOutShots();
  let cleanedRows = false;

  outShotSheet.innerHTML = Array.from({ length: outShotSlotCount }, (_, index) => {
    const row = savedRows[index] || {};
    const defaultNumber = String(index + 1);
    const savedNumber = String(row.number || row.score || "");
    const shouldBlankDefault = !String(row.player || "").trim() && savedNumber === defaultNumber;

    if (shouldBlankDefault) {
      cleanedRows = true;
    }

    return `
      <article class="out-shot-row">
        <div class="out-shot-number">${index + 1}</div>
        <label>
          Player
          <input data-out-field="player" data-out-index="${index}" type="text" value="${escapeAttribute(row.player || "")}" placeholder="Name">
        </label>
        <label>
          Number hit
          <input data-out-field="number" data-out-index="${index}" type="text" inputmode="numeric" pattern="[0-9]*" value="${escapeAttribute(shouldBlankDefault ? "" : (row.number || row.score || ""))}">
        </label>
        <div class="out-shot-status" data-out-status="${index}" aria-live="polite"></div>
      </article>
    `;
  }).join("");

  if (cleanedRows) {
    saveOutShots();
  }

  updateOutShotWinners();
  renderMysteryOutWinner();
  renderHighestOutRecord();
}

function getOutShots() {
  return Array.from({ length: outShotSlotCount }, (_, index) => {
    const row = {};

    outShotSheet.querySelectorAll(`[data-out-index="${index}"]`).forEach((input) => {
      row[input.dataset.outField] = input.value.trim();
    });

    return row;
  });
}

function saveOutShots() {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(outShotStorageKey, JSON.stringify(getOutShots()));
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
}

function readOutShots() {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(outShotStorageKey)) || [];
  } catch {
    return [];
  }
}

function clearOutShots() {
  if (canUseLocalStorage()) {
    localStorage.removeItem(outShotStorageKey);
  }

  renderOutShotSheet();
  renderMysteryOutWinner();
  renderHighestOutRecord();
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
}

function preventDuplicateOutShotNumber(input) {
  if (!input?.matches?.('[data-out-field="number"]')) {
    return;
  }

  const numberHit = getOutShotNumberValue(input);
  if (numberHit === null) {
    return;
  }

  const duplicate = Array.from(outShotSheet.querySelectorAll('[data-out-field="number"]')).some((otherInput) => {
    return otherInput !== input && getOutShotNumberValue(otherInput) === numberHit;
  });

  if (duplicate) {
    input.value = "";
    showMessage(`Out shot ${numberHit} is already listed.`);
  }
}

function updateOutShotWinners() {
  const winningScore = mysteryOut ? Number(mysteryOut.score) : null;

  outShotSheet.querySelectorAll(".out-shot-row").forEach((row) => {
    const numberInput = row.querySelector('[data-out-field="number"]');
    const status = row.querySelector("[data-out-status]");
    const isWinner = Boolean(winningScore && getOutShotNumberValue(numberInput) === winningScore);

    row.classList.toggle("out-shot-winner", isWinner);
    if (status) {
      status.textContent = isWinner ? "Winner" : "";
    }
  });
}

function renderMysteryOutWinner() {
  const winner = getMysteryOutWinner();

  if (!mysteryOutWinner || !mysteryOutWinnerTitle || !mysteryOutWinnerBody) {
    return;
  }

  if (!winner) {
    mysteryOutWinner.classList.add("no-winner");
    mysteryOutWinnerTitle.textContent = "No Winner";
    mysteryOutWinnerBody.textContent = "No out shot has matched yet.";
    return;
  }

  mysteryOutWinner.classList.remove("no-winner");
  mysteryOutWinnerTitle.textContent = "Winner";
  mysteryOutWinnerBody.textContent = `${winner.player || "Unnamed player"} - ${winner.number}`;
}

function renderHighestOutRecord() {
  if (!highestOutRecordBody) {
    return;
  }

  const record = getHighestOutRecord();
  if (!record) {
    highestOutRecordBody.classList.add("empty");
    highestOutRecordBody.textContent = "No out shots recorded yet.";
    return;
  }

  highestOutRecordBody.classList.remove("empty");
  highestOutRecordBody.textContent = `${record.player || "Unnamed player"} - ${record.number}`;
}

function getHighestOutRecord() {
  return Array.from(outShotSheet.querySelectorAll(".out-shot-row")).reduce((bestRecord, row) => {
    const numberInput = row.querySelector('[data-out-field="number"]');
    const playerInput = row.querySelector('[data-out-field="player"]');
    const number = getOutShotNumberValue(numberInput);

    if (number === null || (bestRecord && number <= bestRecord.number)) {
      return bestRecord;
    }

    return {
      player: playerInput?.value?.trim() || "",
      number,
    };
  }, null);
}

function getMysteryOutWinner() {
  const winningScore = mysteryOut ? Number(mysteryOut.score) : null;
  if (!winningScore) {
    return null;
  }

  for (const row of Array.from(outShotSheet.querySelectorAll(".out-shot-row"))) {
    const numberInput = row.querySelector('[data-out-field="number"]');
    const playerInput = row.querySelector('[data-out-field="player"]');
    const number = getOutShotNumberValue(numberInput);
    if (number === winningScore) {
      return {
        player: playerInput?.value?.trim() || "",
        number,
      };
    }
  }

  return null;
}

function getOutShotNumberValue(input) {
  const value = input?.value?.trim();
  if (!value) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function rollDice() {
  diceValues.forEach((_, index) => {
    animateDieRoll(index);
  });
}

function rollDie(index) {
  if (!Number.isInteger(index) || index < 0 || index >= diceValues.length) {
    return;
  }

  animateDieRoll(index);
}

function animateDieRoll(index) {
  const button = dieButtons[index];
  if (!button) {
    return;
  }

  if (diceRollTimers[index]) {
    clearInterval(diceRollTimers[index].interval);
    clearTimeout(diceRollTimers[index].timeout);
  }

  button.classList.add("rolling");
  diceRollTimers[index] = {
    interval: setInterval(() => {
      setDieValue(index, randomD20());
    }, 55),
    timeout: setTimeout(() => {
      clearInterval(diceRollTimers[index].interval);
      diceRollTimers[index] = null;
      setDieValue(index, randomD20());
      button.classList.remove("rolling");
      queueBracketDraftSave();
    }, 620),
  };
}

function randomD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function renderDice() {
  dieButtons.forEach((button, index) => {
    setDieValue(index, diceValues[index]);
  });
  queueBracketDraftSave();
}

function generateMysteryOut() {
  if (mysteryOut || mysteryOutDrawAnimation) {
    return;
  }

  const mode = getMysteryOutMode();
  const availableOuts = getAvailableOuts(mode);
  if (!availableOuts.length) {
    showMessage("No mystery out values are available for that mode.");
    return;
  }

  stopMysteryOutDrawAnimation();
  mysteryOutDrawAnimation = startMysteryOutDrawAnimation({
    values: availableOuts,
    durationMs: 20000,
    onFrame: (score) => {
      if (mysteryOutDrawAnimation) {
        mysteryOutDrawAnimation.value = score;
        mysteryOutDrawAnimation.active = true;
      }
      renderMysteryOut();
    },
    onComplete: (score) => {
      if (mysteryOutDrawAnimation) {
        mysteryOutDrawAnimation.active = false;
      }
      stopMysteryOutDrawAnimation();
      mysteryOut = {
        mode,
        score,
      };
      renderMysteryOut();
      savePortalSnapshotToLocalStorage();
      queueBracketDraftSave();
    },
  });
  renderMysteryOut();
}

function renderMysteryOut() {
  const rollingScore = mysteryOutDrawAnimation?.active ? mysteryOutDrawAnimation.value : null;
  mysteryOutValue.textContent = rollingScore !== null ? String(rollingScore) : (mysteryOut ? mysteryOut.score : "--");
  generateMysteryOutButton.disabled = Boolean(mysteryOut || mysteryOutDrawAnimation);
  generateMysteryOutButton.textContent = mysteryOutDrawAnimation
    ? "Drawing..."
    : mysteryOut
      ? "Locked until reset"
      : "Generate mystery out";
  resetMysteryOutButton.hidden = !mysteryOut && !mysteryOutDrawAnimation;
  mysteryOutModeInputs.forEach((input) => {
    input.disabled = Boolean(mysteryOut || mysteryOutDrawAnimation);
  });
  updateOutShotWinners();
  renderMysteryOutWinner();
}

function resetMysteryOut() {
  stopMysteryOutDrawAnimation();
  mysteryOut = "";
  renderMysteryOut();
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
}

function getAvailableOuts(mode) {
  const finishScores = getMysteryOutFinishes(mode);
  const totals = new Set();

  finishScores.forEach((finish) => totals.add(finish));
  dartScores.forEach((first) => {
    finishScores.forEach((finish) => totals.add(first + finish));
    dartScores.forEach((second) => {
      finishScores.forEach((finish) => totals.add(first + second + finish));
    });
  });

  const exclusions = mysteryOutExclusions[mode] || [];
  const range = mysteryOutRanges[mode] || mysteryOutRanges.double;

  return [...totals]
    .filter((score) => score >= range.min && score <= range.max && !exclusions.includes(score))
    .sort((a, b) => a - b);
}

function getMysteryOutFinishes(mode) {
  if (mode === "open") {
    return dartScores;
  }

  if (mode === "master") {
    return masterOutFinishes;
  }

  return doubleOutFinishes;
}

function getMysteryOutMode() {
  return mysteryOutModeInputs.find((input) => input.checked)?.dataset.mysteryOutMode || "double";
}

function setMysteryOutMode(mode) {
  mysteryOutModeInputs.forEach((input) => {
    input.checked = input.dataset.mysteryOutMode === mode;
  });
}

function setDieValue(index, value) {
  const button = dieButtons[index];
  if (!button) {
    return;
  }

  diceValues[index] = value;
  button.querySelector(".die-value").textContent = value;
  button.setAttribute("aria-label", `Roll die ${index + 1}, current value ${value}`);

  diceTotal.textContent = `Total: ${diceValues.reduce((sum, value) => sum + value, 0)}`;
}

function renderNameInputs(count) {
  if (!Number.isInteger(count) || count < 2 || count > 200) {
    nameList.innerHTML = `<p class="empty-names">Enter 2 to 200 players, then update the list.</p>`;
    return;
  }

  const existingNames = getPlayerNameMap();

  nameList.innerHTML = Array.from({ length: count }, (_, index) => {
    const number = String(index + 1);
    const value = existingNames[number] || "";

    return `
      <label class="name-row">
        <span>${number}</span>
        <input
          type="text"
          data-player-number="${number}"
          value="${escapeAttribute(value)}"
          placeholder="Player ${number}"
        >
      </label>
    `;
  }).join("");
}

function getPlayerNameMap() {
  const names = {};

  nameList.querySelectorAll("[data-player-number]").forEach((input) => {
    const value = input.value.trim();
    if (value) {
      names[input.dataset.playerNumber] = value;
    }
  });

  return names;
}

function applyPlayerNameMap(names, overwriteExisting = false) {
  nameList.querySelectorAll("[data-player-number]").forEach((input) => {
    const savedName = names[input.dataset.playerNumber];
    if (savedName && (overwriteExisting || !input.value.trim())) {
      input.value = savedName;
    }
  });
}

function getPlayerLabel(number) {
  const names = getPlayerNameMap();
  return names[number] || `Player ${number}`;
}

function formatTeam(players) {
  const playerNumbers = Array.isArray(players) ? players : parseTeamNumbers(players);

  return playerNumbers
    .map((number) => `${getPlayerLabel(number)} (#${number})`)
    .join(" / ");
}

function parseTeamNumbers(team) {
  return String(team)
    .match(/#?\d+/g)
    ?.map((value) => value.replace("#", ""))
    || [];
}

function validateDraw(players, groupSize) {
  if (players.length < 1) {
    showMessage("Add at least one player.");
    return false;
  }

  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > players.length) {
    showMessage("Players per group must be at least 1 and no more than the player count.");
    return false;
  }

  return true;
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function chunk(items, size) {
  const groups = [];

  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }

  return groups;
}

function renderGroups(groups) {
  groupsOutput.className = "groups";
  groupsOutput.innerHTML = groups.map((group, index) => `
    <article class="group-card">
      <h3>T${index + 1} Team ${index + 1}</h3>
      <div class="team-members">${escapeHtml(Array.isArray(group) ? formatTeam(group) : group)}</div>
    </article>
  `).join("");
}

function renderPdfLayoutOptions() {
  if (!pdfLayoutSelect) {
    return;
  }

  pdfLayoutSelect.innerHTML = Object.keys(pdfBracketLayouts)
    .map((teamCount) => `<option value="${teamCount}">${teamCount} teams</option>`)
    .join("");
}

function syncPdfLayoutToTeamCount(teamCount) {
  if (!pdfBracketLayouts[teamCount] || !pdfLayoutSelect) {
    return;
  }

  pdfLayoutSelect.value = String(teamCount);
  renderPdfColumnMirror(teamCount);
}

function renderPdfColumnMirror(teamCount) {
  if (!pdfColumnMirror) {
    return;
  }

  const layout = pdfBracketLayouts[teamCount];
  if (!layout) {
    pdfColumnMirror.innerHTML = `<p class="no-routes">PDF mirror is available for 3 to 24 teams.</p>`;
    return;
  }

  pdfColumnMirror.innerHTML = `
    <div class="pdf-mirror-meta">
      <strong>${teamCount} Team Double Elimination</strong>
      <span>${escapeHtml(layout.pdf)}</span>
    </div>
    <div class="pdf-mirror-grid">
      ${renderPdfColumnGroup("Winner's bracket", layout.winner)}
      ${renderPdfColumnGroup("Loser's bracket", layout.loser)}
    </div>
    <div class="pdf-final-row">
      <span>Final: ${escapeHtml(layout.final)}</span>
      <span>Reset: ${escapeHtml(layout.reset)}</span>
    </div>
  `;
}

function renderPdfColumnGroup(title, columnsText) {
  return `
    <section class="pdf-column-group">
      <h3>${title}</h3>
      <div class="pdf-columns">
        ${columnsText.split(" / ").map((column, index) => `
          <div class="pdf-column">
            <p>Column ${index + 1}</p>
            <div class="pdf-games">
              ${column.split(",").map((game) => `<span>${escapeHtml(game.trim())}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function loadPdfBracketGraphs() {
  if (learnedPdfGraphs) {
    return Promise.resolve(learnedPdfGraphs);
  }

  if (!learnedPdfGraphsPromise) {
    learnedPdfGraphsPromise = fetch("PDF_BRACKET_GRAPHS.json?v=pdf-21-24", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load learned PDF bracket graphs: ${response.status}`);
        }
        return response.json();
      })
      .then((graphs) => {
        learnedPdfGraphs = graphs;
        return learnedPdfGraphs;
      })
      .catch(() => {
        learnedPdfGraphs = null;
        return null;
      });
  }

  return learnedPdfGraphsPromise;
}

function createBracketGraph(players) {
  if (learnedPdfGraphs?.[players.length]) {
    return createPdfLearnedBracketGraph(players, learnedPdfGraphs[players.length]);
  }

  if (players.length === 3) {
    return createThreeTeamBracketGraph(players);
  }

  if (players.length === 5) {
    return createFiveTeamBracketGraph(players);
  }

  if (players.length === 7) {
    return createSevenTeamBracketGraph(players);
  }

  if (players.length === 9) {
    return createLearnedNineTeamBracketGraph(players);
  }

  if (players.length === 11) {
    return createLearnedElevenTeamBracketGraph(players);
  }

  if (players.length === 13) {
    return createLearnedThirteenTeamBracketGraph(players);
  }

  if (players.length === 15) {
    return createLearnedFifteenTeamBracketGraph(players);
  }

  if (players.length === 17) {
    return createLearnedSeventeenTeamBracketGraph(players);
  }

  if (players.length === 19) {
    return createLearnedNineteenTeamBracketGraph(players);
  }

  if (players.length === 9) {
    return createNineTeamBracketGraph(players);
  }

  const size = nextPowerOfTwo(players.length);
  const matches = [];
  const rounds = {
    winner: [],
    loser: [],
  };
  let nextId = 1;

  const winnerRounds = Math.log2(size);
  for (let roundIndex = 0; roundIndex < winnerRounds; roundIndex += 1) {
    const matchCount = size / 2 ** (roundIndex + 1);
    rounds.winner[roundIndex] = [];
    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      const match = createGraphMatch(nextId, "winner", roundIndex, matchIndex);
      nextId += 1;
      matches.push(match);
      rounds.winner[roundIndex].push(match);
    }
  }

  const loserRoundCount = Math.max(1, winnerRounds * 2 - 2);
  for (let roundIndex = 0; roundIndex < loserRoundCount; roundIndex += 1) {
    const roundNumber = roundIndex + 1;
    const exponent = roundNumber % 2 === 1
      ? (roundNumber + 3) / 2
      : roundNumber / 2 + 1;
    const matchCount = Math.max(1, size / 2 ** exponent);
    rounds.loser[roundIndex] = [];
    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      const match = createGraphMatch(nextId, "loser", roundIndex, matchIndex);
      nextId += 1;
      matches.push(match);
      rounds.loser[roundIndex].push(match);
    }
  }

  const final = createGraphMatch(nextId, "final", 0, 0);
  nextId += 1;
  const resetFinal = createGraphMatch(nextId, "resetFinal", 1, 0);
  final.title = `Game ${final.id} - Grand Final`;
  resetFinal.title = `Game ${resetFinal.id} - Reset Final`;
  matches.push(final);
  matches.push(resetFinal);

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size,
    matches,
    matchesById: {},
    rounds,
    final,
    resetFinal,
    doubleDipFinal: null,
    champion: "",
  };

  matches.forEach((match) => {
    bracketState.matchesById[match.id] = match;
  });

  seedGraphPlayers(bracketState, players);
  wireGraphWinnerDestinations(bracketState);
  autoAdvanceGraphByes(bracketState);
  wireGraphLoserDestinations(bracketState);
  settleGraphByesAndSources(bracketState);

  return bracketState;
}

function createPdfLearnedBracketGraph(players, learnedGraph) {
  const layout = pdfBracketLayouts[players.length];
  if (!layout) {
    return null;
  }

  const firstFinal = learnedGraph.firstFinal;
  const resetFinal = learnedGraph.resetFinal;
  const winnerPositions = mapPdfColumnPositions(layout.winner, firstFinal);
  const loserPositions = mapPdfColumnPositions(layout.loser, resetFinal);
  const matches = [];
  const rounds = { winner: [], loser: [] };
  const matchesById = {};
  const templateSources = {};
  let seedIndex = 0;

  learnedGraph.matches
    .slice()
    .sort((a, b) => a.id - b.id)
    .forEach((definition) => {
      const winnerPosition = winnerPositions.get(definition.id);
      const loserPosition = loserPositions.get(definition.id);
      const type = definition.id === firstFinal
        ? "final"
        : definition.id === resetFinal
          ? "resetFinal"
          : winnerPosition ? "winner" : "loser";
      const position = winnerPosition || loserPosition || { roundIndex: 0, matchIndex: 0 };
      const match = createGraphMatch(definition.id, type, position.roundIndex, position.matchIndex);
      match.players = definition.inputs.map((input) => {
        if (input.kind !== "seed") {
          return "";
        }
        const player = players[seedIndex] || "";
        seedIndex += 1;
        return player;
      });
      match.slotSources = definition.inputs.map((input) => formatPdfInputSource(input));
      match.winnerTo = definition.winnerTo
        ? { matchId: definition.winnerTo.game, slot: definition.winnerTo.slot }
        : null;
      match.loserTo = definition.loserTo
        ? { matchId: definition.loserTo.game, slot: definition.loserTo.slot }
        : null;

      if (match.type === "final") {
        match.title = `Game ${match.id} - Grand Final`;
      }
      if (match.type === "resetFinal") {
        match.title = `Game ${match.id} - Reset Final`;
      }

      matches.push(match);
      matchesById[match.id] = match;
      templateSources[match.id] = [...match.slotSources];
      if (match.type === "winner") {
        if (!rounds.winner[match.roundIndex]) {
          rounds.winner[match.roundIndex] = [];
        }
        rounds.winner[match.roundIndex].push(match);
      }
      if (match.type === "loser") {
        if (!rounds.loser[match.roundIndex]) {
          rounds.loser[match.roundIndex] = [];
        }
        rounds.loser[match.roundIndex].push(match);
      }
    });

  rounds.winner = rounds.winner.filter(Boolean);
  rounds.loser = rounds.loser.filter(Boolean);
  rounds.winner.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));
  rounds.loser.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size: players.length,
    matches,
    matchesById,
    templateSources,
    rounds,
    final: matchesById[firstFinal],
    resetFinal: matchesById[resetFinal],
    champion: "",
  };

  settleGraphByesAndSources(bracketState);
  return bracketState;
}

function mapPdfColumnPositions(columnsText, excludedGameId) {
  const positions = new Map();
  columnsText.split(" / ").forEach((column, roundIndex) => {
    column.split(",").forEach((game, matchIndex) => {
      const gameId = Number(game.trim().replace(/^G/, ""));
      if (gameId && gameId !== excludedGameId) {
        positions.set(gameId, { roundIndex, matchIndex });
      }
    });
  });
  return positions;
}

function formatPdfInputSource(input) {
  if (input.kind === "winner") {
    return `Winner of Game ${input.game}`;
  }
  if (input.kind === "loser") {
    return input.ifFirstLoss
      ? `L${input.game} - Loser of Game ${input.game} if first loss`
      : `L${input.game} - Loser of Game ${input.game}`;
  }
  return "";
}

function createThreeTeamBracketGraph(players) {
  const definitions = [
    { id: 1, type: "winner", roundIndex: 0, matchIndex: 0, players: ["T1", "T2"], winnerTo: [2, 1], loserTo: [3, 0] },
    { id: 2, type: "winner", roundIndex: 1, matchIndex: 0, players: ["T3", "winner_of_1"], winnerTo: [4, 0], loserTo: [3, 1] },
    { id: 3, type: "loser", roundIndex: 0, matchIndex: 0, players: ["loser_of_1", "loser_of_2"], winnerTo: [4, 1] },
    { id: 4, type: "final", roundIndex: 0, matchIndex: 0, players: ["winner_of_2", "winner_of_3"] },
    { id: 5, type: "resetFinal", roundIndex: 1, matchIndex: 0, players: ["", ""] },
  ];
  const matches = definitions.map((definition) => createTemplateMatch(definition, players));
  matches.forEach((match) => {
    if (match.type === "final") {
      match.title = `Game ${match.id} - Grand Final`;
    }
    if (match.type === "resetFinal") {
      match.title = `Game ${match.id} - Reset Final`;
    }
  });

  const rounds = { winner: [], loser: [] };
  const matchesById = {};
  const templateSources = {};

  matches.forEach((match) => {
    matchesById[match.id] = match;
    templateSources[match.id] = [...match.slotSources];
    if (match.type === "winner") {
      if (!rounds.winner[match.roundIndex]) {
        rounds.winner[match.roundIndex] = [];
      }
      rounds.winner[match.roundIndex].push(match);
    }
    if (match.type === "loser") {
      if (!rounds.loser[match.roundIndex]) {
        rounds.loser[match.roundIndex] = [];
      }
      rounds.loser[match.roundIndex].push(match);
    }
  });

  rounds.winner.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));
  rounds.loser.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size: 3,
    matches,
    matchesById,
    templateSources,
    rounds,
    final: matchesById[4],
    resetFinal: matchesById[5],
    champion: "",
  };

  settleGraphByesAndSources(bracketState);
  return bracketState;
}

function createFiveTeamBracketGraph(players) {
  const definitions = [
    { id: 1, type: "winner", roundIndex: 0, matchIndex: 0, players: ["T1", "T2"], winnerTo: [3, 0], loserTo: [4, 0] },
    { id: 2, type: "winner", roundIndex: 1, matchIndex: 0, players: ["T3", "T4"], winnerTo: [5, 0], loserTo: [4, 1] },
    { id: 3, type: "winner", roundIndex: 1, matchIndex: 1, players: ["winner_of_1", "T5"], winnerTo: [5, 1], loserTo: [6, 1] },
    { id: 4, type: "loser", roundIndex: 0, matchIndex: 0, players: ["loser_of_1", "loser_of_2"], winnerTo: [6, 0] },
    { id: 5, type: "winner", roundIndex: 2, matchIndex: 0, players: ["winner_of_2", "winner_of_3"], winnerTo: [8, 0], loserTo: [7, 0] },
    { id: 6, type: "loser", roundIndex: 1, matchIndex: 0, players: ["winner_of_4", "loser_of_3"], winnerTo: [7, 1] },
    { id: 7, type: "loser", roundIndex: 2, matchIndex: 0, players: ["loser_of_5", "winner_of_6"], winnerTo: [8, 1] },
    { id: 8, type: "final", roundIndex: 0, matchIndex: 0, players: ["winner_of_5", "winner_of_7"] },
    { id: 9, type: "resetFinal", roundIndex: 1, matchIndex: 0, players: ["", ""] },
  ];
  const matches = definitions.map((definition) => createTemplateMatch(definition, players));
  matches.forEach((match) => {
    if (match.type === "final") {
      match.title = `Game ${match.id} - Grand Final`;
    }
    if (match.type === "resetFinal") {
      match.title = `Game ${match.id} - Reset Final`;
    }
  });

  const rounds = { winner: [], loser: [] };
  const matchesById = {};
  const templateSources = {};

  matches.forEach((match) => {
    matchesById[match.id] = match;
    templateSources[match.id] = [...match.slotSources];
    if (match.type === "winner") {
      if (!rounds.winner[match.roundIndex]) {
        rounds.winner[match.roundIndex] = [];
      }
      rounds.winner[match.roundIndex].push(match);
    }
    if (match.type === "loser") {
      if (!rounds.loser[match.roundIndex]) {
        rounds.loser[match.roundIndex] = [];
      }
      rounds.loser[match.roundIndex].push(match);
    }
  });

  rounds.winner.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));
  rounds.loser.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size: 5,
    matches,
    matchesById,
    templateSources,
    rounds,
    final: matchesById[8],
    resetFinal: matchesById[9],
    champion: "",
  };

  settleGraphByesAndSources(bracketState);
  return bracketState;
}

function createSevenTeamBracketGraph(players) {
  const definitions = [
    { id: 1, type: "winner", roundIndex: 0, matchIndex: 0, players: ["T1", "T2"], winnerTo: [4, 1], loserTo: [7, 0] },
    { id: 2, type: "winner", roundIndex: 0, matchIndex: 1, players: ["T3", "T4"], winnerTo: [5, 0], loserTo: [6, 0] },
    { id: 3, type: "winner", roundIndex: 0, matchIndex: 2, players: ["T5", "T6"], winnerTo: [5, 1], loserTo: [6, 1] },
    { id: 4, type: "winner", roundIndex: 1, matchIndex: 0, players: ["T7", "winner_of_1"], winnerTo: [9, 0], loserTo: [8, 0] },
    { id: 5, type: "winner", roundIndex: 1, matchIndex: 1, players: ["winner_of_2", "winner_of_3"], winnerTo: [9, 1], loserTo: [7, 1] },
    { id: 6, type: "loser", roundIndex: 0, matchIndex: 0, players: ["loser_of_2", "loser_of_3"], winnerTo: [8, 1] },
    { id: 7, type: "loser", roundIndex: 0, matchIndex: 1, players: ["loser_of_1", "winner_of_6"], winnerTo: [10, 1] },
    { id: 8, type: "loser", roundIndex: 1, matchIndex: 0, players: ["loser_of_4", "winner_of_6"], winnerTo: [10, 0] },
    { id: 9, type: "winner", roundIndex: 2, matchIndex: 0, players: ["winner_of_4", "winner_of_5"], winnerTo: [12, 0], loserTo: [11, 0] },
    { id: 10, type: "loser", roundIndex: 2, matchIndex: 0, players: ["winner_of_7", "winner_of_8"], winnerTo: [11, 1] },
    { id: 11, type: "loser", roundIndex: 3, matchIndex: 0, players: ["loser_of_9", "winner_of_10"], winnerTo: [12, 1] },
    { id: 12, type: "final", roundIndex: 0, matchIndex: 0, players: ["winner_of_9", "winner_of_11"] },
    { id: 13, type: "resetFinal", roundIndex: 1, matchIndex: 0, players: ["", ""] },
  ];
  const matches = definitions.map((definition) => createTemplateMatch(definition, players));
  matches.forEach((match) => {
    if (match.type === "final") {
      match.title = `Game ${match.id} - Grand Final`;
    }
    if (match.type === "resetFinal") {
      match.title = `Game ${match.id} - Reset Final`;
    }
  });

  const rounds = { winner: [], loser: [] };
  const matchesById = {};
  const templateSources = {};

  matches.forEach((match) => {
    matchesById[match.id] = match;
    templateSources[match.id] = [...match.slotSources];
    if (match.type === "winner") {
      if (!rounds.winner[match.roundIndex]) {
        rounds.winner[match.roundIndex] = [];
      }
      rounds.winner[match.roundIndex].push(match);
    }
    if (match.type === "loser") {
      if (!rounds.loser[match.roundIndex]) {
        rounds.loser[match.roundIndex] = [];
      }
      rounds.loser[match.roundIndex].push(match);
    }
  });

  rounds.winner.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));
  rounds.loser.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size: 7,
    matches,
    matchesById,
    templateSources,
    rounds,
    final: matchesById[12],
    resetFinal: matchesById[13],
    champion: "",
  };

  settleGraphByesAndSources(bracketState);
  return bracketState;
}

function createLearnedNineTeamBracketGraph(players) {
  return learnedPdfGraphs?.[9]
    ? createPdfLearnedBracketGraph(players, learnedPdfGraphs[9])
    : createNineTeamBracketGraph(players);
}

function createLearnedElevenTeamBracketGraph(players) {
  return learnedPdfGraphs?.[11]
    ? createPdfLearnedBracketGraph(players, learnedPdfGraphs[11])
    : createBracketGraphFallback(players);
}

function createLearnedThirteenTeamBracketGraph(players) {
  return learnedPdfGraphs?.[13]
    ? createPdfLearnedBracketGraph(players, learnedPdfGraphs[13])
    : createBracketGraphFallback(players);
}

function createLearnedFifteenTeamBracketGraph(players) {
  return learnedPdfGraphs?.[15]
    ? createPdfLearnedBracketGraph(players, learnedPdfGraphs[15])
    : createBracketGraphFallback(players);
}

function createLearnedSeventeenTeamBracketGraph(players) {
  return learnedPdfGraphs?.[17]
    ? createPdfLearnedBracketGraph(players, learnedPdfGraphs[17])
    : createBracketGraphFallback(players);
}

function createLearnedNineteenTeamBracketGraph(players) {
  return learnedPdfGraphs?.[19]
    ? createPdfLearnedBracketGraph(players, learnedPdfGraphs[19])
    : createBracketGraphFallback(players);
}

function createBracketGraphFallback(players) {
  const size = nextPowerOfTwo(players.length);
  const matches = [];
  const rounds = {
    winner: [],
    loser: [],
  };
  let nextId = 1;

  const winnerRounds = Math.log2(size);
  for (let roundIndex = 0; roundIndex < winnerRounds; roundIndex += 1) {
    const matchCount = size / 2 ** (roundIndex + 1);
    rounds.winner[roundIndex] = [];
    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      const match = createGraphMatch(nextId, "winner", roundIndex, matchIndex);
      nextId += 1;
      matches.push(match);
      rounds.winner[roundIndex].push(match);
    }
  }

  const loserRoundCount = Math.max(1, winnerRounds * 2 - 2);
  for (let roundIndex = 0; roundIndex < loserRoundCount; roundIndex += 1) {
    const roundNumber = roundIndex + 1;
    const exponent = roundNumber % 2 === 1
      ? (roundNumber + 3) / 2
      : roundNumber / 2 + 1;
    const matchCount = Math.max(1, size / 2 ** exponent);
    rounds.loser[roundIndex] = [];
    for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
      const match = createGraphMatch(nextId, "loser", roundIndex, matchIndex);
      nextId += 1;
      matches.push(match);
      rounds.loser[roundIndex].push(match);
    }
  }

  const final = createGraphMatch(nextId, "final", 0, 0);
  nextId += 1;
  const resetFinal = createGraphMatch(nextId, "resetFinal", 1, 0);
  final.title = `Game ${final.id} - Grand Final`;
  resetFinal.title = `Game ${resetFinal.id} - Reset Final`;
  matches.push(final);
  matches.push(resetFinal);

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size,
    matches,
    matchesById: {},
    rounds,
    final,
    resetFinal,
    champion: "",
  };

  matches.forEach((match) => {
    bracketState.matchesById[match.id] = match;
  });

  seedGraphPlayers(bracketState, players);
  wireGraphWinnerDestinations(bracketState);
  autoAdvanceGraphByes(bracketState);
  wireGraphLoserDestinations(bracketState);
  settleGraphByesAndSources(bracketState);

  return bracketState;
}

function createNineTeamBracketGraph(players) {
  const definitions = [
    { id: 1, type: "winner", roundIndex: 0, matchIndex: 0, players: ["T1", "T2"], winnerTo: [5, 0], loserTo: [6, 0] },
    { id: 2, type: "winner", roundIndex: 0, matchIndex: 1, players: ["T3", "T4"], winnerTo: [9, 0], loserTo: [6, 1] },
    { id: 3, type: "winner", roundIndex: 0, matchIndex: 2, players: ["T5", "T6"], winnerTo: [9, 1], loserTo: [7, 1] },
    { id: 4, type: "winner", roundIndex: 0, matchIndex: 3, players: ["T7", "T8"], winnerTo: [10, 0], loserTo: [7, 0] },
    { id: 5, type: "winner", roundIndex: 1, matchIndex: 0, players: ["winner_of_1", "T9"], winnerTo: [10, 1], loserTo: [8, 1] },
    { id: 9, type: "winner", roundIndex: 1, matchIndex: 1, players: ["winner_of_2", "winner_of_3"], winnerTo: [13, 0], loserTo: [12, 1] },
    { id: 10, type: "winner", roundIndex: 1, matchIndex: 2, players: ["winner_of_4", "winner_of_5"], winnerTo: [13, 1], loserTo: [11, 1] },
    { id: 13, type: "winner", roundIndex: 2, matchIndex: 0, players: ["winner_of_9", "winner_of_10"], winnerTo: [16, 0], loserTo: [15, 1] },
    { id: 6, type: "loser", roundIndex: 0, matchIndex: 0, players: ["loser_of_1", "loser_of_2"], winnerTo: [8, 0] },
    { id: 7, type: "loser", roundIndex: 0, matchIndex: 1, players: ["loser_of_4", "loser_of_3"], winnerTo: [11, 0] },
    { id: 8, type: "loser", roundIndex: 1, matchIndex: 0, players: ["winner_of_6", "loser_of_5"], winnerTo: [12, 0] },
    { id: 11, type: "loser", roundIndex: 1, matchIndex: 1, players: ["winner_of_7", "loser_of_10"], winnerTo: [14, 0] },
    { id: 12, type: "loser", roundIndex: 2, matchIndex: 0, players: ["winner_of_8", "loser_of_9"], winnerTo: [14, 1] },
    { id: 14, type: "loser", roundIndex: 3, matchIndex: 0, players: ["winner_of_11", "winner_of_12"], winnerTo: [15, 0] },
    { id: 15, type: "loser", roundIndex: 4, matchIndex: 0, players: ["winner_of_14", "loser_of_13"], winnerTo: [16, 1] },
    { id: 16, type: "final", roundIndex: 0, matchIndex: 0, players: ["winner_of_13", "winner_of_15"] },
    { id: 17, type: "resetFinal", roundIndex: 1, matchIndex: 0, players: ["", ""] },
  ];
  const matches = definitions.map((definition) => createTemplateMatch(definition, players));
  matches.forEach((match) => {
    if (match.type === "final") {
      match.title = `Game ${match.id} - Grand Final`;
    }
    if (match.type === "resetFinal") {
      match.title = `Game ${match.id} - Reset Final`;
    }
  });
  const rounds = { winner: [], loser: [] };
  const matchesById = {};
  const templateSources = {};

  matches.forEach((match) => {
    matchesById[match.id] = match;
    templateSources[match.id] = [...match.slotSources];
    if (match.type === "winner") {
      if (!rounds.winner[match.roundIndex]) {
        rounds.winner[match.roundIndex] = [];
      }
      rounds.winner[match.roundIndex].push(match);
    }
    if (match.type === "loser") {
      if (!rounds.loser[match.roundIndex]) {
        rounds.loser[match.roundIndex] = [];
      }
      rounds.loser[match.roundIndex].push(match);
    }
  });

  rounds.winner.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));
  rounds.loser.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));

  const bracketState = {
    mode: "graph",
    originalPlayers: [...players],
    size: 9,
    matches,
    matchesById,
    templateSources,
    rounds,
    final: matchesById[16],
    resetFinal: matchesById[17],
    champion: "",
  };

  settleGraphByesAndSources(bracketState);
  return bracketState;
}

function createTemplateMatch(definition, players) {
  const match = createGraphMatch(definition.id, definition.type, definition.roundIndex, definition.matchIndex);
  match.players = definition.players.map((slot) => {
    const playerNumber = /^T(\d+)$/.exec(slot)?.[1];
    return playerNumber ? players[Number(playerNumber) - 1] : "";
  });
  match.slotSources = definition.players.map((slot) => formatTemplateSource(slot));
  match.winnerTo = definition.winnerTo ? { matchId: definition.winnerTo[0], slot: definition.winnerTo[1] } : null;
  match.loserTo = definition.loserTo ? { matchId: definition.loserTo[0], slot: definition.loserTo[1] } : null;
  return match;
}

function formatTemplateSource(slot) {
  const winner = /^winner_of_(\d+)$/.exec(slot)?.[1];
  if (winner) {
    return `Winner of Game ${winner}`;
  }

  const loser = /^loser_of_(\d+)$/.exec(slot)?.[1];
  if (loser) {
    return `Loser of Game ${loser}`;
  }

  return "";
}

function createGraphMatch(id, type, roundIndex, matchIndex) {
  return {
    id,
    type,
    roundIndex,
    matchIndex,
    title: `Game ${id}`,
    players: ["", ""],
    slotSources: ["", ""],
    boardAssignment: null,
    winner: "",
    loser: "",
    winnerTo: null,
    loserTo: null,
    autoAdvanced: false,
    isPlayIn: false,
    gameNumber: id,
  };
}

function seedGraphPlayers(bracketState, players) {
  const firstRound = bracketState.rounds.winner[0];
  const seeds = seedPlayersWithByes(players, bracketState.size);

  firstRound.forEach((match, index) => {
    match.players[0] = seeds[index * 2];
    match.players[1] = seeds[index * 2 + 1];
  });
}

function wireGraphWinnerDestinations(bracketState) {
  bracketState.rounds.winner.forEach((round, roundIndex) => {
    round.forEach((match) => {
      const nextWinnerRound = bracketState.rounds.winner[roundIndex + 1];
      match.winnerTo = nextWinnerRound
        ? { matchId: nextWinnerRound[Math.floor(match.matchIndex / 2)].id, slot: match.matchIndex % 2 }
        : { matchId: bracketState.final.id, slot: 0 };

    });
  });

  bracketState.rounds.loser.forEach((round, roundIndex) => {
    round.forEach((match) => {
      const nextLoserRound = bracketState.rounds.loser[roundIndex + 1];
      if (nextLoserRound) {
        const feedRound = roundIndex % 2 === 0;
        const nextMatch = feedRound
          ? nextLoserRound[match.matchIndex]
          : nextLoserRound[Math.floor(match.matchIndex / 2)];
        match.winnerTo = {
          matchId: nextMatch.id,
          slot: feedRound ? 0 : match.matchIndex % 2,
        };
      } else {
        match.winnerTo = { matchId: bracketState.final.id, slot: 1 };
      }
    });
  });
}

function wireGraphLoserDestinations(bracketState) {
  bracketState.rounds.winner.forEach((round) => {
    round.forEach((match) => {
      match.loserTo = getGraphLoserDestination(bracketState, match);
    });
  });
}

function getGraphLoserDestination(bracketState, match) {
  if (match.type !== "winner") {
    return null;
  }

  const mainFirstRoundIndex = bracketState.originalPlayers.length === bracketState.size ? 0 : 1;

  if (match.roundIndex <= mainFirstRoundIndex) {
    const earlyMatches = bracketState.rounds.winner
      .slice(0, mainFirstRoundIndex + 1)
      .flat()
      .filter((winnerMatch) => isGraphWinnerDropMatch(winnerMatch, bracketState))
      .sort((a, b) => a.id - b.id);
    const dropIndex = earlyMatches.findIndex((winnerMatch) => winnerMatch.id === match.id);
    const targetMatch = bracketState.rounds.loser[0]?.[Math.floor(dropIndex / 2)];

    return targetMatch && dropIndex >= 0
      ? { matchId: targetMatch.id, slot: dropIndex % 2 }
      : null;
  }

  const loserRoundIndex = Math.max(1, (match.roundIndex - mainFirstRoundIndex) * 2 - 1);
  const targetRound = bracketState.rounds.loser[loserRoundIndex];
  if (!targetRound) {
    return null;
  }

  const targetIndex = getCrossDropMatchIndex(match.matchIndex, targetRound.length);
  return { matchId: targetRound[targetIndex].id, slot: 1 };
}

function isGraphWinnerDropMatch(match, bracketState) {
  if (match.type !== "winner" || match.autoAdvanced) {
    return false;
  }

  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  return realPlayerCount >= 2 || hasGraphFeederToMatch(bracketState, match.id);
}

function hasGraphFeederToMatch(bracketState, matchId) {
  return bracketState.matches.some((match) => {
    if (match.winner || match.autoAdvanced) {
      return false;
    }

    return match.winnerTo?.matchId === matchId;
  });
}

function chooseWinner(matchId, winnerName) {
  if (!state?.matchesById || !winnerName || winnerName === "BYE") {
    return;
  }

  if (state.mode === "graph") {
    rebuildGraphMatchIndex(state);
  }

  const match = state.matchesById[matchId];
  if (!match || match.winner) {
    showMessage(match?.winner ? "That match already has a winner. Use Fix to change it." : "That match could not be found. Rebuild or restore the bracket.");
    return;
  }

  const loserName = match.players.find((player) => player && player !== winnerName) || "";
  if (!loserName || loserName === "BYE") {
    showMessage("That match is not ready yet. Wait for both players to be filled in.");
    return;
  }

  match.winner = winnerName;
  match.loser = loserName;
  match.autoAdvanced = false;
  advancingMatchId = getGraphAdvanceAnimationTarget(state, match, winnerName);

  if (match.type === "final") {
    applyGraphFinalResult(state, match, winnerName, loserName);
  } else if (match.type === "resetFinal") {
    applyGraphFinalResult(state, match, winnerName, loserName);
    if (winnerName !== match.players[0]) {
      advancingMatchId = ensureDoubleDipFinal(state, match, match.players[0], match.players[1]).id;
    }
  } else if (match.type === "doubleDipFinal") {
    applyGraphFinalResult(state, match, winnerName, loserName);
  } else {
    placeGraphPlayer(state, match.winnerTo, winnerName);
    placeGraphPlayer(state, match.loserTo, loserName);
  }

  sendBracketLegWinnerPortalNotice(match, winnerName);
  settleGraphByesAndSources(state);
  renderBracket();
}

function getGraphAdvanceAnimationTarget(bracketState, match, winnerName) {
  if (match.type === "final") {
    const winnersSidePlayer = match.players[0];
    return winnerName === winnersSidePlayer ? null : bracketState.resetFinal?.id || null;
  }

  if (match.type === "resetFinal") {
    const winnersSidePlayer = match.players[0];
    return winnerName === winnersSidePlayer ? null : bracketState.doubleDipFinal?.id || null;
  }

  return match.winnerTo?.matchId || null;
}

function applyGraphFinalResult(bracketState, match, winnerName, loserName) {
  if (match.type === "doubleDipFinal") {
    bracketState.champion = winnerName;
    return;
  }

  if (match.type === "resetFinal") {
    if (getFinalSeriesWins(bracketState, match.players[0]) >= 2) {
      bracketState.champion = match.players[0];
      return;
    }

    ensureDoubleDipFinal(bracketState, match, match.players[0], match.players[1]);
    return;
  }

  if (!bracketState.resetFinal) {
    bracketState.champion = winnerName;
    return;
  }

  bracketState.resetFinal.players = [...match.players];
  bracketState.resetFinal.slotSources = ["", ""];
}

function getFinalSeriesWins(bracketState, playerName) {
  return [
    bracketState.final,
    bracketState.resetFinal,
    bracketState.doubleDipFinal,
  ].filter((match) => match?.winner === playerName).length;
}

function ensureDoubleDipFinal(bracketState, sourceMatch, winnersSidePlayer, losersSidePlayer) {
  if (bracketState.doubleDipFinal) {
    return bracketState.doubleDipFinal;
  }

  const doubleDipFinal = createGraphMatch(
    Math.max(...bracketState.matches.map((candidate) => candidate.id)) + 1,
    "doubleDipFinal",
    2,
    0,
  );

  doubleDipFinal.gameNumber = (sourceMatch?.gameNumber || bracketState.final.gameNumber || 0) + 1;
  doubleDipFinal.title = `Game ${doubleDipFinal.gameNumber}`;
  doubleDipFinal.players = [winnersSidePlayer, losersSidePlayer];
  doubleDipFinal.slotSources = ["", ""];
  bracketState.doubleDipFinal = doubleDipFinal;
  if (!bracketState.matchesById[doubleDipFinal.id]) {
    bracketState.matches.push(doubleDipFinal);
    bracketState.matchesById[doubleDipFinal.id] = doubleDipFinal;
  }

  return doubleDipFinal;
}

function resetMatchResult(matchId) {
  if (!state?.matchesById) {
    return;
  }

  const boardAssignments = new Map(
    state.matches.map((match) => [match.id, match.boardAssignment ?? null])
  );
  const manualResults = state.matches
    .filter((match) => match.winner && !match.autoAdvanced && match.id !== matchId)
    .map((match) => ({ id: match.id, winner: match.winner }));

  state = createBracketGraph(state.originalPlayers);
  state.matches.forEach((match) => {
    if (boardAssignments.has(match.id)) {
      match.boardAssignment = boardAssignments.get(match.id);
    }
  });

  manualResults.forEach((result) => {
    const match = state.matchesById[result.id];
    if (match?.players.includes(result.winner) && !match.winner) {
      chooseWinner(result.id, result.winner);
    }
  });

  renderBracket();
  queueActiveLodCodesRefresh();
  showMessage("Match result cleared. Pick the correct winner.");
}

function placeGraphPlayer(bracketState, destination, player) {
  if (!destination || !player || player === "BYE") {
    return;
  }

  const match = bracketState.matchesById[destination.matchId];
  if (!match || match.winner) {
    return;
  }

  match.players[destination.slot] = player;
}

function settleGraphByesAndSources(bracketState) {
  let changed = true;

  while (changed) {
    refreshGraphSources(bracketState);
    changed = autoAdvanceGraphByes(bracketState);
  }

  refreshGraphSources(bracketState);
  markGraphPlayInMatches(bracketState);
}

function markGraphPlayInMatches(bracketState) {
  bracketState.matches.forEach((match) => {
    if (isGraphPlayInMatch(match, bracketState)) {
      match.isPlayIn = true;
    }
  });
}

function isGraphPlayInMatch(match, bracketState) {
  if (!match || match.type !== "winner") {
    return false;
  }

  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  if (realPlayerCount < 2) {
    return false;
  }

  if (!bracketState.templateSources && match.roundIndex === 0 && bracketState.originalPlayers.length !== bracketState.size) {
    return true;
  }

  const destination = match.winnerTo;
  const target = destination ? bracketState.matchesById[destination.matchId] : null;
  if (!target || target.type !== "winner") {
    return false;
  }

  const otherSlot = destination.slot === 0 ? 1 : 0;
  const targetSources = bracketState.templateSources?.[target.id] || target.slotSources;
  return targetSources[destination.slot] === `Winner of Game ${match.id}` &&
    Boolean(target.players[otherSlot]) &&
    target.players[otherSlot] !== "BYE" &&
    !targetSources[otherSlot];
}

function autoAdvanceGraphByes(bracketState) {
  let changed = true;
  let changedAny = false;

  while (changed) {
    changed = false;
    bracketState.matches.forEach((match) => {
      if (match.winner) {
        return;
      }

      const realPlayers = match.players.filter((player) => player && player !== "BYE");
      const hasBye = match.players.includes("BYE");
      if (realPlayers.length === 1 && hasBye) {
        match.winner = realPlayers[0];
        match.loser = "";
        match.autoAdvanced = true;
        placeGraphPlayer(bracketState, match.winnerTo, realPlayers[0]);
        changed = true;
        changedAny = true;
        return;
      }

      const emptySlot = match.players.findIndex((player) => !player);
      const sourceCount = match.slotSources.filter(Boolean).length;
      if (
        !bracketState.templateSources &&
        match.type === "loser" &&
        realPlayers.length === 1 &&
        sourceCount === 0 &&
        emptySlot >= 0 &&
        !hasPendingGraphFeeder(bracketState, match.id, emptySlot)
      ) {
        match.winner = realPlayers[0];
        match.loser = "";
        match.autoAdvanced = true;
        placeGraphPlayer(bracketState, match.winnerTo, realPlayers[0]);
        changed = true;
        changedAny = true;
      }
    });
  }

  return changedAny;
}

function hasPendingGraphFeeder(bracketState, matchId, slot) {
  return bracketState.matches.some((match) => {
    if (match.winner || !canGraphFeederProducePlayer(bracketState, match)) {
      return false;
    }

    return isSameGraphDestination(match.winnerTo, matchId, slot) ||
      isSameGraphDestination(match.loserTo, matchId, slot);
  });
}

function isSameGraphDestination(destination, matchId, slot) {
  return destination?.matchId === matchId && destination.slot === slot;
}

function canGraphFeederProducePlayer(bracketState, match, visited = new Set()) {
  if (visited.has(match.id)) {
    return false;
  }

  visited.add(match.id);

  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  if (realPlayerCount > 0 || match.slotSources.some(Boolean) || !isGraphHiddenMatch(match)) {
    return true;
  }

  return bracketState.matches.some((source) => {
    if (source.winner || source.autoAdvanced || source.winnerTo?.matchId !== match.id) {
      return false;
    }

    return canGraphFeederProducePlayer(bracketState, source, visited);
  });
}

function refreshGraphSources(bracketState) {
  if (bracketState.templateSources) {
    bracketState.matches.forEach((match) => {
      const source = bracketState.templateSources[match.id] || ["", ""];
      match.slotSources = match.players.map((player, index) => player ? "" : source[index]);
    });
    return;
  }

  bracketState.matches.forEach((match) => {
    match.slotSources = ["", ""];
  });

  bracketState.matches.forEach((match) => {
    if (isGraphHiddenMatch(match)) {
      return;
    }

    addGraphSource(bracketState, match.winnerTo, `Winner of Game ${match.id}`);
    if (match.type === "winner") {
      addGraphSource(bracketState, match.loserTo, `Loser of Game ${match.id}`);
    }
  });
}

function rebuildGraphMatchIndex(bracketState) {
  bracketState.rounds = bracketState.rounds || { winner: [], loser: [] };
  const visibleMatches = [
    ...(bracketState.rounds.winner || []).flat(),
    ...(bracketState.rounds.loser || []).flat(),
    bracketState.final,
    bracketState.resetFinal,
    bracketState.doubleDipFinal,
  ].filter(Boolean);
  const fallbackMatches = Array.isArray(bracketState.matches) ? bracketState.matches : [];
  const matchesById = {};

  [...visibleMatches, ...fallbackMatches].forEach((match) => {
    if (match?.id && !matchesById[match.id]) {
      matchesById[match.id] = match;
    }
  });

  bracketState.rounds.winner = (bracketState.rounds.winner || []).map((round) => (
    round.map((match) => matchesById[match.id] || match).filter(Boolean)
  ));
  bracketState.rounds.loser = (bracketState.rounds.loser || []).map((round) => (
    round.map((match) => matchesById[match.id] || match).filter(Boolean)
  ));
  bracketState.final = matchesById[bracketState.final?.id] ||
    fallbackMatches.find((match) => match.type === "final") ||
    null;
  bracketState.resetFinal = matchesById[bracketState.resetFinal?.id] ||
    fallbackMatches.find((match) => match.type === "resetFinal") ||
    null;
  bracketState.doubleDipFinal = matchesById[bracketState.doubleDipFinal?.id] ||
    fallbackMatches.find((match) => match.type === "doubleDipFinal") ||
    null;

  bracketState.matches = [
    ...bracketState.rounds.winner.flat(),
    ...bracketState.rounds.loser.flat(),
    bracketState.final,
    bracketState.resetFinal,
    bracketState.doubleDipFinal,
  ].filter(Boolean);
  bracketState.matchesById = {};
  bracketState.matches.forEach((match) => {
    bracketState.matchesById[match.id] = match;
  });
}

function addGraphSource(bracketState, destination, label) {
  if (!destination) {
    return;
  }

  const match = bracketState.matchesById[destination.matchId];
  if (match && !match.players[destination.slot]) {
    match.slotSources[destination.slot] = label;
  }
}

function isGraphHiddenMatch(match) {
  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  const sourceCount = match.slotSources.filter(Boolean).length;
  const templateSourceCount = state?.templateSources?.[match.id]?.filter(Boolean).length || 0;

  return match.autoAdvanced ||
    match.players.every((player) => player === "BYE") ||
    (realPlayerCount === 0 && sourceCount < 2 && templateSourceCount === 0);
}

function createBracket(players) {
  const size = nextPowerOfTwo(players.length);
  const seededPlayers = seedPlayersWithByes(players, size);
  const winnerRounds = createWinnerRounds(size);
  const loserRounds = createLoserRounds(size);
  const bracketState = {
    originalPlayers: [...players],
    size,
    winnerRounds,
    loserRounds,
    final: createMatch("final", 0, 0, "Final"),
    resetFinal: null,
    doubleDipFinal: null,
    champion: "",
  };

  winnerRounds[0].matches.forEach((match, index) => {
    match.players[0] = seededPlayers[index * 2];
    match.players[1] = seededPlayers[index * 2 + 1];
  });

  if (size === 2) {
    loserRounds[0].matches[0].players[1] = "BYE";
  }

  return bracketState;
}

function seedPlayersWithByes(players, size) {
  const seeds = Array(size).fill("BYE");
  const matchCount = size / 2;
  const byeCount = size - players.length;
  const playInCount = matchCount - byeCount;

  for (let matchIndex = 0; matchIndex < matchCount; matchIndex += 1) {
    seeds[matchIndex * 2] = players[matchIndex] || "BYE";
  }

  for (let index = 0; index < playInCount; index += 1) {
    const matchIndex = matchCount - 1 - index;
    const playerIndex = matchCount + index;
    seeds[matchIndex * 2 + 1] = players[playerIndex];
  }

  return seeds;
}

function createWinnerRounds(size) {
  const roundCount = Math.log2(size);

  return Array.from({ length: roundCount }, (_, roundIndex) => {
    const matchCount = size / 2 ** (roundIndex + 1);
    return {
      title: `Winners R${roundIndex + 1}`,
      matches: Array.from({ length: matchCount }, (_, matchIndex) => {
        return createMatch("winner", roundIndex, matchIndex, `Match ${matchIndex + 1}`);
      }),
    };
  });
}

function createLoserRounds(size) {
  const winnerRoundCount = Math.log2(size);
  const loserRoundCount = Math.max(1, winnerRoundCount * 2 - 2);

  return Array.from({ length: loserRoundCount }, (_, roundIndex) => {
    const roundNumber = roundIndex + 1;
    const exponent = roundNumber % 2 === 1
      ? (roundNumber + 3) / 2
      : roundNumber / 2 + 1;
    const matchCount = Math.max(1, size / 2 ** exponent);

    return {
      title: `Losers R${roundNumber}`,
      matches: Array.from({ length: matchCount }, (_, matchIndex) => {
        return createMatch("loser", roundIndex, matchIndex, `Match ${matchIndex + 1}`);
      }),
    };
  });
}

function createMatch(type, roundIndex, matchIndex, title) {
  return {
    id: `${type}-${roundIndex}-${matchIndex}`,
    type,
    roundIndex,
    matchIndex,
    title,
    players: ["", ""],
    slotSources: ["", ""],
    boardAssignment: null,
    winner: "",
    loser: "",
    autoAdvanced: false,
    gameNumber: 0,
  };
}

function assignGameNumbers(bracketState) {
  let gameNumber = 1;

  bracketState.winnerRounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (isPlayableMatch(match)) {
        match.gameNumber = gameNumber;
        match.title = `Game ${gameNumber}`;
        gameNumber += 1;
      } else {
        match.gameNumber = 0;
        match.title = "";
      }
    });
  });

  bracketState.loserRounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (isPlayableMatch(match)) {
        match.gameNumber = gameNumber;
        match.title = `Game ${gameNumber}`;
        gameNumber += 1;
      } else {
        match.gameNumber = 0;
        match.title = "";
      }
    });
  });

  bracketState.final.gameNumber = gameNumber;
  bracketState.final.title = `Game ${gameNumber}`;
}

function assignLoserDropSources(bracketState) {
  getAllMatches(bracketState).forEach((match) => {
    match.slotSources = ["", ""];
  });

  bracketState.winnerRounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (!match.gameNumber) {
        return;
      }

      const destination = getLoserDropDestination(match, bracketState);
      if (destination) {
        destination.match.slotSources[destination.slot] = `Loser of Game ${match.gameNumber}`;
      }
    });
  });

  assignWinnerAdvanceSources(bracketState);
}

function assignWinnerAdvanceSources(bracketState) {
  [...bracketState.winnerRounds, ...bracketState.loserRounds].forEach((round) => {
    round.matches.forEach((match) => {
      if (!match.gameNumber || !hasMatchInput(match)) {
        return;
      }

      const destination = getWinnerAdvanceDestination(match, bracketState);
      if (destination) {
        destination.match.slotSources[destination.slot] = `Winner of Game ${match.gameNumber}`;
      }
    });
  });
}

function hasMatchInput(match) {
  return match.players.some((player) => player && player !== "BYE") ||
    match.slotSources.some(Boolean);
}

function refreshGameNumbersAndSources(bracketState) {
  assignGameNumbers(bracketState);
  assignLoserDropSources(bracketState);
}

function isPlayableMatch(match) {
  return !match.autoAdvanced && !match.players.every((player) => player === "BYE");
}

function chooseWinnerLegacy(type, roundIndex, matchIndex, winnerName) {
  if (!winnerName || winnerName === "BYE") {
    return;
  }

  const match = getMatch(type, roundIndex, matchIndex);

  if (!applyWinner(match, winnerName)) {
    return;
  }

  sendBracketLegWinnerPortalNotice(match, winnerName);
  autoAdvanceByes(state);
  refreshGameNumbersAndSources(state);
  renderBracket();
}

function resetMatchResultLegacy(type, roundIndex, matchIndex) {
  if (!state) {
    return;
  }

  const targetId = `${type}-${roundIndex}-${matchIndex}`;
  const boardAssignments = new Map(
    getAllMatches(state).map((match) => [match.id, match.boardAssignment ?? null])
  );
  const manualResults = getAllMatches(state)
    .filter((match) => match.winner && !match.autoAdvanced && match.id !== targetId)
    .map((match) => ({
      type: match.type,
      roundIndex: match.roundIndex,
      matchIndex: match.matchIndex,
      winner: match.winner,
    }));

  const rebuilt = createBracket(state.originalPlayers);
  state = rebuilt;
  getAllMatches(state).forEach((match) => {
    if (boardAssignments.has(match.id)) {
      match.boardAssignment = boardAssignments.get(match.id);
    }
  });
  autoAdvanceByes(state);
  refreshGameNumbersAndSources(state);

  manualResults.forEach((result) => {
    const match = getMatch(result.type, result.roundIndex, result.matchIndex);
    if (match?.players.includes(result.winner) && !match.winner) {
      applyWinner(match, result.winner);
      autoAdvanceByes(state);
      refreshGameNumbersAndSources(state);
    }
  });

  renderBracket();
  showMessage("Match result cleared. Pick the correct winner.");
}

function applyWinner(match, winnerName) {
  const loserName = match.players.find((player) => player && player !== winnerName) || "";

  if (!loserName || loserName === "BYE") {
    return false;
  }

  match.winner = winnerName;
  match.loser = loserName;
  match.autoAdvanced = false;

  if (match.type === "final") {
    applyLegacyFinalResult(match, winnerName, loserName);
    return true;
  }

  if (match.type === "resetFinal") {
    applyLegacyResetFinalResult(match, winnerName, loserName);
    return true;
  }

  if (match.type === "doubleDipFinal") {
    state.champion = winnerName;
    return true;
  }

  advanceWinner(match, winnerName);
  dropLoser(match, loserName);
  return true;
}

function applyLegacyFinalResult(match, winnerName, loserName) {
  state.resetFinal = state.resetFinal || createMatch("resetFinal", 0, 0, "Game 0");
  state.resetFinal.gameNumber = (state.final.gameNumber || 0) + 1;
  state.resetFinal.title = `Game ${state.resetFinal.gameNumber}`;
  state.resetFinal.players = [...match.players];
  state.resetFinal.slotSources = ["", ""];
}

function applyLegacyResetFinalResult(match, winnerName, loserName) {
  if (getFinalSeriesWins(state, match.players[0]) >= 2) {
    state.champion = match.players[0];
    return;
  }

  state.doubleDipFinal = state.doubleDipFinal || createMatch("doubleDipFinal", 0, 0, "Game 0");
  state.doubleDipFinal.gameNumber = (state.resetFinal?.gameNumber || state.final.gameNumber || 0) + 1;
  state.doubleDipFinal.title = `Game ${state.doubleDipFinal.gameNumber}`;
  state.doubleDipFinal.players = [...match.players];
  state.doubleDipFinal.slotSources = ["", ""];
}

function advanceWinner(match, winnerName) {
  const destination = getWinnerAdvanceDestination(match, state);

  if (destination) {
    placePlayer(destination.match, destination.slot, winnerName);
    return;
  }

  if (match.type === "final") {
    state.champion = winnerName;
  }
}

function getWinnerAdvanceDestination(match, bracketState) {
  if (match.type === "winner") {
    const nextRound = bracketState.winnerRounds[match.roundIndex + 1];

    if (nextRound) {
      return {
        match: nextRound.matches[Math.floor(match.matchIndex / 2)],
        slot: match.matchIndex % 2,
      };
    }

    return { match: bracketState.final, slot: 0 };
  }

  if (match.type === "loser") {
    const nextRound = bracketState.loserRounds[match.roundIndex + 1];

    if (nextRound) {
      const isFeedRound = match.roundIndex % 2 === 0;
      const nextMatch = isFeedRound
        ? nextRound.matches[match.matchIndex]
        : nextRound.matches[Math.floor(match.matchIndex / 2)];
      const slot = isFeedRound ? 0 : match.matchIndex % 2;
      return { match: nextMatch, slot };
    }

    return { match: bracketState.final, slot: 1 };
  }

  return null;
}

function dropLoser(match, loserName) {
  if (match.type !== "winner") {
    return;
  }

  const destination = getLoserDropDestination(match, state);
  if (destination) {
    placePlayer(destination.match, destination.slot, loserName);
  }
}

function getLoserDropDestination(match, bracketState) {
  if (match.type !== "winner") {
    return null;
  }

  const mainFirstRoundIndex = getMainFirstWinnerRoundIndex(bracketState);

  if (match.roundIndex <= mainFirstRoundIndex) {
    const earlyMatches = bracketState.winnerRounds
      .slice(0, mainFirstRoundIndex + 1)
      .flatMap((round) => round.matches)
      .filter((winnerMatch) => winnerMatch.gameNumber)
      .sort((a, b) => a.gameNumber - b.gameNumber);
    const dropIndex = earlyMatches.findIndex((winnerMatch) => winnerMatch.id === match.id);
    const targetMatch = bracketState.loserRounds[0]?.matches[Math.floor(dropIndex / 2)];

    return targetMatch && dropIndex >= 0
      ? { match: targetMatch, slot: dropIndex % 2 }
      : null;
  }

  const loserRoundIndex = Math.max(1, (match.roundIndex - mainFirstRoundIndex) * 2 - 1);
  const targetRound = bracketState.loserRounds[loserRoundIndex];

  if (!targetRound) {
    return null;
  }

  const targetMatchIndex = getCrossDropMatchIndex(match.matchIndex, targetRound.matches.length);
  const targetMatch = targetRound.matches[targetMatchIndex];

  return targetMatch ? { match: targetMatch, slot: 1 } : null;
}

function getMainFirstWinnerRoundIndex(bracketState) {
  return bracketState.originalPlayers.length === bracketState.size ? 0 : 1;
}

function getCrossDropMatchIndex(matchIndex, targetMatchCount) {
  if (targetMatchCount <= 1) {
    return 0;
  }

  const groupSize = 2;
  const groupStart = Math.floor(matchIndex / groupSize) * groupSize;
  const offset = matchIndex % groupSize;
  const crossedIndex = groupStart + (groupSize - 1 - offset);

  return Math.min(crossedIndex, targetMatchCount - 1);
}

function placePlayer(match, slot, player) {
  if (!match || match.winner) {
    return;
  }

  match.players[slot] = player;
}

function getMatch(type, roundIndex, matchIndex) {
  if (type === "winner") {
    return state.winnerRounds[roundIndex].matches[matchIndex];
  }

  if (type === "loser") {
    return state.loserRounds[roundIndex].matches[matchIndex];
  }

  if (type === "resetFinal") {
    return state.resetFinal;
  }

  if (type === "doubleDipFinal") {
    return state.doubleDipFinal;
  }

  return state.final;
}

function autoAdvanceByes(bracketState) {
  let changed = true;

  while (changed) {
    changed = false;

    getAllMatches(bracketState).forEach((match) => {
      if (match.winner) {
        return;
      }

      const realPlayers = match.players.filter((player) => player && player !== "BYE");
      const hasBye = match.players.includes("BYE");

      if (realPlayers.length === 1 && hasBye) {
        match.winner = realPlayers[0];
        match.loser = "";
        match.autoAdvanced = true;
        advanceWinner(match, realPlayers[0]);
        changed = true;
      }
    });
  }
}

function getAllMatches(bracketState) {
  return [
    ...bracketState.winnerRounds.flatMap((round) => round.matches),
    ...bracketState.loserRounds.flatMap((round) => round.matches),
    bracketState.final,
    bracketState.resetFinal,
    bracketState.doubleDipFinal,
  ].filter(Boolean);
}

function renderBracket() {
  if (!state) {
    queueActiveLodCodesRefresh();
    return;
  }

  if (state.mode === "graph") {
    rebuildGraphMatchIndex(state);
    refreshGraphSources(state);
  }

  if (state.champion) {
    if (!scheduleBracketCleanupIfNeeded()) {
      return;
    }
  } else {
    clearBracketCleanupTimer();
    clearBracketCleanupStorage(lodCode);
  }

  championOutput.textContent = state.champion ? `Champion: ${state.champion}` : "Champion: pending";
  bracketOutput.className = "bracket";
  if (state.mode === "graph") {
    bracketOutput.innerHTML = renderPdfVisualBracket();
    updatePaperBackup();
    savePortalSnapshotToLocalStorage();
    saveBracketDraft();
    queueActiveLodCodesRefresh();
    return;
  }

  bracketOutput.innerHTML = `
    ${renderBracketSection("Winners bracket", state.winnerRounds)}
    ${renderBracketSection("Losers bracket", state.loserRounds)}
    ${renderFinal()}
  `;
  updatePaperBackup();
  savePortalSnapshotToLocalStorage();
  saveBracketDraft();
  queueActiveLodCodesRefresh();
}

function buildPortalSnapshot(exportedAt = new Date().toISOString()) {
  return {
    version: 1,
    exportedAt,
    lodCode,
    expiresAt: getBracketCleanupAt(lodCode) || "",
    state: state ? JSON.parse(JSON.stringify(state)) : null,
    outShots: getOutShots(),
    mysteryOut,
    portalNotice,
    portalNoticeAt,
    portalAutoNotice,
    portalAutoNoticeAt,
    portalBullshootNotice,
    portalBullshootNoticeAt,
  };
}

function savePortalSnapshotToLocalStorage() {
  const snapshot = buildPortalSnapshot();
  if (canUseLocalStorage()) {
    try {
      localStorage.setItem(getPortalSnapshotStorageKey(), JSON.stringify(snapshot));
    } catch {
      // Local portal caching is optional; bracket clicks must keep working.
    }
  }
  return queuePortalSnapshotPublish(snapshot);
}

function clearTournamentState({ preserveLodCode = true, clearDraft = true, code = lodCode } = {}) {
  const cleanupCode = normalizeLodCode(code || lodCode);

  if (portalPublishTimer) {
    clearTimeout(portalPublishTimer);
    portalPublishTimer = null;
  }
  lastPublishedPortalSnapshot = "";
  clearBracketCleanupTimer();
  if (cleanupCode) {
    clearBracketCleanupStorage(cleanupCode);
    clearPortalSnapshotStorage(cleanupCode);
  } else {
    clearPortalSnapshotStorage();
  }

  state = null;
  currentTeams = [];
  hasGeneratedTeams = false;
  blockedGenerateCount = 0;
  playerList.value = "";
  stopMysteryOutDrawAnimation();
  portalNotice = "";
  portalNoticeAt = "";
  portalNoticeDraft = "";
  portalAutoNotice = "";
  portalAutoNoticeAt = "";
  portalBullshootNotice = "";
  portalBullshootNoticeAt = "";
  if (portalNoticeInput) {
    portalNoticeInput.value = "";
  }
  if (portalNoticeStatus) {
    portalNoticeStatus.textContent = "";
  }
  if (portalAutoNoticeInput) {
    portalAutoNoticeInput.innerHTML = "";
  }
  if (portalAutoNoticeStatus) {
    portalAutoNoticeStatus.textContent = "";
  }
  if (portalBullshootNoticeInput) {
    portalBullshootNoticeInput.innerHTML = "";
  }
  if (portalBullshootNoticeStatus) {
    portalBullshootNoticeStatus.textContent = "";
  }
  championOutput.textContent = "Champion: pending";
  groupsOutput.className = "groups empty";
  groupsOutput.textContent = "No groups drawn yet.";
  bracketOutput.className = "bracket empty";
  bracketOutput.textContent = "Build a bracket to start.";
  paperBackup.textContent = "Build a bracket to create a paper backup.";
  mysteryOut = "";
  renderMysteryOut();
  savePortalSnapshotToLocalStorage();
  hideTeamDrawWarning();
  clearPlayerNames();

  if (clearDraft) {
    clearBracketDraftStorage();
  }

  if (!preserveLodCode) {
    lodCode = "";
    saveStoredLodCode("");
    renderPortalLink();
  }
}

function saveBracketDraft() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(bracketDraftStorageKey, JSON.stringify(buildBracketDraft()));
  } catch {
    // Ignore storage failures.
  }
}

function queueBracketDraftSave() {
  if (bracketDraftSaveTimer) {
    clearTimeout(bracketDraftSaveTimer);
  }

  bracketDraftSaveTimer = setTimeout(() => {
    bracketDraftSaveTimer = null;
    saveBracketDraft();
  }, 150);
}

function restoreBracketDraft() {
  const draft = readBracketDraft();
  if (!draft) {
    return;
  }

  if (typeof draft.lodCode === "string" && draft.lodCode.trim()) {
    lodCode = normalizeLodCode(draft.lodCode) || lodCode;
    saveStoredLodCode(lodCode);
    renderPortalLink();
  }

  if (Number.isInteger(Number(draft.totalPlayers)) && draft.totalPlayers > 0) {
    totalPlayers.value = String(draft.totalPlayers);
  }

  if (Number.isInteger(Number(draft.playersPerGroup)) && draft.playersPerGroup > 0) {
    playersPerGroup.value = String(draft.playersPerGroup);
  }

  renderNameInputs(Number(totalPlayers.value));

  if (draft.nameMap && typeof draft.nameMap === "object") {
    applyPlayerNameMap(draft.nameMap, true);
  }

  if (typeof draft.playerList === "string") {
    playerList.value = draft.playerList;
  }

  if (Array.isArray(draft.currentTeams) && draft.currentTeams.length) {
    currentTeams = draft.currentTeams;
    hasGeneratedTeams = Boolean(draft.hasGeneratedTeams);
    blockedGenerateCount = Number(draft.blockedGenerateCount || 0);
    renderGroups(currentTeams);
  }

  if (draft.state && typeof draft.state === "object") {
    state = draft.state;
    mysteryOut = draft.mysteryOut || "";

    if (state.mode === "graph") {
      rebuildGraphMatchIndex(state);
      refreshGraphSources(state);
    } else {
      refreshGameNumbersAndSources(state);
    }

    const savedExpiry = Number(draft.expiresAt || 0);
    if (state.champion) {
      if (Number.isFinite(savedExpiry) && savedExpiry > 0) {
        saveBracketCleanupAt(lodCode, savedExpiry);
        const remaining = savedExpiry - Date.now();
        if (remaining <= 0) {
          expireBracketSession(lodCode);
          return;
        }
      } else {
        saveBracketCleanupAt(lodCode, Date.now() + bracketCleanupDurationMs);
      }
    }

    renderBracket();
    syncPdfLayoutToTeamCount(state.originalPlayers?.length || Number(totalPlayers.value) || 0);
    syncPayoutTeams(state.originalPlayers?.length || Number(totalPlayers.value) || 0);
  }

  if (typeof draft.portalNotice === "string") {
    portalNotice = draft.portalNotice;
  }

  if (typeof draft.portalNoticeAt === "string") {
    portalNoticeAt = draft.portalNoticeAt;
  }

  if (typeof draft.portalNoticeDraft === "string") {
    portalNoticeDraft = draft.portalNoticeDraft;
  } else {
    portalNoticeDraft = draft.portalNotice || "";
  }

  if (portalNoticeInput) {
    portalNoticeInput.value = portalNoticeDraft;
  }

  if (typeof draft.portalAutoNotice === "string") {
    portalAutoNotice = draft.portalAutoNotice;
  }

  if (typeof draft.portalAutoNoticeAt === "string") {
    portalAutoNoticeAt = draft.portalAutoNoticeAt;
  }

  if (portalAutoNoticeInput) {
    portalAutoNoticeInput.innerHTML = renderAdminNoticeMarkup(portalAutoNotice, /^Split The Pot winner\b/i);
  }

  if (typeof draft.portalBullshootNotice === "string") {
    portalBullshootNotice = draft.portalBullshootNotice;
  }

  if (typeof draft.portalBullshootNoticeAt === "string") {
    portalBullshootNoticeAt = draft.portalBullshootNoticeAt;
  }

  if (portalBullshootNoticeInput) {
    portalBullshootNoticeInput.innerHTML = renderAdminNoticeMarkup(portalBullshootNotice, /^Bullshoot winner\b/i);
  }

  if (typeof draft.mysteryOut === "string") {
    mysteryOut = draft.mysteryOut;
    renderMysteryOut();
  } else if (draft.mysteryOut && typeof draft.mysteryOut === "object") {
    mysteryOut = draft.mysteryOut;
    if (draft.mysteryOut.mode) {
      setMysteryOutMode(draft.mysteryOut.mode);
    }
    renderMysteryOut();
  }

  if (Array.isArray(draft.diceValues) && draft.diceValues.length >= 2) {
    draft.diceValues.slice(0, 2).forEach((value, index) => {
      const numeric = Number(value) || 1;
      setDieValue(index, numeric < 1 ? 1 : numeric);
    });
  }

  if (pdfLayoutSelect && Number.isInteger(Number(draft.pdfLayoutValue))) {
    pdfLayoutSelect.value = String(draft.pdfLayoutValue);
    renderPdfColumnMirror(Number(draft.pdfLayoutValue));
  }

  if (draft.payout && typeof draft.payout === "object") {
    if (payoutTeams && draft.payout.teams !== undefined) {
      payoutTeams.value = String(draft.payout.teams);
    }
    if (payoutEntry && draft.payout.entry !== undefined) {
      payoutEntry.value = String(draft.payout.entry);
    }
    if (payoutAdded && draft.payout.added !== undefined) {
      payoutAdded.value = String(draft.payout.added);
    }
    if (payoutPlaces && draft.payout.places !== undefined) {
      payoutPlaces.value = String(draft.payout.places);
    }
    if (Array.isArray(draft.payout.percentValues)) {
      renderPayoutPercentInputs(Number(payoutPlaces?.value || 0));
      Array.from(document.querySelectorAll("[data-payout-percent]")).forEach((input, index) => {
        if (draft.payout.percentValues[index] !== undefined) {
          input.value = String(draft.payout.percentValues[index]);
        }
      });
    }
    updatePayoutCalculator();
  }

  queueBracketDraftSave();
}

function readBracketDraft() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(bracketDraftStorageKey);
    if (!raw) {
      return null;
    }

    const draft = JSON.parse(raw);
    return draft && typeof draft === "object" ? draft : null;
  } catch {
    return null;
  }
}

function clearBracketDraftStorage() {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.removeItem(bracketDraftStorageKey);
  } catch {
    // Ignore storage failures.
  }
}

function buildBracketDraft() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    totalPlayers: Number(totalPlayers.value) || 0,
    playersPerGroup: Number(playersPerGroup.value) || 0,
    playerList: playerList.value || "",
    nameMap: getPlayerNameMap(),
    currentTeams,
    hasGeneratedTeams,
    blockedGenerateCount,
    state: state ? JSON.parse(JSON.stringify(state)) : null,
    mysteryOut,
    diceValues: [...diceValues],
    payout: {
      teams: payoutTeams?.value || "",
      entry: payoutEntry?.value || "",
      added: payoutAdded?.value || "",
      places: payoutPlaces?.value || "",
      percentValues: Array.from(document.querySelectorAll("[data-payout-percent]")).map((input) => input.value),
    },
    pdfLayoutValue: pdfLayoutSelect?.value || "",
    lodCode,
    expiresAt: getBracketCleanupAt(lodCode) || "",
    portalNotice,
    portalNoticeDraft,
    portalAutoNotice,
    portalAutoNoticeAt,
    portalBullshootNotice,
    portalBullshootNoticeAt,
  };
}

function scheduleBracketCleanupIfNeeded() {
  clearBracketCleanupTimer();
  clearBracketCleanupStorage(lodCode);
  return true;
}

function expireBracketSession(code = lodCode) {
  const expiredCode = normalizeLodCode(code);
  clearBracketCleanupTimer();
  clearTournamentState({ preserveLodCode: false, clearDraft: true, code: expiredCode });
  if (expiredCode) {
    clearBracketCleanupStorage(expiredCode);
  }
  queueActiveLodCodesRefresh();
  showMessage(expiredCode
    ? `LOD ${expiredCode} expired after 60 minutes and was cleared.`
    : "Expired bracket session cleared.");
}

function getBracketCleanupAt(code = lodCode) {
  if (!canUseLocalStorage()) {
    return 0;
  }

  try {
    const raw = localStorage.getItem(getBracketCleanupStorageKey(code));
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function saveBracketCleanupAt(code = lodCode, expiresAt) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(getBracketCleanupStorageKey(code), String(Number(expiresAt) || 0));
  } catch {
    // Ignore storage failures.
  }
}

function clearBracketCleanupStorage(code = lodCode) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.removeItem(getBracketCleanupStorageKey(code));
  } catch {
    // Ignore storage failures.
  }
}

function clearBracketCleanupTimer() {
  if (bracketCleanupTimer) {
    clearTimeout(bracketCleanupTimer);
    bracketCleanupTimer = null;
  }
}

function getBracketCleanupStorageKey(code = lodCode) {
  const normalized = normalizeLodCode(code) || "default";
  return `${bracketCleanupStorageKey}:${normalized}`;
}

function queueActiveLodCodesRefresh() {
  if (!lodRegistryList) {
    return;
  }

  if (registryRefreshTimer) {
    clearTimeout(registryRefreshTimer);
  }

  registryRefreshTimer = setTimeout(() => {
    registryRefreshTimer = null;
    loadActiveLodCodes(false);
  }, REGISTRY_REFRESH_DEBOUNCE_MS);
}

async function loadActiveLodCodes(announceFailure = false) {
  if (!lodRegistryList) {
    return;
  }

  for (const baseUrl of API_BASE_URLS.length ? API_BASE_URLS : [""]) {
    if (!baseUrl) {
      continue;
    }

    try {
      const response = await fetch(getRegistryUrl(baseUrl), { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const registry = normalizeRegistry(await response.json());
      renderActiveLodCodes(registry, baseUrl);
      return;
    } catch {
      // Try the next host.
    }
  }

  renderActiveLodCodes({ codes: [], updatedAt: "" }, "");
  if (announceFailure) {
    showMessage("Unable to load the active LOD registry.");
  }
}

function getRegistryUrl(baseUrl) {
  return `${baseUrl}/api/lod`;
}

function normalizeRegistry(data) {
  if (Array.isArray(data)) {
    return {
      version: 1,
      updatedAt: "",
      codes: data.map(normalizeLodCode).filter(Boolean),
    };
  }

  if (!data || typeof data !== "object") {
    return { version: 1, updatedAt: "", codes: [] };
  }

  return {
    version: Number(data.version || 1),
    updatedAt: data.updatedAt || "",
    codes: Array.isArray(data.codes) ? data.codes.map(normalizeLodCode).filter(Boolean) : [],
  };
}

function renderActiveLodCodes(registry, sourceBaseUrl) {
  if (!lodRegistryList) {
    return;
  }

  const codes = Array.from(new Set((registry?.codes || []).filter(Boolean))).sort();
  const updatedLabel = registry?.updatedAt ? `Updated ${formatBackupTime(registry.updatedAt)}` : "No registry timestamp";
  const sourceLabel = sourceBaseUrl ? `Source: ${sourceBaseUrl}` : "Source unavailable";

  if (!codes.length) {
    lodRegistryList.innerHTML = `
      <div class="lod-registry-empty">
        <strong>No active LODs published yet.</strong>
        <span>${escapeHtml(sourceLabel)}</span>
      </div>
    `;
    return;
  }

  lodRegistryList.innerHTML = `
    <div class="lod-registry-meta">
      <strong>${escapeHtml(`${codes.length} active LOD${codes.length === 1 ? "" : "s"}`)}</strong>
      <span>${escapeHtml(updatedLabel)} • ${escapeHtml(sourceLabel)}</span>
    </div>
    <div class="lod-registry-codes">
      ${codes.map((code) => `<code>${escapeHtml(code)}</code>`).join("")}
    </div>
  `;
}

function clearPortalSnapshotStorage(code = lodCode) {
  const snapshotCode = normalizeLodCode(code);
  if (canUseLocalStorage()) {
    if (!snapshotCode || snapshotCode === normalizeLodCode(lodCode)) {
      localStorage.removeItem(getPortalSnapshotStorageKey());
    } else {
      localStorage.removeItem(`${portalSnapshotStorageKey}:${snapshotCode}`);
    }
  }

  if (!API_BASE_URLS.length || !snapshotCode) {
    return;
  }

  API_BASE_URLS.forEach((baseUrl) => {
    fetch(getApiSnapshotUrl(baseUrl, snapshotCode), { method: "DELETE" }).catch(() => {
      // Ignore cleanup failures; the next publish will overwrite the old snapshot.
    });
  });
}

function downloadPortalSnapshot() {
  const snapshot = buildPortalSnapshot();
  const blob = new Blob([`${JSON.stringify(snapshot, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `lod-${lodCode}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function queuePortalSnapshotPublish(snapshot) {
  if (!API_BASE_URLS.length || !snapshot || !snapshot.lodCode) {
    return false;
  }

  if (portalPublishTimer) {
    clearTimeout(portalPublishTimer);
  }

  portalPublishTimer = setTimeout(() => {
    portalPublishTimer = null;
    publishPortalSnapshotToApi(snapshot);
  }, API_PUBLISH_DEBOUNCE_MS);
  return true;
}

async function publishPortalSnapshotToApi(snapshot) {
  if (!API_BASE_URLS.length || !snapshot || !snapshot.lodCode) {
    return;
  }

  const serialized = JSON.stringify(snapshot);
  if (serialized === lastPublishedPortalSnapshot) {
    return;
  }

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(getApiSnapshotUrl(baseUrl, snapshot.lodCode), {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: serialized,
      });

      if (response.ok) {
        lastPublishedPortalSnapshot = serialized;
      }
    } catch {
      // Ignore publish failures; the local snapshot remains available.
    }
  }
}

function saveBracketBackup(action) {
  if (!state || !canUseLocalStorage()) {
    return;
  }

  try {
    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const backup = {
      id,
      createdAt,
      action,
      state: JSON.parse(JSON.stringify(state)),
    };
    const index = pruneBracketBackups(readBackupIndex(), maxBracketBackups - 1);

    localStorage.setItem(`${backupKeyPrefix}${id}`, JSON.stringify(backup));
    index.push({ id, createdAt, action });
    localStorage.setItem(backupIndexKey, JSON.stringify(index));
    renderBackups();
    updatePaperBackup(backup.state, `Backup saved ${formatBackupTime(createdAt)}`);
  } catch {
    try {
      pruneBracketBackups(readBackupIndex(), Math.floor(maxBracketBackups / 2));
      renderBackups();
    } catch {
      // Backup cleanup is best effort; bracket clicks must still be allowed through.
    }
    showMessage("Bracket can still advance, but the backup could not be saved. Delete old backups if this keeps happening.");
  }
}

function pruneBracketBackups(index, keepCount = maxBracketBackups) {
  if (!canUseLocalStorage()) {
    return [];
  }

  const cleanedIndex = Array.isArray(index) ? index.filter((backup) => backup?.id) : [];
  const removeCount = Math.max(0, cleanedIndex.length - Math.max(0, keepCount));
  if (removeCount) {
    cleanedIndex.splice(0, removeCount).forEach((backup) => {
      localStorage.removeItem(`${backupKeyPrefix}${backup.id}`);
    });
  }

  localStorage.setItem(backupIndexKey, JSON.stringify(cleanedIndex));
  return cleanedIndex;
}

function renderBackups() {
  if (!backupList) {
    return;
  }

  if (!canUseLocalStorage()) {
    backupList.className = "backup-list empty";
    backupList.textContent = "Backups need browser storage.";
    return;
  }

  const index = readBackupIndex();

  if (!index.length) {
    backupList.className = "backup-list empty";
    backupList.textContent = "No bracket backups yet.";
    return;
  }

  backupList.className = "backup-list";
  backupList.innerHTML = index.slice().reverse().map((backup, reverseIndex) => {
    const number = index.length - reverseIndex;
    const action = backup.action?.selectedWinner
      ? `Before selecting ${backup.action.selectedWinner}`
      : "Before bracket click";

    return `
      <article class="backup-item">
        <div>
          <strong>Backup ${number}</strong>
          <span>${escapeHtml(formatBackupTime(backup.createdAt))}</span>
          <small>${escapeHtml(action)}</small>
        </div>
        <div class="backup-item-actions">
          <button class="secondary" type="button" data-backup-id="${escapeAttribute(backup.id)}">Restore</button>
          <button class="danger" type="button" data-delete-backup-id="${escapeAttribute(backup.id)}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function deleteBackup(id) {
  if (!canUseLocalStorage()) {
    return;
  }

  const index = readBackupIndex().filter((backup) => backup.id !== id);
  localStorage.removeItem(`${backupKeyPrefix}${id}`);
  localStorage.setItem(backupIndexKey, JSON.stringify(index));
  renderBackups();
}

function deleteAllBackups() {
  if (!canUseLocalStorage()) {
    return;
  }

  readBackupIndex().forEach((backup) => {
    localStorage.removeItem(`${backupKeyPrefix}${backup.id}`);
  });
  localStorage.removeItem(backupIndexKey);
  renderBackups();
}

function savePlayerNameBackup(playerCount) {
  if (!canUseLocalStorage()) {
    return;
  }

  const names = getPlayerNameMap();
  const createdAt = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const backup = {
    id,
    createdAt,
    playerCount,
    names,
  };
  const index = readNameBackupIndex();

  localStorage.setItem(`${nameBackupKeyPrefix}${id}`, JSON.stringify(backup));
  index.push({
    id,
    createdAt,
    playerCount,
    nameCount: Object.keys(names).length,
  });
  localStorage.setItem(nameBackupIndexKey, JSON.stringify(index));
  renderNameBackups();
}

function renderNameBackups() {
  if (!nameBackupList) {
    return;
  }

  if (!canUseLocalStorage()) {
    nameBackupList.className = "backup-list empty";
    nameBackupList.textContent = "Player name backups need browser storage.";
    return;
  }

  const index = readNameBackupIndex();

  if (!index.length) {
    nameBackupList.className = "backup-list empty";
    nameBackupList.textContent = "No player name backups yet.";
    return;
  }

  nameBackupList.className = "backup-list";
  nameBackupList.innerHTML = index.slice().reverse().map((backup, reverseIndex) => {
    const number = index.length - reverseIndex;

    return `
      <article class="backup-item">
        <div>
          <strong>Name backup ${number}</strong>
          <span>${escapeHtml(formatBackupTime(backup.createdAt))}</span>
          <small>${backup.nameCount} saved name${backup.nameCount === 1 ? "" : "s"} for ${backup.playerCount} player slots</small>
        </div>
        <div class="backup-item-actions">
          <button class="secondary" type="button" data-merge-name-backup-id="${escapeAttribute(backup.id)}">Merge names</button>
          <button class="danger" type="button" data-delete-name-backup-id="${escapeAttribute(backup.id)}">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function mergePlayerNameBackup(id) {
  const backup = readNameBackup(id);

  if (!backup) {
    showMessage("That player name backup could not be loaded.");
    renderNameBackups();
    return;
  }

  const currentCount = Number(totalPlayers.value);
  if (backup.playerCount > currentCount) {
    totalPlayers.value = backup.playerCount;
    renderNameInputs(backup.playerCount);
  }

  applyPlayerNameMap(backup.names, false);
  showMessage("Player names merged. Existing typed names were kept.");
}

function deletePlayerNameBackup(id) {
  if (!canUseLocalStorage()) {
    return;
  }

  const index = readNameBackupIndex().filter((backup) => backup.id !== id);
  localStorage.removeItem(`${nameBackupKeyPrefix}${id}`);
  localStorage.setItem(nameBackupIndexKey, JSON.stringify(index));
  renderNameBackups();
}

function readNameBackupIndex() {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(nameBackupIndexKey)) || [];
  } catch {
    return [];
  }
}

function readNameBackup(id) {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(`${nameBackupKeyPrefix}${id}`));
  } catch {
    return null;
  }
}

function readBackupIndex() {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(backupIndexKey)) || [];
  } catch {
    return [];
  }
}

function readBackup(id) {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(`${backupKeyPrefix}${id}`));
  } catch {
    return null;
  }
}

function canUseLocalStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

function getPortalSnapshotStorageKey() {
  return `${portalSnapshotStorageKey}:${lodCode}`;
}

function getStoredLodCode() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(lodCodeStorageKey);
    if (raw === null) {
      return null;
    }
    if (raw === lodCodeClearedValue) {
      return "";
    }
    return normalizeLodCode(raw);
  } catch {
    return null;
  }
}

function saveStoredLodCode(code) {
  if (!canUseLocalStorage()) {
    return;
  }

  localStorage.setItem(lodCodeStorageKey, code || lodCodeClearedValue);
}

function generateLodCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = new Uint32Array(6);

  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * alphabet.length);
    }
  }

  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

function normalizeLodCode(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);
}

function getPortalLink() {
  const code = normalizeLodCode(lodCode);
  const url = new URL("portal.html", window.location.href);

  if (code) {
    url.searchParams.set("lod", code);
  }

  url.searchParams.set("ui", "2");

  return url.toString();
}

function getApiBaseUrls() {
  const configuredUrls = Array.isArray(window.BRACKET_API_BASE_URLS)
    ? window.BRACKET_API_BASE_URLS
    : [window.BRACKET_API_BASE_URL];

  return configuredUrls
    .map(normalizeApiBaseUrl)
    .filter(Boolean);
}

function normalizeApiBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.replace(/\/+$/, "");
}

function getApiSnapshotUrl(baseUrl, code) {
  return `${baseUrl}/api/lod/${encodeURIComponent(normalizeLodCode(code))}`;
}

function renderPortalLink() {
  const code = normalizeLodCode(lodCode) || "------";
  const link = getPortalLink();

  if (lodCodeText) {
    lodCodeText.textContent = `LOD: ${code}`;
  }

  if (portalQrCode) {
    portalQrCode.src = createPortalQrDataUrl(link, 500);
  }

  if (lodCodeInput) {
    lodCodeInput.value = normalizeLodCode(lodCode);
  }
}

function formatBackupTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "unknown time";
  }

  return date.toLocaleString();
}

function updatePaperBackup(bracketState = state, title = "Current bracket") {
  if (!paperBackup) {
    return;
  }

  paperBackup.textContent = bracketState
    ? bracketToText(bracketState, title)
    : "Build a bracket to create a paper backup.";
}

function bracketToText(bracketState, title) {
  if (bracketState.mode === "graph") {
    const lines = [
      title,
      `Champion: ${bracketState.champion || "pending"}`,
      "",
      "WINNERS BRACKET",
      ...roundsToText(bracketState.rounds.winner),
      "",
      "LOSERS BRACKET",
      ...roundsToText(bracketState.rounds.loser),
      "",
      "FINAL",
      matchToText(bracketState.final),
      ...(bracketState.resetFinal && !isGraphHiddenMatch(bracketState.resetFinal)
        ? [matchToText(bracketState.resetFinal)]
        : []),
      ...(bracketState.doubleDipFinal && !isGraphHiddenMatch(bracketState.doubleDipFinal)
        ? [matchToText(bracketState.doubleDipFinal)]
        : []),
    ];

    return lines.join("\n");
  }

  const lines = [
    title,
    `Champion: ${bracketState.champion || "pending"}`,
    "",
    "WINNERS BRACKET",
    ...roundsToText(bracketState.winnerRounds),
    "",
    "LOSERS BRACKET",
    ...roundsToText(bracketState.loserRounds),
    "",
    "FINAL",
    matchToText(bracketState.final),
  ];

  return lines.join("\n");
}

function renderGraphSection(title, rounds) {
  return `
    <section class="bracket-section">
      <h3>${title}</h3>
      <div class="rounds">
        ${rounds.map((round, index) => `
          <div class="round">
            <p class="round-title">${title.startsWith("Winners") ? "Winners" : "Losers"} R${index + 1}</p>
            ${round.map(renderMatch).join("")}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPdfVisualBracket() {
  const doubleDipFinal = state.resetFinal && state.resetFinal.winner && state.resetFinal.winner !== state.resetFinal.players[0]
    ? ensureDoubleDipFinal(state, state.resetFinal, state.resetFinal.players[0], state.resetFinal.players[1])
    : state.doubleDipFinal;
  const finalMatches = [state.final, state.resetFinal, doubleDipFinal].filter(Boolean);
  const maxColumns = Math.max(state.rounds.winner.length, state.rounds.loser.length, finalMatches.length ? 1 : 0);

  return `
    <section class="bracket-section pdf-visual-section">
      <div class="pdf-visual-heading">
        <div>
          <h3>PDF bracket</h3>
          <p>${escapeHtml(state.originalPlayers.length)} teams - printed game layout</p>
        </div>
        <span>${escapeHtml(pdfBracketLayouts[state.originalPlayers.length]?.pdf || "Generated bracket")}</span>
      </div>
      <div class="pdf-visual-scroll">
        <div class="pdf-visual-grid" style="--pdf-columns: ${maxColumns};">
          ${renderPdfVisualBand("Winners bracket", state.rounds.winner, "winner")}
          ${renderPdfVisualBand("Losers bracket", state.rounds.loser, "loser")}
          <div class="pdf-visual-band final-band">
            <p class="pdf-band-title">Final</p>
            <div class="pdf-visual-columns">
              <div class="pdf-visual-column final-column">
                ${finalMatches.map((match) => renderFinalMatchBlock(match, match.title)).join("")}
                ${renderChampionBox()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderPdfVisualBand(title, rounds, type) {
  const hasPlayIn = type === "winner" && state.matches.some((match) => match.type === "winner" && isPlayInMatch(match));
  const greyColumnIndex = type === "winner" ? (hasPlayIn ? 2 : 1) : -1;

  return `
    <div class="pdf-visual-band ${type}-band">
      <p class="pdf-band-title">${title}</p>
      <div class="pdf-visual-columns">
        ${rounds.map((round, index) => `
          <div class="pdf-visual-column ${type}-column ${index === greyColumnIndex ? "grey-column" : ""}" style="--column-index: ${index};">
            <p class="round-title">${type === "winner" ? "Winners" : "Losers"} R${index + 1}</p>
            <div class="pdf-column-matches" style="--match-count: ${Math.max(round.length, 1)};">
              ${round.map(renderMatch).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGraphFinal() {
  const doubleDipFinal = state.resetFinal && state.resetFinal.winner && state.resetFinal.winner !== state.resetFinal.players[0]
    ? ensureDoubleDipFinal(state, state.resetFinal, state.resetFinal.players[0], state.resetFinal.players[1])
    : state.doubleDipFinal;

  return `
    <section class="bracket-section final-section">
      <h3>Final</h3>
      <div class="final-layout">
        <div class="rounds">
          <div class="round">
            ${renderFinalMatchBlock(state.final, state.final.title)}
            ${state.resetFinal ? renderFinalMatchBlock(state.resetFinal, state.resetFinal.title) : ""}
            ${doubleDipFinal ? renderFinalMatchBlock(doubleDipFinal, doubleDipFinal.title) : ""}
          </div>
        </div>
        ${renderChampionBox()}
      </div>
    </section>
  `;
}

function renderChampionBox() {
  const champion = state.champion || "Pending";
  const finalGame = state.final?.title || "Final pending";
  const className = state.champion ? "champion-box winner" : "champion-box";

  return `
    <aside class="${className}" aria-label="Tournament winner">
      <p class="champion-box-title">Winner</p>
      <p class="champion-box-game">${escapeHtml(finalGame)}</p>
      <div class="champion-box-name">${escapeHtml(champion)}</div>
      <p class="champion-box-note">${state.champion ? "Tournament champion" : "Waiting for final result"}</p>
    </aside>
  `;
}

function renderFinalMatchBlock(match, title) {
  return `
    <div class="final-match-block">
      <p class="round-title">${title}</p>
      <article class="match ${advancingMatchId === match.id ? "match-advance" : ""}">
        <div class="match-header">
          <p class="match-title">${match.title}</p>
          ${match.winner && !match.autoAdvanced ? `
            <button
              class="reset-match"
              type="button"
              data-reset-match="${escapeAttribute(match.id)}"
              data-match-id="${match.id}"
              data-match-type="${escapeAttribute(match.type)}"
              data-round-index="${match.roundIndex}"
              data-match-index="${match.matchIndex}"
            >Fix</button>
          ` : ""}
        </div>
        <div class="match-tools">
          ${renderBoardAssignmentControl(match)}
        </div>
        ${buildMatchMeta(match)}
        <div class="slots">
          ${match.players.map((player, slotIndex) => renderPlayerButton(match, player, slotIndex, shouldDisablePendingGraphMatch(match))).join("")}
        </div>
      </article>
    </div>
  `;
}

function roundsToText(rounds) {
  return rounds.flatMap((round) => [
    round.title || "",
    ...(Array.isArray(round) ? round : round.matches).map(matchToText),
    "",
  ]);
}

function matchToText(match) {
  const first = match.players[0] || match.slotSources[0] || "Waiting";
  const second = match.players[1] || match.slotSources[1] || "Waiting";
  const result = match.winner ? ` -> Winner: ${match.winner}` : "";

  return `${match.title}: ${first} vs ${second}${result}`;
}

function renderBracketSection(title, rounds) {
  return `
    <section class="bracket-section">
      <h3>${title}</h3>
      <div class="rounds">
        ${rounds.map((round) => `
          <div class="round">
            <p class="round-title">${round.title}</p>
            ${round.matches.map(renderMatch).join("")}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFinal() {
  const doubleDipFinal = state.resetFinal && state.resetFinal.winner && state.resetFinal.winner !== state.resetFinal.players[0]
    ? ensureDoubleDipFinal(state, state.resetFinal, state.resetFinal.players[0], state.resetFinal.players[1])
    : state.doubleDipFinal;

  return `
    <section class="bracket-section">
      <h3>Final</h3>
      <div class="rounds">
        <div class="round">
          <p class="round-title">Championship</p>
          ${renderMatch(state.final)}
          ${state.resetFinal ? renderMatch(state.resetFinal) : ""}
          ${doubleDipFinal ? renderMatch(doubleDipFinal) : ""}
        </div>
      </div>
    </section>
  `;
}

function renderMatch(match) {
  if (state?.mode === "graph" && isGraphHiddenMatch(match)) {
    return "";
  }

  if (
    match.players.every((player) => player === "BYE") ||
    match.autoAdvanced ||
    (!hasMatchInput(match) && state?.mode !== "graph")
  ) {
    return "";
  }

  return `
    <article class="match ${advancingMatchId === match.id ? "match-advance" : ""}">
      <div class="match-header">
        <p class="match-title">${formatMatchTitle(match)}</p>
        ${match.winner && !match.autoAdvanced ? `
          <button
            class="reset-match"
            type="button"
            data-reset-match="${escapeAttribute(match.id)}"
            data-match-id="${match.id}"
            data-match-type="${escapeAttribute(match.type)}"
            data-round-index="${match.roundIndex}"
            data-match-index="${match.matchIndex}"
        >Fix</button>
        ` : ""}
      </div>
      <div class="match-tools">
        ${renderBoardAssignmentControl(match)}
      </div>
      ${buildMatchMeta(match)}
      <div class="slots">
        ${match.players.map((player, slotIndex) => renderPlayerButton(match, player, slotIndex, shouldDisablePendingGraphMatch(match))).join("")}
      </div>
    </article>
  `;
}

function formatMatchTitle(match) {
  const playInLabel = isPlayInMatch(match) ? "PLAY IN - " : "";
  const byeLabel = match.autoAdvanced ? " - BYE" : "";
  return `${playInLabel}${match.title}${byeLabel}`;
}

function isPlayInMatch(match) {
  if (state?.mode === "graph") {
    return Boolean(match?.isPlayIn) || isGraphPlayInMatch(match, state);
  }

  if (!match || match.type !== "winner") {
    return false;
  }

  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  return Boolean(state) &&
    realPlayerCount >= 2 &&
    match.roundIndex === 0 &&
    state.originalPlayers.length !== state.size;
}

function shouldDisablePendingGraphMatch(match) {
  if (state?.mode !== "graph" || match.winner) {
    return false;
  }

  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  return realPlayerCount < 2;
}

function buildMatchMeta(match) {
  if (state?.mode === "graph") {
    const winnerMatch = match.winnerTo ? state.matchesById[match.winnerTo.matchId] : null;
    const loserMatch = match.loserTo ? state.matchesById[match.loserTo.matchId] : null;
    const winnerTarget = winnerMatch
      ? `Winner to Game ${winnerMatch.id} ${formatGraphSlot(match.winnerTo.slot)}`
      : match.type === "final" ? "Winner is champion or forces reset"
        : match.type === "resetFinal" ? "Winner is champion or forces double dip"
          : match.type === "doubleDipFinal" ? "Winner is champion" : "";
    const loserTarget = loserMatch && match.type === "winner"
      ? `Loser to L${match.id} in Game ${loserMatch.id} ${formatGraphSlot(match.loserTo.slot)}`
      : "";
    const labels = [winnerTarget, loserTarget].filter(Boolean);

    return labels.length ? `<p class="match-meta">${labels.join(" | ")}</p>` : "";
  }

  const destination = state ? getWinnerAdvanceDestination(match, state) : null;
  const winnerTarget = destination?.match?.gameNumber
    ? `Winner to Game ${destination.match.gameNumber}`
    : match.type === "final" ? "Winner is champion"
      : match.type === "resetFinal" ? "Winner is champion or forces double dip"
        : match.type === "doubleDipFinal" ? "Winner is champion" : "";
  const loserTarget = match.type === "winner"
    ? getLoserDestinationLabel(match)
    : "";
  const labels = [winnerTarget, loserTarget].filter(Boolean);

  if (!labels.length) {
    return "";
  }

  return `<p class="match-meta">${labels.join(" | ")}</p>`;
}

function renderBoardAssignmentControl(match) {
  const currentValue = Number(match.boardAssignment) || 0;

  return `
    <label class="board-assignment-field">
      <span>Board</span>
      <select
        class="board-assignment-select"
        data-board-assignment
        data-match-id="${match.id}"
        aria-label="Board assignment for ${escapeAttribute(formatMatchTitle(match))}"
      >
        <option value=""${currentValue ? "" : " selected"}>Unassigned</option>
        ${Array.from({ length: 10 }, (_, index) => {
          const value = index + 1;
          return `<option value="${value}"${currentValue === value ? " selected" : ""}>${value}</option>`;
        }).join("")}
      </select>
    </label>
  `;
}

function formatGraphSlot(slot) {
  return slot === 0 ? "(top slot)" : "(bottom slot)";
}

function getLoserDestinationLabel(match) {
  const destination = state ? getLoserDropDestination(match, state) : null;

  if (!destination?.match?.gameNumber) {
    return "";
  }

  return `Loser to Game ${destination.match.gameNumber}`;
}

function renderPlayerButton(match, player, slotIndex, forceDisabled = false) {
  const sourceLabel = match.slotSources[slotIndex];
  const label = player || sourceLabel || "Waiting";
  const isWinner = player && match.winner === player;
  const isLoser = player && match.loser === player && player !== "BYE";
  const isBye = player === "BYE";
  const winnerSourceMatch = /^winner of game\s+(\d{1,3})\b/i.exec(label);
  const winnerSourceGame = winnerSourceMatch ? Number(winnerSourceMatch[1]) : 0;
  const isWinnerSource = winnerSourceGame >= 1 && winnerSourceGame <= 100;
  const loserSourceMatch = /\bloser of game\s+(\d{1,3})\b/i.exec(label);
  const loserSourceGame = loserSourceMatch ? Number(loserSourceMatch[1]) : 0;
  const isLoserSource = loserSourceGame >= 1 && loserSourceGame <= 100;
  const renderedLabel = isWinnerSource
    ? `<span class="winner-source-text">${escapeHtml(label)}</span>`
    : isLoserSource
      ? `<span class="loser-source-text">${escapeHtml(label)}</span>`
    : escapeHtml(label);
  const classNames = [
    "player-button",
    !player ? "waiting" : "",
    sourceLabel && !player ? "source-slot" : "",
    isWinnerSource ? "winner-source" : "",
    isLoserSource ? "loser-source" : "",
    isWinner ? "winner" : "",
    isLoser ? "loser" : "",
    isBye ? "bye" : "",
  ].filter(Boolean).join(" ");
  const disabled = forceDisabled || !player || isBye || Boolean(match.winner);

  return `
    <button
      class="${classNames}"
      type="button"
      ${disabled ? "disabled" : ""}
      data-match-type="${escapeAttribute(match.type)}"
      data-round-index="${match.roundIndex}"
      data-match-index="${match.matchIndex}"
      data-match-id="${match.id}"
      data-player="${escapeAttribute(player)}"
    >${renderedLabel}</button>
  `;
}

function nextPowerOfTwo(value) {
  let power = 1;

  while (power < value) {
    power *= 2;
  }

  return power;
}

function showMessage(text) {
  message.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", " ");
}
