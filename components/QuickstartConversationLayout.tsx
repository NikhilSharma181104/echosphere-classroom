'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles, PhoneOff } from 'lucide-react';

type QuickstartConversationLayoutProps = {
  statusPanel: ReactNode;
  pipelineMetrics: ReactNode;
  transcriptPanel: ReactNode;
  visualizer: ReactNode;
  controls: ReactNode;
  onEndConversation: () => void;
};

export function QuickstartConversationLayout({
  statusPanel,
  pipelineMetrics,
  transcriptPanel,
  visualizer,
  controls,
  onEndConversation,
}: QuickstartConversationLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col text-left">
      {/* Header */}
      <header
        className="flex shrink-0 flex-col gap-4 px-4 py-3 md:h-[64px] md:flex-row md:items-center md:justify-between md:px-6 md:py-0"
        style={{
          background: 'var(--es-page-bg)',
          borderBottom: '1px solid var(--es-border-subtle)',
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'var(--es-action-primary)' }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span
              className="text-base font-semibold tracking-tight"
              style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.32px' }}
            >
              EchoSphere
            </span>
          </Link>
          <div className="hidden sm:flex min-w-0 flex-col justify-center gap-0.5 ml-3 pl-3"
               style={{ borderLeft: '1px solid var(--es-border-subtle)' }}>
            {pipelineMetrics}
          </div>
        </div>

        <div className="flex items-center gap-2 md:pr-1">
          {statusPanel}
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: '#dc2626' }}
            onClick={onEndConversation}
            aria-label="End conversation with AI agent"
            title="End conversation"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            End
          </button>
        </div>
      </header>

      {/* Main area — two-column on desktop */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-4 px-4 pb-4 pt-4 md:px-6 lg:flex-row lg:gap-0">
        {/* Transcript sidebar */}
        <aside className="order-2 h-64 min-h-0 w-full shrink-0 lg:order-1 lg:h-full lg:w-[380px]">
          {transcriptPanel}
        </aside>

        {/* Main content: visualizer + controls */}
        <main className="order-1 flex min-h-0 flex-1 flex-col lg:order-2 lg:border-l lg:pl-6"
              style={{ borderColor: 'var(--es-border-subtle)' }}>
          <div className="flex min-h-0 flex-1 flex-col pb-2 pt-3 md:pb-6">
            {/* Visualizer area */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              {/* Subtle grid background */}
              <div className="grid-pattern-subtle absolute inset-0 rounded-[var(--es-radius-xl)] opacity-40" />
              {visualizer}
            </div>

            {/* Controls dock */}
            <div className="shrink-0 pt-4">{controls}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
