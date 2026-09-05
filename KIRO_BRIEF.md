# KIRO_BRIEF — Paste this at the start of every new Kiro session/account

## Project
EchoSphere — a small-scale, Zoom/Google Meet-style live classroom (teacher + up to 5
students) with an AI co-teacher that joins as an audio-only (+ text chat) participant
via Agora Conversational AI. Each classroom is an isolated Agora RTC channel (identified
by a classroom code). No full auth — lightweight session (name + role + classroom code).

## Tech stack (current, not aspirational)
- Frontend: Next.js (based on AgoraIO-Conversational-AI/agent-quickstart-nextjs)
- Voice: Agora Conversational AI — Deepgram STT (nova-3), MiniMax TTS
- LLM: Agora-managed OpenAI (gpt-4o-mini) — NOT Gemini. Gemini was attempted and
  abandoned after hitting model deprecation (404) and high-demand (503) errors across
  gemini-2.0-flash, gemini-2.5-flash, and gemini-3.6-flash. GEMINI_API_KEY still sits
  unused in .env.local, harmless, not a priority to revisit.
- Backend/DB: NONE. No Azure, no database. Everything is in-session browser/React state.
  This was a deliberate deprioritization given the hackathon deadline.
- Code execution: Kiro (you)
- No video/camera — audio + text chat only.

## MUST NOT touch/break (from the template's own AGENTS.md)
- The `isReady` StrictMode guard pattern in join/connection hooks
- Hook ownership: `useJoin` owns `client.leave()`; `useLocalMicrophoneTrack` owns track
  lifecycle — never call these cleanup methods manually elsewhere
- RTM token generation must stay on `RtcTokenBuilder.buildTokenWithRtm` (not RTC-only)

## Current state — THIS HAS DRIFTED, VERIFY BEFORE TRUSTING
This project has been built across MANY Kiro sessions (credits reset across 12 accounts)
and even briefly a separate Claude planning session that went slightly off-track before
being corrected. Because of this, written summaries (including this one) may not
perfectly match the actual code. DO NOT proceed with new feature work until a full
ground-truth audit (see "Next task" below) confirms what's real.

Believed feature history (VERIFY, don't assume any of this is accurate or complete):
1. Room join with name/role/classroom code — `JoinScreen.tsx`. Teacher gets an
   auto-generated 6-char code; student types it in. Room isolation = classroom code
   used as the Agora RTC channel name.
2. AI persona — `ECHOSPHERE_PROMPT` constant in `app/api/invite-agent/route.ts`. Includes:
   default-to-listening behavior, don't-interrupt-the-teacher rules, explanation-depth
   adaptation, multilingual support instruction, voice-first/concise TTS-friendly output
   rules, and a "Quiz behaviour" section (topic-grounded — only quizzes on what was
   actually taught in-session; asks for the student's name on voice answers since voice
   turns have no automatic speaker identity, unlike text chat; tracks per-student
   correctness; recaps at the end).
3. Turn-taking tuning — `interruption.enable: true` (humans can barge in on the AI);
   VAD timing loosened from defaults (`silence_duration_ms` 480→800ms,
   `prefix_padding_ms` 300→400ms) to reduce false "could you repeat that" responses.
4. Teacher-only mute/unmute AI controls — calls `/api/stop-conversation` then
   `/api/invite-agent` again (full stop/restart; Agora's SDK has no lighter pause
   primitive). Known limitation: conversation history resets on unmute (new session).
5. RTM-broadcast transcript log — each client broadcasts its own completed voice/text
   turns tagged with `{name, role, text, timestamp}` over RTM as `transcript_turn`
   messages. Teacher's client accumulates these into `sessionTranscriptLog`.
6. Post-class summary — teacher clicks "End Class & Summary" → calls
   `/api/inject-think` (generalized route wrapping `agentManagement.agentThink()`) with
   `SUMMARY_PROMPT` (lives in `lib/prompts.ts`, moved there after a Next.js typecheck
   error from exporting a constant from a route file) → AI reasons over its own
   conversation history and produces a structured response (OVERALL SUMMARY, COMMON
   LEARNING GAPS, STUDENTS NEEDING SUPPORT — including quiz performance per #2) → this
   response is captured via the existing transcript listener (`summaryMode` flag +
   `onSummaryTurn` callback capture the next completed agent turn) → parsed by
   `lib/summary-pdf.ts` and exported as a downloadable PDF via jsPDF (dynamically
   imported, ~290KB, only loads on click). 15-second timeout with an error state if no
   summary arrives.
7. Text chat fallback — input box (visible to all roles) for typing messages to the AI
   instead of relying on voice/STT. Reuses `/api/inject-think`, prefixes the message
   with `[Teacher: Name]:` / `[Student: Name]:`, and broadcasts it to the RTM transcript
   log identically to a voice turn. Disabled during `summaryMode` to avoid a race where
   a chat response could be mistakenly captured as the summary.
8. KNOWN ACTIVE BUG (unresolved as of last work session — CHECK IF THIS WAS FIXED):
   Only the TEACHER's client calls `/api/invite-agent` and receives an `agent_id`.
   Students never receive it — `agoraData.agentId` is `undefined` on student clients,
   which permanently disables their chat input (`disabled={... || !agoraData.agentId}`)
   and blocks their `/api/inject-think` calls before the fetch even fires. A fix was
   in progress: broadcast `{ type: 'agent_session', agent_id }` over RTM from teacher to
   students when the agent starts, with a receiver that updates student `agoraData`.
   UNRESOLVED EDGE CASE flagged but not yet solved: a student who joins AFTER the
   teacher's agent already started will miss that one-time broadcast and still be stuck
   — needs either a request/response pattern on student-join, or periodic
   re-broadcast, or the teacher's client re-sending it whenever a new student joins
   (check RTM presence/member-join events for the cleanest hook point).
   VERIFY: was this actually implemented, and does it handle both orderings (student
   joins before vs after the teacher's agent starts)?

## Git discipline reminder
In a past session, 8 files of real work went uncommitted for a while before being
caught. ALWAYS remind the user to run `git add . && git commit -m "..."` after each
verified-working change in this session's report-back — do not assume they remembered.

## Time pressure
This is a hackathon project with a near-term deadline. Prioritize verifying and fixing
what already exists over adding new scope. Working > perfect. If a proposed fix is
risky/experimental, say so plainly and offer the safer fallback alongside it.

## Rules for this session
1. Before making changes, do the full audit in "Next task" below — do not skip it, even
   if it feels redundant, because prior summaries in this file may be stale or wrong.
2. Do NOT run `git push` or touch remote repos — local changes only.
3. Batch related changes together — avoid stopping to ask permission for every small
   step; only pause and report back at defined checkpoints.
4. At the end of the session, report exactly what changed (files touched, what to test)
   and remind the user to commit.
5. Do not include or print any API keys/secrets in your responses.

## Next task

Do NOT make any changes yet. This is a full ground-truth audit — the previous session's
notes above may be inaccurate or outdated, and I need an honest, current picture before
deciding what to build next.

1. GIT HISTORY
   - Run `git log --oneline --all` and show the full commit history.
   - Run `git status` — list any uncommitted changes right now.
   - If there are uncommitted changes, summarize what they do (do not just say "various").

2. LLM / AGENT CONFIG — read app/api/invite-agent/route.ts in full and report:
   - Which LLM provider/model is actually configured right now.
   - Quote the full current system prompt (ECHOSPHERE_PROMPT or equivalent) verbatim,
     including the Quiz behaviour section if present.
   - Current turnDetection/VAD settings and interruption settings.
   - Confirm templateVariables usage (teacher_name injection) is still present.

3. CHAT / INJECT-THINK — read app/api/inject-think/route.ts and lib/prompts.ts (if it
   exists) in full and report exactly what's there, including SUMMARY_PROMPT verbatim.

4. THE KNOWN BUG (#8 above) — check ConversationComponent.tsx and LandingPage.tsx:
   - Is there an RTM message type for broadcasting agent_id to students?
   - Does agoraData.agentId actually get populated on a STUDENT client? Trace the exact
     code path and report your findings plainly — "yes, works" or "no, still broken,
     here's exactly where it fails."
   - Was the join-order edge case (student joining after teacher's agent already
     started) ever addressed? If yes, how? If no, confirm it's still an open gap.

5. FEATURE INVENTORY — for each of these, report Working / Partially working / Broken /
   Not started, with the file(s) involved: room join+roles, room isolation, AI persona,
   turn-taking, teacher mute/unmute, RTM transcript broadcast, post-class summary + PDF
   export, text chat (teacher AND student separately), quiz behavior, multilingual
   support (has this ever actually been tested?).

6. RUN CHECKS
   - `pnpm run lint && pnpm run typecheck && pnpm run verify:api`
   - Report any failures verbatim.

7. ANYTHING ELSE — flag anything you notice that looks incomplete, inconsistent, unused/
   dead code, or risky for a live demo, even if it wasn't explicitly asked about above.

Do not fix anything in this task. Just report facts clearly, in the structure above, so
we can decide together what to prioritize with the time remaining.
