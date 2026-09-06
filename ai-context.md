# AI Context & Memory Document

**Attention AI Agent:** Please read this document carefully before making changes to the EchoSphere Classroom repository. It contains the architectural decisions, UI patterns, and component structures we have built so far. Respect these patterns to avoid regressions.

## 1. Project Architecture
- **Framework:** Next.js (App Router), React, TypeScript.
- **Styling:** TailwindCSS, utilizing a specific color palette defined via arbitrary values (e.g., `#031A10` for dark forest, `#D0FFA2` for lime accents) and CSS variables in `app/globals.css`.
- **Database/Auth:** Supabase.
- **RTC/RTM:** Agora (Voice AI, transcript, pub/sub).

## 2. Component Map (Meeting Room)

The Meeting Room UI is primarily orchestrated by three key files:

1. `components/ClassroomConversationLayout.tsx`
   - **Responsibility:** The visual shell. Contains the header, the floating dock controls, the sidebar, and the flex layout.
   - **Key State:** 
     - `isSidebarOpen`: Controls the 70/30 layout split. If false, the main video area expands to 100% and a floating `ChevronLeft` button appears to reopen it.
     - `activeTab`: Controls which sidebar tab is shown (`transcript`, `qa`, `notes`, `ai`).
   - **Design Guidelines:** Do not change the layout button to a toggle. We explicitly removed the toggle from the top-header "Layout" button. The sidebar is toggled via an `X` button in the tabs header and a floating arrow.

2. `components/ClassroomTranscriptPanel.tsx`
   - **Responsibility:** Renders the actual chat messages (user and AI).
   - **Design Guidelines:** The transcript panel was intentionally stripped of its dark container styling so that it seamlessly blends into the sidebar's glassmorphism background. Do not re-add a standalone container background to it. Chat bubbles use `text-[15px]` for readability.

3. `components/SonaAIExpression.tsx`
   - **Responsibility:** Visualizes the AI agent's current state. 
   - **Behavior:** It receives an `agentState` prop (`"connecting" | "connected" | "listening" | "thinking" | "speaking" | "error"`). It maps these to explicit PNG images (e.g., `sonaai_listening.png`, `sonaai_thinking.png`). 
   - **Animation:** It uses a crossfading dual-image `AnimatePresence` setup with a `rounded-[12px]` square background. Do not revert this to a blob or circle.

## 3. Pending Implementation Tasks (For You)

When instructed to work on the meeting room features, focus on:

- **Dock Controls:** The buttons in `ClassroomConversationLayout` (Mic, Camera, Screen Share, End Call) are currently visual placeholders. They need to be linked to the Agora RTC hooks (e.g., `useLocalMicrophoneTrack`, `usePublish`). *Do not break the `isReady` StrictMode guard pattern detailed in `AGENTS.md` when implementing these.*
- **Predefined Prompts:** In the sidebar's "AI Assistant" tab, there are buttons for "What are the key decisions?" etc. Wire these to trigger a message send to the AI agent.
- **Dashboard Wiring:** Ensure that clicking a class in `StudentDashboard` or `TeacherDashboard` correctly mounts the `MeetingPage` with the appropriate Agora `uid` and `channel`.

## 4. Golden Rules
1. **Never use generic colors.** Stick to the `#031A10` and `#D0FFA2` color scheme. 
2. **Never break the 70/30 split.** The flexbox layout in `ClassroomConversationLayout` relies on `w-[30%] shrink-0` for the sidebar and `flex-1` for the main stage. 
3. **Always read `AGENTS.md`.** It contains strict instructions on Agora hook ownership and component lifecycle.
