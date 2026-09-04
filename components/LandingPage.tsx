'use client';

import { useState, useRef, Suspense, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Loader2, VolumeX, Volume2 } from 'lucide-react';
import { TEACHER_UID } from '@/lib/agora';
import type { RTMClient } from 'agora-rtm';
import type {
  AgoraTokenData,
  ClientStartRequest,
  AgentResponse,
  AgoraRenewalTokens,
  UserSession,
} from '../types/conversation';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSkeleton } from './LoadingSkeleton';
import { JoinScreen } from './JoinScreen';

// Dynamically import the ConversationComponent with ssr disabled
const ConversationComponent = dynamic(() => import('./ConversationComponent'), {
  ssr: false,
});

// Dynamically import AgoraRTCProvider (browser-only).
// The AgoraVoiceAI toolkit is initialized inside ConversationComponent after
// the RTC join succeeds, so this wrapper only needs to provide the RTC client.
const AgoraProvider = dynamic(
  async () => {
    const { AgoraRTCProvider, default: AgoraRTC } =
      await import('agora-rtc-react');
    return {
      default: function AgoraProviders({
        children,
      }: {
        children: React.ReactNode;
      }) {
        // useRef persists across StrictMode's simulated unmount/remount, so only
        // one RTC client is ever created per session (useMemo creates two in StrictMode).
        const clientRef = useRef<ReturnType<
          typeof AgoraRTC.createClient
        > | null>(null);
        if (!clientRef.current) {
          clientRef.current = AgoraRTC.createClient({
            mode: 'rtc',
            codec: 'vp8',
          });
        }
        return (
          <AgoraRTCProvider client={clientRef.current}>
            {children}
          </AgoraRTCProvider>
        );
      },
    };
  },
  { ssr: false },
);

export default function LandingPage() {
  const [showConversation, setShowConversation] = useState(false);

  // Preload heavy modules on mount so they're already cached when the user
  // clicks "Join Classroom" — eliminates the ~1.8s dynamic-import delay.
  useEffect(() => {
    import('agora-rtc-react').catch(() => {});
    import('agora-rtm').catch(() => {});
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agoraData, setAgoraData] = useState<AgoraTokenData | null>(null);
  const [rtmClient, setRtmClient] = useState<RTMClient | null>(null);
  const [agentJoinError, setAgentJoinError] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  // Teacher-only: tracks whether the AI agent has been muted (stopped) by the teacher.
  const [isAiMuted, setIsAiMuted] = useState(false);
  const [isAiMuteLoading, setIsAiMuteLoading] = useState(false);

  const handleJoin = async (session: UserSession) => {
    setIsLoading(true);
    setError(null);
    setAgentJoinError(false);
    setUserSession(session);

    try {
      // Teacher always joins as UID 1 (fixed). Students pass ?role=student and
      // the server assigns the next available slot from the reserved pool (2–6),
      // guaranteeing each student gets a unique UID regardless of which tab joins first.
      const tokenUrl =
        session.role === 'teacher'
          ? `/api/generate-agora-token?channel=${encodeURIComponent(session.classroomCode)}&uid=${TEACHER_UID}`
          : `/api/generate-agora-token?channel=${encodeURIComponent(session.classroomCode)}&role=student`;

      // 1. Fetch RTC token, passing the classroom code as the channel name so
      //    every participant with the same code lands in the same Agora room.
      const agoraResponse = await fetch(tokenUrl);
      const responseData = await agoraResponse.json();

      if (!agoraResponse.ok) {
        throw new Error(
          `Failed to generate Agora token: ${JSON.stringify(responseData)}`,
        );
      }

      // 2. Only the teacher starts the agent session — the agent is shared by
      //    the whole classroom. Students join the existing channel directly;
      //    calling invite-agent again would start a conflicting duplicate session.
      //
      //    RTM setup runs for everyone. Agent invite runs only for teachers,
      //    in parallel with RTM so there's no extra latency for the teacher.

      let agentData: AgentResponse | null = null;

      if (session.role === 'teacher') {
        // Teacher: start agent + RTM in parallel.
        const [inviteResult, rtmResult] = await Promise.all([
          fetch('/api/invite-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requester_id: responseData.uid,
              channel_name: responseData.channel,
              user_name: session.name,
              user_role: session.role,
            } as ClientStartRequest),
          })
            .then(async (res) => {
              if (!res.ok) {
                setAgentJoinError(true);
                return null;
              }
              return res.json() as Promise<AgentResponse>;
            })
            .catch((err) => {
              console.error('Failed to start conversation with agent:', err);
              setAgentJoinError(true);
              return null;
            }),

          (async () => {
            const { default: AgoraRTM } = await import('agora-rtm');
            const rtmClient: RTMClient = new AgoraRTM.RTM(
              process.env.NEXT_PUBLIC_AGORA_APP_ID!,
              responseData.uid,
            );
            await rtmClient.login({ token: responseData.token });
            await rtmClient.subscribe(responseData.channel);
            return rtmClient;
          })(),
        ]);

        agentData = inviteResult;
        setRtmClient(rtmResult);
      } else {
        // Student: agent is already running — just set up RTM.
        const { default: AgoraRTM } = await import('agora-rtm');
        const studentRtm: RTMClient = new AgoraRTM.RTM(
          process.env.NEXT_PUBLIC_AGORA_APP_ID!,
          responseData.uid,
        );
        await studentRtm.login({ token: responseData.token });
        await studentRtm.subscribe(responseData.channel);
        setRtmClient(studentRtm);
      }

      // 3. All dependencies ready — store state and show conversation
      setAgoraData({ ...responseData, agentId: agentData?.agent_id });
      setShowConversation(true);
    } catch (err) {
      setError('Failed to join classroom. Please try again.');
      console.error('Error joining classroom:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenWillExpire = useCallback(
    async (uid: string): Promise<AgoraRenewalTokens> => {
      try {
        const channel = agoraData?.channel;
        if (!channel) {
          throw new Error('Missing channel for token renewal');
        }

        // RTC and RTM tokens are renewed independently:
        //   - RTC uses the browser client's assigned UID (passed in from ConversationComponent).
        //   - RTM uses the same UID that was used during RTM login (agoraData.uid).
        // Both are fetched in parallel to stay within the token-expiry grace-period window.
        const [rtcResponse, rtmResponse] = await Promise.all([
          fetch(`/api/generate-agora-token?channel=${channel}&uid=${uid}`),
          fetch(`/api/generate-agora-token?channel=${channel}&uid=${agoraData.uid}`),
        ]);
        const [rtcData, rtmData] = await Promise.all([
          rtcResponse.json(),
          rtmResponse.json(),
        ]);

        if (!rtcResponse.ok || !rtmResponse.ok) {
          throw new Error('Failed to generate renewal tokens');
        }

        return {
          rtcToken: rtcData.token,
          rtmToken: rtmData.token,
        };
      } catch (error) {
        console.error('Error renewing token:', error);
        throw error;
      }
    },
    [agoraData],
  );

  // Teacher-only: stops the AI agent so it won't respond until unmuted.
  // Implementation: full agent stop via /api/stop-conversation (Agora has no lighter pause).
  // Known limitation: transcript history inside the agent is lost on stop/restart.
  const handleMuteAi = useCallback(async () => {
    if (!agoraData?.agentId || isAiMuteLoading) return;
    setIsAiMuteLoading(true);
    try {
      await fetch('/api/stop-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agoraData.agentId }),
      });
      // Clear agentId so unmute knows to start fresh
      setAgoraData((prev) => (prev ? { ...prev, agentId: undefined } : prev));
      setIsAiMuted(true);
    } catch (err) {
      console.error('Failed to mute AI agent:', err);
    } finally {
      setIsAiMuteLoading(false);
    }
  }, [agoraData, isAiMuteLoading]);

  // Teacher-only: starts a fresh agent session on the same channel so AI resumes.
  const handleUnmuteAi = useCallback(async () => {
    if (!agoraData || !userSession || isAiMuteLoading) return;
    setIsAiMuteLoading(true);
    try {
      const res = await fetch('/api/invite-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_id: agoraData.uid,
          channel_name: agoraData.channel,
          user_name: userSession.name,
          user_role: userSession.role,
        } as ClientStartRequest),
      });
      if (res.ok) {
        const data = await res.json() as AgentResponse;
        setAgoraData((prev) => (prev ? { ...prev, agentId: data.agent_id } : prev));
        setIsAiMuted(false);
      } else {
        console.error('Failed to unmute AI agent:', await res.text());
      }
    } catch (err) {
      console.error('Failed to unmute AI agent:', err);
    } finally {
      setIsAiMuteLoading(false);
    }
  }, [agoraData, userSession, isAiMuteLoading]);

  const handleEndConversation = async () => {
    // Stop the AI agent
    if (agoraData?.agentId) {
      try {
        const response = await fetch('/api/stop-conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agent_id: agoraData.agentId }),
        });
        if (!response.ok) {
          console.error('Failed to stop agent:', await response.text());
        }
      } catch (error) {
        console.error('Error stopping agent:', error);
      }
    }

    // Tear down RTM — owned here since we created it here
    rtmClient?.logout().catch((err) => console.error('RTM logout error:', err));
    setRtmClient(null);
    setShowConversation(false);
  };

  return (
    <div className="relative flex h-dvh min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Hero shell: either shows the pre-call CTA or swaps in the live conversation experience. */}
      <div
        className={`flex min-h-0 flex-1 flex-col ${
          showConversation
            ? 'items-stretch justify-start'
            : 'items-center justify-center'
        }`}
      >
        <div
          className={`z-10 flex min-h-0 flex-1 flex-col ${
            showConversation
              ? 'h-full w-full max-w-none items-stretch gap-0 px-0 text-left'
              : 'w-full max-w-none items-center justify-center px-4 text-center'
          }`}
        >
          {!showConversation ? (
            <JoinScreen
              isLoading={isLoading}
              error={error}
              onJoin={handleJoin}
            />
          ) : agoraData && rtmClient && userSession ? (
            <>
              {/* Non-fatal invite warning: the browser session can still render even if agent start failed. */}
              {agentJoinError && (
                <div className="p-3 bg-destructive/10 rounded-md text-destructive text-sm max-w-sm">
                  Failed to connect with AI agent. The conversation may not work
                  as expected.
                </div>
              )}
              {/* Browser-only conversation mount: RTC provider, error boundary, and lazy-loaded call UI. */}
              <Suspense fallback={<LoadingSkeleton />}>
                <ErrorBoundary>
                  <AgoraProvider>
                    <ConversationComponent
                      agoraData={agoraData}
                      rtmClient={rtmClient}
                      userSession={userSession}
                      teacherControls={
                        userSession.role === 'teacher' ? (
                          <button
                            type="button"
                            onClick={isAiMuted ? handleUnmuteAi : handleMuteAi}
                            disabled={isAiMuteLoading}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                              isAiMuted
                                ? 'border-primary text-primary hover:bg-primary/10'
                                : 'border-amber-500 text-amber-500 hover:bg-amber-500/10'
                            }`}
                            aria-label={isAiMuted ? 'Unmute AI co-teacher' : 'Mute AI co-teacher'}
                            title={isAiMuted ? 'Resume AI responses' : 'Silence AI — stops it from responding until unmuted'}
                          >
                            {isAiMuteLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : isAiMuted ? (
                              <Volume2 className="h-3 w-3" />
                            ) : (
                              <VolumeX className="h-3 w-3" />
                            )}
                            {isAiMuted ? 'Unmute AI' : 'Mute AI'}
                          </button>
                        ) : undefined
                      }
                      onTokenWillExpire={handleTokenWillExpire}
                      onEndConversation={handleEndConversation}
                    />
                  </AgoraProvider>
                </ErrorBoundary>
              </Suspense>
            </>
          ) : (
            /* Fallback if session bootstrap partially succeeded but required state is missing. */
            <p className="text-sm text-muted-foreground">
              Failed to load conversation data.
            </p>
          )}
        </div>
      </div>

      {/* Persistent attribution footer for the pre-call and in-call views. */}
      <footer className="fixed bottom-0 right-0 z-40 py-4 pr-4 md:py-6 md:pr-6">
        <div className="flex items-center justify-end gap-2 text-muted-foreground">
          <span className="text-xs font-medium tracking-wide uppercase">
            Powered by
          </span>
          <a
            href="https://agora.io/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            aria-label="Visit Agora's website"
          >
            <Image
              src="/agora-logo-rgb-blue.svg"
              alt="Agora"
              width={86}
              height={24}
              priority
              className="h-6 w-auto hover:opacity-80 transition-opacity translate-y-1"
            />
            <span className="sr-only">Agora</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
