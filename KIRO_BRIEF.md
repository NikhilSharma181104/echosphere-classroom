# EchoSphere — Kiro Brief

Read this whole file before doing anything. Fix a bug in the last session's
UID assignment. Run checks after, report back.

---

## Bug found in manual testing

4-tab test: 1 teacher + 3 students, same classroom code. 2 of 3 students
showed as disconnected.

## Root cause

The last session's `getReservedUid()` helper in `LandingPage.tsx` tracks the
"next available student slot" in `sessionStorage`, keyed by classroom code.
But `sessionStorage` is scoped per browser tab — it does NOT share state
across tabs, even for the same site. So every student tab independently
starts with no stored slot and picks the same first available slot (UID 2),
causing multiple students to try to join the RTC channel with the same UID —
Agora only allows one of them to actually hold it, and the rest fail/show
disconnected.

## Task — move slot assignment to the server

Replace the client-side `sessionStorage` slot counter with server-side
coordination, since the app already keeps other state in-memory for this
hackathon demo (no DB yet):

1. In (or near) `/api/generate-agora-token`, add a simple **in-memory** map
   from `channel_name` → next available student slot index, scoped to the
   running server process (a plain `Map<string, number>` at module scope is
   fine for a hackathon demo — no persistence needed).
2. When a student requests a token, the server (not the client) determines
   the next available UID from the reserved pool (2–6) for that specific
   classroom code, increments the counter for that channel, and returns the
   assigned UID in the response alongside the token — the client then uses
   that returned UID for its own RTC join, instead of guessing one itself.
3. Teacher keeps the fixed UID (1) as before — no change needed there, no
   collision risk since there's only one teacher per classroom.
4. Remove the now-incorrect `sessionStorage`-based `getReservedUid()` slot
   logic from `LandingPage.tsx` for students; students should get their UID
   from the server's token response instead.
5. Handle the edge case: if more than 5 students try to join (rare, but
   possible in testing) — return a clear error rather than silently
   colliding or crashing; report what you did here.
6. Run `pnpm run lint && pnpm run typecheck && pnpm run verify:api` and fix
   any errors, updating tests if the token response shape changed.

## MUST NOT touch/break

- The `isReady` StrictMode guard pattern in join/connection hooks.
- Hook ownership: `useJoin` owns `client.leave()`; `useLocalMicrophoneTrack`
  owns track create/close lifecycle.
- RTM token generation must stay on `RtcTokenBuilder.buildTokenWithRtm`.
- Do not touch `remoteUids: ALL_PARTICIPANT_UIDS`, `.withInterruption()`, or
  the prompt/templateVariables logic — those are confirmed working.
- Teacher's fixed UID (1) and the reserved pool range (2–6) stay as they are
  — only fix HOW student slots get assigned, not the pool itself.

Do not run `pnpm run dev` or `git push`.

When done, report what changed and give the manual test: same 4-tab test (1
teacher + 3 students, same classroom code) — confirm all 4 show connected
this time, with no UID collisions.
