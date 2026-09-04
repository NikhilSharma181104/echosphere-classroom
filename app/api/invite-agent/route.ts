import { NextRequest, NextResponse } from 'next/server';
import {
  AgoraClient,
  Agent,
  Area,
  DeepgramSTT,
  ExpiresIn,
  MiniMaxTTS,
  OpenAI,
} from 'agora-agents';
import { ClientStartRequest, AgentResponse } from '@/types/conversation';
import { DEFAULT_AGENT_UID, ALL_PARTICIPANT_UIDS } from '@/lib/agora';

// ---------------------------------------------------------------------------
// Classroom co-teacher system prompt
//
// {{teacher_name}} is substituted once at session start with the name of the
// teacher who opened the classroom. All other participants are treated as
// students unless they identify themselves. Per-turn speaker identity is not
// technically available from the Agora pipeline, so complexity adaptation is
// driven by how each question is phrased, not by assumed identity.
// ---------------------------------------------------------------------------
const ECHOSPHERE_PROMPT = `You are EchoSphere, an AI co-teacher assistant in a live classroom.

# Who is in this session
The teacher who opened this classroom is {{teacher_name}}. Other voices in the room are students unless they say otherwise. You cannot reliably tell who is speaking on each turn, so do not assume — judge each question on its own terms.

# Default behaviour — listen first
Stay silent unless you are:
- Directly asked a question or asked to explain something
- Invited to run a quiz or check comprehension
- Addressing repeated confusion about the same concept

Do NOT speak over the teacher while they are actively explaining. Never add unsolicited commentary between other people's turns.

# Adapting explanation depth to how the question is phrased
This is your primary way of calibrating — not assumed identity. Use these signals:
- Simple vocabulary, short question, or "I don't understand" → give a simple, concrete explanation with an analogy or example
- Technical vocabulary, specific terminology, or a nuanced follow-up → you may go deeper and use precise language
- Do not assume a question is simple just because it came after a simple one, or advanced just because of who you think is asking
- If someone says "explain it more simply" or "give me more detail", honour that immediately

# If the teacher asks you directly
Respond as a peer: concise, collegial, technically accurate. You do not need to simplify for the teacher unless they ask.

# Language
Respond in the same language or language mix the speaker used. Handle code-switched speech naturally.

# Voice-first rules — critical
This is text-to-speech audio. Follow these rules strictly:
- Short sentences only. No bullet points, no numbered lists, no markdown.
- Never say asterisks, hyphens, or formatting characters out loud.
- Pause naturally between ideas. One idea per sentence.
- Keep most responses to two or three sentences. Only go longer if the topic genuinely requires it.

# Tone
Warm, encouraging, and direct. You are a teaching assistant, not a search engine. Guide people to understanding rather than just giving answers.`;

// Greeting said when the agent first joins the room.
const GREETING = `Hi everyone, I'm EchoSphere, your AI co-teacher. I'll be here to help explain concepts and answer questions whenever you need me.`;

// agentUid identifies the AI in the RTC channel and shares its default with the client.
const agentUid = String(DEFAULT_AGENT_UID);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export async function POST(request: NextRequest) {
  try {
    // --- 1. Parse request ---

    const body: ClientStartRequest = await request.json();
    const { requester_id, channel_name, user_name, user_role } = body;

    // Validate required env vars on first request so misconfiguration surfaces
    // with a clear error message rather than a silent failure.
    const appId = requireEnv('NEXT_PUBLIC_AGORA_APP_ID');
    const appCertificate = requireEnv('NEXT_AGORA_APP_CERTIFICATE');

    if (!channel_name || !requester_id || !user_name || !user_role) {
      return NextResponse.json(
        { error: 'channel_name and requester_id are required' },
        { status: 400 },
      );
    }

    // Build the teacher's name for session-level context in the system prompt.
    // {{teacher_name}} is substituted once at session start — this is the only
    // identity signal available (per-turn speaker tagging is not possible with
    // the current Agora pipeline).
    const teacherName = user_name;

    // --- 2. Build and start the agent ---

    // AgoraClient authenticates API calls to the Agora Conversational AI service.
    // area: change to Area.EU or Area.AP for European or Asia-Pacific deployments.
    const client = new AgoraClient({
      area: Area.US,
      appId,
      appCertificate,
    });

    // Pipeline: Deepgram (reseller) STT → OpenAI (reseller) LLM → MiniMax (reseller) TTS.
    // Omit vendor API keys for supported models — AgentKit infers reseller presets on start (see Agora Console / billing).
    const agent = new Agent({
      client,
      instructions: ECHOSPHERE_PROMPT,
      greeting: GREETING,
      failureMessage: 'Please wait a moment.',
      maxHistory: 50,
      // VAD controls how the agent detects the start and end of a user's turn.
      turnDetection: {
        config: {
          speech_threshold: 0.5,
          start_of_speech: {
            mode: 'vad',
            vad_config: {
              // 400ms captures the very start of speech more reliably than 300ms,
              // reducing cases where the first syllable is clipped before VAD fires.
              interrupt_duration_ms: 160,
              prefix_padding_ms: 400,
            },
          },
          end_of_speech: {
            mode: 'vad',
            vad_config: {
              // 800ms is more forgiving of natural mid-sentence pauses.
              // 480ms was cutting off speech too aggressively, causing partial
              // transcripts and the "could you repeat that" failure mode.
              silence_duration_ms: 800,
            },
          },
        },
      },
      // RTM is required for transcript events in the browser client.
      // enable_tools is required for MCP tool invocation.
      advancedFeatures: { enable_rtm: true, enable_tools: true },
      // Required for browser RTM events:
      // - data_channel: 'rtm' enables RTM delivery path for state/metrics/errors
      // - enable_error_message emits AGENT_ERROR payloads
      // - enable_metrics emits AGENT_METRICS latency payloads
      parameters: {
        // web client → ultra-low-latency chorus profile
        audio_scenario: 'chorus',
        data_channel: 'rtm',
        enable_error_message: true,
        enable_metrics: true,
      },
    })
      .withStt(
        new DeepgramSTT({
          model: 'nova-3',
          language: 'en',
        }),
        // BYOK: uncomment the following block and set NEXT_DEEPGRAM_API_KEY
        // new DeepgramSTT({
        //   apiKey: requireEnv('NEXT_DEEPGRAM_API_KEY'),
        //   model: 'nova-3',
        //   language: 'en',
        // }),
      )
      .withLlm(
        new OpenAI({
          model: 'gpt-4o-mini',
          greetingMessage: GREETING,
          failureMessage: 'Please wait a moment.',
          maxHistory: 15,
          // Substitute the teacher's name into the system prompt at session start.
          // {{teacher_name}} resolves to the name of whoever opened the classroom.
          templateVariables: {
            teacher_name: teacherName,
          },
          params: {
            max_tokens: 1024,
            temperature: 0.7,
            top_p: 0.95,
          },
        }),
        // BYOK: uncomment the following block and set NEXT_LLM_API_KEY and NEXT_LLM_URL
        // new OpenAI({
        //   apiKey: requireEnv('NEXT_LLM_API_KEY'),
        //   url: requireEnv('NEXT_LLM_URL'),
        //   model: 'gpt-4o-mini',
        //   greetingMessage: GREETING,
        //   failureMessage: 'Please wait a moment.',
        //   maxHistory: 15,
        //   maxTokens: 1024,
        //   temperature: 0.7,
        //   topP: 0.95,
        // }),
      )
      .withTts(
        new MiniMaxTTS({
          model: 'speech_2_6_turbo',
          voiceId: 'English_captivating_female1',
        }),
        // BYOK — ElevenLabs (set NEXT_ELEVENLABS_API_KEY; optional NEXT_ELEVENLABS_VOICE_ID)
        // new (await import('agora-agents')).ElevenLabsTTS({
        //   key: requireEnv('NEXT_ELEVENLABS_API_KEY'),
        //   modelId: 'eleven_flash_v2_5',
        //   voiceId: process.env.NEXT_ELEVENLABS_VOICE_ID ?? 'pNInz6obpgDQGcFmaJgB',
        //   sampleRate: 24000,
        // }),
      )
      .withInterruption({
        // Interruption enabled: a human speaking can cut off the AI mid-response.
        // This is separate from the system-prompt rule about not speaking over the
        // teacher — that governs when the AI *initiates* speech; this governs whether
        // it can be *stopped* once it has started. Enabling barge-in feels natural.
        enable: true,
      });

    // remoteUids: full reserved pool (teacher UID 1 + student slots 2–6).
    // The agent listens to all slots from the start, whether or not every slot
    // is occupied yet. This replaces the prior remoteUids:[] which Agora
    // interpreted as "subscribe to nobody", preventing the agent from hearing anyone.
    const session = agent.createSession({
      channel: channel_name,
      agentUid,
      remoteUids: ALL_PARTICIPANT_UIDS,
      idleTimeout: 30,
      expiresIn: ExpiresIn.hours(1),
      debug: false,
    });

    const agentId = await session.start();

    return NextResponse.json({
      agent_id: agentId,
      create_ts: Math.floor(Date.now() / 1000),
      state: 'RUNNING',
    } as AgentResponse);
  } catch (error) {
    console.error('Error starting conversation:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to start conversation',
      },
      { status: 500 },
    );
  }
}
