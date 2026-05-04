const storageKeys = {
  bars: "boardflowBars",
  blackouts: "boardflowBlackouts",
  bookings: "boardflowBookings",
};

const slotOptions = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

const seedBars = [
  { id: "bar-1", name: "Bullseye Taproom", area: "Downtown", boards: 3 },
  { id: "bar-2", name: "Triple Twenty Pub", area: "Northside", boards: 2 },
  { id: "bar-3", name: "Flight Club Bar", area: "South End", boards: 4 },
  { id: "bar-4", name: "The Oche House", area: "Riverside", boards: 1 },
];

const seedBlackouts = [
  { id: "blk-1", barId: "bar-1", slot: "7:00 PM", reason: "In-house blind draw" },
  { id: "blk-2", barId: "bar-2", slot: "6:00 PM", reason: "Steel league night" },
  { id: "blk-3", barId: "bar-4", slot: "8:00 PM", reason: "Only board reserved for house match" },
];

const seedBookings = [
  {
    id: "bk-1",
    player: "Jason R.",
    opponent: "Mike T.",
    league: "Premier",
    barId: "bar-1",
    slot: "5:00 PM",
    length: 2,
    notes: "Remote flex match. Camera setup already confirmed.",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "bk-2",
    player: "Alyssa D.",
    opponent: "Chris B.",
    league: "Challenger",
    barId: "bar-3",
    slot: "7:00 PM",
    length: 1,
    notes: "Quick make-up match before feeder finals.",
    createdAt: Date.now() - 2400000,
  },
];

const barForm = document.querySelector("#barForm");
const blackoutForm = document.querySelector("#blackoutForm");
const bookingForm = document.querySelector("#bookingForm");
const blackoutBar = document.querySelector("#blackoutBar");
const blackoutSlot = document.querySelector("#blackoutSlot");
const bookingBar = document.querySelector("#bookingBar");
const bookingSlot = document.querySelector("#bookingSlot");
const bookingLength = document.querySelector("#bookingLength");
const adminMessage = document.querySelector("#adminMessage");
const bookingMessage = document.querySelector("#bookingMessage");
const barRoster = document.querySelector("#barRoster");
const bookingList = document.querySelector("#bookingList");
const availabilityGrid = document.querySelector("#availabilityGrid");
const clearBookingsButton = document.querySelector("#clearBookings");

let bars = loadData(storageKeys.bars, seedBars);
let blackouts = loadData(storageKeys.blackouts, seedBlackouts);
let bookings = loadData(storageKeys.bookings, seedBookings);

renderSlotSelects();
renderEverything();

barForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(barForm);
  const name = String(formData.get("barName") || "").trim();
  const area = String(formData.get("barArea") || "").trim();
  const boards = Number(formData.get("boardCount"));

  if (!name || !area || !Number.isInteger(boards) || boards < 1) {
    setMessage(adminMessage, "Add a bar name, area, and at least one board.");
    return;
  }

  bars = [
    {
      id: `bar-${Date.now()}`,
      name,
      area,
      boards,
    },
    ...bars,
  ];

  persistAll();
  renderEverything();
  barForm.reset();
  document.querySelector("#boardCount").value = "2";
  setMessage(adminMessage, `${name} added with ${boards} board${boards === 1 ? "" : "s"}.`);
});

blackoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(blackoutForm);
  const barId = String(formData.get("blackoutBar") || "");
  const slot = String(formData.get("blackoutSlot") || "");
  const reason = String(formData.get("blackoutReason") || "").trim();

  if (!barId || !slot || !reason) {
    setMessage(adminMessage, "Choose a bar, a time block, and a reason.");
    return;
  }

  const duplicate = blackouts.some((blackout) => blackout.barId === barId && blackout.slot === slot);
  if (duplicate) {
    setMessage(adminMessage, "That bar already has a full blackout for that time.");
    return;
  }

  blackouts = [
    {
      id: `blk-${Date.now()}`,
      barId,
      slot,
      reason,
    },
    ...blackouts,
  ];

  persistAll();
  renderEverything();
  blackoutForm.reset();
  setMessage(adminMessage, "Venue blackout added.");
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const player = String(formData.get("playerName") || "").trim();
  const opponent = String(formData.get("opponentName") || "").trim();
  const league = String(formData.get("leagueSelect") || "").trim();
  const barId = String(formData.get("bookingBar") || "");
  const slot = String(formData.get("bookingSlot") || "");
  const length = Number(formData.get("bookingLength"));
  const notes = String(formData.get("bookingNotes") || "").trim();

  if (!player || !opponent || !league || !barId || !slot || !Number.isInteger(length)) {
    setMessage(bookingMessage, "Complete every booking field before reserving a board.");
    return;
  }

  const availability = getAvailability(barId, slot, length);
  if (!availability.ok) {
    setMessage(bookingMessage, availability.message);
    return;
  }

  bookings = [
    {
      id: `bk-${Date.now()}`,
      player,
      opponent,
      league,
      barId,
      slot,
      length,
      notes,
      createdAt: Date.now(),
    },
    ...bookings,
  ];

  persistAll();
  renderEverything();
  bookingForm.reset();
  bookingLength.value = "2";
  setMessage(bookingMessage, `Board reserved at ${findBar(barId)?.name || "selected bar"} for ${slot}.`);
});

clearBookingsButton.addEventListener("click", () => {
  bookings = [...seedBookings];
  persistAll();
  renderEverything();
  setMessage(bookingMessage, "Demo bookings reset.");
});

barRoster.addEventListener("click", (event) => {
  const removeBarButton = event.target.closest("[data-remove-bar]");
  const removeBlackoutButton = event.target.closest("[data-remove-blackout]");

  if (removeBarButton) {
    const barId = removeBarButton.dataset.removeBar;
    bars = bars.filter((bar) => bar.id !== barId);
    blackouts = blackouts.filter((blackout) => blackout.barId !== barId);
    bookings = bookings.filter((booking) => booking.barId !== barId);
    persistAll();
    renderEverything();
    setMessage(adminMessage, "Bar removed.");
    return;
  }

  if (removeBlackoutButton) {
    const blackoutId = removeBlackoutButton.dataset.removeBlackout;
    blackouts = blackouts.filter((blackout) => blackout.id !== blackoutId);
    persistAll();
    renderEverything();
    setMessage(adminMessage, "Blackout removed.");
  }
});

bookingList.addEventListener("click", (event) => {
  const removeBookingButton = event.target.closest("[data-remove-booking]");

  if (!removeBookingButton) {
    return;
  }

  bookings = bookings.filter((booking) => booking.id !== removeBookingButton.dataset.removeBooking);
  persistAll();
  renderEverything();
  setMessage(bookingMessage, "Reservation removed.");
});

bookingBar.addEventListener("change", syncBookingSlots);
bookingLength.addEventListener("change", syncBookingSlots);

function renderEverything() {
  renderBarOptions();
  renderBarRoster();
  renderBookings();
  renderAvailability();
  syncBookingSlots();
}

function renderSlotSelects() {
  blackoutSlot.innerHTML = slotOptions
    .map((slot) => `<option value="${slot}">${slot}</option>`)
    .join("");
}

function renderBarOptions() {
  const options = bars
    .map((bar) => `<option value="${escapeHtml(bar.id)}">${escapeHtml(bar.name)} · ${escapeHtml(bar.area)}</option>`)
    .join("");

  blackoutBar.innerHTML = options;
  bookingBar.innerHTML = options;
}

function renderBarRoster() {
  if (!bars.length) {
    barRoster.innerHTML = `<p class="empty-state">No bars added yet.</p>`;
    return;
  }

  barRoster.innerHTML = bars
    .map((bar) => {
      const barBlackouts = getBarBlackouts(bar.id);
      return `
        <article class="bar-card">
          <div class="bar-header">
            <div class="bar-summary">
              <h3>${escapeHtml(bar.name)}</h3>
              <p>${escapeHtml(bar.area)} · ${bar.boards} board${bar.boards === 1 ? "" : "s"}</p>
            </div>
            <button type="button" class="secondary" data-remove-bar="${escapeHtml(bar.id)}">Remove bar</button>
          </div>
          <div class="blackout-list">
            ${
              barBlackouts.length
                ? barBlackouts
                    .map(
                      (blackout) => `
                        <div class="blackout-item">
                          <div class="blackout-copy">
                            <strong>${escapeHtml(blackout.slot)}</strong>
                            <span>${escapeHtml(blackout.reason)}</span>
                          </div>
                          <button type="button" class="secondary" data-remove-blackout="${escapeHtml(blackout.id)}">Delete block</button>
                        </div>
                      `
                    )
                    .join("")
                : `<p class="empty-state">No venue-wide blackouts posted.</p>`
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderBookings() {
  if (!bookings.length) {
    bookingList.innerHTML = `<p class="empty-state">No reservations yet.</p>`;
    return;
  }

  bookingList.innerHTML = bookings
    .sort((left, right) => getSlotIndex(left.slot) - getSlotIndex(right.slot))
    .map((booking) => {
      const bar = findBar(booking.barId);
      return `
        <article class="booking-card">
          <div class="booking-header">
            <div>
              <h3>${escapeHtml(booking.player)} vs ${escapeHtml(booking.opponent)}</h3>
              <div class="booking-meta">${escapeHtml(booking.league)} · ${bar ? `${escapeHtml(bar.name)} · ${escapeHtml(bar.area)}` : "Unknown bar"}</div>
            </div>
            <button type="button" class="secondary" data-remove-booking="${escapeHtml(booking.id)}">Cancel</button>
          </div>
          <p class="booking-meta">${escapeHtml(booking.slot)} · ${booking.length} hour${booking.length === 1 ? "" : "s"}</p>
          <p class="booking-meta">${escapeHtml(booking.notes || "No extra match notes.")}</p>
        </article>
      `;
    })
    .join("");
}

function renderAvailability() {
  if (!bars.length) {
    availabilityGrid.innerHTML = `<p class="empty-state">Add a bar to show availability.</p>`;
    return;
  }

  availabilityGrid.innerHTML = bars
    .map((bar) => {
      const slots = slotOptions
        .map((slot) => renderSlot(bar, slot))
        .join("");

      return `
        <article class="board-card">
          <div class="board-header">
            <div>
              <h3>${escapeHtml(bar.name)}</h3>
              <p class="slot-note">${escapeHtml(bar.area)} · ${bar.boards} board${bar.boards === 1 ? "" : "s"} available when open</p>
            </div>
            <span class="pill">${countOpenSlots(bar.id)} open windows</span>
          </div>
          <div class="slot-list">${slots}</div>
        </article>
      `;
    })
    .join("");
}

function renderSlot(bar, slot) {
  const blackout = blackouts.find((entry) => entry.barId === bar.id && entry.slot === slot);
  if (blackout) {
    return `
      <div class="slot-item blocked">
        <div class="slot-copy">
          <strong>${escapeHtml(slot)}</strong>
          <span>${escapeHtml(blackout.reason)}</span>
        </div>
        <span class="pill warn">Blocked</span>
      </div>
    `;
  }

  const slotBookings = bookingsForSlot(bar.id, slot);
  const openBoards = Math.max(bar.boards - slotBookings.length, 0);
  const itemClass = slotBookings.length ? "slot-item busy" : "slot-item";
  const badgeClass = openBoards > 0 ? "pill open" : "pill full";
  const badgeText = openBoards > 0 ? `${openBoards} open` : "Full";
  const matchupText = slotBookings.length
    ? slotBookings.map((booking) => `${escapeHtml(booking.player)} vs ${escapeHtml(booking.opponent)}`).join(" · ")
    : "No reservations yet.";

  return `
    <div class="${itemClass}">
      <div class="slot-copy">
        <strong>${escapeHtml(slot)}</strong>
        <span>${matchupText}</span>
      </div>
      <div class="slot-meta">
        <span class="${badgeClass}">${badgeText}</span>
      </div>
    </div>
  `;
}

function syncBookingSlots() {
  const selectedBarId = bookingBar.value || bars[0]?.id;
  const selectedLength = Number(bookingLength.value) || 1;

  if (!selectedBarId) {
    bookingSlot.innerHTML = "";
    return;
  }

  const options = slotOptions
    .filter((slot) => {
      const availability = getAvailability(selectedBarId, slot, selectedLength);
      return availability.ok;
    })
    .map((slot) => `<option value="${slot}">${slot}</option>`)
    .join("");

  bookingSlot.innerHTML = options || `<option value="">No open slots</option>`;
}

function getAvailability(barId, slot, length) {
  const startIndex = getSlotIndex(slot);
  const bar = findBar(barId);

  if (!bar || startIndex < 0) {
    return { ok: false, message: "Pick a valid bar and time." };
  }

  const neededSlots = slotOptions.slice(startIndex, startIndex + length);
  if (neededSlots.length !== length) {
    return { ok: false, message: "That booking runs past the schedule window." };
  }

  for (const currentSlot of neededSlots) {
    const blackout = blackouts.find((entry) => entry.barId === barId && entry.slot === currentSlot);
    if (blackout) {
      return { ok: false, message: `${bar.name} is blocked at ${currentSlot}.` };
    }

    const currentBookings = bookingsForSlot(barId, currentSlot);
    if (currentBookings.length >= bar.boards) {
      return { ok: false, message: `No board is open at ${currentSlot} in ${bar.name}.` };
    }
  }

  return { ok: true };
}

function bookingsForSlot(barId, slot) {
  return bookings.filter((booking) => {
    if (booking.barId !== barId) {
      return false;
    }

    const start = getSlotIndex(booking.slot);
    const end = start + booking.length - 1;
    const current = getSlotIndex(slot);
    return current >= start && current <= end;
  });
}

function countOpenSlots(barId) {
  return slotOptions.filter((slot) => {
    const availability = getAvailability(barId, slot, 1);
    return availability.ok;
  }).length;
}

function getBarBlackouts(barId) {
  return blackouts
    .filter((blackout) => blackout.barId === barId)
    .sort((left, right) => getSlotIndex(left.slot) - getSlotIndex(right.slot));
}

function findBar(barId) {
  return bars.find((bar) => bar.id === barId) || null;
}

function getSlotIndex(slot) {
  return slotOptions.indexOf(slot);
}

function setMessage(node, text) {
  node.textContent = text;
}

function persistAll() {
  localStorage.setItem(storageKeys.bars, JSON.stringify(bars));
  localStorage.setItem(storageKeys.blackouts, JSON.stringify(blackouts));
  localStorage.setItem(storageKeys.bookings, JSON.stringify(bookings));
}

function loadData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return [...fallback];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...fallback];
  } catch (error) {
    return [...fallback];
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
