'use client';

import { useEffect, useMemo, useRef } from 'react';

type TranscriptMessage = {
  turn_id?: string | number;
  uid: number;
  text?: string;
  createdAt?: number;
};

export type ClassroomTranscriptPanelProps = {
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

export function ClassroomTranscriptPanel({
  messageList,
  currentInProgressMessage,
  agentUID,
}: ClassroomTranscriptPanelProps) {
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
      className="flex h-full min-h-0 w-full flex-col overflow-hidden"
      aria-label="Transcription panel"
    >
      {/* Live indicator */}
      <div className="flex shrink-0 items-center justify-between pb-3">
        <p
          className="text-xs font-medium"
          style={{
            color: 'var(--es-text-muted, #6B7280)',
            fontFamily: 'monospace',
            fontSize: '11px',
          }}
        >
          live voice turns
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Live
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-gray-400">
              Start speaking to see the live transcript here.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isAgent = String(message.uid) === agentUID;
            const label = isAgent ? 'SonaAI' : 'You';
            const text = message.text?.trim();
            const time = formatMessageTime(message.createdAt);

            const initials = isAgent ? 'AI' : 'ME';

            return (
              <article
                key={`${message.turn_id ?? message.uid}-${index}`}
                className={`flex gap-2.5 ${isAgent ? '' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isAgent ? 'bg-[#D0FFA2] text-[#031A10]' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {initials}
                </div>

                {/* Bubble */}
                <div
                  className={`flex max-w-[85%] flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                >
                  <div className="mb-1 flex items-center gap-2 px-0.5">
                    <span className="text-[11px] font-semibold text-gray-500">
                      {label}
                    </span>
                    {time && (
                      <span className="text-[10px] font-normal text-gray-400">
                        {time}
                      </span>
                    )}
                  </div>
                  <div
                    className={`whitespace-pre-wrap rounded-xl px-4 py-3 text-[15px] leading-relaxed ${
                      isAgent
                        ? 'bg-white/80 text-gray-800 border border-gray-100'
                        : 'bg-[#D0FFA2] text-[#031A10]'
                    }`}
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
