# SonaAI — Voice AI Co-Teacher for Live Classrooms

### Project Plan (Hackathon Build)

---

## 1. Problem Statement (Recap)

Build a voice AI co-teacher that joins a **live digital classroom** with a teacher and multiple students. It should:

- Understand the ongoing lesson in real time
- Speak only at the right moments (never interrupt the teacher)
- Give contextual answers, run spoken quizzes, and adapt explanations per student
- Identify repeated learning gaps across students
- Support multilingual / code-switched speech
- Let the teacher override or control it
- Produce a post-class summary of learning gaps and insights

**Example scenario:** In a math class, 3 students independently struggle with the same concept. The AI notices the pattern, waits for a natural pause, gives a simpler re-explanation, and later tells the teacher which students need follow-up.

---

## 2. Roles

| Role                        | Responsibility                                                                |
| --------------------------- | ----------------------------------------------------------------------------- |
| **You (builder)**           | Middle man — makes decisions, runs tools, tests, submits, presents            |
| **Claude (this chat)**      | Guide — plans architecture, writes exact prompts for Kiro/Antigravity, debugs |
| **Kiro**                    | Writes actual application code from Claude's prompts                          |
| **Antigravity**             | Designs UI screens (teacher dashboard, student view)                          |
| **Agora Conversational AI** | Real-time voice layer — mandatory                                             |
| **Gemini API**              | LLM brain — context understanding, decision-making, multilingual              |
| **Azure**                   | Backend hosting + database (student identity, transcripts, summaries)         |

---

## 3. Tech Stack

| Layer                 | Tool                                             | Notes                                                                                                                                                           |
| --------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Voice/Real-time layer | **Agora Conversational AI**                      | Mandatory. Handles audio streaming, VAD (turn-taking), agent orchestration                                                                                      |
| STT                   | Agora-managed (Deepgram, model nova-3)           | No separate key needed, part of Agora free minutes                                                                                                              |
| TTS                   | Agora-managed (MiniMax)                          | No separate key needed                                                                                                                                          |
| LLM                   | **Agora-managed OpenAI (gpt-4o-mini)**           | Reverted from Gemini after hitting model deprecation (404) and high-demand (503) errors during build — see Section 4c. Zero external key needed, proven stable. |
| Frontend              | **Next.js** (`agent-quickstart-nextjs` template) | Pre-wired Agora setup; classroom UI, join screen, role selection                                                                                                |
| Backend / DB          | **Azure** (planned, not yet started)             | Deferred — current build uses in-session state + RTM broadcast instead (see Section 4c)                                                                         |
| UI Design             | **Antigravity**                                  | Not yet used                                                                                                                                                    |
| Code generation       | **Kiro**                                         | Executes Claude's step-by-step prompts to build the app                                                                                                         |

---

## 4. System Architecture (High Level)

**Model: small-scale Zoom/Google Meet-style room.** Agora RTC hosts a real multi-party
video+audio channel (teacher + a handful of students, real camera/mic tiles, grid layout).
The AI Co-Teacher joins that same channel as its own participant — audio-only (no camera),
always listening, speaks only when appropriate. This is NOT a 1-on-1 voice bot; it's a
shared live room, isolated per classroom session/code.

```
[Teacher Device] (video+audio) ---\
                                    \
[Student Device 1] (video+audio) ---+---> Agora RTC Channel = "Classroom Room"
                                    /       (isolated per classroom code, like a
[Student Device N] (video+audio) -/         Zoom/Meet room; caps ~4-6 participants)
                                        |
                                        v
                     AI Co-Teacher joins as a silent participant
                     (audio-only tile, always listening via Agora Conversational AI)
                          (STT -> Gemini LLM -> TTS)
                                        |
                                        v
                          Context Engine (per-turn):
                          - Role (teacher/student) from session metadata
                          - Student identity/session (name + classroom code)
                          - Ongoing lesson transcript
                          - Student's past struggle history
                                        |
                                        v
                     Decision: Answer now / Wait / Log gap silently
                                        |
                     -------------------------------------
                     |                                     |
                     v                                     v
        Spoken response (TTS via Agora,          Azure DB (log gap, transcript,
        heard by everyone in the room             student performance)
        like an unmuted participant)
                                        |
                                        v
                        After class ends -> Gemini generates
                        Post-Class Summary -> stored in Azure ->
                        shown on Teacher Dashboard
```

**Room isolation:** each classroom = a unique Agora channel name (tied to a generated
classroom code). No cross-talk between different classrooms; sessions are ephemeral
(no video/audio recording or cloud storage — only AI transcript + gap logs are persisted).

---

## 4a. Confirmed: Base Template Is Voice-Only, Single-User

Investigation of `agent-quickstart-nextjs` (via AGENTS.md + architecture diagram) confirms:

- Template = **one browser user + one AI agent**, audio-only (mic + transcript + visualizer). No video, no multi-party.
- Underlying Agora RTC SDK (`agora-rtc-sdk-ng`) DOES support many participants — we are extending
  the **UI/app layer**, not fighting the SDK.
- Key file to edit for AI behavior: `app/api/invite-agent/route.ts` (system prompt, VAD, LLM model, voice)
- Must preserve template's core patterns (do not touch): `isReady` StrictMode guard, hook ownership
  (`useJoin` owns `client.leave()`, `useLocalMicrophoneTrack` owns track lifecycle), RTM token via
  `RtcTokenBuilder.buildTokenWithRtm`.

**Revised Step 4 becomes two build tracks on top of the existing voice foundation:**

1. Add video tracks + a small grid UI (teacher + student tiles, camera on/off)
2. Add multi-user join flow with name + role + classroom code (extending the current single-user join)

---

## 4b. Roles & Identity (Lightweight, No Full Auth)

Full login/OAuth is skipped to fit the hackathon timeline. Instead:

- **Join screen:** user enters Name + selects Role (Teacher / Student)
- **Teacher** gets an auto-generated **classroom code**; shares it with students
- **Students** join by entering that code + their name → same Agora channel = same "room"
- On join, a session ID is generated (e.g. `crypto.randomUUID()`) tied to `{name, role, classroomCode}`
- This is attached as **user metadata** in the Agora RTC channel
- Every voice turn sent to Gemini includes the role tag, e.g. `"This message is from: Teacher"` or `"Student - Priya"`
- Frontend UI adapts by role: Teacher sees control panel (mute/override AI); Student doesn't
- Session data lives in browser/session state for the demo; Azure DB (Phase 6) persists
  student history across classes if time allows (`{studentId, name, pastGaps}`)

This satisfies "teacher/student role awareness" and "student identification via session/user
identity" without building real authentication infrastructure.

---

## 4c. Reality Check — What Actually Got Built (deviations from original plan)

This section tracks where the actual build diverged from the original plan above, and why.
Keep the original sections for historical context, but treat THIS section as ground truth.

- **LLM: Gemini abandoned, using Agora-managed OpenAI (gpt-4o-mini).** Hit
  `gemini-2.0-flash` (404, deprecated) → `gemini-2.5-flash` (404, "no longer available to
  new users") → `gemini-3.6-flash` (503, high demand, confirmed valid via direct API test).
  Given the deadline, reverted to the proven-stable Agora-managed OpenAI path. The
  classroom system prompt (persona, behavior rules) was preserved through this revert.
  `GEMINI_API_KEY` remains in `.env.local`, unused — could revisit only if time allows.

- **No video/camera tiles.** Audio-only, exactly as the base template was. The
  Zoom/Meet-style multi-party experience is achieved via multi-user audio join +
  Agora RTC channel isolation (via classroom code), NOT via a video grid UI. This was
  deprioritized given time constraints — a working audio-only classroom that nails the
  AI behavior requirements scores better than an unfinished video UI.

- **No Azure/DB integration (yet).** Deferred. Currently all session state (name, role,
  classroom code) lives in browser/React state, not persisted server-side. Per-student
  history across multiple classes (mentioned in the original Section 5 table) is NOT
  built. If time remains after core AI features are solid, this is the last priority.

- **Student identity reaches the AI in a limited way.** Agora's managed Conversational AI
  pipeline does not expose true per-turn speaker diarization to the LLM — it cannot tell
  which student is speaking on a given turn. Workaround implemented: the TEACHER's name
  is injected into the system prompt at session start via `templateVariables`
  (`{{teacher_name}}`). Full student-level identification is being solved via a
  **shared RTM-broadcast transcript** instead (see Phase 6 update below) — each client
  broadcasts its own completed turns tagged with name/role over the existing RTM channel;
  the teacher's client compiles this into an attributed log, which is what feeds the
  post-class summary. This is the practical substitute for true voice diarization.

- **Teacher override is a full stop/restart, not a lighter mute.** Agora's agent session
  API only supports `stop()` / `start()` — no pause/silence primitive. "Mute AI" calls
  the stop-conversation route (agent leaves the channel); "Unmute AI" calls invite-agent
  again (agent rejoins, fresh session). Known limitation: conversation history/context is
  lost across a mute/unmute cycle since it's a genuinely new agent session. Acceptable
  for a hackathon demo.

- **Turn-taking tuning:** AI interruption was initially disabled entirely
  (`interruption.enable: false`) to stop it from talking over the teacher — but this also
  blocked humans from interrupting the AI, which felt unnatural. Fixed:
  `interruption.enable: true` (humans CAN interrupt the AI mid-response), while
  "don't talk over the teacher" remains governed separately by the system prompt (i.e.
  the AI's own decision about when to START talking, not whether it can be interrupted
  once talking). VAD timing was also loosened (`silence_duration_ms` 480ms → 800ms,
  `prefix_padding_ms` 300ms → 400ms) to reduce false "could you repeat that" responses
  from clipped speech — these are tunable starting points, not final values.

---

## 5. Feature-to-Requirement Mapping

| Requirement                    | How it's implemented                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Real-time participation        | Agora RTC channel + Conversational AI agent, always listening                                                                    |
| Teacher/student role awareness | Role tag set at join (teacher/student), passed in every LLM prompt                                                               |
| Appropriate turn-taking        | Agora VAD detects speech/pauses; AI only speaks in silence gaps, never mid-teacher-speech; teacher speech has priority weighting |
| Contextual answers             | Rolling lesson transcript fed into Gemini prompt as context window                                                               |
| Different explanation levels   | Per-student profile (grade level / past performance) stored in Azure, injected into prompt to adjust complexity                  |
| Spoken quizzes                 | AI-triggered Q&A flow via TTS, answers captured via STT, graded by Gemini                                                        |
| Multilingual / code-switching  | Gemini handles natively — no separate translation layer                                                                          |
| Student identification         | Session/user ID assigned at join, tied to Azure student profile                                                                  |
| Post-class summary             | Transcript + logged gaps sent to Gemini after session ends → structured summary → Azure storage → dashboard view                 |
| Teacher control/override       | Teacher-only control panel (mute AI, force response, dismiss suggestion) via Agora signaling channel                             |

---

## 6. Build Phases (updated with actual progress)

**Phase 1 — Foundation** ✅ DONE

- Next.js quickstart template set up, Agora App ID/Certificate connected
- Gemini attempted, abandoned (see 4c) — Agora-managed OpenAI is the working LLM
- Basic voice in/out confirmed working

**Phase 2 — Classroom Roles & Identity** ✅ MOSTLY DONE (no video)

- Join screen: name + role + classroom code — DONE (`JoinScreen.tsx`)
- Room isolation via classroom-code-as-channel-name — DONE, verified with multi-tab test
- Teacher vs student view differences — DONE (teacher-only mute/unmute controls)
- Video/audio grid UI — NOT DONE, deprioritized (see 4c)

**Phase 3 — Context & Turn-Taking Logic** ✅ MOSTLY DONE

- Classroom system prompt (SONAAI_PROMPT) — DONE
- Turn-taking: AI waits for pauses, doesn't interrupt teacher, can itself be
  interrupted — DONE, tuned (see 4c)
- Rolling transcript buffer — partial: uses `maxHistory: 15` (conversation window),
  not a dedicated lesson-topic tracker
- Silent gap-logging logic — NOT YET, planned as part of Phase 6 rework below

**Phase 4 — Adaptive Teaching Features** ❌ NOT STARTED

- Per-student explanation-level adjustment — blocked on student identity (being solved
  via Phase 6 rework below)
- Spoken quiz flow — not started
- Multilingual handling — should work via OpenAI natively, not explicitly tested yet

**Phase 5 — Teacher Controls** ✅ DONE

- Mute/Unmute AI button, teacher-only visibility — DONE (full stop/restart under the
  hood, see 4c for limitation)

**Phase 6 — Post-Class Intelligence** 🔄 IN PROGRESS (reworked approach)

- Original plan: Azure-stored summary. Current approach: RTM-broadcast tagged
  transcript (each client sends its own completed turns with name/role over RTM;
  teacher's client compiles the full attributed log) → sent to OpenAI at
  "End Conversation" → structured summary (common gaps, students needing support,
  overall summary) shown to teacher before session closes. No Azure storage yet —
  summary is generated and displayed in-session only, not persisted.

**Phase 7 — Polish & Demo Prep** — NOT STARTED

- UI polish, demo video recording, final submission

---

## 7. Credentials Checklist (keep private, never share publicly)

```
AGORA_APP_ID=
AGORA_APP_CERTIFICATE=
GEMINI_API_KEY=
AZURE_...(added once backend is set up)
```

---

## 8. Next Immediate Step

Building the RTM-tagged transcript + post-class summary feature (Phase 6 rework):
each client broadcasts its own completed speech turns over RTM tagged with name/role;
teacher's client compiles the attributed log; on "End Conversation," this log is sent
to a new API route that calls OpenAI to generate a structured summary (common learning
gaps, students needing support, overall summary) — shown to the teacher before the
session closes. This is the feature that directly satisfies the problem statement's
example scenario (identifying repeated gaps across students and telling the teacher
who needs follow-up).

After this: spoken quiz flow (mostly prompt-engineering, low cost) is the next-highest
priority if time remains. Video grid and Azure/DB integration are explicitly
deprioritized stretch goals given the deadline.
