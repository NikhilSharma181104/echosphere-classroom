'use client';

import { useState, useRef, Suspense, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Loader2, VolumeX, Volume2, FileText, Sparkles } from 'lucide-react';
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

// Dynamically import the ConversationComponent with ssr disabled
const ConversationComponent = dynamic(() => import('./ConversationComponent'), {
  ssr: false,
});

// Dynamically import AgoraRTCProvider (browser-only).
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

export default function MeetingPage() {
  const router = useRouter();
  const [showConversation, setShowConversation] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [mounted, setMounted] = useState(false);

  // Preload heavy modules on mount
  useEffect(() => {
    import('agora-rtc-react').catch(() => {});
    import('agora-rtm').catch(() => {});
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agoraData, setAgoraData] = useState<AgoraTokenData | null>(null);
  const [rtmClient, setRtmClient] = useState<RTMClient | null>(null);
  const [agentJoinError, setAgentJoinError] = useState(false);
  const [isAiMuted, setIsAiMuted] = useState(false);
  const [isAiMuteLoading, setIsAiMuteLoading] = useState(false);

  // Summary flow state
  type SummaryState = 'idle' | 'requesting' | 'waiting' | 'ready' | 'error';
  const [summaryState, setSummaryState] = useState<SummaryState>('idle');
  const [summaryText, setSummaryText] = useState<string>('');
  const [summaryMode, setSummaryMode] = useState(false);
  const summaryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sessionTranscriptLog = useRef<import('@/types/conversation').TranscriptTurn[]>([]);

  // Read session from sessionStorage on mount and auto-join
  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('echosphere_meeting');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const session: UserSession = {
          name: parsed.name,
          role: parsed.role,
          classroomCode: parsed.classroomCode,
        };
        setUserSession(session);
        // Auto-join on mount
        void handleJoinInternal(session);
      } catch {
        router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTranscriptTurn = useCallback(
    (turn: import('@/types/conversation').TranscriptTurn) => {
      sessionTranscriptLog.current = [...sessionTranscriptLog.current, turn];
    },
    [],
  );

  const handleAgentId = useCallback((agentId: string) => {
    setAgoraData((prev) =>
      prev && !prev.agentId ? { ...prev, agentId } : prev,
    );
  }, []);

  const handleJoinInternal = async (session: UserSession) => {
    setIsLoading(true);
    setError(null);
    setAgentJoinError(false);

    try {
      const tokenUrl =
        session.role === 'teacher'
          ? `/api/generate-agora-token?channel=${encodeURIComponent(session.classroomCode)}&uid=${TEACHER_UID}`
          : `/api/generate-agora-token?channel=${encodeURIComponent(session.classroomCode)}&role=student`;

      const agoraResponse = await fetch(tokenUrl);
      const responseData = await agoraResponse.json();

      if (!agoraResponse.ok) {
        throw new Error(
          `Failed to generate Agora token: ${JSON.stringify(responseData)}`,
        );
      }

      let agentData: AgentResponse | null = null;

      if (session.role === 'teacher') {
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

        if (inviteResult?.agent_id && rtmResult) {
          const agentSessionMsg = JSON.stringify({
            type: 'agent_session',
            agent_id: inviteResult.agent_id,
          });
          rtmResult
            .publish(responseData.channel, agentSessionMsg)
            .catch((err) =>
              console.warn('[agent_session] RTM publish failed:', err),
            );
          rtmResult.storage
            .setChannelMetadata(
              responseData.channel,
              'MESSAGE',
              [{ key: 'agent_id', value: inviteResult.agent_id }],
              { addTimeStamp: false, addUserId: false },
            )
            .catch((err) =>
              console.warn('[agent_session] metadata write failed:', err),
            );
        }
      } else {
        const { default: AgoraRTM } = await import('agora-rtm');
        const studentRtm: RTMClient = new AgoraRTM.RTM(
          process.env.NEXT_PUBLIC_AGORA_APP_ID!,
          responseData.uid,
        );
        await studentRtm.login({ token: responseData.token });
        await studentRtm.subscribe(responseData.channel);

        try {
          const metaResponse = await studentRtm.storage.getChannelMetadata(
            responseData.channel,
            'MESSAGE',
          );
          const agentIdValue = (metaResponse.metadata as Record<string, { value: string }> | undefined)?.['agent_id']?.value;
          if (agentIdValue) {
            agentData = {
              agent_id: agentIdValue,
              create_ts: 0,
              state: 'RUNNING',
            };
          }
        } catch {
          // Metadata not yet set — agentId stays undefined
        }

        setRtmClient(studentRtm);
      }

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

  const handleSummaryTurn = useCallback((text: string) => {
    if (summaryTimeoutRef.current) {
      clearTimeout(summaryTimeoutRef.current);
      summaryTimeoutRef.current = null;
    }
    setSummaryText(text);
    setSummaryMode(false);
    setSummaryState('ready');
  }, []);

  const handleEndClassAndSummary = useCallback(async () => {
    if (!agoraData?.agentId) {
      void handleEndConversation();
      return;
    }
    setSummaryState('requesting');
    setSummaryMode(true);
    try {
      const res = await fetch('/api/inject-think', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agoraData.agentId }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setSummaryState('waiting');

      summaryTimeoutRef.current = setTimeout(() => {
        setSummaryMode(false);
        setSummaryState('error');
      }, 15000);
    } catch (err) {
      console.error('Failed to request summary:', err);
      setSummaryMode(false);
      setSummaryState('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agoraData]);

  const handleDownloadSummary = useCallback(async () => {
    if (!summaryText || !userSession) return;
    const { parseSummaryText, downloadSummaryPdf } = await import('@/lib/summary-pdf');
    const parsed = parseSummaryText(summaryText);
    await downloadSummaryPdf(parsed, userSession.classroomCode, userSession.name);
  }, [summaryText, userSession]);

  const handleDismissSummaryAndEnd = useCallback(async () => {
    setSummaryState('idle');
    setSummaryText('');
    if (summaryTimeoutRef.current) {
      clearTimeout(summaryTimeoutRef.current);
      summaryTimeoutRef.current = null;
    }
    await handleEndConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMuteAi = useCallback(async () => {
    if (!agoraData?.agentId || isAiMuteLoading) return;
    setIsAiMuteLoading(true);
    try {
      await fetch('/api/stop-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agoraData.agentId }),
      });
      setAgoraData((prev) => (prev ? { ...prev, agentId: undefined } : prev));
      setIsAiMuted(true);
    } catch (err) {
      console.error('Failed to mute AI agent:', err);
    } finally {
      setIsAiMuteLoading(false);
    }
  }, [agoraData, isAiMuteLoading]);

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

    rtmClient?.logout().catch((err) => console.error('RTM logout error:', err));
    setRtmClient(null);
    setShowConversation(false);
    sessionTranscriptLog.current = [];
    sessionStorage.removeItem('echosphere_meeting');
    router.push('/dashboard');
  };

  if (!mounted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--es-page-bg)' }}
      >
        <div className="animate-pulse-subtle text-sm" style={{ color: 'var(--es-text-muted)' }}>
          Loading…
        </div>
      </div>
    );
  }

  // Pre-join loading state
  if (!showConversation) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4"
        style={{ background: 'var(--es-page-bg)' }}
      >
        <div className="grid-pattern-subtle grid-fade-b absolute inset-0 -z-10" />
        
        <div
          className="animate-slide-up-enter flex flex-col items-center rounded-[var(--es-radius-xl)] p-8 text-center"
          style={{
            background: 'var(--es-page-bg)',
            border: '1px solid var(--es-border-subtle)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--es-radius-md)]"
            style={{ background: 'var(--es-action-primary)' }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          {isLoading ? (
            <>
              <Loader2 className="mb-3 h-6 w-6 animate-spin" style={{ color: 'var(--es-text-primary)' }} />
              <p className="text-lg font-semibold" style={{ color: 'var(--es-text-primary)' }}>
                Joining classroom…
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--es-text-muted)' }}>
                Setting up your audio and connecting to the room
              </p>
            </>
          ) : error ? (
            <>
              <p className="text-lg font-semibold" style={{ color: 'var(--es-text-primary)' }}>
                Connection Failed
              </p>
              <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>
                {error}
              </p>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="mt-4 rounded-full px-6 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--es-action-primary)' }}
              >
                Back to Dashboard
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold" style={{ color: 'var(--es-text-primary)' }}>
                Preparing classroom…
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-dvh min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="flex min-h-0 flex-1 flex-col items-stretch justify-start">
        <div className="z-10 flex min-h-0 flex-1 flex-col h-full w-full max-w-none items-stretch gap-0 px-0 text-left">
          {agoraData && rtmClient && userSession ? (
            <>
              {agentJoinError && (
                <div className="p-3 bg-destructive/10 rounded-md text-destructive text-sm max-w-sm mx-auto mt-2">
                  Failed to connect with AI agent. The conversation may not work as expected.
                </div>
              )}
              <Suspense fallback={<LoadingSkeleton />}>
                <ErrorBoundary>
                  <AgoraProvider>
                    <ConversationComponent
                      agoraData={agoraData}
                      rtmClient={rtmClient}
                      userSession={userSession}
                      teacherControls={
                        userSession.role === 'teacher' ? (
                          <>
                            <button
                              type="button"
                              onClick={isAiMuted ? handleUnmuteAi : handleMuteAi}
                              disabled={isAiMuteLoading}
                              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                              style={{
                                borderColor: isAiMuted ? 'var(--es-action-primary)' : '#f59e0b',
                                color: isAiMuted ? 'var(--es-action-primary)' : '#f59e0b',
                              }}
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
                            <button
                              type="button"
                              onClick={handleEndClassAndSummary}
                              disabled={summaryState === 'requesting' || summaryState === 'waiting'}
                              className="flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                              aria-label="End class and generate summary"
                              title="Ends the class and asks the AI to generate a structured summary"
                            >
                              {(summaryState === 'requesting' || summaryState === 'waiting') ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <FileText className="h-3 w-3" />
                              )}
                              {summaryState === 'waiting' ? 'Generating…' : 'End Class & Summary'}
                            </button>
                          </>
                        ) : undefined
                      }
                      onTranscriptTurn={handleTranscriptTurn}
                      onAgentId={handleAgentId}
                      onSummaryTurn={handleSummaryTurn}
                      summaryMode={summaryMode}
                      onTokenWillExpire={handleTokenWillExpire}
                      onEndConversation={handleEndConversation}
                    />
                  </AgoraProvider>
                </ErrorBoundary>
              </Suspense>
            </>
          ) : (
            <p className="text-sm text-muted-foreground p-4">
              Failed to load conversation data.
            </p>
          )}
        </div>
      </div>

      {/* Summary modal */}
      {userSession && userSession.role === 'teacher' && (summaryState === 'ready' || summaryState === 'error') && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Post-class summary"
        >
          <div
            className="w-full max-w-lg rounded-[var(--es-radius-xl)] p-6 space-y-4"
            style={{
              background: 'var(--es-page-bg)',
              border: '1px solid var(--es-border-subtle)',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 shrink-0" style={{ color: 'var(--es-text-primary)' }} />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--es-text-primary)' }}>
                Post-Class Summary
              </h2>
            </div>

            {summaryState === 'error' ? (
              <p className="text-sm" style={{ color: '#dc2626' }}>
                The summary timed out or failed to generate. You can still download the raw transcript or end the class.
              </p>
            ) : (
              <div
                className="max-h-64 overflow-y-auto rounded-[var(--es-radius-md)] p-3"
                style={{
                  background: 'var(--es-panel-bg-2)',
                  border: '1px solid var(--es-border-subtle)',
                }}
              >
                <pre
                  className="whitespace-pre-wrap text-xs leading-relaxed"
                  style={{ color: 'var(--es-text-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {summaryText}
                </pre>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              {summaryState === 'ready' && (
                <button
                  type="button"
                  onClick={handleDownloadSummary}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: 'var(--es-action-primary)' }}
                >
                  <FileText className="h-4 w-4" />
                  Download Summary (PDF)
                </button>
              )}
              <button
                type="button"
                onClick={handleDismissSummaryAndEnd}
                className="rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-70"
                style={{
                  color: 'var(--es-text-muted)',
                  border: '1px solid var(--es-border-subtle)',
                }}
              >
                {summaryState === 'ready' ? 'End Class' : 'End Class Anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
