import { NextRequest, NextResponse } from 'next/server';
import { AgoraClient, Area } from 'agora-agents';

// The structured summary prompt sent to the agent at end-of-class.
// Exported so the summary flow can import it without duplicating the string.
// Headers are deliberately ALL-CAPS so the client can parse sections reliably.
export const SUMMARY_PROMPT =
  'Class is ending. Based on our conversation today, please give a structured post-class summary using EXACTLY these three section headers on their own lines: ' +
  'OVERALL SUMMARY, COMMON LEARNING GAPS, STUDENTS NEEDING SUPPORT. ' +
  'Under OVERALL SUMMARY write 2-3 sentences describing what was covered. ' +
  'Under COMMON LEARNING GAPS list the concepts multiple students seemed to struggle with. ' +
  'Under STUDENTS NEEDING SUPPORT list each student by name with a brief reason why they may need follow-up. ' +
  'If there are no gaps or no students needing support, say "None identified." ' +
  'Keep the entire response factual, concise, and based only on what was actually discussed.';

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
