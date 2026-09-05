'use client';

import type { ReactNode, CSSProperties } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'blur-in';

const animationClassMap: Record<AnimationType, string> = {
  'fade-up': 'scroll-reveal',
  'fade-down': 'scroll-reveal',
  'slide-left': 'scroll-reveal-left',
  'slide-right': 'scroll-reveal-right',
  'scale-in': 'scroll-reveal-scale',
  'blur-in': 'scroll-reveal-blur',
};

type ScrollRevealProps = {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer';
  style?: CSSProperties;
};

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
  style,
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>({ threshold });

  const animClass = animationClassMap[animation];

  return (
    <Tag
      ref={ref}
      className={`${animClass} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
