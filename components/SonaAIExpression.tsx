'use client';

import { useMemo, useState, useEffect } from 'react';

/**
 * Maps AgentVisualizerState values to SonaAI robot expression images.
 * Replaces the default blob/orb visualizer with expressive robot faces.
 */

type AgentVisualizerState =
  | 'disconnected'
  | 'joining'
  | 'not-joined'
  | 'listening'
  | 'analyzing'
  | 'talking'
  | 'ambient';

const STATE_TO_EXPRESSION: Record<AgentVisualizerState, { src: string; label: string }> = {
  'disconnected': { src: '/sonaai_confused.png', label: 'Disconnected' },
  'joining':      { src: '/sonaai_processing.png', label: 'Joining...' },
  'not-joined':   { src: '/sonaai_ready.png', label: 'Not Joined' },
  'listening':    { src: '/sonaai_listening.png', label: 'Listening' },
  'analyzing':    { src: '/sonaai_thinking.png', label: 'Thinking' },
  'talking':      { src: '/sonaai_speaking.png', label: 'Speaking' },
  'ambient':      { src: '/sonaai_idle.png', label: 'Ambient' },
};

// Preload all expression images on mount so transitions are instant
const ALL_SRCS = Object.values(STATE_TO_EXPRESSION).map(e => e.src);

export type SonaAIExpressionProps = {
  state: AgentVisualizerState;
  size?: 'sm' | 'md' | 'lg';
};

export function SonaAIExpression({ state, size = 'lg' }: SonaAIExpressionProps) {
  const expression = useMemo(() => STATE_TO_EXPRESSION[state] ?? STATE_TO_EXPRESSION['ambient'], [state]);

  // Preload all images on first render
  useEffect(() => {
    ALL_SRCS.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Crossfade: track previous and current for smooth blend
  const [displaySrc, setDisplaySrc] = useState(expression.src);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (expression.src !== displaySrc) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplaySrc(expression.src);
        setIsTransitioning(false);
      }, 200); // Half of the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [expression.src, displaySrc]);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const bgSizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-52 h-52',
  };

  // Subtle animation classes per state
  const animationClass = useMemo(() => {
    switch (state) {
      case 'talking':
        return 'animate-bounce-gentle';
      case 'listening':
        return 'animate-pulse-slow';
      case 'analyzing':
      case 'joining':
        return 'animate-pulse';
      default:
        return '';
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${animationClass}`}>
        {/* Glow ring */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            state === 'talking'
              ? 'bg-[#D0FFA2]/20 scale-110 blur-xl'
              : state === 'listening'
              ? 'bg-cyan-400/15 scale-105 blur-lg'
              : state === 'analyzing'
              ? 'bg-purple-400/15 scale-105 blur-lg'
              : 'bg-transparent scale-100'
          }`}
        />
        {/* White circular background */}
        <div className={`${bgSizeClasses[size]} rounded-xl bg-white shadow-xl flex items-center justify-center relative z-10`}>
          <img
            src={displaySrc}
            alt={`SonaAI - ${expression.label}`}
            className={`${sizeClasses[size]} object-contain drop-shadow-lg transition-opacity duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            draggable={false}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-white/70 transition-all duration-300">{expression.label}</span>
    </div>
  );
}
