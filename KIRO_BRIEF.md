# KIRO_BRIEF — Paste this at the start of every new Kiro session/account

## Project
EchoSphere — a small-scale, Zoom/Google Meet-style live classroom (teacher + up to 5
students) with an AI co-teacher that joins as an audio-only participant via Agora
Conversational AI. Each classroom is an isolated Agora RTC channel (identified by a
classroom code). LLM brain = Gemini API (BYOK). No full auth — lightweight role/session
system (name + role + classroom code).

## Tech stack
- Frontend: Next.js (based on AgoraIO-Conversational-AI/agent-quickstart-nextjs)
- Voice: Agora Conversational AI (Agora-managed STT: Deepgram, TTS: MiniMax)
- LLM: Gemini API (Google AI Studio key, BYOK into Agora)
- Backend/DB: Azure (App Service/Functions + Cosmos DB or Postgres) — added in later phase
- UI design: Antigravity
- Code execution: Kiro (you)

## Current state
<!-- UPDATE THIS SECTION EACH SESSION -->
- Repo cloned from template into "EchoSphere-Classroom", Git initialized under my own
  account, baseline commit made. plan.md and this KIRO_BRIEF.md are in the repo root.
- Architecture already investigated (do NOT re-investigate, saves credits): base template
  = ONE browser user + ONE AI agent, voice-only (mic + transcript + visualizer), NO video,
  NO multi-party support. Confirmed via AGENTS.md and the architecture diagram.
- Key file for AI behavior: app/api/invite-agent/route.ts (system prompt, VAD, LLM model,
  voice — this is where Gemini gets wired in later).
- MUST NOT touch/break: the `isReady` StrictMode guard pattern, hook ownership
  (`useJoin` owns client.leave(), `useLocalMicrophoneTrack` owns track lifecycle),
  RTM token generation via `RtcTokenBuilder.buildTokenWithRtm`.
- STEP 1 DONE: dependencies installed (pnpm install, 495 packages). .env.local created
  from env.local.example with real credentials filled in (NEXT_PUBLIC_AGORA_APP_ID,
  NEXT_AGORA_APP_CERTIFICATE, GEMINI_API_KEY). .env.local is gitignored, safe.
- App has NOT been run yet. No feature code changed yet.
- Status: Starting Step 2 — multi-user join flow with name + role + classroom code,
  built on top of the existing single-user join in components/LandingPage.tsx.

## Rules for this session
1. Before making changes, briefly confirm you understand the current state above.
2. Do NOT run `git push` or touch remote repos — local changes only.
3. Batch related changes together — avoid stopping to ask permission for every small step;
   only pause and report back at the major checkpoints I specify in the task prompt.
4. At the end of the session, tell me exactly what changed (files touched, what to test)
   so I can update this brief for the next session.
5. Do not include or print any API keys/secrets in your responses.

## Next task
<!-- The specific task prompt goes here each session -->

STEP 2 — Multi-user join flow with roles + classroom code

Goal: extend the existing single-user join flow (components/LandingPage.tsx and related
join logic) so that:

1. Join screen asks for:
   - Name (text input)
   - Role: "Teacher" or "Student" (dropdown/toggle)
   - Classroom code:
     - If role = Teacher: auto-generate a short random code (e.g. 6 characters) and
       display it prominently so it can be shared with students.
     - If role = Student: an input field to type in the classroom code given by the teacher.

2. The classroom code becomes the Agora RTC channel name (so each classroom is an
   isolated room — same pattern the template already uses for its single channel, just
   parameterized by this code instead of a fixed/default value).

3. Attach {name, role} as user metadata when joining the RTC channel, so this info is
   available to other parts of the app later (we will use it when wiring the AI's
   context in a future step — do not build that logic yet, just make sure name+role
   travel with the user session, e.g. in RTM user attributes or app state accessible
   after join).

4. Keep everything else about the existing voice connection flow (isReady guard, hook
   ownership, AgoraVoiceAI init) exactly as it is — you are adding a join screen on top,
   not rewriting the connection logic.

5. Do NOT add video/camera tracks yet — that is a separate future step. This step is
   ONLY: join screen UI + role/name/classroom-code plumbing into the existing (audio-only)
   channel join.

6. After implementing, run: pnpm run lint && pnpm run typecheck
   Fix any errors those raise.

7. Report back: which files you changed/created, and a short list of what I should
   manually test in the browser (e.g. "open two tabs, join as teacher in one and
   student with the same code in the other, confirm both connect to the same room").

Do NOT run pnpm run dev yourself — I will test it manually.