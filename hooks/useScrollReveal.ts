'use client';

import { useEffect, useRef, useCallback } from 'react';

type UseScrollRevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Adds `.is-visible` when the element scrolls into view.
 * Respects prefers-reduced-motion by making elements visible immediately.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const ref = useRef<T>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('is-visible');
        }
      }
    },
    [once],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion — show everything immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, threshold, rootMargin]);

  return ref;
}

/**
 * Observes multiple children of a container.
 * Each child with a `.scroll-reveal` (or variant) class gets `.is-visible` independently.
 */
export function useScrollRevealChildren(
  options: UseScrollRevealOptions = {},
) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = container.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-blur',
    );

    if (reducedMotion) {
      targets.forEach((t) => t.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        }
      },
      { threshold, rootMargin },
    );

    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return containerRef;
}
