import { NextRequest, NextResponse } from 'next/server';
import { AgoraClient, Area } from 'agora-agents';
import { SUMMARY_PROMPT } from '@/lib/prompts';

export interface InjectThinkRequest {
  agent_id: string;
  /** The text to inject into the agent pipeline. Defaults to SUMMARY_PROMPT if omitted. */
  text?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InjectThinkRequest = await request.json();
    const { agent_id, text } = body;

    if (!agent_id) {
      return NextResponse.json(
        { error: 'agent_id is required' },
        { status: 400 },
      );
    }

    const promptText = text?.trim() || SUMMARY_PROMPT;

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
      interruptable: true, // allow interruption for normal chat; summary sets this via prompt
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
