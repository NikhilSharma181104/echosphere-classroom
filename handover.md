# EchoSphere Classroom - Handover Document

Welcome! This document outlines everything you need to know to take over the development of the EchoSphere Classroom project. The repository is fully up-to-date, pushed to GitHub, and free of lockfile conflicts.

## 1. State of the Repository
- **Fully Clean & Pushed:** All features, UI tweaks, and fixes have been pushed to `main` on GitHub.
- **Package Manager:** We are strictly using `pnpm`. A clean `pnpm-lock.yaml` is committed. 

## 2. Local Setup & API Instructions

Follow these steps to get the project running locally:

### Prerequisites
Make sure you have Node.js and `pnpm` installed.

### Installation
1. **Clone the repository:**
   ```bash
   git pull origin main
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```

### Environment Variables
Create a `.env.local` file in the root directory. You will need API keys for **Agora** (for real-time video/voice) and **Supabase** (for authentication and database).

```env
# --- Agora Credentials ---
# Required: found in Agora Console → your project → "App ID"
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
# Required: found in Agora Console → your project → "App Certificate"
# Server-side only. Never expose this in client code.
NEXT_AGORA_APP_CERTIFICATE=your_agora_app_certificate

# --- Supabase Credentials ---
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the App
Start the development server:
```bash
pnpm run dev
```
Navigate to `http://localhost:3000`.

---

## 3. What We've Built So Far

### Authentication & Profiles
- Built a complete, polished Auth flow (Login, Sign Up, Reset Password) integrated with Supabase.
- Added a profile image cropping modal (`ProfileCropperModal.tsx`) for user avatars.

### Dashboards
- Implemented robust `StudentDashboard.tsx` and `TeacherDashboard.tsx` interfaces.
- Removed dummy session bypass logic to ensure the auth flow is authentic for the judges.

### SonaAI Meeting Room (Classroom)
This was heavily revamped to look premium and highly functional:
- **Layout:** Implemented a responsive 70/30 split. The video stage takes 70% and the sidebar takes 30%. The sidebar can be toggled closed to let the video stage expand to 100%. A floating arrow button allows reopening.
- **Robot Expressions:** Replaced the generic visualizer blob with a dynamic `SonaAIExpression` component. The robot avatar automatically changes expressions (Idle, Listening, Processing, Thinking, Speaking, etc.) based on the real-time AI agent state, utilizing crossfaded image transitions.
- **Controls Dock:** Replaced old controls with a sleek, Google Meet-style floating dock at the bottom of the screen.
- **Sidebar Organization:** Cleaned up the sidebar. Reordered tabs to `Transcript`, `Q&A`, `Notes`, `AI Assistant`. Blended the transcript rail into the sidebar (removed its dark container). 
- **Typography & UI Polish:** Increased the font size of the chat bubbles and predefined "Ask SonaAI" questions to improve readability. Added a pulsing green dot to the participant count for a "live" feel.

---

## 4. What You Need To Do Next (Handover Tasks)

You are taking over the **Meeting Room (Classroom) features**. Here is what's left on the docket:

1. **Wire up the Meeting Controls:** The new Google Meet-style dock looks great, but buttons like Mic Mute, Video Toggle, and Screen Share need their `onClick` handlers connected to the Agora SDK hooks.
2. **"Ask SonaAI" Integration:** In the sidebar's AI Assistant tab, there are predefined questions (e.g., "What are the key decisions?"). These need to be wired up to actually submit prompts to the agent or LLM.
3. **Dashboard to Meeting Transition:** Ensure that when a user clicks "Join Class" in the dashboard, the correct parameters (room ID, token) are passed into the `MeetingPage` component.
4. **Supabase Rules:** Make sure the RLS (Row Level Security) rules in Supabase match the queries the dashboards are making.

> **Note for AI Agents:** I have also generated an `ai-context.md` file specifically formatted for you to feed to Claude, Cursor, or whichever AI you use. It contains a strict summary of our UI patterns and current architectural state to prevent regressions.
