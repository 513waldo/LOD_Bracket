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
const nameBackupPreview = document.querySelector("#nameBackupPreview");
const outShotSheet = document.querySelector("#outShotSheet");
const d20Canvas = document.querySelector("#d20Canvas");
const d20Context = d20Canvas ? d20Canvas.getContext("2d") : null;
const diceRollerPanel = document.querySelector(".dice-roller");
const diceRollerOverlay = document.createElement("div");
const rollDiceButton = document.querySelector("#rollDice");
const toggleDiceRollerSizeButton = document.querySelector("#toggleDiceRollerSize");
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
const openAttendanceSheetButton = document.querySelector("#openAttendanceSheet");
const assistantAdminStatus = document.querySelector("#assistantAdminStatus");
const assistantAdminLogoutButton = document.querySelector("#assistantAdminLogout");
const barNameInput = document.querySelector("#barName");
const eventDateInput = document.querySelector("#eventDate");
const eventDateStatus = document.querySelector("#eventDateStatus");
const generateEventDateButton = document.querySelector("#generateEventDate");
const deleteAllActiveLodsButton = document.querySelector("#deleteAllActiveLods");
const newLodCodeButton = document.querySelector("#newLodCode");
const portalQrCode = document.querySelector("#portalQrCode");
const lodCodeText = document.querySelector("#lodCodeText");
const lodCodeInput = document.querySelector("#lodCodeInput");
const loadLodCodeButton = document.querySelector("#loadLodCode");
const clearLodCodeButton = document.querySelector("#clearLodCode");
const portalNoticeInput = document.querySelector("#portalNoticeInput");
const portalSupportNoticeInput = document.querySelector("#portalSupportNoticeInput");
const portalSupportNoticeStatus = document.querySelector("#portalSupportNoticeStatus");
const portalSupportTranscript = document.querySelector("#portalSupportTranscript");
const portalAutoNoticeInput = document.querySelector("#portalAutoNoticeInput");
const portalAutoNoticeStatus = document.querySelector("#portalAutoNoticeStatus");
const portalBullshootNoticeInput = document.querySelector("#portalBullshootNoticeInput");
const portalBullshootNoticeStatus = document.querySelector("#portalBullshootNoticeStatus");
const sendPortalSupportNoticeButton = document.querySelector("#sendPortalSupportNotice");
const clearPortalSupportNoticeButton = document.querySelector("#clearPortalSupportNotice");
const clearPendingAdminMessagesButton = document.querySelector("#clearPendingAdminMessages");
const clearAllSentMessagesButton = document.querySelector("#clearAllSentMessages");
const sendPortalNoticeButton = document.querySelector("#sendPortalNotice");
const clearPortalNoticeButton = document.querySelector("#clearPortalNotice");
const portalNoticeStatus = document.querySelector("#portalNoticeStatus");
const attendanceRootStatus = document.querySelector("#attendanceRootStatus");
const attendanceRootCurrentPassword = document.querySelector("#attendanceRootCurrentPassword");
const attendanceRootNewPassword = document.querySelector("#attendanceRootNewPassword");
const attendanceRootConfirmPassword = document.querySelector("#attendanceRootConfirmPassword");
const saveAttendanceRootPasswordButton = document.querySelector("#saveAttendanceRootPassword");
const clearAttendanceRootPasswordButton = document.querySelector("#clearAttendanceRootPassword");
const openAttendancePageButton = document.querySelector("#openAttendancePage");
const lodRegistryList = document.querySelector("#lodRegistryList");
const refreshRegistryButton = document.querySelector("#refreshRegistry");
const EMPTY_QR_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
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
const bracketDraftSessionStorageKey = "dartsTournamentBracketDraftSession";
const bracketDraftWindowNamePrefix = "dartsTournamentBracketDraftWindow:";
const bracketDraftHistoryStateKey = "bracketDraft";
const bracketCleanupStorageKey = "dartsTournamentBracketCleanupAt";
const lodCodeStorageKey = "dartsTournamentLodCode";
const lodCodeClearedValue = "__CLEARED__";
const assistantAdminPasswordStorageKey = "dartsTournamentAssistantAdminPassword";
const assistantAdminSessionStorageKey = "dartsTournamentAssistantAdminSessionCode";
const assistantAdminBackupStorageKey = "dartsTournamentAssistantAdminBackup";
const productionAssistantAdminPassword = decodePasswordCodes([53, 49, 51, 56, 53, 57, 68, 97, 114, 116, 115, 33]);
const maxNameBackups = 25;
const bracketCleanupDurationMs = 24 * 60 * 60 * 1000;
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
const defaultRosterNames = [
  "AJ Riley",
  "Bob Lucas",
  "Chip Ingels",
  "Cody Lawton",
  "Dale Hofstetter",
  "Danny Trischler",
  "Darryl Christ",
  "Dave Matlock",
  "Dave Milby",
  "Geoff Schwein",
  "Geoffrey Ziemak",
  "Greg Kenny",
  "Jason Howard",
  "Jay Moretti",
  "Jesse Plessinger",
  "Joe Roman",
  "Joel Zang",
  "Julie Buffington Wendt",
  "Justin Ball",
  "Keith Atkinson",
  "Kevin Leonhardt",
  "Len Bauer",
  "Marc Bennett",
  "Mike Knight",
  "Mike Madsen",
  "Mike Walterman (Waldo)",
  "Mike Zerhusen",
  "Shawn Baker",
  "Steve Brown",
  "Terry Sims",
  "Tim Sims",
  "Tracy Thorner",
  "Trevor Barton",
  "William Hoover",
  "Zach Rice",
  "Adam Travis",
  "Alice Elberfeld",
  "Anthony Mele",
  "Ben Schulcz",
  "Christie Randall",
  "Dalton Rarrick",
  "Dan Ward",
  "Daniel Mathey",
  "David Genis",
  "Deanna DeRosier",
  "Dom Ranieri",
  "Doree Garner",
  "Ed Boothe",
  "Greg Cribbet",
  "Howard Morris",
];
const diceValues = [1, 1];
const d20CanvasWidth = 680;
const d20CanvasHeight = 480;
const d20Radius = 76;
const d20RollDurationMinMs = 5000;
const d20RollDurationMaxMs = 15000;
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
  25: { pdf: "25teamdouble.pdf", winner: "G1,G2,G3,G4,G5,G6,G7,G8,G9 / G11,G18,G12,G13,G14,G15,G16,G17 / G27,G28,G29,G30 / G39,G40 / G45 / G48", loser: "G10 / G19,G20,G21,G22,G23,G24,G25,G26 / G27,G28,G29,G30 / G31,G32,G33,G34 / G35,G36,G37,G38 / G41,G42 / G43,G44 / G46 / G47 / G49", final: "G48", reset: "G49 from L48" },
  26: { pdf: "26teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  27: { pdf: "27teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  28: { pdf: "28teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  29: { pdf: "29teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  30: { pdf: "30teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  31: { pdf: "31teamDouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  32: { pdf: "32teamDouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  33: { pdf: "33teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
  34: { pdf: "34teamdouble.pdf", winner: "PDF preview only", loser: "PDF preview only", final: "PDF preview only", reset: "PDF preview only" },
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
let portalSupportNotice = "";
let portalSupportNoticeAt = "";
let portalSupportNoticeDraft = "";
let portalSupportMessages = [];
let portalAutoNotice = "";
let portalAutoNoticeAt = "";
let portalBullshootNotice = "";
let portalBullshootNoticeAt = "";
let splitPotEntries = [];
let splitPotWinner = null;
let bullseyeShootEntries = [];
let bullseyeShootWinner = null;
let bullseyeShootCurrentPot = 0;
let restoredBackupId = "";
let splitPotDrawAnimation = null;
let bullseyeShootDrawAnimation = null;
let d20RollState = null;
let d20RollFrame = null;
let d20RollInterval = null;
let d20RollCompleteTimer = null;
let d20RollStartTime = 0;
let diceRollerOriginalParent = null;
let diceRollerOriginalNextSibling = null;
const storedLodCode = getStoredLodCode();
const requestedLodCode = getRequestedLodCode();
let lodCode = requestedLodCode || (storedLodCode === null ? generateLodCode() : storedLodCode);
let portalPublishTimer = null;
let lastPublishedPortalSnapshot = "";
let lastPublishedPortalSnapshotSignature = "";
let registryRefreshTimer = null;
let remoteMirrorTimer = null;
let remoteMirrorRequestEpoch = 0;
let lastRemoteMirrorSnapshotSignature = "";
let bracketDraftSaveTimer = null;
let sharedNameBackupRefreshTimer = null;
let bracketCleanupTimer = null;
let resetBracketClickLock = false;
let lastSyncedPlayerCount = null;
let totalPlayersSyncTimer = null;
let suppressPortalSnapshotPublish = false;
let diceRollerFullscreenRequested = false;
let diceRollerMaximizeMode = "";

window.startTeamGeneration = generatePlayers;
window.startBracketBuild = buildBracket;
window.resetTournament = resetTournament;
window.handleBracketWinnerClick = handleBracketWinnerClick;
window.handleBracketResetClick = handleBracketResetClick;
window.clearBullShootEntries = clearBullShootEntries;
window.addBullseyeShootEntry = addBullseyeShootEntry;
window.drawBullseyeShootWinner = drawBullseyeShootWinner;
window.restoreBracketBackup = restoreBracketBackup;
window.saveOutShots = saveOutShots;
window.generateMysteryOut = generateMysteryOut;
window.resetMysteryOut = resetMysteryOut;
window.setMysteryOutMode = setMysteryOutMode;

function syncTotalPlayersSection(force = false) {
  const rawCount = Number(totalPlayers?.value);
  const normalizedCount = Number.isFinite(rawCount) ? Math.trunc(rawCount) : 0;

  if (!force && normalizedCount === lastSyncedPlayerCount) {
    return;
  }

  lastSyncedPlayerCount = normalizedCount;
  renderNameInputs(normalizedCount);
  syncPdfLayoutToTeamCount(normalizedCount);
  syncPayoutTeamsFromPlayerCount();
  updatePayoutCalculator();
  savePortalSnapshotToLocalStorage();
}

function handleTotalPlayersUpdate() {
  syncTotalPlayersSection(true);
}

window.syncTotalPlayersSection = syncTotalPlayersSection;
window.handleTotalPlayersUpdate = handleTotalPlayersUpdate;

totalPlayers?.addEventListener("input", handleTotalPlayersUpdate);
totalPlayers?.addEventListener("change", handleTotalPlayersUpdate);
totalPlayers?.addEventListener("keyup", handleTotalPlayersUpdate);
totalPlayers?.addEventListener("paste", () => window.setTimeout(() => syncTotalPlayersSection(true), 0));

saveStoredLodCode(lodCode);
renderPortalLink();

diceRollerOverlay.className = "dice-roller-overlay";

renderNameInputs(Number(totalPlayers.value));
renderBackups();
renderNameBackups();
if (API_BASE_URLS.length) {
  void loadSharedNameBackups();
  sharedNameBackupRefreshTimer = window.setInterval(() => {
    void loadSharedNameBackups();
  }, 30000);
}
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
if (requestedLodCode) {
  loadRemoteAdminSnapshot(requestedLodCode, true);
} else if (getAssistantAdminSessionCode() && normalizeLodCode(lodCode) === getAssistantAdminSessionCode()) {
  loadRemoteAdminSnapshot(lodCode, false);
}
syncTotalPlayersSection(true);
if (!totalPlayersSyncTimer) {
  totalPlayersSyncTimer = window.setInterval(() => syncTotalPlayersSection(false), 250);
}
loadActiveLodCodes();

playersPerGroup.addEventListener("change", () => {
  syncPayoutTeamsFromPlayerCount();
  updatePayoutCalculator();
});

document.querySelector("#refreshNames").addEventListener("click", () => {
  shrinkTotalPlayersToEnteredNames();
  saveCurrentRosterBackup();
  queueBracketDraftSave();
});

function saveCurrentRosterBackup() {
  const count = Math.max(
    Number(totalPlayers.value) || 0,
    Number(nameList?.querySelectorAll("[data-player-number]").length || 0),
  );
  const names = getPlayerNameMap();

  if (!count || !Object.keys(names).length) {
    showMessage("Enter some player names before updating the roster.");
    return;
  }

  savePlayerNameBackup(count, names, getBarName());
}

if (pdfLayoutSelect) {
  pdfLayoutSelect.addEventListener("change", () => {
    renderPdfColumnMirror(Number(pdfLayoutSelect.value));
    queueBracketDraftSave();
  });
}

refreshRegistryButton?.addEventListener("click", () => {
  loadActiveLodCodes(true);
});

lodRegistryList?.addEventListener("click", (event) => {
  const codeButton = event.target.closest?.("[data-load-lod-code]");
  if (!codeButton) {
    return;
  }

  const code = normalizeLodCode(codeButton.dataset.loadLodCode || "");
  if (!code) {
    return;
  }

  loadRemoteAdminSnapshot(code, true);
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

function generateNewPortalCode({ silent = false } = {}) {
  lodCode = generateLodCode();
  saveStoredLodCode(lodCode);
  clearAssistantAdminSessionCode();
  stopRemoteMirrorRefresh();
  renderPortalLink(true);
  savePortalSnapshotToLocalStorage();
  queueActiveLodCodesRefresh();
  if (!silent) {
    showMessage(`New LOD code generated: ${lodCode}.`);
  }
}

function generateTournamentDate() {
  if (!eventDateInput) {
    return;
  }

  eventDateInput.value = getGeneratedTournamentDateInput();
  updateEventDateStatus();
  queueBracketDraftSave();
  showMessage("Tournament date generated.");
}

newLodCodeButton?.addEventListener("click", generateNewPortalCode);
window.generateNewPortalCode = generateNewPortalCode;

generateEventDateButton?.addEventListener("click", generateTournamentDate);
eventDateInput?.addEventListener("input", () => {
  updateEventDateStatus();
  queueBracketDraftSave();
});
eventDateInput?.addEventListener("change", () => {
  updateEventDateStatus();
  queueBracketDraftSave();
});

loadLodCodeButton?.addEventListener("click", () => {
  const code = normalizeLodCode(lodCodeInput?.value || "");

  if (!code) {
    lodCode = "";
    saveStoredLodCode("");
    renderPortalLink();
    queueActiveLodCodesRefresh();
    clearAssistantAdminSessionCode();
    stopRemoteMirrorRefresh();
    showMessage("LOD code cleared.");
    return;
  }

  loadRemoteAdminSnapshot(code, true);
});

assistantAdminLogoutButton?.addEventListener("click", logoutAssistantAdmin);
deleteAllActiveLodsButton?.addEventListener("click", () => {
  void deleteAllActiveLods();
});

clearLodCodeButton?.addEventListener("click", () => {
  const previousCode = lodCode;
  lodCode = "";
  saveStoredLodCode("");
  renderPortalLink();
  clearAssistantAdminSessionCode();
  stopRemoteMirrorRefresh();

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

portalSupportNoticeInput?.addEventListener("input", () => {
  portalSupportNoticeDraft = portalSupportNoticeInput.value || "";
  queueBracketDraftSave();
});

function formatAdminPortalMessage(label, message, stamp = new Date()) {
  const text = String(message || "").trim();
  if (!text) {
    return "";
  }

  const timeLabel = stamp instanceof Date && !Number.isNaN(stamp.getTime())
    ? stamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

  return timeLabel ? `${label} - ${timeLabel}: ${text}` : `${label}: ${text}`;
}

function getAdminSupportSenderLabel() {
  return isAssistantAdminSessionActive() ? "Assistant Admin" : "Tournament Director";
}

function getAdminSupportSessionContext() {
  const currentLodCode = normalizeLodCode(lodCode);
  const sessionCode = getAssistantAdminSessionCode();
  return {
    active: Boolean(currentLodCode && (!sessionCode || currentLodCode === sessionCode)),
    lodCode: currentLodCode,
    sessionCode,
  };
}

function parseAdminPortalMessage(text) {
  const value = String(text || "").trim();
  if (!value) {
    return null;
  }

  const match = value.match(/^(Assistant Admin|Tournament Director|Admin Support|Admin Assist|Admin)\s*-\s*([^:]+):\s*(.*)$/i);
  if (match) {
    const sender = /assistant/i.test(match[1]) ? "Assistant Admin" : "Tournament Director";
    const message = String(match[3] || "").trim();
    if (!message) {
      return null;
    }
    return {
      sender,
      message,
      stamp: "",
    };
  }

  return {
    sender: "Assistant Admin",
    message: value,
    stamp: "",
  };
}

function normalizePortalSupportMessages(value, fallbackNotice = "", fallbackNoticeAt = "") {
  const entries = [];

  if (Array.isArray(value)) {
    value.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }

      const sender = /assistant/i.test(String(entry.sender || entry.author || ""))
        ? "Assistant Admin"
        : "Tournament Director";
      const message = String(entry.message || entry.text || "").trim();
      if (!message) {
        return;
      }

      const stampValue = String(entry.stamp || entry.timestamp || entry.createdAt || entry.sentAt || entry.at || "");
      const stamp = stampValue && !Number.isNaN(new Date(stampValue).getTime()) ? new Date(stampValue).toISOString() : "";
      entries.push({
        sender,
        message,
        stamp,
        lodCode: normalizeLodCode(entry.lodCode || entry.lod || ""),
        sessionCode: normalizeLodCode(entry.sessionCode || entry.session || ""),
      });
    });
  }

  if (!entries.length) {
    const parsed = parseAdminPortalMessage(fallbackNotice);
    if (parsed) {
      entries.push({
        sender: parsed.sender || "Assistant Admin",
        message: parsed.message || String(fallbackNotice || "").trim(),
        stamp: parsed.stamp || fallbackNoticeAt || "",
        lodCode: normalizeLodCode(lodCode),
        sessionCode: getAssistantAdminSessionCode(),
      });
    } else if (String(fallbackNotice || "").trim()) {
      entries.push({
        sender: "Assistant Admin",
        message: String(fallbackNotice || "").trim(),
        stamp: fallbackNoticeAt || "",
        lodCode: normalizeLodCode(lodCode),
        sessionCode: getAssistantAdminSessionCode(),
      });
    }
  }

  return entries;
}

function renderPortalSupportTranscript() {
  if (!portalSupportTranscript) {
    return;
  }

  const entries = Array.isArray(portalSupportMessages) ? portalSupportMessages : [];
  if (!entries.length) {
    portalSupportTranscript.className = "portal-message-log empty";
    portalSupportTranscript.textContent = "No support messages yet.";
    return;
  }

  portalSupportTranscript.className = "portal-message-log";
  portalSupportTranscript.innerHTML = entries.map((entry) => {
    const sender = /assistant/i.test(String(entry.sender || "")) ? "Assistant Admin" : "Tournament Director";
    const stamp = entry.stamp && !Number.isNaN(new Date(entry.stamp).getTime())
      ? new Date(entry.stamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      : "";
    const body = escapeHtml(entry.message || "").replace(/\n/g, "<br>");
    return `
      <div class="portal-message-entry ${sender === "Assistant Admin" ? "assistant" : "admin"}">
        <div class="portal-message-meta">
          <strong>${escapeHtml(sender)}</strong>
          <span>${escapeHtml(stamp || "unknown time")}</span>
        </div>
        <div class="portal-message-body">${body}</div>
      </div>
    `;
  }).join("");
}

sendPortalNoticeButton?.addEventListener("click", () => {
  const didPublish = publishPortalNotice(portalNoticeDraft, { syncInput: false });
  const stampLabel = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  showMessage(portalNotice
    ? (didPublish ? `Board call sent to players portal at ${stampLabel}.` : `Board call saved at ${stampLabel}; set an LOD code to publish.`)
    : `Board call cleared at ${stampLabel}.`);
});

sendPortalSupportNoticeButton?.addEventListener("click", () => {
  const sender = getAdminSupportSenderLabel();
  const stamp = new Date();
  const didPublish = setAdminSupportPortalNotice(portalSupportNoticeDraft, sender);
  const stampLabel = stamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = portalSupportNotice
      ? (didPublish ? `Sent as ${sender} at ${stampLabel}.` : `Message ready at ${stampLabel}; set an LOD code to publish.`)
      : `Cleared at ${stampLabel}.`;
  }
  showMessage(portalSupportNotice
    ? (didPublish ? `Admin support message sent as ${sender} at ${stampLabel}.` : `Admin support message saved at ${stampLabel}; set an LOD code to publish.`)
    : `Admin support message cleared at ${stampLabel}.`);
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

function clearPendingAdminMessages() {
  portalNoticeDraft = "";
  portalSupportNoticeDraft = "";

  if (portalNoticeInput) {
    portalNoticeInput.value = "";
  }
  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = "";
  }
  if (portalNoticeStatus) {
    portalNoticeStatus.textContent = "";
  }
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = "";
  }

  queueBracketDraftSave();
  showMessage("Pending admin messages cleared.");
}

function clearAllPortalMessages({ publish = true } = {}) {
  portalNotice = "";
  portalNoticeAt = "";
  portalNoticeDraft = "";
  portalSupportNotice = "";
  portalSupportNoticeAt = "";
  portalSupportNoticeDraft = "";
  portalSupportMessages = [];
  portalAutoNotice = "";
  portalAutoNoticeAt = "";
  portalBullshootNotice = "";
  portalBullshootNoticeAt = "";

  if (portalNoticeInput) {
    portalNoticeInput.value = "";
  }
  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = "";
  }
  if (portalAutoNoticeInput) {
    portalAutoNoticeInput.innerHTML = "";
  }
  if (portalBullshootNoticeInput) {
    portalBullshootNoticeInput.innerHTML = "";
  }
  if (portalNoticeStatus) {
    portalNoticeStatus.textContent = "";
  }
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = "";
  }
  if (portalAutoNoticeStatus) {
    portalAutoNoticeStatus.textContent = "";
  }
  if (portalBullshootNoticeStatus) {
    portalBullshootNoticeStatus.textContent = "";
  }
  renderPortalSupportTranscript();

  let didPublish = false;
  if (publish) {
    didPublish = savePortalSnapshotToLocalStorage();
    if (didPublish) {
      void flushPortalSnapshotPublish();
    }
  }

  queueBracketDraftSave();
  return didPublish;
}

function clearAllSentMessages() {
  const didPublish = clearAllPortalMessages({ publish: true });
  showMessage("All sent admin messages cleared.");
  return didPublish;
}

clearPortalSupportNoticeButton?.addEventListener("click", () => {
  if (!getAdminSupportSessionContext().active) {
    showMessage("Assistant admin session is required before clearing support messages.");
    if (portalSupportNoticeStatus) {
      portalSupportNoticeStatus.textContent = "Assistant admin session is required before clearing support messages.";
    }
    updateAssistantAdminControls();
    return;
  }

  portalSupportNotice = "";
  portalSupportNoticeAt = "";
  portalSupportNoticeDraft = "";
  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = "";
  }
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = "";
  }
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
  showMessage("Admin support message cleared.");
});

clearPendingAdminMessagesButton?.addEventListener("click", () => {
  clearPendingAdminMessages();
});

clearAllSentMessagesButton?.addEventListener("click", () => {
  clearAllSentMessages();
});

window.clearPendingAdminMessages = clearPendingAdminMessages;

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
  if (!validateOutShotsBeforeSave()) {
    return;
  }

  saveOutShots();
  showMessage("Out shots saved.");
});

document.querySelector("#clearOutShots").addEventListener("click", () => {
  clearOutShots();
  showMessage("Out shot sheet cleared.");
});

outShotSheet.addEventListener("input", (event) => {
  updateOutShotWinners();
  renderHighestOutRecord();
  renderMysteryOutWinner();
  saveOutShots();
});

outShotSheet.addEventListener("change", (event) => {
  updateOutShotWinners();
  renderHighestOutRecord();
  renderMysteryOutWinner();
  saveOutShots();
});

rollDiceButton.addEventListener("click", rollDice);
window.rollDice = rollDice;
window.toggleDiceRollerSize = toggleDiceRollerSize;
window.addSplitPotEntry = addSplitPotEntry;
window.drawSplitPotWinner = drawSplitPotWinner;
window.mergePlayerNameBackup = mergePlayerNameBackup;
window.deletePlayerNameBackup = deletePlayerNameBackup;

toggleDiceRollerSizeButton?.addEventListener("click", toggleDiceRollerSize);
document.addEventListener("fullscreenchange", syncDiceRollerFullscreenState);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && diceRollerPanel?.classList.contains("is-maximized")) {
    if (document.fullscreenElement === diceRollerPanel) {
      diceRollerMaximizeMode = "";
      document.exitFullscreen().catch(() => {});
      return;
    }

    diceRollerMaximizeMode = "";
    diceRollerPanel.classList.remove("is-maximized");
    document.body.classList.remove("dice-roller-maximized");
    document.body.style.overflow = "";
    clearDiceRollerMaximizedStyles();
    restoreDiceRollerPanel();
    syncDiceRollerFullscreenState();
  }
});
window.addEventListener("resize", () => {
  if (diceRollerPanel?.classList.contains("is-maximized")) {
    resizeDiceRollerCanvasForViewport();
  }
});
syncDiceRollerFullscreenState();

generateMysteryOutButton.addEventListener("click", () => {
  generateMysteryOut();
});

resetMysteryOutButton.addEventListener("click", () => {
  resetMysteryOut();
});

mysteryOutModeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    setMysteryOutMode(input.dataset.mysteryOutMode);
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

function clearSplitPotEntries() {
  stopSplitPotDrawAnimation();
  splitPotEntries = [];
  splitPotWinner = null;
  saveSplitPot();
  renderSplitPot();
  showMessage("Split The Pot entries cleared.");
}

window.clearSplitPotEntries = clearSplitPotEntries;
clearSplitPotEntriesButton?.addEventListener("click", clearSplitPotEntries);

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
  clearBullshootPortalNotice();
  saveBullseyeShoot();
  renderBullseyeShoot();
});

function clearBullShootEntries() {
  stopBullseyeShootDrawAnimation();
  bullseyeShootEntries = [];
  bullseyeShootWinner = null;
  clearBullshootPortalNotice();
  saveBullseyeShoot();
  renderBullseyeShoot();
  showMessage("Bull Shoot entries cleared.");
}

clearBullseyeShootEntriesButton?.addEventListener("click", clearBullShootEntries);

playerList.addEventListener("input", () => {
  syncPayoutTeams();
  updatePayoutCalculator();
});

async function generatePlayers() {
  const assistantMode = isAssistantAdminSessionActive();
  if (assistantMode) {
    stopRemoteMirrorRefresh();
  }

  try {
    if (state || hasGeneratedTeams) {
      blockedGenerateCount += 1;
      const shameCount = blockedGenerateCount > 1 ? `${blockedGenerateCount} times` : "once";
      const shameMessage = `Shame. Reset the bracket before generating teams again (${shameCount}).`;
      showTeamDrawWarning(shameMessage);
      showMessage(shameMessage);
      return;
    }

    const enteredCount = Number(totalPlayers.value);
    const fallbackCount = Number(nameList?.querySelectorAll("[data-player-number]").length || 0);
    const count = Number.isInteger(enteredCount) && enteredCount >= 2
      ? enteredCount
      : fallbackCount;
    const groupSize = Number(playersPerGroup.value);

    if (!Number.isInteger(count) || count < 2 || count > 200) {
      showMessage("Enter 2 to 200 players.");
      return;
    }

    if (String(totalPlayers.value || "") !== String(count)) {
      totalPlayers.value = String(count);
      renderNameInputs(count);
    }

    if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > count) {
      showMessage("Players per team must be at least 1 and no more than the player count.");
      return;
    }

    const nameMap = getPlayerNameMap();
    savePlayerNameBackup(count, nameMap, getBarName());
    const players = Array.from({ length: count }, (_, index) => String(index + 1));
    const teams = chunk(shuffle(players), groupSize);
    currentTeams = teams;
    hasGeneratedTeams = true;
    blockedGenerateCount = 0;
    hideTeamDrawWarning();
    renderTeams(currentTeams);
    syncPayoutTeams(teams.length);
    updatePayoutCalculator();
    savePortalSnapshotToLocalStorage();
    if (assistantMode) {
      await flushPortalSnapshotPublish();
    }
    queueBracketDraftSave();
    showMessage(`Generated ${teams.length} random team${teams.length === 1 ? "" : "s"}.`);
    hideTeamDrawWarning();
  } finally {
    if (assistantMode) {
      startRemoteMirrorRefresh();
    }
  }
}

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

async function buildBracket() {
  const assistantMode = isAssistantAdminSessionActive();
  if (assistantMode) {
    stopRemoteMirrorRefresh();
  }

  generateNewPortalCode({ silent: true });

  try {
    if (state) {
      showMessage("Bracket already exists. Reset the bracket before building again.");
      return;
    }

    const rawPlayers = getPlayers();
    const activePlayers = currentTeams.length
      ? currentTeams.map(formatTeam)
      : rawPlayers;

    if (activePlayers.length < 2) {
      showMessage("Add at least 2 players to build a bracket.");
      return;
    }

    if (activePlayers.length > 100) {
      showMessage("Bracket supports up to 100 teams.");
      return;
    }

    const pdfGraphs = await loadPdfBracketGraphs();
    if (activePlayers.length <= 24 && !pdfGraphs?.[activePlayers.length]) {
      showMessage(`Unable to load the PDF bracket graph for ${activePlayers.length} teams.`);
      return;
    }

    state = createBracketGraph(activePlayers);
    renderBracket();
    queueActiveLodCodesRefresh();
    syncPdfLayoutToTeamCount(activePlayers.length);
    syncPayoutTeams(activePlayers.length);
    updatePayoutCalculator();
    savePortalSnapshotToLocalStorage();
    if (assistantMode) {
      await flushPortalSnapshotPublish();
    }
    showMessage(`Bracket built for ${activePlayers.length} player${activePlayers.length === 1 ? "" : "s"}.`);
  } finally {
    if (assistantMode) {
      startRemoteMirrorRefresh();
    }
  }
}

bracketOutput.addEventListener("click", (event) => {
  const resetButton = event.target.closest("[data-reset-match]");

  if (resetButton) {
    handleBracketResetClick(resetButton);
    return;
  }

  const button = event.target.closest("[data-match-type]");

  if (!button) {
    return;
  }

  handleBracketWinnerClick(button);
});

function handleBracketWinnerClick(button) {
  if (!button || !button.dataset) {
    return;
  }

  const matchId = Number(button.dataset.matchId);
  const player = button.dataset.player;
  if (!player) {
    return;
  }

  if (button.disabled) {
    return;
  }

  if (!claimBracketButtonClick(button, "winnerHandled")) {
    return;
  }

  saveBracketBackup({
    matchId,
    selectedWinner: player,
  });

  if (state?.matchesById) {
    chooseWinner(matchId, player);
  } else {
    chooseWinnerLegacy(
      button.dataset.matchType,
      Number(button.dataset.roundIndex),
      Number(button.dataset.matchIndex),
      player,
    );
  }
  queueActiveLodCodesRefresh();
}

function handleBracketResetClick(button) {
  if (!button || !button.dataset) {
    return;
  }

  if (!claimBracketButtonClick(button, "resetHandled")) {
    return;
  }

  const matchId = Number(button.dataset.matchId);

  saveBracketBackup({
    resetMatch: button.dataset.resetMatch,
    selectedWinner: "",
  });

  if (state?.matchesById) {
    resetMatchResult(matchId);
  } else {
    resetMatchResultLegacy(
      button.dataset.matchType,
      Number(button.dataset.roundIndex),
      Number(button.dataset.matchIndex),
    );
  }
}

function claimBracketButtonClick(button, handledKey) {
  if (button.dataset[handledKey] === "true") {
    return false;
  }

  button.dataset[handledKey] = "true";
  window.setTimeout(() => {
    if (button?.dataset) {
      delete button.dataset[handledKey];
    }
  }, 0);
  return true;
}

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
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
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

  restoreBracketBackup(button.dataset.backupId);
});

function restoreBracketBackup(id) {
  const backup = readBackup(id);

  if (!backup) {
    showMessage("That backup could not be loaded.");
    renderBackups();
    return false;
  }

  state = backup.state;
  if (state.mode === "graph") {
    rebuildGraphMatchIndex(state);
    refreshGraphSources(state);
  } else {
    refreshGameNumbersAndSources(state);
  }
  renderBracket();
  savePortalSnapshotToLocalStorage();
  saveBracketDraft();
  queueActiveLodCodesRefresh();
  restoredBackupId = id;
  renderBackups();
  showMessage(`Restored backup from ${formatBackupTime(backup.createdAt)}.`);
  return true;
}

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

function parsePurchaseAmount(value) {
  const normalized = String(value || "")
    .replace(/[$,\s]/g, "")
    .trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
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

    const nextDelay = getTicketDrawDelay(progress, elapsed, durationMs);
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

    state.timerId = window.setTimeout(step, getTicketDrawDelay(progress, elapsed, durationMs));
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

function getTicketDrawDelay(progress, elapsedMs = 0, durationMs = 20000) {
  const elapsed = Math.max(0, Number(elapsedMs) || 0);
  const total = Math.max(1, Number(durationMs) || 20000);
  const remaining = Math.max(0, total - elapsed);

  if (remaining <= 3000) {
    if (remaining <= 1000) {
      return 500;
    }
    if (remaining <= 2000) {
      return 750;
    }
    return 1000;
  }

  if (elapsed < 5000) {
    const ramp = elapsed / 5000;
    return Math.round(650 - (ramp * 530));
  }

  if (elapsed < 11000) {
    const fast = (elapsed - 5000) / 6000;
    return Math.round(30 - (fast * 8));
  }

  const slowDown = Math.min(1, (elapsed - 11000) / Math.max(1, total - 14000));
  return Math.round(40 + (slowDown * 460));
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
  const amountPaid = parsePurchaseAmount(splitPotTicketsInput?.value);
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
  let didSendNotice = false;
  let renderSucceeded = false;
  try {
    saveSplitPot();
    renderSplitPot();
    renderSucceeded = true;
  } catch (error) {
    console.error(error);
  }

  try {
    didSendNotice = sendSplitPotPortalNotice();
  } catch (error) {
    console.error(error);
  }

  if (splitPotNameInput) {
    splitPotNameInput.value = "";
    splitPotNameInput.focus();
  }
  if (splitPotTicketsInput) {
    splitPotTicketsInput.value = "0";
  }

  if (!renderSucceeded) {
    showMessage("Split The Pot entry saved, but the on-page list could not refresh.");
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
  const amountPaid = parsePurchaseAmount(bullseyeShootTicketsInput?.value);
  const ticketCount = getSplitPotTicketsForAmount(amountPaid);

  if (!name) {
    showMessage("Enter a Bull Shoot name.");
    bullseyeShootNameInput?.focus();
    return;
  }

  if (!Number.isInteger(amountPaid) || amountPaid < 1) {
    showMessage("Choose at least $1 for Bull Shoot.");
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
  let didSendNotice = false;
  let renderSucceeded = false;
  try {
    saveBullseyeShoot();
    renderBullseyeShoot();
    renderSucceeded = true;
  } catch (error) {
    console.error(error);
  }

  try {
    didSendNotice = sendBullseyeShootPortalNotice();
  } catch (error) {
    console.error(error);
  }

  if (bullseyeShootNameInput) {
    bullseyeShootNameInput.value = "";
    bullseyeShootNameInput.focus();
  }
  if (bullseyeShootTicketsInput) {
    bullseyeShootTicketsInput.value = "0";
  }

  if (!renderSucceeded) {
    showMessage("Bull Shoot entry saved, but the on-page list could not refresh.");
  }
  showMessage(`${formatMoney(amountPaid)} added for ${name}: ${ticketCount} ticket${ticketCount === 1 ? "" : "s"}.${didSendNotice ? " Player portal message sent." : " Set an LOD code to send player portal messages."}`);
}

function drawBullseyeShootWinner() {
  const tickets = getBullseyeShootTickets();

  if (!tickets.length) {
    showMessage("Add Bull Shoot tickets before drawing.");
    return;
  }

  clearBullshootPortalNotice();
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
      showMessage(`Bull Shoot winner: ${winnerTicket.name}, ticket ${winnerTicket.ticketLabel}.${didSendNotice ? " Player portal message sent." : " Set an LOD code to send player portal messages."}`);
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
    bullseyeShootEntriesOutput.innerHTML = `<p class="split-pot-empty">No Bull Shoot tickets entered yet.</p>`;
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
      : `Bull Shoot Tickets - Pot ${formatMoney(pot)} - ${ticketTotal} ticket${ticketTotal === 1 ? "" : "s"}`,
    ...(winner ? [`Winning ticket: ${winner.ticketLabel}`, `Pot ${formatMoney(pot)} - ${ticketTotal} ticket${ticketTotal === 1 ? "" : "s"}`] : []),
    ...ticketList,
  ].join("\n");
  return setBullshootPortalNotice(message);
}

function sendBullshootRollPortalNotice(dieValues = []) {
  const [tripleValue, doubleValue] = Array.isArray(dieValues) ? dieValues : [];
  const triple = Number(tripleValue);
  const double = Number(doubleValue);
  if (!Number.isFinite(triple) || !Number.isFinite(double)) {
    return false;
  }

  const total = triple + double;
  const message = `Bullshoot result - Triple ${triple}, Double ${double} - total ${total}`;
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

function publishPortalNotice(message, { syncInput = true } = {}) {
  const text = String(message || "").trim();
  const stamp = new Date();
  portalNotice = text ? formatAdminPortalMessage("Admin", text, stamp) : "";
  portalNoticeAt = portalNotice ? new Date().toISOString() : "";
  if (syncInput && portalNoticeInput) {
    portalNoticeInput.value = text;
  }
  const didPublish = savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
  const stampLabel = stamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (portalNoticeStatus) {
    portalNoticeStatus.textContent = text
      ? (didPublish ? `Sent at ${stampLabel}.` : `Message ready at ${stampLabel}; set an LOD code to publish.`)
      : `Cleared at ${stampLabel}.`;
  }
  return didPublish;
}

function setAdminSupportPortalNotice(message, sender = getAdminSupportSenderLabel()) {
  const text = String(message || "").trim();
  const stamp = new Date();
  const sessionContext = getAdminSupportSessionContext();
  if (!sessionContext.active) {
    portalSupportNotice = "";
    portalSupportNoticeAt = "";
    portalSupportMessages = normalizePortalSupportMessages(
      portalSupportMessages,
      portalSupportNotice,
      portalSupportNoticeAt,
    );
    renderPortalSupportTranscript();
    portalSupportTranscript?.lastElementChild?.scrollIntoView({ block: "end", behavior: "smooth" });
    if (portalSupportNoticeStatus) {
      portalSupportNoticeStatus.textContent = "Assistant admin session is required before sending support messages.";
    }
    showMessage("Assistant admin session is required before sending support messages.");
    updateAssistantAdminControls();
    return false;
  }

  portalSupportNotice = text ? formatAdminPortalMessage(sender, text, stamp) : "";
  portalSupportNoticeAt = portalSupportNotice ? new Date().toISOString() : "";
  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = text;
  }
  if (portalSupportNotice) {
    portalSupportMessages = [...portalSupportMessages, {
      sender,
      message: text,
      stamp: portalSupportNoticeAt,
      lodCode: sessionContext.lodCode,
      sessionCode: sessionContext.sessionCode,
    }];
  }
  renderPortalSupportTranscript();
  portalSupportTranscript?.lastElementChild?.scrollIntoView({ block: "end", behavior: "smooth" });
  const didPublish = savePortalSnapshotToLocalStorage();
  if (didPublish) {
    void flushPortalSnapshotPublish();
  }
  queueBracketDraftSave();
  const stampLabel = stamp.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = text
      ? (didPublish ? `Sent as ${sender} at ${stampLabel}.` : `Message ready at ${stampLabel}; set an LOD code to publish.`)
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

function clearBullshootPortalNotice() {
  return setBullshootPortalNotice("");
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
  return publishPortalNotice(winnerLine, { syncInput: false });
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
    showMessage("Bull Shoot could not be saved in this browser.");
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
  showMessage("Bull Shoot entry deleted.");
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
  if (resetBracketClickLock) {
    return;
  }
  resetBracketClickLock = true;
  window.setTimeout(() => {
    resetBracketClickLock = false;
  }, 0);

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

  diceValues[0] = 1;
  diceValues[1] = 1;
  d20RollState = null;
  renderDice();

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
  queueActiveLodCodesRefresh();
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
  updateOutShotWinners();
  renderHighestOutRecord();
  renderMysteryOutWinner();
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

function validateOutShotsBeforeSave() {
  const duplicateNumber = getDuplicateOutShotNumber();
  if (duplicateNumber === null) {
    return true;
  }

  showMessage(`Out shot ${duplicateNumber} is already listed.`);
  return false;
}

function getDuplicateOutShotNumber() {
  const seen = new Set();

  for (const input of outShotSheet.querySelectorAll('[data-out-field="number"]')) {
    const numberHit = getOutShotNumberValue(input);
    if (numberHit === null) {
      continue;
    }

    if (seen.has(numberHit)) {
      return numberHit;
    }

    seen.add(numberHit);
  }

  return null;
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

function renderMysteryOut() {
  if (mysteryOutModeInputs.length) {
    mysteryOutModeInputs.forEach((input) => {
      input.checked = Boolean(mysteryOut && input.dataset.mysteryOutMode === mysteryOut.mode);
    });
  }

  if (mysteryOutValue) {
    const hasActiveRoll = Boolean(mysteryOutDrawAnimation?.active && mysteryOutDrawAnimation.value !== null);
    const currentValue = hasActiveRoll
      ? mysteryOutDrawAnimation.value
      : (mysteryOut && Number.isFinite(Number(mysteryOut.score)) ? Number(mysteryOut.score) : null);
    mysteryOutValue.textContent = currentValue ? String(currentValue) : "--";
  }

  if (resetMysteryOutButton) {
    resetMysteryOutButton.hidden = !mysteryOut;
  }

  renderMysteryOutWinner();
}

function getMysteryOutValues(mode = mysteryOut?.mode || "double") {
  const normalizedMode = ["open", "double", "master"].includes(String(mode)) ? String(mode) : "double";
  if (normalizedMode === "open") {
    return [...dartScores];
  }
  if (normalizedMode === "master") {
    return buildMysteryOutRangeValues(normalizedMode);
  }
  return [...doubleOutFinishes];
}

function buildMysteryOutRangeValues(mode) {
  const range = mysteryOutRanges[mode] || mysteryOutRanges.double;
  const exclusions = new Set((mysteryOutExclusions[mode] || []).map(Number));
  const values = [];

  for (let score = range.min; score <= range.max; score += 1) {
    if (exclusions.has(score)) {
      continue;
    }
    values.push(score);
  }

  if (mode === "double") {
    return values.filter((score) => score % 2 === 0 || score === 50);
  }

  return values;
}

function setMysteryOutMode(mode) {
  const normalizedMode = ["open", "double", "master"].includes(String(mode)) ? String(mode) : "double";
  mysteryOut = {
    ...(mysteryOut && typeof mysteryOut === "object" ? mysteryOut : {}),
    mode: normalizedMode,
    score: mysteryOut && typeof mysteryOut === "object" ? mysteryOut.score || "" : "",
  };
  savePortalSnapshotToLocalStorage();
  renderMysteryOut();
  queueBracketDraftSave();
}

function generateMysteryOut() {
  const selectedMode = Array.from(mysteryOutModeInputs).find((input) => input.checked)?.dataset?.mysteryOutMode;
  const mode = selectedMode || mysteryOut?.mode || "double";
  const values = getMysteryOutValues(mode);

  if (!values.length) {
    showMessage("No mystery out values are available for that mode.");
    return;
  }

  const finalizeMysteryOut = (finalValue) => {
    mysteryOut = {
      mode,
      score: Number(finalValue) || 0,
      drawnAt: new Date().toISOString(),
    };
    mysteryOutDrawAnimation = null;
    savePortalSnapshotToLocalStorage();
    renderMysteryOut();
    queueBracketDraftSave();
    showMessage(`Mystery out generated: ${finalValue}.`);
  };

  try {
    stopMysteryOutDrawAnimation();
    if (mysteryOutValue) {
      mysteryOutValue.textContent = "--";
    }
    if (resetMysteryOutButton) {
      resetMysteryOutButton.hidden = false;
    }

    mysteryOutDrawAnimation = startMysteryOutDrawAnimation({
      values,
      durationMs: 20000,
      onFrame: (value) => {
        if (mysteryOutValue) {
          mysteryOutValue.textContent = String(value);
        }
      },
      onComplete: (finalValue) => {
        finalizeMysteryOut(finalValue);
      },
    });
  } catch (error) {
    console.error(error);
    mysteryOutDrawAnimation = null;
  }

  if (!mysteryOutDrawAnimation) {
    finalizeMysteryOut(values[getRandomIndex(values.length)]);
  }
}

function resetMysteryOut() {
  stopMysteryOutDrawAnimation();
  mysteryOut = "";
  renderMysteryOut();
  savePortalSnapshotToLocalStorage();
  queueBracketDraftSave();
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

function randomD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function rand(min, max) {
  return (Math.random() * (max - min)) + min;
}

function renderDice() {
  if (!d20Context || !d20Canvas) {
    return;
  }

  d20Canvas.width = d20CanvasWidth;
  d20Canvas.height = d20CanvasHeight;

  if (!d20RollState) {
    d20RollState = createD20RollState();
  }

  d20RollState.active = false;
  d20RollState.startedAt = performance.now();
  d20RollState.lastTime = d20RollState.startedAt;
  diceValues[0] = 6;
  diceValues[1] = 9;
  d20RollState.dies.forEach((die, index) => {
    die.stopped = true;
    die.vx = 0;
    die.vy = 0;
    die.displayNum = diceValues[index] || die.displayNum;
    die.finalVal = die.displayNum;
    die.stoppedAngle = die.angle;
    die.shadeOffset = Math.floor(Math.random() * 6);
    die.x = die.restX;
    die.y = die.restY;
  });

  diceValues[0] = d20RollState.dies[0].displayNum;
  diceValues[1] = d20RollState.dies[1].displayNum;
  drawD20Frame(performance.now());
  queueBracketDraftSave();
}

function createD20RollState() {
  const BLACK = { body: "#ff8c1a", dark: "#8a5200", mid: "#ffae4d", light: "#ffd89a", text: "#111111", label: "#111111" };
  const PURPLE = { body: "#ffffff", dark: "#c1121f", mid: "#f3f3f3", light: "#e0e0e0", text: "#111111", label: "#111111" };

  const makeDie = (color, spinDir, startX, startY, vx, vy, restX, restY) => ({
    color,
    spinDir,
    restX,
    restY,
    x: startX,
    y: startY,
    vx,
    vy,
    angle: rand(0, Math.PI * 2),
    displayNum: randomD20(),
    finalVal: randomD20(),
    locked: false,
    lastFlick: 0,
    stopped: false,
    stoppedAngle: 0,
    shadeOffset: Math.floor(Math.random() * 6),
    lastShadeShift: 0,
    trail: [],
  });

  return {
    active: false,
    startedAt: 0,
    durationMs: d20RollDurationMaxMs,
    dies: [
      makeDie(BLACK, 1, rand(90, 180), rand(100, 220), rand(4.5, 6.4), rand(2.9, 5.8), 170, 200),
      makeDie(PURPLE, -1, rand(450, 560), rand(220, 360), rand(-6.3, -4.4), rand(-4.9, -2.7), 490, 320),
    ],
  };
}

function rollDice() {
  if (!d20Context || !d20Canvas || d20RollState?.active) {
    return;
  }

  startD20Roll();
}

async function toggleDiceRollerSize() {
  if (!diceRollerPanel) {
    return;
  }

  const isFullscreen = document.fullscreenElement === diceRollerPanel;
  const isFallbackMaximized = diceRollerMaximizeMode === "fallback";

  if (isFullscreen) {
    try {
      diceRollerMaximizeMode = "";
      await document.exitFullscreen();
    } catch {
      // Fall back to the existing panel restore path.
    }
    return;
  }

  if (isFallbackMaximized) {
    diceRollerMaximizeMode = "";
    diceRollerPanel.classList.remove("is-maximized");
    document.body.classList.remove("dice-roller-maximized");
    document.body.style.overflow = "";
    clearDiceRollerMaximizedStyles();
    restoreDiceRollerPanel();
    syncDiceRollerFullscreenState();
    return;
  }

  if (typeof diceRollerPanel.requestFullscreen === "function") {
    try {
      diceRollerMaximizeMode = "fullscreen";
      moveDiceRollerPanelToOverlay();
      await diceRollerPanel.requestFullscreen({ navigationUI: "hide" });
      diceRollerPanel.classList.add("is-maximized");
      document.body.classList.add("dice-roller-maximized");
      document.body.style.overflow = "hidden";
      resizeDiceRollerCanvasForViewport();
      syncDiceRollerFullscreenState();
      return;
    } catch {
      diceRollerMaximizeMode = "";
      // If fullscreen is blocked, use the overlay fallback below.
    }
  }

  diceRollerMaximizeMode = "fallback";
  moveDiceRollerPanelToOverlay();
  diceRollerPanel.classList.add("is-maximized");
  document.body.classList.add("dice-roller-maximized");
  document.body.style.overflow = "hidden";
  applyDiceRollerMaximizedStyles();
  resizeDiceRollerCanvasForViewport();
  syncDiceRollerFullscreenState();
}

function moveDiceRollerPanelToOverlay() {
  if (!diceRollerPanel || diceRollerPanel.parentElement === diceRollerOverlay) {
    return;
  }

  diceRollerOriginalParent = diceRollerPanel.parentElement;
  diceRollerOriginalNextSibling = diceRollerPanel.nextElementSibling;
  if (!diceRollerOverlay.isConnected) {
    document.body.appendChild(diceRollerOverlay);
  }
  diceRollerOverlay.appendChild(diceRollerPanel);
}

function restoreDiceRollerPanel() {
  if (!diceRollerPanel || !diceRollerOriginalParent) {
    return;
  }

  if (diceRollerOriginalNextSibling && diceRollerOriginalNextSibling.parentElement === diceRollerOriginalParent) {
    diceRollerOriginalParent.insertBefore(diceRollerPanel, diceRollerOriginalNextSibling);
  } else {
    diceRollerOriginalParent.appendChild(diceRollerPanel);
  }
}

function applyDiceRollerMaximizedStyles() {
  if (!diceRollerPanel) {
    return;
  }

  diceRollerPanel.style.setProperty("width", "100vw");
  diceRollerPanel.style.setProperty("height", "100vh");
  diceRollerPanel.style.setProperty("max-width", "none");
  diceRollerPanel.style.setProperty("position", "fixed");
  diceRollerPanel.style.setProperty("inset", "0");
  diceRollerPanel.style.setProperty("z-index", "3001");
  diceRollerPanel.style.setProperty("margin", "0");
  diceRollerPanel.style.setProperty("box-sizing", "border-box");
}

function clearDiceRollerMaximizedStyles() {
  if (!diceRollerPanel) {
    return;
  }

  diceRollerPanel.removeAttribute("style");
  if (d20Canvas) {
    d20Canvas.style.removeProperty("width");
    d20Canvas.style.removeProperty("height");
    d20Canvas.style.removeProperty("max-width");
    d20Canvas.style.removeProperty("max-height");
  }
}

function resizeDiceRollerCanvasForViewport() {
  if (!d20Canvas) {
    return;
  }

  const availableWidth = Math.max(320, window.innerWidth - 48);
  const availableHeight = Math.max(240, window.innerHeight - 180);
  const scale = Math.min(availableWidth / d20CanvasWidth, availableHeight / d20CanvasHeight);
  const width = Math.max(320, Math.floor(d20CanvasWidth * scale));
  const height = Math.max(240, Math.floor(d20CanvasHeight * scale));
  d20Canvas.style.width = `${width}px`;
  d20Canvas.style.height = `${height}px`;
  d20Canvas.style.maxWidth = "none";
  d20Canvas.style.maxHeight = "none";
}

function syncDiceRollerFullscreenState() {
  if (!diceRollerPanel || !toggleDiceRollerSizeButton) {
    return;
  }

  const isFullscreen = document.fullscreenElement === diceRollerPanel;
  const isFallbackMaximized = diceRollerMaximizeMode === "fallback";
  const isMaximized = isFullscreen || isFallbackMaximized;

  if (!isMaximized) {
    diceRollerMaximizeMode = "";
    diceRollerPanel.classList.remove("is-maximized");
    document.body.classList.remove("dice-roller-maximized");
    document.body.style.overflow = "";
    clearDiceRollerMaximizedStyles();
    restoreDiceRollerPanel();
  }

  diceRollerPanel.classList.toggle("is-maximized", isMaximized);
  document.body.classList.toggle("dice-roller-maximized", isMaximized);
  if (isMaximized) {
    resizeDiceRollerCanvasForViewport();
  }
  toggleDiceRollerSizeButton.textContent = isMaximized ? "−" : "+";
  toggleDiceRollerSizeButton.title = isMaximized ? "Restore D20 roller" : "Maximize D20 roller";
  toggleDiceRollerSizeButton.setAttribute("aria-label", toggleDiceRollerSizeButton.title);
}

function startD20Roll() {
  d20RollState = createD20RollState();
  d20RollState.active = true;
  d20RollState.startedAt = performance.now();
  d20RollState.lastTime = d20RollState.startedAt;
  d20RollState.resultPublished = false;
  d20RollState.durationMs = Math.floor(
    Math.random() * (d20RollDurationMaxMs - d20RollDurationMinMs + 1)
  ) + d20RollDurationMinMs;
  diceValues[0] = d20RollState.dies[0].displayNum;
  diceValues[1] = d20RollState.dies[1].displayNum;

  if (d20RollFrame) {
    cancelAnimationFrame(d20RollFrame);
  }
  if (d20RollInterval) {
    clearInterval(d20RollInterval);
  }
  if (d20RollCompleteTimer) {
    clearTimeout(d20RollCompleteTimer);
  }

  d20RollInterval = setInterval(() => drawD20Frame(performance.now()), 16);
  d20RollCompleteTimer = setTimeout(() => {
    if (!d20RollState || d20RollState.resultPublished) {
      return;
    }
    d20RollState.resultPublished = true;
    sendBullshootRollPortalNotice(d20RollState.dies.map((die) => die.finalVal || die.displayNum));
  }, d20RollState.durationMs + 150);
  drawD20Frame(performance.now());
}

function updateD20Die(die, dt) {
  if (die.stopped) {
    return;
  }

  die.x += die.vx * dt * 60;
  die.y += die.vy * dt * 60;

  if (die.x - d20Radius < 0) {
    die.x = d20Radius;
    die.vx = Math.abs(die.vx) * 0.985;
    die.vy += rand(-1.2, 1.2);
  }
  if (die.x + d20Radius > d20CanvasWidth) {
    die.x = d20CanvasWidth - d20Radius;
    die.vx = -Math.abs(die.vx) * 0.985;
    die.vy += rand(-1.2, 1.2);
  }
  if (die.y - d20Radius < 0) {
    die.y = d20Radius;
    die.vy = Math.abs(die.vy) * 0.985;
    die.vx += rand(-1.5, 1.5);
  }
  if (die.y + d20Radius > d20CanvasHeight) {
    die.y = d20CanvasHeight - d20Radius;
    die.vy = -Math.abs(die.vy) * 0.985;
    die.vx += rand(-1.5, 1.5);
  }

  die.vx *= 0.992;
  die.vy *= 0.992;
  die.vx += rand(-0.035, 0.035);
  die.vy += rand(-0.045, 0.045);

  const spd = Math.sqrt((die.vx * die.vx) + (die.vy * die.vy));
  die.angle += spd * 0.03 * die.spinDir;

  die.trail.push({ x: die.x, y: die.y });
  if (die.trail.length > 22) {
    die.trail.shift();
  }
}

function resolveD20Collision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt((dx * dx) + (dy * dy));
  if (!dist) {
    return;
  }

  const minDist = d20Radius * 2;
  if (dist >= minDist) {
    return;
  }

  const overlap = minDist - dist;
  const nx = dx / dist;
  const ny = dy / dist;
  a.x -= nx * overlap * 0.5;
  a.y -= ny * overlap * 0.5;
  b.x += nx * overlap * 0.5;
  b.y += ny * overlap * 0.5;

  const dvx = a.vx - b.vx;
  const dvy = a.vy - b.vy;
  const dot = (dvx * nx) + (dvy * ny);
  if (dot > 0) {
    return;
  }

  const impulse = dot * 1.12;
  a.vx -= impulse * nx;
  a.vy -= impulse * ny;
  b.vx += impulse * nx;
  b.vy += impulse * ny;

  a.vx += rand(-1.0, 1.0);
  a.vy += rand(-1.0, 1.0);
  b.vx += rand(-1.0, 1.0);
  b.vy += rand(-1.0, 1.0);
  a.shadeOffset = Math.floor(Math.random() * 6);
  b.shadeOffset = Math.floor(Math.random() * 6);
}

function drawD20Hex(cx, cy, r, angle, color, numStr, flash) {
  if (!d20Context) {
    return;
  }

  const ctx = d20Context;
  const faceBody = color.body === "#f4f4f4" ? "#f8f8f8" : color.body;
  const isWhiteDie = color.body === "#ffffff";
  const faceDark = isWhiteDie ? "#c1121f" : (color.body === "#f4f4f4" ? "#111111" : color.dark);
  const faceMid = color.body === "#f4f4f4" ? "#e8e8e8" : color.mid;
  const faceLight = isWhiteDie ? "#e26a74" : (color.body === "#f4f4f4" ? "#d2d2d2" : color.light);
  const faceText = color.body === "#f4f4f4" ? "#111111" : color.text;
  const faceLabel = color.body === "#f4f4f4" ? "#111111" : color.label;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 6;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }

  const shadeOffset = Number.isInteger(color.shadeOffset) ? color.shadeOffset : 0;
  const highlightA = pts[shadeOffset % 6];
  const highlightB = pts[(shadeOffset + 1) % 6];
  const shadowA = pts[(shadeOffset + 3) % 6];
  const shadowB = pts[(shadeOffset + 4) % 6];

  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.fillStyle = faceBody;
  ctx.fill();
  ctx.strokeStyle = flash ? "#ffffff" : faceDark;
  ctx.lineWidth = flash ? 3 : (isWhiteDie ? 2.6 : 2);
  ctx.stroke();

  if (!flash) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(highlightA[0], highlightA[1]);
    ctx.lineTo(highlightB[0], highlightB[1]);
    ctx.closePath();
    ctx.fillStyle = isWhiteDie ? "#fefefe" : (color.body === "#f4f4f4" ? "#ffffff" : faceMid);
    ctx.globalAlpha = 0.98;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shadowA[0], shadowA[1]);
    ctx.lineTo(shadowB[0], shadowB[1]);
    ctx.closePath();
    ctx.fillStyle = isWhiteDie ? "#c1121f" : (color.body === "#f4f4f4" ? "#b0b0b0" : faceDark);
    ctx.globalAlpha = isWhiteDie ? 0.34 : 0.62;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = isWhiteDie ? "#c1121f" : (color.body === "#f4f4f4" ? "#9f9f9f" : faceLight);
    ctx.lineWidth = isWhiteDie ? 2.2 : 1.4;
    ctx.globalAlpha = isWhiteDie ? 0.92 : 0.54;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  ctx.font = `700 ${Math.round(r * 0.52)}px sans-serif`;
  ctx.fillStyle = faceText;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(numStr, 0, r * 0.1);

  if (!flash && numStr === "6") {
    ctx.save();
    ctx.strokeStyle = faceText;
    ctx.lineWidth = Math.max(1.5, r * 0.05);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, r * 0.34);
    ctx.lineTo(r * 0.15, r * 0.34);
    ctx.stroke();
    ctx.restore();
  }

  if (!flash && numStr === "9") {
    ctx.save();
    ctx.strokeStyle = faceText;
    ctx.lineWidth = Math.max(1.5, r * 0.05);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.06);
    ctx.lineTo(r * 0.15, -r * 0.06);
    ctx.stroke();
    ctx.restore();
  }

  if (!flash) {
    ctx.font = `900 ${Math.round(r * 0.22)}px sans-serif`;
    ctx.fillStyle = faceLabel;
    ctx.globalAlpha = 0.9;
    ctx.fillText(isWhiteDie ? "D" : "T", 0, -r * 0.48);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawD20Shadow(x, y) {
  if (!d20Context) {
    return;
  }

  const depthFactor = y / d20CanvasHeight;
  const ctx = d20Context;
  ctx.save();
  ctx.globalAlpha = 0.07 + depthFactor * 0.16;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(x, y + d20Radius * 0.88, d20Radius * 0.65 * (0.5 + depthFactor * 0.55), d20Radius * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawD20Trail(die) {
  if (!d20Context || !die.trail || die.trail.length < 2) {
    return;
  }

  const ctx = d20Context;
  ctx.save();
  for (let i = 1; i < die.trail.length; i++) {
    const alpha = (i / die.trail.length) * 0.10;
    const size = d20Radius * 0.30 * (i / die.trail.length);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = die.color.body;
    ctx.beginPath();
    ctx.arc(die.trail[i].x, die.trail[i].y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawD20Frame(now) {
  if (!d20Context || !d20Canvas || !d20RollState) {
    return;
  }

  const ctx = d20Context;
  const state = d20RollState;
  const dt = state.active ? Math.min((now - (state.lastTime || now)) / 1000, 0.05) : 0;
  state.lastTime = now;

  ctx.clearRect(0, 0, d20CanvasWidth, d20CanvasHeight);

  const globalElapsed = now - state.startedAt;
  const durationMs = state.durationMs || d20RollDurationMaxMs;
  const timeUp = globalElapsed >= durationMs;

  state.dies.forEach((die) => updateD20Die(die, dt));
  resolveD20Collision(state.dies[0], state.dies[1]);

  state.dies.forEach((die) => {
    if (timeUp && !die.stopped) {
      die.stopped = true;
      die.finalVal = die.displayNum;
      die.stoppedAngle = die.angle;
      die.vx = 0;
      die.vy = 0;
    }
  });

  state.dies.forEach((die) => {
    if (die.stopped) {
      return;
    }

    const spd = Math.sqrt((die.vx * die.vx) + (die.vy * die.vy));
    const shouldFlickNumbers = globalElapsed < durationMs - 1000;
    if (spd > 0.2 && now - die.lastShadeShift > 70) {
      die.shadeOffset = (die.shadeOffset + 1 + Math.floor(Math.random() * 4)) % 6;
      die.lastShadeShift = now;
    }
    if (shouldFlickNumbers) {
      die.locked = false;
      const flickSpeed = Math.max(30, Math.floor(spd * 14));
      if (now - die.lastFlick > flickSpeed) {
        die.displayNum = randomD20();
        die.lastFlick = now;
      }
    } else if (!die.locked) {
      die.finalVal = die.displayNum;
      die.locked = true;
    }
  });

  state.dies.forEach((die) => {
    if (!die.stopped) {
      drawD20Trail(die);
    }
  });

  state.dies.forEach((die) => {
    die.color.shadeOffset = die.shadeOffset;
    if (die.stopped) {
      drawD20Shadow(die.x, die.y);
      drawD20Hex(die.x, die.y, d20Radius, die.stoppedAngle, die.color, String(die.displayNum), false);
    } else {
      drawD20Shadow(die.x, die.y);
      drawD20Hex(die.x, die.y, d20Radius, die.angle, die.color, String(die.displayNum), false);
    }
  });

  diceValues[0] = state.dies[0].displayNum;
  diceValues[1] = state.dies[1].displayNum;

  if (timeUp && state.dies.every((die) => die.stopped)) {
    if (!state.resultPublished) {
      state.resultPublished = true;
      sendBullshootRollPortalNotice(state.dies.map((die) => die.displayNum));
    }
    state.active = false;
    if (d20RollFrame) {
      cancelAnimationFrame(d20RollFrame);
      d20RollFrame = null;
    }
    if (d20RollInterval) {
      clearInterval(d20RollInterval);
      d20RollInterval = null;
    }
    if (d20RollCompleteTimer) {
      clearTimeout(d20RollCompleteTimer);
      d20RollCompleteTimer = null;
    }
    queueBracketDraftSave();
    return;
  }
}

function renderNameInputs(count) {
  if (!Number.isInteger(count) || count < 2 || count > 200) {
    nameList.innerHTML = `<p class="empty-names">Enter 2 to 200 players, then update the list.</p>`;
    lastSyncedPlayerCount = Number.isInteger(count) ? count : 0;
    return;
  }

  const existingNames = getPlayerNameMap();
  lastSyncedPlayerCount = count;
  const fallbackNames = isLocalHost() ? defaultRosterNames.slice(0, count) : [];

  nameList.innerHTML = Array.from({ length: count }, (_, index) => {
    const number = String(index + 1);
    const value = existingNames[number] || fallbackNames[index] || "";

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

function isLocalHost() {
  try {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
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

function getBarName() {
  return String(barNameInput?.value || "").trim();
}

function shrinkTotalPlayersToEnteredNames() {
  const enteredNames = Array.from(nameList?.querySelectorAll("[data-player-number]") || [])
    .map((input) => input.value.trim())
    .filter(Boolean);

  if (enteredNames.length < 2) {
    showMessage("Enter at least 2 player names before shrinking the list.");
    return;
  }

  if (String(totalPlayers.value || "") !== String(enteredNames.length)) {
    totalPlayers.value = String(enteredNames.length);
  }

  syncTotalPlayersSection(true);

  Array.from(nameList?.querySelectorAll("[data-player-number]") || []).forEach((input, index) => {
    input.value = enteredNames[index] || "";
  });

  savePortalSnapshotToLocalStorage();
  showMessage(`Trimmed the list to ${enteredNames.length} player${enteredNames.length === 1 ? "" : "s"}.`);
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
    pdfColumnMirror.innerHTML = `<p class="no-routes">PDF mirror is available for 3 to 34 teams.</p>`;
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
    learnedPdfGraphsPromise = fetch("PDF_BRACKET_GRAPHS.json?v=pdf-21-31", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load learned PDF bracket graphs: ${response.status}`);
        }
        return response.json();
      })
      .then((graphs) => {
        learnedPdfGraphs = normalizeLearnedPdfGraphs(graphs);
        return learnedPdfGraphs;
      })
      .catch(() => {
        learnedPdfGraphs = null;
        return null;
      });
  }

  return learnedPdfGraphsPromise;
}

function normalizeLearnedPdfGraphs(graphs) {
  if (!graphs || typeof graphs !== "object") {
    return graphs;
  }

  const graph = graphs[8];
  if (!graph || !Array.isArray(graph.matches)) {
    return graphs;
  }

  const updateMatch = (id, patch) => {
    const match = graph.matches.find((item) => item?.id === id);
    if (match) {
      Object.assign(match, patch);
    }
  };

  updateMatch(8, {
    winnerTo: { game: 11, slot: 1 },
  });
  updateMatch(11, {
    inputs: [
      { kind: "winner", game: 7 },
      { kind: "winner", game: 8 },
    ],
    winnerTo: { game: 14, slot: 0 },
    loserTo: { game: 13, slot: 0, ifFirstLoss: false },
  });
  updateMatch(13, {
    inputs: [
      { kind: "loser", game: 11, ifFirstLoss: false },
      { kind: "winner", game: 12 },
    ],
    winnerTo: { game: 14, slot: 1 },
    loserTo: null,
  });

  return graphs;
}

function createBracketGraph(players) {
  if (learnedPdfGraphs?.[players.length]) {
    return createPdfLearnedBracketGraph(players, learnedPdfGraphs[players.length]);
  }

  if (players.length >= 3 && players.length <= 24) {
    throw new Error(`Missing PDF bracket graph for ${players.length}-team bracket`);
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
  const playInGameIds = getPdfLayoutColumnGameIds(layout.winner, 0);
  const byeFedGameIds = getPdfLayoutColumnGameIds(layout.winner, 1);
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
      match.isPlayIn = match.type === "winner" && playInGameIds.has(match.id);
      match.isByeFed = match.type === "winner" && byeFedGameIds.has(match.id);

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

function assignGraphDisplayGameNumbers(bracketState) {
  if (!bracketState || bracketState.mode !== "graph") {
    return;
  }

  const orderedMatches = [
    ...(bracketState.rounds?.winner || []).flat(),
    ...(bracketState.rounds?.loser || []).flat(),
    bracketState.final,
    bracketState.resetFinal,
    bracketState.doubleDipFinal,
  ].filter(Boolean);

  orderedMatches.forEach((match) => {
    const displayGameNumber = Number(match?.id || match?.gameNumber || 0);
    match.gameNumber = displayGameNumber;
    if (match.type === "final") {
      match.title = `Game ${displayGameNumber} - Grand Final`;
    } else if (match.type === "resetFinal") {
      match.title = `Game ${displayGameNumber} - Reset Final`;
    } else if (match.type === "doubleDipFinal") {
      match.title = `Game ${displayGameNumber} - Double Dip Final`;
    } else {
      match.title = `Game ${displayGameNumber}`;
    }
  });
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

function getPdfLayoutColumnGameIds(columnsText, columnIndex) {
  const column = columnsText.split(" / ")[columnIndex] || "";
  return new Set(
    column
      .split(",")
      .map((game) => Number(game.trim().replace(/^G/, "")))
      .filter((gameId) => Number.isInteger(gameId) && gameId > 0),
  );
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

function getGraphDisplayGameNumber(match) {
  const value = Number(match?.gameNumber || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function normalizeGraphSourceLabel(label, bracketState) {
  const value = String(label || "");
  const winnerMatch = /^Winner of Game (\d+)\b/i.exec(value);
  if (winnerMatch) {
    const source = bracketState?.matchesById?.[Number(winnerMatch[1])];
    const displayNumber = getGraphDisplayGameNumber(source) || Number(winnerMatch[1]);
    return `Winner of Game ${displayNumber}`;
  }

  const loserMatch = /^Loser of Game (\d+)\b/i.exec(value);
  if (loserMatch) {
    const source = bracketState?.matchesById?.[Number(loserMatch[1])];
    const displayNumber = getGraphDisplayGameNumber(source) || Number(loserMatch[1]);
    return `Loser of Game ${displayNumber}`;
  }

  return value;
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
    isByeFed: false,
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
    return null;
  }

  return match.winnerTo?.matchId || null;
}

function applyGraphFinalResult(bracketState, match, winnerName, loserName) {
  if (match.type === "doubleDipFinal") {
    bracketState.champion = winnerName;
    return;
  }

  if (match.type === "resetFinal") {
    bracketState.champion = winnerName;
    bracketState.doubleDipFinal = null;
    return;
  }

  const winnersSidePlayer = match.players[0];
  if (winnerName === winnersSidePlayer) {
    bracketState.champion = winnerName;
    bracketState.doubleDipFinal = null;
    if (bracketState.resetFinal) {
      bracketState.resetFinal.players = ["", ""];
      bracketState.resetFinal.slotSources = ["", ""];
      bracketState.resetFinal.winner = "";
      bracketState.resetFinal.loser = "";
      bracketState.resetFinal.autoAdvanced = false;
    }
    return;
  }

  const playoff = bracketState.resetFinal || createGraphMatch(
    Math.max(...bracketState.matches.map((candidate) => candidate.id)) + 1,
    "resetFinal",
    1,
    0,
  );

  playoff.title = `Game ${playoff.gameNumber || (match.gameNumber + 1)} - Playoff`;
  playoff.players = [...match.players];
  playoff.slotSources = ["", ""];
  playoff.winner = "";
  playoff.loser = "";
  playoff.autoAdvanced = false;
  bracketState.resetFinal = playoff;
  if (!bracketState.matchesById[playoff.id]) {
    bracketState.matches.push(playoff);
    bracketState.matchesById[playoff.id] = playoff;
  }
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

  if (state.mode === "graph") {
    resetGraphMatchCascade(matchId);
  } else {
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
  }

  renderBracket();
  clearAllPortalMessages({ publish: true });
  queueActiveLodCodesRefresh();
  showMessage("Match result cleared. Pick the correct winner.");
}

function resetGraphMatchCascade(matchId) {
  const affectedIds = getGraphResetCascadeIds(state, matchId);
  const affectedSet = new Set(affectedIds);
  const boardAssignments = new Map(
    state.matches.map((match) => [match.id, match.boardAssignment ?? null])
  );

  affectedIds.forEach((id) => {
    const match = state.matchesById[id];
    if (!match) {
      return;
    }

    match.winner = "";
    match.loser = "";
    match.autoAdvanced = false;

    match.players = ["", ""];
    match.slotSources = ["", ""];
  });

  state.matches.forEach((match) => {
    if (boardAssignments.has(match.id)) {
      match.boardAssignment = boardAssignments.get(match.id);
    }
  });

  if (affectedSet.has(state.final?.id) || affectedSet.has(state.resetFinal?.id) || affectedSet.has(state.doubleDipFinal?.id)) {
    state.champion = "";
    if (state.resetFinal) {
      state.resetFinal.players = ["", ""];
      state.resetFinal.slotSources = ["", ""];
      state.resetFinal.winner = "";
      state.resetFinal.loser = "";
      state.resetFinal.autoAdvanced = false;
    }
    if (state.doubleDipFinal) {
      state.doubleDipFinal.players = ["", ""];
      state.doubleDipFinal.slotSources = ["", ""];
      state.doubleDipFinal.winner = "";
      state.doubleDipFinal.loser = "";
      state.doubleDipFinal.autoAdvanced = false;
    }
  }

  settleGraphByesAndSources(state);
}

function getGraphResetCascadeIds(bracketState, matchId) {
  const affected = new Set([matchId]);
  const queue = [matchId];

  while (queue.length) {
    const currentId = queue.shift();
    const currentMatch = bracketState.matchesById?.[currentId];
    if (!currentMatch) {
      continue;
    }

    [currentMatch.winnerTo, currentMatch.loserTo].forEach((destination) => {
      const destinationId = destination?.matchId;
      if (!destinationId || affected.has(destinationId)) {
        return;
      }

      affected.add(destinationId);
      queue.push(destinationId);
    });
  }

  return Array.from(affected);
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
  assignGraphDisplayGameNumbers(bracketState);
  let changed = true;

  while (changed) {
    refreshGraphSources(bracketState);
    changed = autoAdvanceGraphByes(bracketState);
  }

  refreshGraphSources(bracketState);
  markGraphPlayInMatches(bracketState);
}

function markGraphPlayInMatches(bracketState) {
  if (bracketState.templateSources) {
    return;
  }

  bracketState.matches.forEach((match) => {
    match.isPlayIn = false;
    match.isByeFed = false;
    if (isGraphPlayInMatch(match, bracketState)) {
      match.isPlayIn = true;
    }
  });
}

function isGraphPlayInMatch(match, bracketState) {
  if (!match || match.type !== "winner") {
    return false;
  }

  if (match.roundIndex !== 0 || match.autoAdvanced) {
    return false;
  }

  const realPlayerCount = match.players.filter((player) => player && player !== "BYE").length;
  if (realPlayerCount < 2) {
    return false;
  }

  const destination = match.winnerTo;
  const target = destination ? bracketState.matchesById[destination.matchId] : null;
  if (!target || target.type !== "winner") {
    return false;
  }

  const targetRealPlayers = target.players.filter((player) => player && player !== "BYE").length;
  return targetRealPlayers === 1;
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
      match.slotSources = match.players.map((player, index) => player ? "" : normalizeGraphSourceLabel(source[index], bracketState));
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

    addGraphSource(bracketState, match.winnerTo, `Winner of Game ${getGraphDisplayGameNumber(match)}`);
    if (match.type === "winner") {
      addGraphSource(bracketState, match.loserTo, `Loser of Game ${getGraphDisplayGameNumber(match)}`);
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
  assignGraphDisplayGameNumbers(bracketState);
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
  const limit = Math.min(players.length, size);

  for (let index = 0; index < limit; index += 1) {
    seeds[index] = players[index];
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
  clearAllPortalMessages({ publish: true });
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
  if (winnerName === match.players[0]) {
    state.champion = winnerName;
    state.doubleDipFinal = null;
    if (state.resetFinal) {
      state.resetFinal.players = ["", ""];
      state.resetFinal.slotSources = ["", ""];
      state.resetFinal.winner = "";
      state.resetFinal.loser = "";
      state.resetFinal.autoAdvanced = false;
    }
    return;
  }

  state.resetFinal = state.resetFinal || createMatch("resetFinal", 0, 0, "Playoff");
  state.resetFinal.gameNumber = (state.final.gameNumber || 0) + 1;
  state.resetFinal.title = `Game ${state.resetFinal.gameNumber} - Playoff`;
  state.resetFinal.players = [...match.players];
  state.resetFinal.slotSources = ["", ""];
  state.resetFinal.winner = "";
  state.resetFinal.loser = "";
  state.resetFinal.autoAdvanced = false;
}

function applyLegacyResetFinalResult(match, winnerName, loserName) {
  state.champion = winnerName;
  state.doubleDipFinal = null;
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

  if (!scheduleBracketCleanupIfNeeded()) {
    return;
  }

  championOutput.textContent = state.champion ? `Champion: ${state.champion}` : "Champion: pending";
  bracketOutput.className = "bracket";
  if (state.mode === "graph") {
    bracketOutput.innerHTML = renderPdfVisualBracket();
    schedulePdfReferencePreview();
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
    ${renderPdfReferencePanel()}
  `;
  updatePaperBackup();
  schedulePdfReferencePreview();
  savePortalSnapshotToLocalStorage();
  saveBracketDraft();
  queueActiveLodCodesRefresh();
}

function buildPortalSnapshot(exportedAt = new Date().toISOString()) {
  return {
    version: 1,
    exportedAt,
    lodCode,
    expiresAt: refreshBracketCleanupAt(lodCode) || getOrCreateBracketCleanupAt(lodCode) || "",
    totalPlayers: Number(totalPlayers?.value || 0) || 0,
    playersPerGroup: Number(playersPerGroup?.value || 0) || 0,
    barName: getBarName(),
    eventDate: normalizeDateInputValue(eventDateInput?.value || ""),
    playerList: playerList?.value || "",
    nameMap: getPlayerNameMap(),
    currentTeams,
    hasGeneratedTeams,
    blockedGenerateCount,
    state: state ? JSON.parse(JSON.stringify(state)) : null,
    outShots: getOutShots(),
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
    splitPot: {
      entries: splitPotEntries,
      winner: splitPotWinner,
    },
    bullseyeShoot: {
      currentPot: getBullseyeShootCurrentPot(),
      entries: bullseyeShootEntries,
      winner: bullseyeShootWinner,
    },
    portalNotice,
    portalNoticeAt,
    portalSupportNotice,
    portalSupportNoticeAt,
    portalSupportMessages,
    portalAutoNotice,
    portalAutoNoticeAt,
    portalBullshootNotice,
    portalBullshootNoticeAt,
  };
}

const PORTAL_SNAPSHOT_SIGNATURE_IGNORED_KEYS = new Set([
  "exportedAt",
  "portalNoticeAt",
  "portalSupportNoticeAt",
  "portalAutoNoticeAt",
  "portalBullshootNoticeAt",
]);

function clonePortalSnapshotForSignature(value) {
  if (Array.isArray(value)) {
    return value.map((item) => clonePortalSnapshotForSignature(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const clone = {};
  Object.keys(value)
    .filter((key) => !PORTAL_SNAPSHOT_SIGNATURE_IGNORED_KEYS.has(key))
    .sort()
    .forEach((key) => {
      clone[key] = clonePortalSnapshotForSignature(value[key]);
    });
  return clone;
}

function getPortalSnapshotSignature(snapshot) {
  try {
    return JSON.stringify(clonePortalSnapshotForSignature(snapshot));
  } catch {
    return "";
  }
}

function savePortalSnapshotToLocalStorage() {
  const snapshot = buildPortalSnapshot();
  const signature = getPortalSnapshotSignature(snapshot);
  if (canUseLocalStorage()) {
    try {
      localStorage.setItem(getPortalSnapshotStorageKey(), JSON.stringify(snapshot));
    } catch {
      // Local portal caching is optional; bracket clicks must keep working.
    }
  }
  if (suppressPortalSnapshotPublish) {
    return false;
  }

  if (signature && signature === lastPublishedPortalSnapshotSignature) {
    return false;
  }

  return queuePortalSnapshotPublish(snapshot);
}

function isAssistantAdminSessionActive() {
  const sessionCode = getAssistantAdminSessionCode();
  return Boolean(sessionCode && sessionCode === normalizeLodCode(lodCode));
}

async function flushPortalSnapshotPublish(snapshot = buildPortalSnapshot()) {
  if (!API_BASE_URLS.length || suppressPortalSnapshotPublish || !snapshot || !snapshot.lodCode) {
    return false;
  }

  if (portalPublishTimer) {
    clearTimeout(portalPublishTimer);
    portalPublishTimer = null;
  }

  await publishPortalSnapshotToApi(snapshot);
  return true;
}

function clearTournamentState({ preserveLodCode = true, clearDraft = true, code = lodCode } = {}) {
  const cleanupCode = normalizeLodCode(code || lodCode);

  if (portalPublishTimer) {
    clearTimeout(portalPublishTimer);
    portalPublishTimer = null;
  }
  if (bracketDraftSaveTimer) {
    clearTimeout(bracketDraftSaveTimer);
    bracketDraftSaveTimer = null;
  }
  lastPublishedPortalSnapshot = "";
  lastPublishedPortalSnapshotSignature = "";
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
  portalSupportNotice = "";
  portalSupportNoticeAt = "";
  portalSupportNoticeDraft = "";
  portalSupportMessages = [];
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
  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = "";
  }
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = "";
  }
  renderPortalSupportTranscript();
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
  persistBracketDraft(buildBracketDraft());
}

function persistBracketDraft(draft) {
  const payload = JSON.stringify(draft);
  try {
    if (canUseLocalStorage()) {
      localStorage.setItem(bracketDraftStorageKey, payload);
    }
    if (canUseSessionStorage()) {
      sessionStorage.setItem(bracketDraftSessionStorageKey, payload);
    }
  } catch {
    // Ignore storage failures.
  }
  try {
    window.name = `${bracketDraftWindowNamePrefix}${payload}`;
  } catch {
    // Ignore window name failures.
  }
  try {
    const currentState = (history.state && typeof history.state === "object") ? history.state : {};
    history.replaceState({ ...currentState, [bracketDraftHistoryStateKey]: payload }, "", location.href);
  } catch {
    // Ignore history state failures.
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

function flushBracketDraftSave() {
  if (bracketDraftSaveTimer) {
    clearTimeout(bracketDraftSaveTimer);
    bracketDraftSaveTimer = null;
  }
  saveBracketDraft();
}

function restoreBracketDraft() {
  const portalSnapshot = readPortalSnapshot();
  if (portalSnapshot && portalSnapshot.state && typeof portalSnapshot.state === "object") {
    applyRemoteAdminSnapshot(portalSnapshot, "local-storage");
    return true;
  }

  const draft = readBracketDraft();
  if (!draft) {
    return false;
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
  lastSyncedPlayerCount = Number(totalPlayers.value) || 0;

  if (draft.nameMap && typeof draft.nameMap === "object") {
    applyPlayerNameMap(draft.nameMap, true);
  }

  if (typeof draft.playerList === "string") {
    playerList.value = draft.playerList;
  }

  if (typeof draft.eventDate === "string" && eventDateInput) {
    eventDateInput.value = normalizeDateInputValue(draft.eventDate);
    updateEventDateStatus();
  }

  if (Array.isArray(draft.currentTeams) && draft.currentTeams.length) {
    currentTeams = draft.currentTeams;
    hasGeneratedTeams = Boolean(draft.hasGeneratedTeams);
    blockedGenerateCount = Number(draft.blockedGenerateCount || 0);
    renderGroups(currentTeams);
  }

  if (draft.state && typeof draft.state === "object") {
    state = restoreGraphStateFromDraft(draft.state);
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
        if (savedExpiry <= Date.now()) {
          expireBracketSession(lodCode);
          return;
        }
      } else {
        clearCompletedBracketCode(lodCode);
      }
    } else {
      const cleanupAt = refreshBracketCleanupAt(lodCode) || (Number.isFinite(savedExpiry) && savedExpiry > 0
        ? savedExpiry
        : getOrCreateBracketCleanupAt(lodCode));

      if (cleanupAt && cleanupAt <= Date.now()) {
        expireBracketSession(lodCode);
        return;
      }

      if (cleanupAt) {
        saveBracketCleanupAt(lodCode, cleanupAt);
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

  if (typeof draft.portalSupportNotice === "string") {
    portalSupportNotice = draft.portalSupportNotice;
  }

  if (typeof draft.portalSupportNoticeAt === "string") {
    portalSupportNoticeAt = draft.portalSupportNoticeAt;
  }

  if (typeof draft.portalSupportNoticeDraft === "string") {
    portalSupportNoticeDraft = draft.portalSupportNoticeDraft;
  } else {
    portalSupportNoticeDraft = portalSupportNotice || "";
  }

  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = portalSupportNoticeDraft;
  }
  portalSupportMessages = normalizePortalSupportMessages(
    draft.portalSupportMessages,
    portalSupportNotice,
    portalSupportNoticeAt,
  );
  renderPortalSupportTranscript();
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = portalSupportNotice
      ? `Sent at ${portalSupportNoticeAt ? new Date(portalSupportNoticeAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "unknown time"}.`
      : "";
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
      diceValues[index] = numeric < 1 ? 1 : numeric;
    });
    if (d20RollState?.dies) {
      d20RollState.dies.slice(0, 2).forEach((die, index) => {
        die.displayNum = diceValues[index];
        die.finalVal = diceValues[index];
        die.stopped = true;
        die.vx = 0;
        die.vy = 0;
      });
      d20RollState.active = false;
    }
    renderDice();
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
  return true;
}

function readPortalSnapshot() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(getPortalSnapshotStorageKey());
    if (!raw) {
      return null;
    }

    return normalizeAdminMirrorSnapshot(JSON.parse(raw));
  } catch {
    return null;
  }
}

function readBracketDraft() {
  const sources = [];

  try {
    if (canUseLocalStorage()) {
      const raw = localStorage.getItem(bracketDraftStorageKey);
      if (raw) {
        sources.push(raw);
      }
    }
  } catch {
    // Ignore storage failures.
  }

  try {
    if (canUseSessionStorage()) {
      const raw = sessionStorage.getItem(bracketDraftSessionStorageKey);
      if (raw) {
        sources.push(raw);
      }
    }
  } catch {
    // Ignore storage failures.
  }

  try {
    if (typeof window.name === "string" && window.name.startsWith(bracketDraftWindowNamePrefix)) {
      sources.push(window.name.slice(bracketDraftWindowNamePrefix.length));
    }
  } catch {
    // Ignore window name failures.
  }

  try {
    const historyDraft = history.state && typeof history.state === "object"
      ? history.state[bracketDraftHistoryStateKey]
      : null;
    if (typeof historyDraft === "string" && historyDraft) {
      sources.push(historyDraft);
    }
  } catch {
    // Ignore history failures.
  }

  for (const source of sources) {
    try {
      const draft = JSON.parse(source);
      if (draft && typeof draft === "object") {
        return draft;
      }
    } catch {
      // Try the next source.
    }
  }

  return null;
}

function clearBracketDraftStorage() {
  try {
    if (canUseLocalStorage()) {
      localStorage.removeItem(bracketDraftStorageKey);
    }
    if (canUseSessionStorage()) {
      sessionStorage.removeItem(bracketDraftSessionStorageKey);
    }
    if (typeof window.name === "string" && window.name.startsWith(bracketDraftWindowNamePrefix)) {
      window.name = "";
    }
    const currentState = (history.state && typeof history.state === "object") ? history.state : {};
    if (Object.prototype.hasOwnProperty.call(currentState, bracketDraftHistoryStateKey)) {
      const { [bracketDraftHistoryStateKey]: _, ...rest } = currentState;
      history.replaceState(rest, "", location.href);
    }
  } catch {
    // Ignore storage failures.
  }
}

function saveAssistantAdminBackupDraft(draft = buildBracketDraft()) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    if (!sessionStorage.getItem(assistantAdminBackupStorageKey)) {
      sessionStorage.setItem(assistantAdminBackupStorageKey, JSON.stringify(draft));
    }
  } catch {
    // Ignore backup failures.
  }
}

function readAssistantAdminBackupDraft() {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(assistantAdminBackupStorageKey);
    if (!raw) {
      return null;
    }
    const draft = JSON.parse(raw);
    return draft && typeof draft === "object" ? draft : null;
  } catch {
    return null;
  }
}

function clearAssistantAdminBackupDraft() {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    sessionStorage.removeItem(assistantAdminBackupStorageKey);
  } catch {
    // Ignore backup cleanup failures.
  }
}

function restoreBracketDraftObject(draft) {
  if (!draft || typeof draft !== "object") {
    return;
  }

  if (draft.state && typeof draft.state === "object") {
    const restoredState = restoreGraphStateFromDraft(draft.state);
    draft = {
      ...draft,
      state: restoredState,
      expiresAt: restoredState?.champion ? (draft.expiresAt || "") : (refreshBracketCleanupAt(lodCode) || draft.expiresAt || ""),
    };
  }

  persistBracketDraft(draft);
  if (typeof draft.lodCode === "string") {
    saveStoredLodCode(normalizeLodCode(draft.lodCode));
  }
}

function restoreGraphStateFromDraft(draftState) {
  if (!draftState || typeof draftState !== "object" || draftState.mode !== "graph") {
    return draftState;
  }

  const restoredState = draftState;
  const matches = Array.isArray(restoredState.matches) ? restoredState.matches : [];
  const matchesById = {};
  const rounds = { winner: [], loser: [] };

  matches.forEach((match) => {
    if (!match || typeof match !== "object") {
      return;
    }

    if (!Array.isArray(match.players)) {
      match.players = ["", ""];
    }
    if (!Array.isArray(match.slotSources)) {
      match.slotSources = ["", ""];
    }

    matchesById[match.id] = match;

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

  if ((restoredState.originalPlayers || []).length === 8) {
    const openingRound = matches
      .filter((match) => match.type === "winner" && match.roundIndex === 0)
      .sort((a, b) => a.id - b.id);
    const roundHasPlayers = openingRound.some((match) => match.players.some((player) => player && player !== "BYE"));

    if (!roundHasPlayers) {
      let seedIndex = 0;
      openingRound.forEach((match) => {
        match.players[0] = restoredState.originalPlayers[seedIndex] || "";
        match.players[1] = restoredState.originalPlayers[seedIndex + 1] || "";
        seedIndex += 2;
      });
    }
  }

  rounds.winner = rounds.winner.filter(Boolean);
  rounds.loser = rounds.loser.filter(Boolean);
  rounds.winner.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));
  rounds.loser.forEach((round) => round.sort((a, b) => a.matchIndex - b.matchIndex));

  restoredState.matchesById = matchesById;
  restoredState.rounds = rounds;
  restoredState.final = matchesById[restoredState.final?.id] || matches.find((match) => match.type === "final") || restoredState.final || null;
  restoredState.resetFinal = matchesById[restoredState.resetFinal?.id] || matches.find((match) => match.type === "resetFinal") || restoredState.resetFinal || null;
  restoredState.doubleDipFinal = matchesById[restoredState.doubleDipFinal?.id] || matches.find((match) => match.type === "doubleDipFinal") || null;

  state = restoredState;
  rebuildGraphMatchIndex(state);
  settleGraphByesAndSources(state);
  return state;
}

function buildBracketDraft() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    totalPlayers: Number(totalPlayers.value) || 0,
    playersPerGroup: Number(playersPerGroup.value) || 0,
    barName: getBarName(),
    eventDate: normalizeDateInputValue(eventDateInput?.value || ""),
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
    expiresAt: refreshBracketCleanupAt(lodCode) || getOrCreateBracketCleanupAt(lodCode) || "",
    portalNotice,
    portalNoticeDraft,
    portalSupportNoticeAt,
    portalSupportNotice,
    portalSupportNoticeDraft,
    portalSupportMessages,
    portalAutoNotice,
    portalAutoNoticeAt,
    portalBullshootNotice,
    portalBullshootNoticeAt,
  };
}

function scheduleBracketCleanupIfNeeded() {
  clearBracketCleanupTimer();

  if (!state) {
    return false;
  }

  const normalizedCode = normalizeLodCode(lodCode);
  if (!normalizedCode) {
    return true;
  }

  if (state.champion) {
    window.setTimeout(() => clearCompletedBracketCode(normalizedCode), 0);
    return true;
  }

  const expiresAt = getOrCreateBracketCleanupAt(normalizedCode);
  if (!expiresAt) {
    return true;
  }

  const remaining = expiresAt - Date.now();
  if (remaining <= 0) {
    expireBracketSession(normalizedCode);
    return false;
  }

  bracketCleanupTimer = window.setTimeout(() => {
    expireBracketSession(normalizedCode);
  }, remaining);

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
    ? `LOD ${expiredCode} expired after 24 hours and was cleared.`
    : "Expired bracket session cleared.");
}

function clearCompletedBracketCode(code = lodCode) {
  const completedCode = normalizeLodCode(code);
  if (!completedCode) {
    return;
  }

  clearBracketCleanupTimer();
  clearBracketCleanupStorage(completedCode);
  clearPortalSnapshotStorage(completedCode);

  if (normalizeLodCode(lodCode) === completedCode) {
    lodCode = "";
    saveStoredLodCode("");
    clearAssistantAdminSessionCode();
    renderPortalLink();
  }

  queueActiveLodCodesRefresh();
}

function getOrCreateBracketCleanupAt(code = lodCode) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return 0;
  }

  if (!canUseLocalStorage()) {
    return 0;
  }

  try {
    const raw = localStorage.getItem(getBracketCleanupStorageKey(normalizedCode));
    const value = Number(raw);
    if (Number.isFinite(value) && value > 0) {
      return value;
    }

    if (!state || state.champion) {
      return 0;
    }

    const expiresAt = Date.now() + bracketCleanupDurationMs;
    localStorage.setItem(getBracketCleanupStorageKey(normalizedCode), String(expiresAt));
    return expiresAt;
  } catch {
    return 0;
  }
}

function refreshBracketCleanupAt(code = lodCode) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode || !canUseLocalStorage() || !state || state.champion) {
    return 0;
  }

  try {
    const expiresAt = Date.now() + bracketCleanupDurationMs;
    localStorage.setItem(getBracketCleanupStorageKey(normalizedCode), String(expiresAt));
    return expiresAt;
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

async function fetchActiveLodRegistry() {
  for (const baseUrl of API_BASE_URLS.length ? API_BASE_URLS : [""]) {
    if (!baseUrl) {
      continue;
    }

    try {
      const response = await fetch(getRegistryUrl(baseUrl), { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      return { registry: normalizeRegistry(await response.json()), baseUrl };
    } catch {
      // Try the next host.
    }
  }

  return { registry: { version: 1, updatedAt: "", codes: [] }, baseUrl: "" };
}

async function deleteAllActiveLods() {
  const activeSessionCode = getAssistantAdminSessionCode();
  const loadedCode = normalizeLodCode(lodCode);
  const storedPassword = getAssistantAdminPassword();
  if (!activeSessionCode || (loadedCode && activeSessionCode !== loadedCode)) {
    const entered = window.prompt("Enter the assistant admin password to delete all active LODs.", "");
    if (!entered) {
      showMessage("Assistant admin access was cancelled.");
      return false;
    }

    if (entered !== productionAssistantAdminPassword && entered !== storedPassword) {
      showMessage("Incorrect assistant admin password.");
      return false;
    }

    saveAssistantAdminPassword(productionAssistantAdminPassword);
    if (loadedCode) {
      saveAssistantAdminSessionCode(loadedCode);
    }
  }

  const registries = await fetchAllActiveLodRegistries();
  const codes = Array.from(new Set(registries.flatMap(({ registry }) => registry?.codes || []).filter(Boolean))).sort();

  const confirmLabel = codes.length
    ? `Delete all ${codes.length} active LOD${codes.length === 1 ? "" : "s"} and clear their messages?`
    : "Delete all active LODs and clear their messages?";
  if (!window.confirm(confirmLabel)) {
    showMessage("Delete all active LODs cancelled.");
    return false;
  }

  const cleanupCode = normalizeLodCode(lodCode);
  const deletedCodes = new Set(codes);

  for (const code of deletedCodes) {
    clearBracketCleanupStorage(code);
    for (const baseUrl of API_BASE_URLS) {
      if (!baseUrl) {
        continue;
      }

      try {
        await fetch(getApiSnapshotUrl(baseUrl, code), { method: "DELETE" });
      } catch {
        // Keep deleting other codes even if one host fails.
      }
    }
    if (canUseLocalStorage()) {
      try {
        localStorage.removeItem(`${portalSnapshotStorageKey}:${code}`);
      } catch {
        // Ignore local cache cleanup failures.
      }
    }
  }

  for (const baseUrl of API_BASE_URLS) {
    if (!baseUrl) {
      continue;
    }

    try {
      await fetch(getRegistryUrl(baseUrl), { method: "DELETE" });
    } catch {
      // Keep going so every configured host gets a delete attempt.
    }
  }

  if (!deletedCodes.size && cleanupCode) {
    clearPortalSnapshotStorage(cleanupCode);
    clearBracketCleanupStorage(cleanupCode);
  }

  if (cleanupCode) {
    clearTournamentState({ preserveLodCode: false, clearDraft: true, code: cleanupCode });
  } else {
    clearTournamentState({ preserveLodCode: false, clearDraft: true, code: "" });
  }

  clearAssistantAdminSessionCode();
  clearAllPortalMessages({ publish: false });
  queueActiveLodCodesRefresh();
  updateAssistantAdminControls();
  showMessage("All active LODs and their messages were deleted.");
  return true;
}

async function fetchAllActiveLodRegistries() {
  const results = [];

  for (const baseUrl of API_BASE_URLS.length ? API_BASE_URLS : [""]) {
    if (!baseUrl) {
      continue;
    }

    try {
      const response = await fetch(getRegistryUrl(baseUrl), { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      results.push({
        baseUrl,
        registry: normalizeRegistry(await response.json()),
      });
    } catch {
      // Try the next host.
    }
  }

  return results;
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

  if (!codes.length) {
    lodRegistryList.innerHTML = `
      <div class="lod-registry-empty">
        <strong>No active LODs published yet.</strong>
        <span>${escapeHtml(updatedLabel)}</span>
      </div>
    `;
    return;
  }

  lodRegistryList.innerHTML = `
    <div class="lod-registry-meta">
      <strong>${escapeHtml(`${codes.length} active LOD${codes.length === 1 ? "" : "s"}`)}</strong>
      <span>${escapeHtml(updatedLabel)}</span>
    </div>
    <div class="lod-registry-codes">
      ${codes.map((code) => `<button class="lod-code-chip secondary" type="button" data-load-lod-code="${escapeAttribute(code)}" onclick="window.loadAssistantAdminSnapshot('${escapeAttribute(code)}')">${escapeHtml(code)}</button>`).join("")}
    </div>
  `;
}

function getAssistantAdminPassword() {
  if (!canUseLocalStorage()) {
    return "";
  }

  try {
    return localStorage.getItem(assistantAdminPasswordStorageKey) || "";
  } catch {
    return "";
  }
}

function saveAssistantAdminPassword(password) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(assistantAdminPasswordStorageKey, String(password || ""));
  } catch {
    // Ignore storage failures.
  }
}

function getAssistantAdminSessionCode() {
  if (!canUseSessionStorage()) {
    return "";
  }

  try {
    return normalizeLodCode(sessionStorage.getItem(assistantAdminSessionStorageKey) || "");
  } catch {
    return "";
  }
}

function saveAssistantAdminSessionCode(code) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    sessionStorage.setItem(assistantAdminSessionStorageKey, normalizeLodCode(code));
  } catch {
    // Ignore storage failures.
  }
}

function clearAssistantAdminSessionCode() {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    sessionStorage.removeItem(assistantAdminSessionStorageKey);
  } catch {
    // Ignore storage failures.
  }
}

function getAttendancePasswordStatusLabel() {
  const storedPassword = getStoredAttendanceRootPassword();
  const sessionPassword = getAttendanceRootSessionPassword();

  if (!hasStoredAttendanceRootPassword()) {
    return "Using the default root password.";
  }

  if (sessionPassword && sessionPassword === storedPassword) {
    return "Root password is unlocked in this browser session.";
  }

  return "Custom root password is set and the attendance page will prompt for it.";
}

function updateAttendanceRootControls() {
  if (attendanceRootStatus) {
    attendanceRootStatus.textContent = getAttendancePasswordStatusLabel();
  }

  if (clearAttendanceRootPasswordButton) {
    clearAttendanceRootPasswordButton.disabled = !getStoredAttendanceRootPassword();
  }
}

function saveAttendanceRootPasswordFromAdmin() {
  const currentPassword = normalizeAttendanceRootPassword(attendanceRootCurrentPassword?.value || "");
  const newPassword = normalizeAttendanceRootPassword(attendanceRootNewPassword?.value || "");
  const confirmPassword = normalizeAttendanceRootPassword(attendanceRootConfirmPassword?.value || "");
  const storedPassword = getStoredAttendanceRootPassword();

  if (storedPassword && currentPassword !== storedPassword) {
    showMessage("Current root password is incorrect.");
    return;
  }

  if (!newPassword) {
    showMessage("Enter a new root password.");
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("Root password confirmation does not match.");
    return;
  }

  saveStoredAttendanceRootPassword(newPassword);
  clearAttendanceRootSessionPassword();

  if (attendanceRootCurrentPassword) {
    attendanceRootCurrentPassword.value = "";
  }
  if (attendanceRootNewPassword) {
    attendanceRootNewPassword.value = "";
  }
  if (attendanceRootConfirmPassword) {
    attendanceRootConfirmPassword.value = "";
  }

  updateAttendanceRootControls();
  showMessage("Attendance root password saved.");
}

function clearAttendanceRootPasswordFromAdmin() {
  const confirmed = window.confirm("Reset the attendance root password to the default value for this browser?");
  if (!confirmed) {
    return;
  }

  clearStoredAttendanceRootPassword();
  clearAttendanceRootSessionPassword();
  if (attendanceRootCurrentPassword) {
    attendanceRootCurrentPassword.value = "";
  }
  if (attendanceRootNewPassword) {
    attendanceRootNewPassword.value = "";
  }
  if (attendanceRootConfirmPassword) {
    attendanceRootConfirmPassword.value = "";
  }

  updateAttendanceRootControls();
  showMessage("Attendance root password reset to the default.");
}

function openAttendanceSheet() {
  window.location.href = "attendance.html";
}

function requireAssistantAdminPassword(code) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return false;
  }

  const currentSession = getAssistantAdminSessionCode();
  if (currentSession && currentSession === normalizedCode) {
    return true;
  }

  const storedPassword = getAssistantAdminPassword();
  const promptLabel = `Enter the assistant admin password to load LOD ${normalizedCode}.`;
  const entered = window.prompt(promptLabel, "");

  if (!entered) {
    showMessage("Assistant admin access was cancelled.");
    return false;
  }

  if (entered !== productionAssistantAdminPassword && entered !== storedPassword) {
    showMessage("Incorrect assistant admin password.");
    return false;
  }

  saveAssistantAdminPassword(productionAssistantAdminPassword);
  saveAssistantAdminSessionCode(normalizedCode);
  return true;
}

function stopRemoteMirrorRefresh() {
  remoteMirrorRequestEpoch += 1;
  if (remoteMirrorTimer) {
    clearInterval(remoteMirrorTimer);
    remoteMirrorTimer = null;
  }
}

function startRemoteMirrorRefresh() {
  const normalizedCode = normalizeLodCode(lodCode);
  if (!normalizedCode || !API_BASE_URLS.length) {
    return;
  }

  stopRemoteMirrorRefresh();
  remoteMirrorTimer = window.setInterval(() => {
    if (normalizeLodCode(lodCode)) {
      pollRemoteAdminSnapshot(lodCode);
    }
  }, Math.max(1000, Number(window.BRACKET_API_POLL_MS || 5000)));
}

async function pollRemoteAdminSnapshot(code) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return false;
  }

  const requestEpoch = remoteMirrorRequestEpoch;

  for (const baseUrl of API_BASE_URLS.length ? API_BASE_URLS : [""]) {
    if (!baseUrl) {
      continue;
    }

    try {
      const response = await fetch(getApiSnapshotUrl(baseUrl, normalizedCode), { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const snapshot = normalizeAdminMirrorSnapshot(await response.json());
      if (!snapshot) {
        continue;
      }

      if (requestEpoch !== remoteMirrorRequestEpoch) {
        return false;
      }

      const snapshotSignature = getPortalSnapshotSignature(snapshot);
      if (snapshotSignature && snapshotSignature === lastRemoteMirrorSnapshotSignature) {
        return true;
      }

      applyRemoteAdminSnapshot(snapshot, baseUrl);
      lastRemoteMirrorSnapshotSignature = snapshotSignature;
      if (snapshotSignature) {
        lastPublishedPortalSnapshotSignature = snapshotSignature;
      }
      updateAssistantAdminControls();
      return true;
    } catch {
      // Try the next configured host.
    }
  }

  return false;
}

async function loadRemoteAdminSnapshot(code, announceFailure = false) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    if (announceFailure) {
      showMessage("Enter a LOD code to load a live admin snapshot.");
    }
    return false;
  }

  const sessionCode = getAssistantAdminSessionCode();
  if (sessionCode !== normalizedCode && !requireAssistantAdminPassword(normalizedCode)) {
    return false;
  }

  saveAssistantAdminSessionCode(normalizedCode);
  saveAssistantAdminBackupDraft(buildBracketDraft());
  lodCode = normalizedCode;
  saveStoredLodCode(lodCode);
  renderPortalLink(true);
  queueActiveLodCodesRefresh();
  stopRemoteMirrorRefresh();
  lastRemoteMirrorSnapshotSignature = "";
  startRemoteMirrorRefresh();

  for (const baseUrl of API_BASE_URLS.length ? API_BASE_URLS : [""]) {
    if (!baseUrl) {
      continue;
    }

    try {
      const response = await fetch(getApiSnapshotUrl(baseUrl, normalizedCode), { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const snapshot = normalizeAdminMirrorSnapshot(await response.json());
      if (!snapshot) {
        continue;
      }

      const snapshotSignature = getPortalSnapshotSignature(snapshot);
      if (snapshotSignature && snapshotSignature === lastRemoteMirrorSnapshotSignature) {
        updateAssistantAdminControls();
        return true;
      }

      applyRemoteAdminSnapshot(snapshot, baseUrl);
      lastRemoteMirrorSnapshotSignature = snapshotSignature;
      if (snapshotSignature) {
        lastPublishedPortalSnapshotSignature = snapshotSignature;
      }
      updateAssistantAdminControls();
      showMessage(`Live admin snapshot loaded for LOD ${normalizedCode}.`);
      return true;
    } catch {
      // Try the next configured host.
    }
  }

  if (announceFailure) {
    showMessage(`Unable to load the live admin snapshot for LOD ${normalizedCode}.`);
  }
  return false;
}

window.loadAssistantAdminSnapshot = function loadAssistantAdminSnapshot(code) {
  return loadRemoteAdminSnapshot(code, true);
};

window.addEventListener("storage", (event) => {
  if (!event.key) {
    return;
  }

  if (event.key === assistantAdminSessionStorageKey || event.key === assistantAdminPasswordStorageKey) {
    updateAssistantAdminControls();

    const currentCode = normalizeLodCode(lodCode);
    const sessionCode = getAssistantAdminSessionCode();
    if (!currentCode) {
      return;
    }

    if (sessionCode === currentCode) {
      startRemoteMirrorRefresh();
      void pollRemoteAdminSnapshot(currentCode);
      return;
    }

    stopRemoteMirrorRefresh();
    return;
  }

  if (event.key === ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY || event.key === ATTENDANCE_ROOT_SESSION_STORAGE_KEY) {
    updateAttendanceRootControls();
    return;
  }

  if (!event.key.startsWith(`${portalSnapshotStorageKey}:`) || !event.newValue) {
    return;
  }

  try {
    const snapshot = normalizeAdminMirrorSnapshot(JSON.parse(event.newValue));
    if (!snapshot) {
      return;
    }

    const currentCode = normalizeLodCode(lodCode);
    if (!currentCode || normalizeLodCode(snapshot.lodCode) !== currentCode) {
      return;
    }

    const signature = getPortalSnapshotSignature(snapshot);
    if (signature && signature === lastRemoteMirrorSnapshotSignature) {
      return;
    }

    applyRemoteAdminSnapshot(snapshot, "local-storage");
    lastRemoteMirrorSnapshotSignature = signature;
    if (signature) {
      lastPublishedPortalSnapshotSignature = signature;
    }
    updateAssistantAdminControls();
  } catch {
    // Ignore malformed storage payloads.
  }
});

function normalizeAdminMirrorSnapshot(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const snapshot = {
    version: Number(data.version || 1),
    exportedAt: String(data.exportedAt || ""),
    lodCode: normalizeLodCode(data.lodCode),
    expiresAt: Number(data.expiresAt || 0) || 0,
    state: data.state && typeof data.state === "object" ? data.state : null,
    outShots: Array.isArray(data.outShots) ? data.outShots : [],
    mysteryOut: data.mysteryOut || "",
    portalNotice: String(data.portalNotice || ""),
    portalNoticeAt: String(data.portalNoticeAt || ""),
    portalSupportNotice: String(data.portalSupportNotice || ""),
    portalSupportNoticeAt: String(data.portalSupportNoticeAt || ""),
    portalSupportMessages: Array.isArray(data.portalSupportMessages) ? data.portalSupportMessages : [],
    portalAutoNotice: String(data.portalAutoNotice || ""),
    portalAutoNoticeAt: String(data.portalAutoNoticeAt || ""),
    portalBullshootNotice: String(data.portalBullshootNotice || ""),
    portalBullshootNoticeAt: String(data.portalBullshootNoticeAt || ""),
    totalPlayers: Math.max(0, Math.floor(Number(data.totalPlayers) || 0)),
    playersPerGroup: Math.max(0, Math.floor(Number(data.playersPerGroup) || 0)),
    barName: String(data.barName || ""),
    eventDate: normalizeDateInputValue(data.eventDate || ""),
    playerList: String(data.playerList || ""),
    nameMap: data.nameMap && typeof data.nameMap === "object" ? data.nameMap : {},
    currentTeams: Array.isArray(data.currentTeams) ? data.currentTeams : [],
    hasGeneratedTeams: Boolean(data.hasGeneratedTeams),
    blockedGenerateCount: Math.max(0, Math.floor(Number(data.blockedGenerateCount) || 0)),
    diceValues: Array.isArray(data.diceValues) ? data.diceValues : [],
    pdfLayoutValue: data.pdfLayoutValue !== undefined ? String(data.pdfLayoutValue) : "",
    payout: data.payout && typeof data.payout === "object" ? data.payout : null,
    splitPot: data.splitPot && typeof data.splitPot === "object" ? data.splitPot : null,
    bullseyeShoot: data.bullseyeShoot && typeof data.bullseyeShoot === "object" ? data.bullseyeShoot : null,
  };

  return snapshot;
}

function applyRemoteAdminSnapshot(snapshot, sourceBaseUrl = "") {
  if (!snapshot || typeof snapshot !== "object") {
    return;
  }

  stopSplitPotDrawAnimation();
  stopBullseyeShootDrawAnimation();
  stopMysteryOutDrawAnimation();
  if (d20RollFrame) {
    cancelAnimationFrame(d20RollFrame);
    d20RollFrame = null;
  }
  if (d20RollInterval) {
    clearInterval(d20RollInterval);
    d20RollInterval = null;
  }
  if (d20RollCompleteTimer) {
    clearTimeout(d20RollCompleteTimer);
    d20RollCompleteTimer = null;
  }
  d20RollState = null;

  suppressPortalSnapshotPublish = true;

  if (snapshot.lodCode) {
    lodCode = normalizeLodCode(snapshot.lodCode) || lodCode;
    saveStoredLodCode(lodCode);
    renderPortalLink();
  }

  if (snapshot.totalPlayers !== undefined) {
    totalPlayers.value = String(snapshot.totalPlayers || 0);
  }
  if (snapshot.playersPerGroup !== undefined) {
    playersPerGroup.value = String(snapshot.playersPerGroup || 0);
  }
  if (snapshot.barName !== undefined && barNameInput) {
    barNameInput.value = String(snapshot.barName || "");
  }
  if (snapshot.eventDate !== undefined && eventDateInput) {
    eventDateInput.value = normalizeDateInputValue(snapshot.eventDate);
    updateEventDateStatus();
  }
  renderNameInputs(Number(totalPlayers.value));
  lastSyncedPlayerCount = Number(totalPlayers.value) || 0;

  if (snapshot.nameMap && typeof snapshot.nameMap === "object") {
    applyPlayerNameMap(snapshot.nameMap, true);
  }

  if (typeof snapshot.playerList === "string") {
    playerList.value = snapshot.playerList;
  }

  if (Array.isArray(snapshot.currentTeams)) {
    currentTeams = snapshot.currentTeams;
    hasGeneratedTeams = Boolean(snapshot.hasGeneratedTeams);
    blockedGenerateCount = Number(snapshot.blockedGenerateCount || 0);
    if (currentTeams.length) {
      renderGroups(currentTeams);
    }
  }

  if (snapshot.state && typeof snapshot.state === "object") {
    state = restoreGraphStateFromDraft(snapshot.state);
    mysteryOut = snapshot.mysteryOut || "";
    if (state.mode === "graph") {
      rebuildGraphMatchIndex(state);
      refreshGraphSources(state);
    } else {
      refreshGameNumbersAndSources(state);
    }
    if (!state.champion) {
      const refreshedExpiry = refreshBracketCleanupAt(lodCode);
      if (refreshedExpiry) {
        saveBracketCleanupAt(lodCode, refreshedExpiry);
      }
    }
    renderBracket();
    syncPdfLayoutToTeamCount(state.originalPlayers?.length || Number(totalPlayers.value) || 0);
    syncPayoutTeams(state.originalPlayers?.length || Number(totalPlayers.value) || 0);
  } else {
    state = null;
    bracketOutput.className = "bracket empty";
    bracketOutput.textContent = "Build a bracket to start.";
    championOutput.textContent = "Champion: pending";
  }

  if (snapshot.payout && typeof snapshot.payout === "object") {
    if (payoutTeams && snapshot.payout.teams !== undefined) {
      payoutTeams.value = String(snapshot.payout.teams);
    }
    if (payoutEntry && snapshot.payout.entry !== undefined) {
      payoutEntry.value = String(snapshot.payout.entry);
    }
    if (payoutAdded && snapshot.payout.added !== undefined) {
      payoutAdded.value = String(snapshot.payout.added);
    }
    if (payoutPlaces && snapshot.payout.places !== undefined) {
      payoutPlaces.value = String(snapshot.payout.places);
    }
    if (Array.isArray(snapshot.payout.percentValues)) {
      renderPayoutPercentInputs(Number(payoutPlaces?.value || 0));
      Array.from(document.querySelectorAll("[data-payout-percent]")).forEach((input, index) => {
        if (snapshot.payout.percentValues[index] !== undefined) {
          input.value = String(snapshot.payout.percentValues[index]);
        }
      });
    }
    updatePayoutCalculator();
  }

  if (snapshot.pdfLayoutValue !== undefined && pdfLayoutSelect) {
    pdfLayoutSelect.value = String(snapshot.pdfLayoutValue || "");
    renderPdfColumnMirror(Number(pdfLayoutSelect.value || 8));
  }

  if (Array.isArray(snapshot.diceValues) && snapshot.diceValues.length >= 2) {
    snapshot.diceValues.slice(0, 2).forEach((value, index) => {
      const numeric = Number(value) || 1;
      diceValues[index] = numeric < 1 ? 1 : numeric;
    });
    renderDice();
  }

  if (snapshot.splitPot && typeof snapshot.splitPot === "object") {
    splitPotEntries = Array.isArray(snapshot.splitPot.entries) ? snapshot.splitPot.entries : [];
    splitPotWinner = snapshot.splitPot.winner && typeof snapshot.splitPot.winner === "object" ? snapshot.splitPot.winner : null;
    renderSplitPot();
  }

  if (snapshot.bullseyeShoot && typeof snapshot.bullseyeShoot === "object") {
    bullseyeShootEntries = Array.isArray(snapshot.bullseyeShoot.entries) ? snapshot.bullseyeShoot.entries : [];
    bullseyeShootWinner = snapshot.bullseyeShoot.winner && typeof snapshot.bullseyeShoot.winner === "object" ? snapshot.bullseyeShoot.winner : null;
    bullseyeShootCurrentPot = Math.max(0, Math.floor(Number(snapshot.bullseyeShoot.currentPot || 0) || 0));
    if (bullseyeShootCurrentPotInput) {
      bullseyeShootCurrentPotInput.value = String(bullseyeShootCurrentPot);
    }
    renderBullseyeShoot();
  }

  if (snapshot.outShots && Array.isArray(snapshot.outShots)) {
    try {
      localStorage.setItem(outShotStorageKey, JSON.stringify(snapshot.outShots));
    } catch {
      // Ignore storage failures.
    }
    renderOutShotSheet();
  }

  if (typeof snapshot.mysteryOut === "string") {
    mysteryOut = snapshot.mysteryOut;
    renderMysteryOut();
  } else if (snapshot.mysteryOut && typeof snapshot.mysteryOut === "object") {
    mysteryOut = snapshot.mysteryOut;
    renderMysteryOut();
  }

  portalNotice = snapshot.portalNotice || "";
  portalNoticeAt = snapshot.portalNoticeAt || "";
  portalNoticeDraft = portalNotice;
  if (portalNoticeInput) {
    portalNoticeInput.value = portalNoticeDraft;
  }

  portalSupportNotice = snapshot.portalSupportNotice || "";
  portalSupportNoticeAt = snapshot.portalSupportNoticeAt || "";
  portalSupportNoticeDraft = portalSupportNotice;
  if (portalSupportNoticeInput) {
    portalSupportNoticeInput.value = portalSupportNoticeDraft;
  }
  portalSupportMessages = normalizePortalSupportMessages(
    snapshot.portalSupportMessages,
    portalSupportNotice,
    portalSupportNoticeAt,
  );
  renderPortalSupportTranscript();
  if (portalSupportNoticeStatus) {
    portalSupportNoticeStatus.textContent = portalSupportNotice
      ? `Sent at ${portalSupportNoticeAt ? new Date(portalSupportNoticeAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "unknown time"}.`
      : "";
  }

  portalAutoNotice = snapshot.portalAutoNotice || "";
  portalAutoNoticeAt = snapshot.portalAutoNoticeAt || "";
  if (portalAutoNoticeInput) {
    portalAutoNoticeInput.innerHTML = renderAdminNoticeMarkup(portalAutoNotice, /^Split The Pot winner\b/i);
  }

  portalBullshootNotice = snapshot.portalBullshootNotice || "";
  portalBullshootNoticeAt = snapshot.portalBullshootNoticeAt || "";
  if (portalBullshootNoticeInput) {
    portalBullshootNoticeInput.innerHTML = renderAdminNoticeMarkup(portalBullshootNotice, /^Bullshoot winner\b/i);
  }

  savePortalSnapshotToLocalStorage();
  suppressPortalSnapshotPublish = false;
  saveBracketDraft();
  queueActiveLodCodesRefresh();
  updateAssistantAdminControls();
  try {
    lastRemoteMirrorSnapshotSignature = getPortalSnapshotSignature(snapshot);
    if (lastRemoteMirrorSnapshotSignature) {
      lastPublishedPortalSnapshotSignature = lastRemoteMirrorSnapshotSignature;
    }
  } catch {
    lastRemoteMirrorSnapshotSignature = "";
    lastPublishedPortalSnapshotSignature = "";
  }
}

function logoutAssistantAdmin() {
  const backup = readAssistantAdminBackupDraft();
  const returnUrl = new URL("portal.html", window.location.href);
  const currentCode = normalizeLodCode(lodCode);

  clearAssistantAdminSessionCode();
  stopRemoteMirrorRefresh();
  lastPublishedPortalSnapshotSignature = "";
  lastRemoteMirrorSnapshotSignature = "";
  updateAssistantAdminControls();

  if (backup) {
    restoreBracketDraftObject(backup);
  }

  clearAssistantAdminBackupDraft();

  if (currentCode) {
    returnUrl.searchParams.set("lod", currentCode);
  }
  window.location.href = returnUrl.toString();
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

  const signature = getPortalSnapshotSignature(snapshot);
  if (signature && signature === lastPublishedPortalSnapshotSignature) {
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
  const signature = getPortalSnapshotSignature(snapshot);
  if (signature && signature === lastPublishedPortalSnapshotSignature) {
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
        lastPublishedPortalSnapshotSignature = signature;
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
    const isRestored = backup.id === restoredBackupId;
    const action = backup.action?.selectedWinner
      ? `Before selecting ${backup.action.selectedWinner}`
      : "Before bracket click";

    return `
      <article class="backup-item">
        <div>
          <strong>Backup ${number}</strong>
          <span>${escapeHtml(formatBackupTime(backup.createdAt))}</span>
          <small>${escapeHtml(action)}</small>
          ${isRestored ? '<small class="backup-status restored">Restored</small>' : ""}
        </div>
        <div class="backup-item-actions">
          <button class="secondary" type="button" data-backup-id="${escapeAttribute(backup.id)}" onclick="restoreBracketBackup('${escapeAttribute(backup.id)}')">${isRestored ? "Restored" : "Restore"}</button>
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
  if (restoredBackupId === id) {
    restoredBackupId = "";
  }
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

function savePlayerNameBackup(playerCount, names = getPlayerNameMap(), barName = getBarName()) {
  if (!canUseLocalStorage()) {
    showMessage("Could not save roster backup. Browser storage is not available.");
    return;
  }

  try {
    const createdAt = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const backup = {
      id,
      createdAt,
      playerCount,
      barName: String(barName || "").trim(),
      names,
    };
    const nameCount = Object.keys(names).length;
    const index = pruneNameBackups(readNameBackupIndex(), maxNameBackups - 1);

    localStorage.setItem(`${nameBackupKeyPrefix}${id}`, JSON.stringify(backup));
    index.push({
      id,
      createdAt,
      playerCount,
      barName: backup.barName,
      nameCount,
    });
    localStorage.setItem(nameBackupIndexKey, JSON.stringify(pruneNameBackups(index)));
    renderNameBackups();
    savePortalSnapshotToLocalStorage();
    void publishGlobalNameBackups();
    showMessage(`Saved roster backup at ${formatBackupTime(createdAt)} with ${nameCount} saved name${nameCount === 1 ? "" : "s"}${backup.barName ? ` for ${backup.barName}` : ""}.`);
  } catch {
    showMessage("Could not save roster backup. Browser storage may be full or blocked.");
  }
}

if (nameList) {
  const persistStepOneDraft = () => {
    saveBracketDraft();
    savePortalSnapshotToLocalStorage();
  };
  nameList.addEventListener("input", persistStepOneDraft);
  nameList.addEventListener("change", persistStepOneDraft);
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
  renderNameBackupPreview(index);

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
          <small>${escapeHtml(backup.barName || "Unlabeled bar")} · ${backup.nameCount} saved name${backup.nameCount === 1 ? "" : "s"} for ${backup.playerCount} player slots</small>
        </div>
        <div class="backup-item-actions">
          <button class="secondary" type="button" onclick="mergePlayerNameBackup('${escapeAttribute(backup.id)}')">Merge names</button>
          <button class="danger" type="button" onclick="deletePlayerNameBackup('${escapeAttribute(backup.id)}')">Delete</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderNameBackupPreview(index = readNameBackupIndex()) {
  if (!nameBackupPreview) {
    return;
  }

  if (!canUseLocalStorage()) {
    nameBackupPreview.className = "backup-preview-list empty";
    nameBackupPreview.textContent = "Player name backups need browser storage.";
    return;
  }

  const recent = index.slice().reverse().slice(0, 2);
  if (!recent.length) {
    nameBackupPreview.className = "backup-preview-list empty";
    nameBackupPreview.textContent = "No player name backups yet.";
    return;
  }

  nameBackupPreview.className = "backup-preview-list";
  nameBackupPreview.innerHTML = recent.map((backup) => `
    <article class="backup-preview-item">
      <div>
        <strong>${escapeHtml(backup.barName || "Unlabeled bar")}</strong>
        <span>${escapeHtml(formatBackupTime(backup.createdAt))}</span>
        <small>${backup.nameCount} saved name${backup.nameCount === 1 ? "" : "s"} for ${backup.playerCount} player slots</small>
      </div>
      <div class="backup-item-actions">
        <button class="secondary" type="button" onclick="mergePlayerNameBackup('${escapeAttribute(backup.id)}')">Merge names</button>
      </div>
    </article>
  `).join("");
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

  if (barNameInput && backup.barName) {
    barNameInput.value = backup.barName;
  }

  applyPlayerNameMap(backup.names, false);
  flushBracketDraftSave();
  savePortalSnapshotToLocalStorage();
  showMessage(`Player names merged${backup.barName ? ` from ${backup.barName}` : ""}. Existing typed names were kept.`);
}

function deletePlayerNameBackup(id) {
  if (!canUseLocalStorage()) {
    return;
  }

  const index = readNameBackupIndex().filter((backup) => backup.id !== id);
  localStorage.removeItem(`${nameBackupKeyPrefix}${id}`);
  localStorage.setItem(nameBackupIndexKey, JSON.stringify(index));
  renderNameBackups();
  savePortalSnapshotToLocalStorage();
  void publishGlobalNameBackups();
}

function deleteAllPlayerNameBackups() {
  if (!canUseLocalStorage()) {
    renderNameBackups();
    return;
  }

  readNameBackupIndex().forEach((backup) => {
    localStorage.removeItem(`${nameBackupKeyPrefix}${backup.id}`);
  });
  localStorage.removeItem(nameBackupIndexKey);
  renderNameBackups();
  savePortalSnapshotToLocalStorage();
  void publishGlobalNameBackups();
}

document.querySelector("#resetBracket").addEventListener("click", resetTournament);
openAttendanceSheetButton?.addEventListener("click", openAttendanceSheet);
saveAttendanceRootPasswordButton?.addEventListener("click", saveAttendanceRootPasswordFromAdmin);
clearAttendanceRootPasswordButton?.addEventListener("click", clearAttendanceRootPasswordFromAdmin);
openAttendancePageButton?.addEventListener("click", openAttendanceSheet);
window.addEventListener("beforeunload", flushBracketDraftSave);
window.addEventListener("beforeunload", clearSharedNameBackupRefreshTimer);
window.addEventListener("pagehide", flushBracketDraftSave);
window.addEventListener("pagehide", clearSharedNameBackupRefreshTimer);

function readNameBackupIndex() {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    return pruneNameBackups(JSON.parse(localStorage.getItem(nameBackupIndexKey)) || []);
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

function syncNameBackupsToLocalStorage(backups) {
  if (!canUseLocalStorage()) {
    return;
  }

  const normalized = Array.isArray(backups)
    ? backups
        .map((backup) => normalizeNameBackup(backup))
        .filter(Boolean)
    : [];

  try {
    const existingIndex = readNameBackupIndex();
    const merged = new Map();

    existingIndex.forEach((backup) => {
      const localBackup = readNameBackup(backup.id);
      if (localBackup && typeof localBackup === "object" && localBackup.id) {
        merged.set(localBackup.id, normalizeNameBackup(localBackup));
      }
    });

    normalized.forEach((backup) => {
      merged.set(backup.id, backup);
    });

    const index = Array.from(merged.values())
      .sort((left, right) => String(left.createdAt || "").localeCompare(String(right.createdAt || "")))
      .map((backup) => ({
        id: backup.id,
        createdAt: backup.createdAt,
        playerCount: backup.playerCount,
        barName: backup.barName || "",
        nameCount: Object.keys(backup.names || {}).length,
      }));
    const cleanedIndex = pruneNameBackups(index);

    merged.forEach((backup) => {
      localStorage.setItem(`${nameBackupKeyPrefix}${backup.id}`, JSON.stringify(backup));
    });
    localStorage.setItem(nameBackupIndexKey, JSON.stringify(cleanedIndex));
  } catch {
    // Ignore storage failures; the in-memory snapshot still renders.
  }
}

function getSharedNameBackupsUrl(baseUrl) {
  return `${baseUrl}/api/name-backups`;
}

async function loadSharedNameBackups() {
  if (!nameBackupList) {
    return;
  }

  for (const baseUrl of API_BASE_URLS.length ? API_BASE_URLS : [""]) {
    if (!baseUrl) {
      continue;
    }

    try {
      const response = await fetch(getSharedNameBackupsUrl(baseUrl), { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const payload = await response.json().catch(() => null);
      const backups = normalizeSharedNameBackupPayload(payload);
      syncNameBackupsToLocalStorage(backups);
      renderNameBackups();
      return;
    } catch {
      // Try the next host.
    }
  }
}

async function publishGlobalNameBackups() {
  if (!API_BASE_URLS.length) {
    return;
  }

  const backups = readNameBackupIndex()
    .map((backup) => readNameBackup(backup.id))
    .filter((backup) => backup && typeof backup === "object");

  const payload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    backups,
  };

  for (const baseUrl of API_BASE_URLS) {
    if (!baseUrl) {
      continue;
    }

    try {
      await fetch(getSharedNameBackupsUrl(baseUrl), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Ignore publish failures; the local cache remains available.
    }
  }
}

function normalizeSharedNameBackupPayload(payload) {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "object" && Array.isArray(payload.backups)) {
    return payload.backups;
  }

  return [];
}

function normalizeNameBackup(backup) {
  if (!backup || typeof backup !== "object" || !backup.id) {
    return null;
  }

  const names = backup.names && typeof backup.names === "object" ? backup.names : {};

  return {
    id: String(backup.id),
    createdAt: String(backup.createdAt || new Date().toISOString()),
    playerCount: Math.max(0, Math.floor(Number(backup.playerCount) || 0)),
    barName: String(backup.barName || ""),
    names,
  };
}

function pruneNameBackups(index, keepCount = maxNameBackups) {
  if (!Array.isArray(index)) {
    return [];
  }

  const cleaned = index
    .filter((backup) => backup && typeof backup === "object" && backup.id)
    .map((backup) => ({
      id: String(backup.id),
      createdAt: String(backup.createdAt || ""),
      playerCount: Math.max(0, Math.floor(Number(backup.playerCount) || 0)),
      barName: String(backup.barName || ""),
      nameCount: Math.max(0, Math.floor(Number(backup.nameCount) || 0)),
    }));

  const removeCount = Math.max(0, cleaned.length - Math.max(0, keepCount));
  if (removeCount && canUseLocalStorage()) {
    cleaned.splice(0, removeCount).forEach((backup) => {
      localStorage.removeItem(`${nameBackupKeyPrefix}${backup.id}`);
    });
  } else if (removeCount) {
    cleaned.splice(0, removeCount);
  }

  return cleaned;
}

function clearSharedNameBackupRefreshTimer() {
  if (sharedNameBackupRefreshTimer) {
    clearInterval(sharedNameBackupRefreshTimer);
    sharedNameBackupRefreshTimer = null;
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

function canUseSessionStorage() {
  try {
    return typeof sessionStorage !== "undefined";
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

function getGeneratedTournamentDateInput() {
  const today = new Date();
  const offset = (6 - today.getDay() + 7) % 7;
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, 12, 0, 0, 0);
  return formatDateInputValue(date);
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateInputValue(value) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function updateEventDateStatus() {
  if (!eventDateStatus) {
    return;
  }

  const value = normalizeDateInputValue(eventDateInput?.value || "");
  eventDateStatus.textContent = value
    ? `Tournament date set to ${value}. This is shared with the attendance sheet.`
    : "No tournament date set yet.";
}

function normalizeLodCode(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);
}

function getRequestedLodCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    return normalizeLodCode(params.get("lod") || params.get("code") || "");
  } catch {
    return "";
  }
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

function renderPortalLink(forceRefresh = false) {
  const normalizedCode = normalizeLodCode(lodCode);
  const code = normalizedCode || "------";
  const link = getPortalLink();

  if (lodCodeText) {
    lodCodeText.textContent = `LOD: ${code}`;
  }

  if (portalQrCode) {
    portalQrCode.src = normalizedCode ? createPortalQrDataUrl(link, 500) : EMPTY_QR_DATA_URL;
  }

  if (lodCodeInput) {
    lodCodeInput.value = normalizeLodCode(lodCode);
  }

  updateAssistantAdminControls();
}

function updateAssistantAdminControls() {
  const activeSessionCode = getAssistantAdminSessionCode();
  const sessionContext = getAdminSupportSessionContext();
  if (assistantAdminStatus) {
    assistantAdminStatus.hidden = !activeSessionCode;
    assistantAdminStatus.textContent = activeSessionCode
      ? `Assistant Admin session: ${activeSessionCode}`
      : "";
  }

  if (sendPortalSupportNoticeButton) {
    sendPortalSupportNoticeButton.disabled = !sessionContext.lodCode;
    sendPortalSupportNoticeButton.title = sessionContext.lodCode
      ? ""
      : "Load a bracket before sending support messages.";
  }

  if (clearPortalSupportNoticeButton) {
    clearPortalSupportNoticeButton.disabled = !sessionContext.lodCode;
    clearPortalSupportNoticeButton.title = sessionContext.lodCode
      ? ""
      : "Load a bracket before clearing support messages.";
  }

  if (clearAllSentMessagesButton) {
    clearAllSentMessagesButton.disabled = !sessionContext.lodCode;
    clearAllSentMessagesButton.title = sessionContext.lodCode
      ? ""
      : "Open or load a bracket before clearing sent messages.";
  }

  if (deleteAllActiveLodsButton) {
    deleteAllActiveLodsButton.disabled = false;
    deleteAllActiveLodsButton.title = "";
  }

  if (assistantAdminLogoutButton) {
    assistantAdminLogoutButton.hidden = false;
    assistantAdminLogoutButton.textContent = "Return to Player Portal";
  }

  updateAttendanceRootControls();
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
      ...(hasRenderableFinalMatch(bracketState.resetFinal)
        ? [matchToText(bracketState.resetFinal)]
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
  const finalMatches = [state.final, state.resetFinal].filter(hasRenderableFinalMatch);
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
      ${renderPdfReferencePanel()}
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
          <div class="pdf-visual-column ${type}-column ${index === greyColumnIndex ? "grey-column" : ""} ${type === "winner" && state.originalPlayers.length === 9 && index === 0 ? "playin-align" : ""}" style="--column-index: ${index};">
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

function renderPdfReferencePanel() {
  const layout = pdfBracketLayouts[state.originalPlayers.length];
  const pdfName = layout?.pdf;
  const pdfSrc = pdfName ? `assets/pdf-brackets/${pdfName}` : null;

  return `
    <section class="pdf-reference-panel" aria-label="PDF bracket reference">
      <div class="pdf-reference-heading">
        <div>
          <h4>PDF reference</h4>
          <p>Printed layout for ${escapeHtml(String(state.originalPlayers.length))} teams, showing the combined winners and losers bracket PDF</p>
        </div>
        <span>${escapeHtml(pdfName || "No PDF reference available")}</span>
      </div>
      ${pdfSrc ? `
        <div class="pdf-reference-frame">
          <div class="pdf-reference-preview" data-pdf-preview data-pdf-src="${escapeAttribute(pdfSrc)}">
            <div class="pdf-reference-preview-status">Loading PDF preview…</div>
            <div class="pdf-reference-preview-pages"></div>
          </div>
        </div>
      ` : `
        <div class="pdf-reference-empty">No PDF reference file is available for this team count.</div>
      `}
    </section>
  `;
}

const PDFJS_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
let pdfReferencePreviewToken = 0;
let pdfReferenceWorkerConfigured = false;

function schedulePdfReferencePreview() {
  pdfReferencePreviewToken += 1;
  const token = pdfReferencePreviewToken;
  const trigger = typeof window.requestAnimationFrame === "function"
    ? window.requestAnimationFrame.bind(window)
    : (callback) => setTimeout(callback, 0);

  trigger(() => {
    renderPdfReferencePreview(token);
  });
}

async function renderPdfReferencePreview(token = pdfReferencePreviewToken) {
  const previewRoots = document.querySelectorAll("[data-pdf-preview]");
  if (!previewRoots.length) {
    return;
  }

  const pdfjsLib = window.pdfjsLib;
  if (!pdfjsLib) {
    previewRoots.forEach((previewRoot) => {
      const status = previewRoot.querySelector(".pdf-reference-preview-status");
      const pages = previewRoot.querySelector(".pdf-reference-preview-pages");
      if (status) {
        status.textContent = "PDF preview unavailable on this device.";
      }
      if (pages) {
        pages.innerHTML = "";
      }
    });
    return;
  }

  if (!pdfReferenceWorkerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC;
    pdfReferenceWorkerConfigured = true;
  }

  for (const previewRoot of previewRoots) {
    if (token !== pdfReferencePreviewToken || !previewRoot.isConnected) {
      return;
    }

    const pdfSrc = previewRoot.dataset.pdfSrc || "";
    const status = previewRoot.querySelector(".pdf-reference-preview-status");
    const pages = previewRoot.querySelector(".pdf-reference-preview-pages");
    if (!pdfSrc || !status || !pages) {
      continue;
    }

    status.textContent = "Loading PDF preview…";
    pages.innerHTML = "";

    try {
      const pdf = await pdfjsLib.getDocument({ url: pdfSrc }).promise;
      if (token !== pdfReferencePreviewToken || !previewRoot.isConnected) {
        return;
      }

      status.textContent = `${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"} rendered in-browser`;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        if (token !== pdfReferencePreviewToken || !previewRoot.isConnected) {
          return;
        }

        const page = await pdf.getPage(pageNumber);
        if (token !== pdfReferencePreviewToken || !previewRoot.isConnected) {
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const containerWidth = Math.max(
          previewRoot.getBoundingClientRect().width || 0,
          pages.getBoundingClientRect().width || 0,
          320
        );
        const scale = Math.min(1.4, Math.max(0.65, (containerWidth - 4) / baseViewport.width));
        const viewport = page.getViewport({ scale });
        const figure = document.createElement("figure");
        figure.className = "pdf-reference-preview-page";
        const caption = document.createElement("figcaption");
        caption.className = "pdf-reference-preview-page-label";
        caption.textContent = `Page ${pageNumber}`;
        const canvas = document.createElement("canvas");
        canvas.className = "pdf-reference-preview-canvas";
        canvas.setAttribute("aria-label", `PDF page ${pageNumber}`);
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Unable to create a canvas context for the PDF preview.");
        }

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        figure.append(caption, canvas);
        pages.appendChild(figure);

        await page.render({
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0],
        }).promise;
      }
    } catch (error) {
      console.error("PDF preview render failed:", error);
      status.textContent = "PDF preview could not load on this device.";
      pages.innerHTML = "";
    }
  }
}

function renderGraphFinal() {
  return `
    <section class="bracket-section final-section">
      <h3>Final</h3>
      <div class="final-layout">
        <div class="rounds">
          <div class="round">
            ${renderFinalMatchBlock(state.final, state.final.title)}
            ${hasRenderableFinalMatch(state.resetFinal) ? renderFinalMatchBlock(state.resetFinal, state.resetFinal.title) : ""}
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
  if (!hasRenderableFinalMatch(match)) {
    return "";
  }

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
            onclick="window.handleBracketResetClick(this)"
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

function hasRenderableFinalMatch(match) {
  if (!match) {
    return false;
  }

  const players = Array.isArray(match.players) ? match.players : [];
  const sources = Array.isArray(match.slotSources) ? match.slotSources : [];
  return Boolean(match.winner || match.autoAdvanced || players.some(Boolean) || sources.some(Boolean));
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
  return `
    <section class="bracket-section">
      <h3>Final</h3>
      <div class="rounds">
        <div class="round">
          <p class="round-title">Championship</p>
          ${renderMatch(state.final)}
          ${hasRenderableFinalMatch(state.resetFinal) ? renderMatch(state.resetFinal) : ""}
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
            onclick="window.handleBracketResetClick(this)"
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
  const byeFedLabel = state?.mode === "graph" && match?.isByeFed ? "BYE FED - " : "";
  const byeLabel = match.autoAdvanced ? " - BYE" : "";
  if (state?.mode === "graph") {
    const gameNumber = getGraphDisplayGameNumber(match);
    const graphTitle = match.type === "final"
      ? `Game ${gameNumber} - Grand Final`
      : match.type === "resetFinal"
        ? `Game ${gameNumber} - Playoff`
        : `Game ${gameNumber}`;
    return `${playInLabel}${byeFedLabel}${graphTitle}${byeLabel}`;
  }

  return `${playInLabel}${byeFedLabel}${match.title}${byeLabel}`;
}

function isPlayInMatch(match) {
  if (state?.mode === "graph") {
    return Boolean(match?.isPlayIn);
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
      ? `Winner to Game ${getGraphDisplayGameNumber(winnerMatch)} ${formatGraphSlot(match.winnerTo.slot)}`
      : match.type === "final" ? "Winner is champion or opens playoff"
        : match.type === "resetFinal" ? "Winner is champion"
          : match.type === "doubleDipFinal" ? "Winner is champion" : "";
    const loserTarget = loserMatch && match.type === "winner"
      ? `Loser to L${getGraphDisplayGameNumber(match)} in Game ${getGraphDisplayGameNumber(loserMatch)} ${formatGraphSlot(match.loserTo.slot)}`
      : "";
    const labels = [winnerTarget, loserTarget].filter(Boolean);

    return labels.length ? `<p class="match-meta">${labels.join(" | ")}</p>` : "";
  }

  const destination = state ? getWinnerAdvanceDestination(match, state) : null;
  const winnerTarget = destination?.match?.gameNumber
    ? `Winner to Game ${getGraphDisplayGameNumber(destination.match)}`
    : match.type === "final" ? "Winner is champion"
      : match.type === "resetFinal" ? "Winner is champion"
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
  const boardCount = 64;

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
        ${Array.from({ length: boardCount }, (_, index) => {
          const value = index + 1;
          return `<option value="${value}"${currentValue === value ? " selected" : ""}>${value}</option>`;
        }).join("")}
      </select>
    </label>
  `;
}

function getAssignableBoardMatches(bracketState = state) {
  if (!bracketState) {
    return [];
  }

  return getAllMatches(bracketState).filter((match) => {
    if (!match) {
      return false;
    }

    return match.type === "winner" ||
      match.type === "loser" ||
      match.type === "final" ||
      match.type === "resetFinal" ||
      match.type === "doubleDipFinal";
  });
}

function formatGraphSlot(slot) {
  return slot === 0 ? "(top slot)" : "(bottom slot)";
}

function getLoserDestinationLabel(match) {
  const destination = state ? getLoserDropDestination(match, state) : null;

  if (!destination?.match?.gameNumber) {
    return "";
  }

  return `Loser to Game ${getGraphDisplayGameNumber(destination.match)}`;
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
      onclick="window.handleBracketWinnerClick(this)"
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
