import { NextRequest, NextResponse } from 'next/server';
import { AgoraClient, Area } from 'agora-agents';
import { SUMMARY_PROMPT } from '@/lib/prompts';

export interface InjectThinkRequest {
  agent_id: string;
  /** The text to inject into the agent pipeline. Defaults to SUMMARY_PROMPT if omitted. */
  text?: string;
  /**
   * The full compiled transcript to be prepended to the summary prompt.
   */
  transcriptLog?: string;
  /**
   * Whether the injected think can be interrupted by incoming speech.
   * Defaults to true for chat messages; pass false for summary generation so
   * a student speaking doesn't cut off the AI's summary response.
   */
  interruptable?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: InjectThinkRequest = await request.json();
    const { agent_id, text, transcriptLog, interruptable = true } = body;

    if (!agent_id) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 },
      );
    }

    const basePrompt = text?.trim() || SUMMARY_PROMPT;
    const promptText = transcriptLog 
      ? `Here is the full transcript of the class:\n\n${transcriptLog}\n\n${basePrompt}`
      : basePrompt;

    if (!promptText) {
      return NextResponse.json(
        { error: 'text must not be empty' },
        { status: 400 },
      );
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.NEXT_AGORA_APP_CERTIFICATE;
    if (!appId || !appCertificate) {
      return NextResponse.json(
        { error: 'Agora credentials are not configured' },
        { status: 500 },
      );
    }

    const client = new AgoraClient({ area: Area.US, appId, appCertificate });

    // Use the agentManagement client directly — no need to hold a full AgentSession.
    await client.agentManagement.agentThink({
      appid: appId,
      agentId: agent_id,
      text: promptText,
      // Interrupt any current state so the injected text is processed immediately.
      on_listening_action: 'interrupt',
      on_thinking_action: 'interrupt',
      on_speaking_action: 'interrupt',
      interruptable, // false for summary (prevents speech from cutting it off), true for chat
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error injecting think prompt:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to inject prompt',
      },
      { status: 500 },
    );
  }
}
