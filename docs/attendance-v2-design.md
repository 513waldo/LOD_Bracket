# Attendance V2 Design

## Goal

Create one server-owned attendance record for each LOD. The admin portal and
attendance page read and update the same record. Normal LOD bracket operation
must remain unchanged while V2 is developed and tested locally.

## Series and nightly session codes

Attendance uses two distinct identifiers:

- `series_code`: a stable code for the venue's attendance series. It identifies
  the long-lived attendance sheet.
- `lod_code`: the unique code for that night's tournament/bracket session.

At the start of a session, the director enters the `series_code` in the admin
portal. The portal loads that series' server-owned attendance sheet. The
director then merges the current night's roster, identified by `lod_code`, into
the series sheet.

The merge is performed against normalized player names. Every player in the
nightly roster is marked present for that particular attendance week. For a
matching existing player, the current week's check is set and their count is
incremented or recalculated from the recorded weekly checks. A new player is
added to the series sheet with the current week's check already marked and a
count of one. The operation must be idempotent: repeating the same merge for
the same `lod_code` cannot add another check or inflate the count.

The merge should record the source `lod_code`, week, actor, timestamp, and
match method in the audit history. Ambiguous name matches should be surfaced
for confirmation rather than silently merged.

## End-to-end workflow

### 1. Create or select the attendance series

The venue has one long-lived attendance series with a unique `series_code`.
The director creates it once or selects an existing series. The series stores
the venue, tournament/series name, description, director, staff permissions,
week schedule, and attendance roster.

### 2. Start a nightly LOD

The director creates the night's LOD in the normal admin portal. The LOD gets
its own unique `lod_code` and contains that night's player roster. Normal LOD
bracket generation and scoring continue unchanged.

### 3. Open the series from the admin portal

The director enters the permanent `series_code` in the attendance section of
the admin portal. The server authenticates the director, verifies venue and
staff authorization, and loads the matching attendance series. No attendance
data is copied through URL parameters or browser-local storage.

### 4. Select the attendance week

The director selects the specific week or session date. The server resolves
that selection to a unique `attendance_week_id`; the client must not infer the
week solely from the browser date or an array position.

### 5. Load or create that week's roster

The director chooses one of two paths:

- **Merge an existing LOD roster:** enter or select the night's `lod_code` and
  choose **Merge roster**. The server loads the LOD roster and compares it
  with the series roster using normalized names and, when available, a stable
  player ID. The director can then modify the merged roster before saving.
- **Create a roster from scratch:** choose **Create roster**, manually add the
  players who attended, and save the list against the selected series and
  week. Each player added to this week's attendance roster is checked for that
  week.

Both paths produce the same server-owned weekly attendance record. The
director can add or remove names before finalizing the week, subject to the
appropriate staff permissions.

For every player in the nightly roster:

- Existing player: set the checkmark for the selected week.
- New player: add them to the series roster and set the selected week's
  checkmark immediately.
- Either case: calculate the displayed attendance count from all weekly
  checks, including the newly checked week.

If a name has multiple possible matches, the merge pauses that name for
director confirmation. It must not silently merge the wrong person.

### 6. Prevent duplicate counting

The server records the `(series_id, lod_id, attendance_week_id)` merge as an
idempotency key. Repeating the merge leaves the same checkmark in place and
does not increase the attendance count twice.

### 7. Review and continue operations

The attendance page reads the updated server record and displays each player,
weekly checkmarks, and the calculated count. The director can correct an
authorized attendance entry, with every change recorded in the audit history.
The LOD remains available for bracket scoring independently.

### 8. Lock and hand off when appropriate

After the attendance period, the director locks the selected week or roster.
If the process requires it, the locked attendance roster is handed off to the
bracket as a controlled, auditable operation. Later bracket changes do not
rewrite historical attendance checks.

## Reuse

- Account creation, login, session tokens, and account/venue isolation.
- The existing `BracketRoom` Durable Object and LOD snapshot ownership rules.
- Bracket player roster and locked-roster handoff.
- Existing QR rendering and portal URL components.
- Existing Cloudflare Worker deployment and frontend styling.

## Retire from the attendance path

- Browser `localStorage` as the source of truth.
- Account-level attendance buckets and anonymous fallback ownership.
- Metadata transfer through URL parameters and browser-local generation state.
- Attendance-specific client-side passwords as the primary authorization model.

## Proposed server model

An LOD owns one attendance sheet:

```text
VenueAccount
  id, name, status

LOD
  id, venue_id, code, event_type, event_name, description, event_date
  director_account_id, status, roster_lock_at

AttendanceSheet
  id, venue_id, series_code, version, current_week, created_at, updated_at

AttendancePlayer
  id, attendance_sheet_id, canonical_name, display_name, weekly_checks
  attendance_count, registration_status, metadata

AttendanceMerge
  id, attendance_sheet_id, lod_id, source_roster_hash, week, actor_account_id
  created_at

AttendanceStaff
  attendance_sheet_id, account_id, role, revoked_at

AttendanceQrToken
  id, attendance_sheet_id, token_hash, expires_at, revoked_at

AttendanceAuditEvent
  id, attendance_sheet_id, actor_account_id, action, payload, created_at
```

The Worker implementation may initially store these records in the existing
Durable Object SQLite storage. The logical ownership boundary is more
important than the final table names.

## API surface

```text
POST   /api/lods/:lodId/attendance
GET    /api/lods/:lodId/attendance
PATCH  /api/lods/:lodId/attendance
POST   /api/lods/:lodId/attendance/registrations
PATCH  /api/lods/:lodId/attendance/registrations/:registrationId
POST   /api/lods/:lodId/attendance/qr
POST   /api/lods/:lodId/attendance/qr/:token/revoke
GET    /api/lods/:lodId/attendance/audit
POST   /api/lods/:lodId/attendance/lock-roster
POST   /api/lods/:lodId/attendance/handoff-to-bracket
```

Public QR registration must use an opaque, revocable token and must never
return staff, account, or audit data. Staff and director endpoints require
account authentication and verify that the account is authorized for the LOD.

## Roles and states

Roles: director, staff, and registrant/public participant.

Registration states: invited, registered, checked-in, withdrawn, rejected.

LOD attendance states: draft, open, locked, handed-off, archived.

Roster handoff is one-way after lock: the attendance roster becomes the input
for bracket creation, and later bracket edits do not silently rewrite attendance
history.

## Migration and rollback

1. Freeze the current attendance feature except critical fixes.
2. Build V2 behind `/attendance-v2` and a local/test feature flag.
3. Use test-only LOD records; do not migrate production browser data yet.
4. Run multi-venue, multi-LOD, permission, QR, lock, and handoff tests.
5. Keep `/attendance` on the current implementation during pilot.
6. Switch the route only after acceptance tests pass.
7. Retain the old route for rollback during the first production event.
8. Remove localStorage migration code only after successful production use.

## Post-V2 task

- Add a one-time Tournament Code notification email to the tournament director
  and the configured administrator after the permanent code is created or
  first activated. Store a `notificationSentAt` value so weekly LOD creation,
  later access, refreshes, and retries do not send duplicate messages. Test
  this against Cloudflare production after the Attendance V2 acceptance tests
  pass.
- Add series staff invitations for substitute directors. A venue owner or
  authorized director can invite a verified account with a scoped role and,
  when appropriate, an expiration time. Email the existing Tournament Code
  and series link to the invitee without sharing another user's password.
  Test the invitation and email flow in Cloudflare production because local
  Resend testing is limited to the configured test recipient.

## Acceptance tests

- Normal LOD creation and scoring still work.
- Two venues cannot read or mutate one another's LOD attendance.
- Two LODs at one venue have independent sheets and QR tokens.
- Admin metadata appears immediately on the matching attendance sheet.
- Entering a series code loads the correct long-lived attendance sheet.
- Merging a nightly LOD roster marks every roster name for that particular
  week, including newly added players, and updates the count beside each name.
- Repeating a nightly merge is idempotent and does not double-count attendance.
- A name appearing in multiple series sheets remains isolated to its own
  `series_code`.
- Refreshing or changing browsers does not lose server-owned data.
- Revoked and expired QR tokens cannot register players.
- Staff permissions are enforced for read, write, lock, and handoff actions.
- Locked rosters transfer deterministically into the bracket.
- Audit history records every metadata, registration, permission, QR, lock, and handoff change.
- Existing attendance remains available during rollback.
