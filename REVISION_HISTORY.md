# Revision History

High-level history of the website, grouped by function.

## Bracket

- Started as a tournament bracket builder with player entry, team generation, bracket rendering, and champion progression.
- Added bracket reset, bracket cleanup, and saved draft behavior.
- Added support for multiple bracket layouts and PDF-oriented bracket structures.
- Added board and match progression logic so losers move correctly through the bracket.
- Fixed final-round behavior so the tournament ends immediately when the winners-bracket team wins, and a playoff is only created when the losers-bracket team wins.

## Player Portal

- Added a player-facing portal linked by QR code and LOD code.
- Added live portal message support for board calls and tournament notices.
- Added player-portal visibility fixes, including board assignment display.
- Added portal snapshot publishing so bracket updates can be mirrored into the portal.

## Attendance

- Added a director-only attendance page separate from the public player portal.
- Added login gating with a root password and per-bar username/password access.
- Added venue setup fields such as bar name, event name, and eligibility requirements.
- Added weekly attendance tracking with a spreadsheet-style grid.
- Added manual player entry.
- Added bracket roster import so attendance can start from the generated player list.
- Added customizable week dates, including one-click date generation and custom per-week dates.
- Added a shared tournament date from the bracket portal so attendance tracker entries can stay aligned.
- Added Mystery Out and Bullshoot tracking.
- Added tracker history so past draw results remain visible.
- Added attendance export and Facebook-ready roster text.
- Improved mobile layout and spreadsheet spacing for the weekly sheet and trackers.

## Roster Backups

- Added saved player-name backups for Step 1.
- Added merge actions so saved rosters can be pulled back into the current player grid.
- Added shared roster backups across devices and tournament codes.
- Added bar name metadata to saved roster backups.
- Added clearer backup previews and labels so backups are easier to find on mobile.
- Reworked the merge flow multiple times to keep the backups practical in real use.

## Access And Sharing

- Added GitHub Pages deployment support for the static front end.
- Added Cloudflare-backed live update support for bracket snapshots and shared backups.
- Added a configurable polling interval for the portal so live refreshes can be tuned against API usage.
- Added clearer admin-portal labels and navigation for attendance and player-portal access.

## Recent Functional State

- `bracket.html` is the director/admin portal.
- `portal.html` is the player-facing portal.
- `attendance.html` is director-only and requires login.
- The bracket page produces the shared data source for attendance, mystery out, bullshoot, and roster backups.
- The attendance page consumes that shared data and manages weekly eligibility and history.

