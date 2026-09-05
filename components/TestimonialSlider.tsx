'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "SonaAI completely changed my classroom dynamic. Students are more engaged because they can see the live transcript, and the end-of-class summaries save me hours of prep time.",
    name: "Sarah Miller",
    role: "High School Science Teacher",
    initials: "SM"
  },
  {
    id: 2,
    quote: "The low latency is incredible. It feels like having a real teaching assistant in the room. I can ask the AI to elaborate on a point, and it responds instantly.",
    name: "James Chen",
    role: "University Professor",
    initials: "JC"
  },
  {
    id: 3,
    quote: "Being able to moderate the AI and pause its responses gives me the confidence to use it with younger students. It's safe, reliable, and incredibly smart.",
    name: "Anna Kowalski",
    role: "Middle School English Teacher",
    initials: "AK"
  },
  {
    id: 4,
    quote: "The multi-participant support means my students can ask questions directly to the AI co-teacher while I facilitate the discussion. It's a game-changer.",
    name: "Robert Patel",
    role: "Online Bootcamp Instructor",
    initials: "RP"
  }
];

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = TESTIMONIALS.length - 1;
      if (nextIndex >= TESTIMONIALS.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const testimonial = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-20 md:py-28" style={{ background: '#F5F5F5' }}>
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal animation="fade-up" className="text-center mb-16">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: 'var(--es-action-primary)',
              color: 'var(--es-on-primary)',
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: 'var(--es-on-primary)' }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ letterSpacing: '0.832px' }}
            >
              Testimonials
            </span>
          </div>
          <h2
            className="font-extrabold"
            style={{
              fontSize: '48px',
              lineHeight: '1.2',
              letterSpacing: '-1.488px',
              color: '#000000',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            Loved by educators
          </h2>
        </ScrollReveal>

        <div className="relative h-[400px] sm:h-[300px] w-full flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full max-w-2xl"
            >
              <div
                className="rounded-2xl p-8 sm:p-12 text-center"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 20px 40px -20px rgba(0,0,0,0.05)'
                }}
              >
                <div className="mb-6 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-current"
                      style={{ color: '#facc15' }}
                    />
                  ))}
                </div>
                <p
                  className="mb-8 text-lg sm:text-xl leading-relaxed"
                  style={{
                    color: '#333333',
                    letterSpacing: 'normal',
                    fontFamily: 'var(--font-manrope)',
                  }}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex flex-col items-center justify-center gap-2">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                    style={{
                      background: 'var(--es-action-primary)',
                      color: 'var(--es-on-primary)',
                    }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: '#000000', fontFamily: 'var(--font-manrope)' }}
                    >
                      {testimonial.name}
                    </p>
                    <p className="text-xs" style={{ color: '#707070' }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between z-10 px-0 sm:-mx-12 pointer-events-none">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full pointer-events-auto transition-transform hover:scale-110 active:scale-95"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full pointer-events-auto transition-transform hover:scale-110 active:scale-95"
              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-6 h-6 text-black" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
