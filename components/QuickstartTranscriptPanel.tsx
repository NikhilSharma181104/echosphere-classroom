'use client';

import { useEffect, useMemo, useRef } from 'react';

type TranscriptMessage = {
  turn_id?: string | number;
  uid: number;
  text?: string;
  createdAt?: number;
};

type QuickstartTranscriptPanelProps = {
  messageList: TranscriptMessage[];
  currentInProgressMessage: TranscriptMessage | null;
  agentUID: string;
};

function formatMessageTime(createdAt?: number) {
  if (!createdAt) return null;
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt));
}

export function QuickstartTranscriptPanel({
  messageList,
  currentInProgressMessage,
  agentUID,
}: QuickstartTranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useMemo(
    () =>
      currentInProgressMessage
        ? [...messageList, currentInProgressMessage]
        : messageList,
    [currentInProgressMessage, messageList],
  );

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <section
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[var(--es-radius-lg)]"
      style={{
        background: 'var(--es-page-bg)',
        border: '1px solid var(--es-border-subtle)',
        boxShadow: 'var(--es-card-shadow)',
      }}
      aria-label="Transcription panel"
    >
      {/* Header */}
      <div
        className="flex h-14 shrink-0 items-center justify-between px-4"
        style={{ borderBottom: '1px solid var(--es-border-subtle)' }}
      >
        <div>
          <h2
            className="text-sm font-semibold"
            style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
          >
            Transcript
          </h2>
          <p
            className="text-xs"
            style={{
              color: 'var(--es-text-muted)',
              fontFamily: 'monospace',
              fontSize: '11px',
              letterSpacing: '-0.325px',
            }}
          >
            live voice turns
          </p>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full animate-pulse-subtle"
            style={{ background: '#22c55e' }}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--es-text-muted)' }}>
            Live
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm" style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}>
              Start speaking to see the live transcript here.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isAgent = String(message.uid) === agentUID;
            const label = isAgent ? 'SonaAI' : 'You';
            const text = message.text?.trim();
            const time = formatMessageTime(message.createdAt);

            // Get initials for avatar
            const initials = isAgent ? 'AI' : 'ME';

            return (
              <article
                key={`${message.turn_id ?? message.uid}-${index}`}
                className={`flex gap-2.5 ${isAgent ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{
                    background: isAgent ? 'var(--es-action-primary)' : 'var(--es-panel-bg-2)',
                    color: isAgent ? '#ffffff' : 'var(--es-text-primary)',
                  }}
                >
                  {initials}
                </div>

                {/* Bubble */}
                <div className={`flex max-w-[85%] flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
                  <div className="mb-1 flex items-center gap-2 px-0.5">
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: 'var(--es-text-muted)' }}
                    >
                      {label}
                    </span>
                    {time && (
                      <span
                        className="text-[10px] font-normal"
                        style={{ color: 'var(--es-text-muted)' }}
                      >
                        {time}
                      </span>
                    )}
                  </div>
                  <div
                    className="whitespace-pre-wrap rounded-[var(--es-radius-md)] px-3 py-2 text-[13px] leading-[20px]"
                    style={{
                      background: isAgent ? 'var(--es-panel-bg-2)' : 'var(--es-action-primary)',
                      color: isAgent ? 'var(--es-text-primary)' : '#ffffff',
                      letterSpacing: '-0.16px',
                    }}
                  >
                    {text || '…'}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
