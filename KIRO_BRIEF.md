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
- STEP 1 DONE. STEP 2 DONE (join flow, roles, room isolation working).
- STEP 3 ATTEMPTED: swapped LLM to Gemini, added ECHOSPHERE_PROMPT classroom persona.
  Hit a wall: gemini-2.0-flash (404, deprecated) -> gemini-2.5-flash (404, deprecated
  for new keys) -> gemini-3.6-flash (503, high demand, but confirmed valid via direct
  curl test to Google's API). Time pressure (demo in ~10 hours) means we cannot risk
  depending on an external LLM with availability issues.
- DECISION: reverting LLM from Gemini back to Agora-managed OpenAI LLM (the original
  default that was proven 100% working in early testing — greeted as "Ada" with zero
  errors). KEEPING the ECHOSPHERE_PROMPT classroom co-teacher persona/system prompt —
  only the LLM provider/model is reverting, not the prompt engineering work.
- plan.md/KIRO_BRIEF.md tech stack note: Gemini BYOK is deprioritized for now due to
  Google-side model deprecation/availability issues hit during Step 3. Agora-managed
  OpenAI LLM is the working baseline going forward. May revisit Gemini or try Groq
  (OpenAI-compatible, via the template's existing but unwired app/api/chat/completions/
  route.ts) only if time remains after the app is otherwise demo-ready.
- Status: Reverting Step 3's LLM choice to Agora-managed OpenAI, keeping the classroom
  system prompt intact.

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

STEP 3-REVERT — Revert LLM to Agora-managed OpenAI, keep classroom prompt

Time-critical decision: revert the LLM from Gemini back to Agora's managed OpenAI LLM 
(the one this template used by default before Step 3), since Gemini hit external API 
issues (model deprecation + 503 high-demand errors) and we have a hard deadline (demo in 
~10 hours).

1. In app/api/invite-agent/route.ts:
   - Remove the Gemini import and the .withLlm(new Gemini({...})) block.
   - Restore the Agora-managed OpenAI LLM configuration that was there before Step 3.
     Use git history to get this exactly right: run `git log --oneline` to find the
     commit before Step 3's Gemini change, then `git show <that-commit>:app/api/invite-agent/route.ts`
     to see the original .withLlm(...) block, and restore that exact OpenAI config.
   - IMPORTANT: keep the ECHOSPHERE_PROMPT (classroom co-teacher system prompt) and the
     GREETING constant from Step 3 — do NOT revert those. Only the LLM provider/model
     config reverts to OpenAI; the persona/prompt content stays as-is.
   - GEMINI_API_KEY can stay in .env.local (unused for now, harmless) — do not remove it,
     we may revisit Gemini later if time permits.

2. Also apply this small cosmetic fix while in there: in
   components/QuickstartPipelineMetrics.tsx, the hardcoded label already correctly says
   'OpenAI LLM' — no change needed there since we're reverting to OpenAI anyway.

3. Run: pnpm run lint && pnpm run typecheck && pnpm run verify:api
   Fix any errors those raise.

4. Report back: confirm the exact OpenAI model/config restored, and confirm
   ECHOSPHERE_PROMPT/GREETING are still intact and unchanged.

Do NOT run pnpm run dev yourself — I will test it manually.