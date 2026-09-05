import type { RTMClient } from 'agora-rtm';
import type { ReactNode } from 'react';

/** Lightweight session identity — no auth, just name + role + classroom. */
export type UserRole = 'teacher' | 'student';

export interface UserSession {
  name: string;
  role: UserRole;
  classroomCode: string;
}

export interface AgoraTokenData {
  token: string;
  uid: string;
  channel: string;
  agentId?: string;
}

export interface ClientStartRequest {
  requester_id: string;
  channel_name: string;
  /** Display name of the user joining the session. */
  user_name: string;
  /** Role of the user: 'teacher' or 'student'. */
  user_role: UserRole;
}

export interface StopConversationRequest {
  agent_id: string;
}

export interface AgentResponse {
  agent_id: string;
  create_ts: number;
  state: string;
}

export interface AgoraRenewalTokens {
  rtcToken: string;
  rtmToken: string;
}

/** A single attributed turn in the session log — used for the post-class summary. */
export interface TranscriptTurn {
  name: string;
  role: 'teacher' | 'student' | 'agent';
  text: string;
  timestamp: number;
}

export interface ConversationComponentProps {
  agoraData: AgoraTokenData;
  rtmClient: RTMClient;
  userSession: UserSession;
  /** Optional slot for teacher-only controls rendered in the controls dock. */
  teacherControls?: ReactNode;
  /**
   * Called whenever a turn completes (local user or agent) so the parent can
   * accumulate the session transcript log for the post-class summary.
   */
  onTranscriptTurn?: (turn: TranscriptTurn) => void;
  /**
   * Called when the AGENT produces a completed turn while summary mode is active
   * (i.e. after inject-think fires). The parent uses this text to generate the PDF.
   */
  onSummaryTurn?: (text: string) => void;
  /**
   * When true, the next completed agent turn text is forwarded to onSummaryTurn (once).
   * Set to true immediately before calling /api/inject-think.
   */
  summaryMode?: boolean;
  /**
   * Called when an agent_session RTM message is received from another participant.
   * Used by student clients to obtain the agent_id the teacher broadcast on join.
   */
  onAgentId?: (agentId: string) => void;
  onTokenWillExpire: (uid: string) => Promise<AgoraRenewalTokens>;
  onEndConversation: () => void;
}
