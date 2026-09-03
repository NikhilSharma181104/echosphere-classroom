# EchoSphere — Voice AI Co-Teacher for Live Classrooms
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

| Role | Responsibility |
|---|---|
| **You (builder)** | Middle man — makes decisions, runs tools, tests, submits, presents |
| **Claude (this chat)** | Guide — plans architecture, writes exact prompts for Kiro/Antigravity, debugs |
| **Kiro** | Writes actual application code from Claude's prompts |
| **Antigravity** | Designs UI screens (teacher dashboard, student view) |
| **Agora Conversational AI** | Real-time voice layer — mandatory |
| **Gemini API** | LLM brain — context understanding, decision-making, multilingual |
| **Azure** | Backend hosting + database (student identity, transcripts, summaries) |

---

## 3. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Voice/Real-time layer | **Agora Conversational AI** | Mandatory. Handles audio streaming, VAD (turn-taking), agent orchestration |
| STT | Agora-managed (Deepgram) | No separate key needed, part of Agora free minutes |
| TTS | Agora-managed (MiniMax) | No separate key needed |
| LLM | **Gemini API** (AI Studio key, BYOK into Agora) | Context reasoning, explanation generation, gap detection, multilingual/code-switch handling |
| Frontend | **Next.js** (`agent-quickstart-nextjs` template) | Pre-wired Agora setup; classroom UI, join screen, role selection |
| Backend / DB | **Azure** (App Service or Functions + Cosmos DB/Postgres) | Session storage, student identity, transcript logs, generated summaries |
| UI Design | **Antigravity** | Visual design of dashboard/student view before Kiro builds it |
| Code generation | **Kiro** | Executes Claude's step-by-step prompts to build the app |

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

## 5. Feature-to-Requirement Mapping

| Requirement | How it's implemented |
|---|---|
| Real-time participation | Agora RTC channel + Conversational AI agent, always listening |
| Teacher/student role awareness | Role tag set at join (teacher/student), passed in every LLM prompt |
| Appropriate turn-taking | Agora VAD detects speech/pauses; AI only speaks in silence gaps, never mid-teacher-speech; teacher speech has priority weighting |
| Contextual answers | Rolling lesson transcript fed into Gemini prompt as context window |
| Different explanation levels | Per-student profile (grade level / past performance) stored in Azure, injected into prompt to adjust complexity |
| Spoken quizzes | AI-triggered Q&A flow via TTS, answers captured via STT, graded by Gemini |
| Multilingual / code-switching | Gemini handles natively — no separate translation layer |
| Student identification | Session/user ID assigned at join, tied to Azure student profile |
| Post-class summary | Transcript + logged gaps sent to Gemini after session ends → structured summary → Azure storage → dashboard view |
| Teacher control/override | Teacher-only control panel (mute AI, force response, dismiss suggestion) via Agora signaling channel |

---

## 6. Build Phases

**Phase 1 — Foundation (Agora + Gemini wiring)**
- Set up Next.js quickstart template
- Connect Agora App ID/Certificate
- Connect Gemini API key as the LLM (BYOK)
- Test: basic voice in/out working in a channel

**Phase 2 — Classroom Roles & Identity**
- Multi-party video/audio room UI (Zoom/Meet-style grid, small scale ~4-6 tiles)
- Join screen: name + role (teacher/student) selection + classroom code
- Session/user identity tagging (no full auth — see Section 4b)
- Teacher vs student view differences (control panel vs plain view)

**Phase 3 — Context & Turn-Taking Logic**
- Rolling transcript buffer per session
- Prompt engineering: role-aware, context-aware, turn-taking rules
- Silent "gap logging" vs "speak now" decision logic

**Phase 4 — Adaptive Teaching Features**
- Per-student explanation-level adjustment
- Spoken quiz flow
- Multilingual handling (test with code-switch input)

**Phase 5 — Teacher Controls**
- Mute/override/force-speak buttons
- Signaling from teacher client to AI agent

**Phase 6 — Post-Class Intelligence**
- Session-end trigger
- Gemini-generated summary (common gaps, per-student notes)
- Azure storage + dashboard display

**Phase 7 — Polish & Demo Prep**
- UI polish via Antigravity
- Record demo video showing Agora integration clearly
- Final submission

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

**Step 4: Set up the Next.js quickstart template using Kiro**, connect Agora + Gemini credentials, and get a basic working voice loop before adding any classroom logic.
