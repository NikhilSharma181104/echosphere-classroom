'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth springs for cursor position
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="tab"], [role="menuitem"]'
      );
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial={{ width: 20, height: 20, opacity: 0 }}
      animate={{
        width: isHovering ? 40 : 20,
        height: isHovering ? 40 : 20,
        backgroundColor: isHovering ? 'rgba(208, 255, 162, 0)' : 'rgba(208, 255, 162, 1)',
        border: isHovering ? '2px solid rgba(208, 255, 162, 1)' : '0px solid rgba(208, 255, 162, 0)',
        opacity: mousePosition.x > 0 ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    />
  );
}
