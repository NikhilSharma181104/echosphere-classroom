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

export interface ConversationComponentProps {
  agoraData: AgoraTokenData;
  rtmClient: RTMClient;
  userSession: UserSession;
  /** Optional slot for teacher-only controls rendered in the controls dock. */
  teacherControls?: ReactNode;
  onTokenWillExpire: (uid: string) => Promise<AgoraRenewalTokens>;
  onEndConversation: () => void;
}
