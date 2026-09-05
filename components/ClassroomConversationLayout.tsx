'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PhoneOff,
  MessageSquare,
} from 'lucide-react';

export type ClassroomConversationLayoutProps = {
  statusPanel: ReactNode;
  pipelineMetrics: ReactNode;
  transcriptPanel: ReactNode;
  visualizer: ReactNode;
  controls: ReactNode;
  onEndConversation: () => void;
};

export function ClassroomConversationLayout({
  statusPanel,
  pipelineMetrics,
  transcriptPanel,
  visualizer,
  controls,
  onEndConversation,
}: ClassroomConversationLayoutProps) {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="flex min-h-0 flex-1 flex-col text-left" style={{ background: 'var(--es-page-bg)' }}>
      {/* Header */}
      <header
        className="flex shrink-0 flex-col gap-4 px-4 py-3 md:h-[64px] md:flex-row md:items-center md:justify-between md:px-6 md:py-0"
        style={{
          background: 'var(--es-panel-bg)',
          borderBottom: '1px solid var(--es-border-subtle)',
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: 'var(--es-action-primary)' }}
            >
              <Sparkles className="h-4 w-4" style={{ color: 'var(--es-on-primary)' }} />
            </div>
            <span
              className="text-base font-bold tracking-tight"
              style={{
                color: 'var(--es-text-primary)',
                letterSpacing: '-0.32px',
                fontFamily: 'var(--font-manrope)',
              }}
            >
              SonaAI
            </span>
          </Link>
          <div
            className="hidden sm:flex min-w-0 flex-col justify-center gap-0.5 ml-3 pl-3"
            style={{ borderLeft: '1px solid var(--es-border-subtle)' }}
          >
            {pipelineMetrics}
          </div>
        </div>

        <div className="flex items-center gap-2 md:pr-1">
          {/* Live indicator */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ border: '1px solid var(--es-border-subtle)' }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse-subtle"
              style={{ background: '#ef4444' }}
            />
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: '#ef4444' }}
            >
              Live
            </span>
          </div>

          {statusPanel}

          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: '#dc2626',
              color: '#ffffff',
            }}
            onClick={onEndConversation}
            aria-label="End conversation with AI agent"
            title="End conversation"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            End Class
          </button>
        </div>
      </header>

      {/* Main area — participant grid + sidebar */}
      <div className="flex min-h-0 w-full flex-1">
        {/* Main content: participant grid + controls */}
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-2 pt-4 md:px-6 md:pb-4">
            {/* Participant grid — Google Meet style */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center gap-4 p-4">
              {/* Subtle grid background */}
              <div className="grid-pattern-subtle absolute inset-0 rounded-xl opacity-20" />

              {/* Participant tiles grid */}
              <div className="relative z-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Teacher / User tile */}
                <div
                  className="flex flex-col items-center justify-center rounded-2xl p-6 sm:p-8"
                  style={{
                    background: 'var(--es-panel-bg)',
                    border: '1px solid var(--es-border-subtle)',
                    minHeight: '200px',
                  }}
                >
                  {/* User avatar */}
                  <div
                    className="mb-3 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                    style={{
                      border: '3px solid var(--es-action-primary)',
                      background: 'var(--es-panel-bg-2)',
                      color: 'var(--es-text-primary)',
                    }}
                  >
                    You
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--es-text-primary)' }}
                  >
                    You
                  </p>
                  <p
                    className="text-[11px] font-medium uppercase tracking-wider mt-0.5"
                    style={{ color: 'var(--es-action-primary)' }}
                  >
                    Speaking
                  </p>
                  {/* Visualizer - mic indicator */}
                  <div className="mt-3">
                    {visualizer}
                  </div>
                </div>

                {/* SonaAI tile */}
                <div
                  className="flex flex-col items-center justify-center rounded-2xl p-6 sm:p-8"
                  style={{
                    background: 'var(--es-panel-bg)',
                    border: '1px solid var(--es-border-subtle)',
                    minHeight: '200px',
                  }}
                >
                  {/* AI avatar */}
                  <div className="relative mb-3">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                      style={{
                        border: '3px solid var(--es-action-primary)',
                        background: 'var(--es-action-primary)',
                        color: 'var(--es-on-primary)',
                      }}
                    >
                      S
                    </div>
                    {/* AI label */}
                    <span
                      className="absolute -top-1 -right-2 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={{
                        background: 'var(--es-panel-bg-2)',
                        color: 'var(--es-text-muted)',
                        border: '1px solid var(--es-border-subtle)',
                      }}
                    >
                      AI
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--es-text-primary)' }}
                  >
                    SonaAI
                  </p>
                  <p
                    className="text-[11px] font-medium uppercase tracking-wider mt-0.5"
                    style={{ color: 'var(--es-action-primary)' }}
                  >
                    Listening
                  </p>
                  {/* Audio bars animation */}
                  <div className="mt-3 flex items-end gap-0.5 h-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full"
                        style={{
                          background: 'var(--es-action-primary)',
                          height: `${8 + (i % 3) * 6}px`,
                          animation: `pulse-subtle ${1 + i * 0.2}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom control bar — Google Meet style */}
          <div
            className="shrink-0 flex items-center justify-center gap-3 px-4 py-3 md:px-6"
            style={{
              background: 'var(--es-panel-bg)',
              borderTop: '1px solid var(--es-border-subtle)',
            }}
          >
            {/* Controls from ConversationComponent */}
            <div className="flex items-center gap-3">
              {controls}
            </div>

            {/* Separator */}
            <div className="hidden md:block h-8 w-px mx-2" style={{ background: 'var(--es-border-subtle)' }} />

            {/* Chat toggle */}
            <button
              type="button"
              onClick={() => setChatOpen(!chatOpen)}
              className={`meeting-control-btn ${chatOpen ? 'active' : ''}`}
              aria-label="Toggle chat sidebar"
              title="Toggle transcript"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </main>

        {/* Toggleable Chat/Transcript sidebar */}
        {chatOpen && (
          <aside
            className="chat-sidebar-enter hidden w-[380px] shrink-0 flex-col border-l lg:flex"
            style={{
              borderColor: 'var(--es-border-subtle)',
              background: 'var(--es-page-bg)',
            }}
          >
            {transcriptPanel}
          </aside>
        )}
      </div>

      {/* Mobile transcript (shown below on small screens) */}
      <div className="lg:hidden px-4 pb-4">
        <div className="h-64 min-h-0 w-full">
          {transcriptPanel}
        </div>
      </div>
    </div>
  );
}
