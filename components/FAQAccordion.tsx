'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const FAQS = [
  {
    question: 'How does the AI co-teacher work?',
    answer: 'SonaAI integrates directly into your live classroom session. It listens to the audio, understands the context of the lesson, and can respond to student questions or summarize topics when prompted by the teacher.'
  },
  {
    question: 'Can I mute the AI during important lectures?',
    answer: 'Absolutely. The teacher has full control over the AI. You can mute it, pause it, or ask it to only listen and generate a transcript without speaking.'
  },
  {
    question: 'Are the transcripts saved?',
    answer: 'Yes, full transcripts and intelligent summaries are generated automatically at the end of each session and can be downloaded as a PDF.'
  },
  {
    question: 'How many students can join a classroom?',
    answer: 'Currently, our platform supports up to 6 active speaking participants per classroom to ensure the highest quality voice interaction and lowest latency.'
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-28" style={{ background: '#F5F5F5' }}>
      <div className="mx-auto max-w-3xl px-6">
        <ScrollReveal animation="fade-up" className="text-center mb-12">
          <h2
            className="font-extrabold"
            style={{
              fontSize: '40px',
              lineHeight: '1.2',
              letterSpacing: '-1.488px',
              color: '#000000',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            Frequently Asked Questions
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div 
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ 
                        color: isOpen ? '#031A10' : '#333333',
                        fontFamily: 'var(--font-manrope)'
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4 flex items-center justify-center w-8 h-8 rounded-full"
                      style={{ background: isOpen ? '#031A10' : '#F5F5F5' }}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" style={{ color: '#D0FFA2' }} />
                      ) : (
                        <Plus className="w-4 h-4" style={{ color: '#031A10' }} />
                      )}
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-sm leading-relaxed" style={{ color: '#707070' }}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
