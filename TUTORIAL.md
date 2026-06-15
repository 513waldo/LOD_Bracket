# Tournament Tool Tutorial

This is the practical, high-level way to use the site.

## What The Pages Do

- Admin portal: `https://513waldo.github.io/LOD_Bracket/bracket.html`
- Player portal: `portal.html` opened from the QR code
- Attendance sheet: `attendance.html` for directors only

## Start A Tournament

- Open `bracket.html`.
- Enter the total player count.
- Enter the players per group.
- Fill in the player names in Step 1.
- Use the actual number of players that are playing, then click `Update list` when the names are entered.
- Enter the bar name.
- Set or generate the tournament date.
- Click `Update list` if you want the current roster backup saved.
- Click `Generate teams`.
- Review the teams in Step 3.
- Click `Build bracket`.

## Share The Player Portal

- Copy the portal link from the admin page.
- Or use the QR code shown on the bracket page.
- Players scan the QR code to open `portal.html?lod=...`.
- The portal updates from bracket changes if live updates are enabled.

## Use Attendance

- Open `attendance.html` from the director portal.
- Log in with the root password or the bar username/password.
- Set the venue name if needed.
- Set the eligibility rule, such as `6 of 12 weeks`.
- Use `Sync bracket roster` to pull the current player list from the bracket page.
- Use `Add player` to type in anyone missing from the list.
- Mark weekly attendance with the checkboxes.
- Use the custom week dates if the schedule is not weekly.

## Track Mystery Out And Bullshoot

- Use the `Sync from bracket data` button on the attendance page.
- The attendance sheet pulls the current Mystery Out and Bullshoot results from the bracket portal data.
- The picked player fields are filled from the bracket data when available.
- The tracker history keeps prior draw results so you can look back later.

## Handle Saved Players

- Step 1 keeps roster backups for the player names.
- Click `Update list` to save the current roster backup and refresh the player list.
- Use the `Merge names` button on a saved roster to bring those names back into the current grid.
- Saved rosters include the bar name, so you can tell them apart.

## Publish To Facebook

- Open the attendance page.
- Use the Facebook section to build a post.
- Choose `Eligible only` or `Full roster`.
- Copy the generated text and paste it into Facebook.

## Daily Workflow

- Set up the tournament in the bracket portal.
- Share the QR code with players.
- Use the attendance sheet during the night.
- Sync Mystery Out and Bullshoot results when the draw stops.
- Keep the roster backups and weekly attendance updated.

## Notes

- The attendance page is director-only.
- The portal and attendance sheet both use the bracket page as the shared source of truth.
- If something looks stale, hard-refresh after the latest deploy finishes.
