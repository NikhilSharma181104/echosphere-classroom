'use client';

import type { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'blur-in';

type ElementType = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'span' | 'p';

type ScrollRevealProps = {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
};

// Map to pre-created motion components
const motionElements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  header: motion.header,
  footer: motion.footer,
  span: motion.span,
  p: motion.p,
};

const getVariants = (type: AnimationType) => {
  switch (type) {
    case 'fade-up':
      return {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-down':
      return {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0 },
      };
    case 'slide-left':
      return {
        hidden: { opacity: 0, x: -48 },
        visible: { opacity: 1, x: 0 },
      };
    case 'slide-right':
      return {
        hidden: { opacity: 0, x: 48 },
        visible: { opacity: 1, x: 0 },
      };
    case 'scale-in':
      return {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
      };
    case 'blur-in':
      return {
        hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      };
    default:
      return {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      };
  }
};

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  className = '',
  as = 'div',
  style,
}: ScrollRevealProps) {
  const MotionTag = motionElements[as] || motion.div;
  const variants = getVariants(animation);

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: `0px 0px -${threshold * 100}% 0px` }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: delay / 1000,
      }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
