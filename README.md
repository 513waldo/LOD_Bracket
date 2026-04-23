# All in One LOD Shop

A browser-based darts toolkit for league nights, luck-of-the-draw events, and tournament play. The project is plain HTML, CSS, and JavaScript, so it can run locally without a build step.

## Apps

- `index.html` - LOD calculator entry page.
- `lod-calculator/` - Standalone checkout helper.
- `tournament-bracket/` - Team draw, double-elimination bracket, out-shot tracker, dice roller, and Mystery Out tool.

## Tournament Bracket Features

- Random team generation from a player count and players-per-group setting.
- Editable player names with browser-backed saved name lists.
- Double-elimination bracket generation for common tournament sizes.
- Special 9-team bracket template with grand final reset support.
- Generic graph bracket support with bracket reset finals.
- Winner picking by tapping/clicking a player in each match.
- Loser routing into the correct losers-bracket slot.
- Match `Fix` buttons for correcting bracket results.
- Champion display.
- Bracket backups saved before bracket clicks.
- Paper bracket backup/print view.
- Out Shots tracker for players and hit numbers.
- Two D20-style randomizers labeled `Triple` and `Double`.
- Mystery Out generator with `Open`, `Double`, and `Master` modes.
- Mystery Out bogey exclusions per mode.
- Dartboard-themed responsive UI with mobile breakpoints.

## LOD Calculator Features

- Enter score left.
- Choose darts remaining: 1, 2, or 3.
- Choose checkout logic.
- Get recommended target routes.

## File Structure

```text
DARTS/
  README.md
  index.html
  style.css
  app.js
  background.png
  lod-calculator/
    index.html
    style.css
    app.js
  tournament-bracket/
    index.html
    style.css
    app.js
    assets/
      background.png
      dartboard-split-background.png
```

## Running Locally

Open one of these files in a browser:

- Main LOD calculator: `DARTS/index.html`
- Standalone calculator: `DARTS/lod-calculator/index.html`
- Tournament tool: `DARTS/tournament-bracket/index.html`

If browser storage or asset paths behave differently from direct file opening, serve the folder with a simple local server:

```bash
cd ~/DARTS
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
http://localhost:8000/lod-calculator/
http://localhost:8000/tournament-bracket/
```

## Notes

- Data is stored in the browser with `localStorage`.
- Backups and saved names are local to the browser/device.
- The tournament bracket supports up to 100 teams from the UI.
- The Mystery Out value locks after generation, but its `Fix` button can clear only that value.
- The full `Reset bracket` button clears the tournament, teams, player names, and Mystery Out state.

## Current Focus

The active development area is `tournament-bracket/`, especially bracket layout, double-elimination routing, mobile presentation, and tournament-night helper tools.
