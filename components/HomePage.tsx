'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScrollReveal } from './ScrollReveal';
import {
  Mic,
  Users,
  Zap,
  Brain,
  Shield,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FilterableGrid } from './FilterableGrid';
import { FAQAccordion } from './FAQAccordion';
import { TestimonialSlider } from './TestimonialSlider';

/* ─────────────────────────────────────────────────────────────
   Floating pill-shaped dark nav (like reference images)
   ───────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3">
      <nav
        className={`w-full max-w-5xl rounded-[18px] px-6 transition-all duration-300 ${
          scrolled ? 'py-2.5' : 'py-3'
        }`}
        style={{
          background: 'rgba(3, 26, 16, 0.92)',
          backdropFilter: 'blur(17px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(17px) saturate(1.2)',
          border: '1px solid var(--es-border-subtle)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/SonaAI%20icon1.png" alt="SonaAI Logo" className="h-8 w-8 object-contain bg-white p-1" style={{ borderRadius: '12px' }} />
            <span
              className="text-base font-bold tracking-tight"
              style={{
                color: '#FFFFFF',
                letterSpacing: '-0.32px',
                fontFamily: 'var(--font-manrope)',
              }}
            >
              SonaAI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-7 md:flex">
            {[
              { label: 'Home', href: '/', active: true },
              { label: 'Features', href: '#features', active: false },
              { label: 'How It Works', href: '#how-it-works', active: false },
              { label: 'Testimonials', href: '#testimonials', active: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-xs font-normal transition-colors duration-200 hover:text-white"
                style={{
                  color: item.active ? 'var(--es-action-primary)' : '#B2B2B2',
                  fontFamily: 'sans-serif',
                  letterSpacing: 'normal',
                }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <motion.a
              href="/auth"
              className="rounded-full px-5 py-2 text-sm font-bold"
              whileHover={{ scale: 1.05, backgroundColor: '#bdec8a' }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'var(--es-action-primary)',
                color: 'var(--es-on-primary)',
                letterSpacing: '-0.16px',
              }}
            >
              Get Started
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg md:hidden"
            style={{ border: '1px solid var(--es-border-subtle)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1">
              <span
                className={`block h-0.5 w-3.5 rounded-full transition-transform duration-200 ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`}
                style={{ background: '#FFFFFF' }}
              />
              <span
                className={`block h-0.5 w-3.5 rounded-full transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
                style={{ background: '#FFFFFF' }}
              />
              <span
                className={`block h-0.5 w-3.5 rounded-full transition-transform duration-200 ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`}
                style={{ background: '#FFFFFF' }}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="mt-3 border-t pt-3"
            style={{ borderColor: 'var(--es-border-subtle)' }}
          >
            <div className="flex flex-col gap-3 pb-2">
              {['Features', 'How It Works', 'Testimonials'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium py-1"
                  style={{ color: '#B2B2B2' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                href="/auth"
                className="mt-1 rounded-full px-5 py-2.5 text-center text-sm font-bold"
                style={{
                  background: 'var(--es-action-primary)',
                  color: 'var(--es-on-primary)',
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature card — white card on light bg
   (dark text, lime icon badge)
   ───────────────────────────────────────────────────────────── */


function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="group rounded-xl p-6"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
        style={{ background: 'var(--es-action-primary)' }}
      >
        <Icon className="h-5 w-5" style={{ color: 'var(--es-on-primary)' }} />
      </div>
      <h3
        className="mb-2 text-lg font-semibold"
        style={{
          color: '#000000',
          letterSpacing: '-0.324px',
          fontFamily: 'var(--font-manrope)',
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: '#707070', letterSpacing: 'normal' }}
      >
        {description}
      </p>
      <Link href="/features" className="mt-4 flex items-center justify-between group-hover:cursor-pointer">
        <span className="text-xs font-medium transition-colors" style={{ color: '#707070' }}>
          Learn more
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors group-hover:bg-black/5">
          <ArrowUpRight className="h-4 w-4" style={{ color: '#000000' }} />
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step component for How It Works (light section)
   ───────────────────────────────────────────────────────────── */
function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold"
        style={{
          background: 'var(--es-action-primary)',
          color: 'var(--es-on-primary)',
        }}
      >
        {number}
      </div>
      <h3
        className="mb-2 text-lg font-semibold"
        style={{
          color: '#000000',
          letterSpacing: '-0.324px',
          fontFamily: 'var(--font-manrope)',
        }}
      >
        {title}
      </h3>
      <p
        className="max-w-xs text-sm leading-relaxed"
        style={{ color: '#707070', letterSpacing: 'normal' }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section Badge Pill (lime badge)
   ───────────────────────────────────────────────────────────── */
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
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
        {children}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main HomePage
   
   Section coloring per DESIGN.md + user instructions:
   ─ Hero:          dark forest (#031A10)
   ─ Stats:         off-white (#F5F5F5)
   ─ Features:      off-white (#F5F5F5) with white cards
   ─ How It Works:  white (#FFFFFF)
   ─ Testimonials:  off-white (#F5F5F5) with white cards
   ─ CTA:           white (#FFFFFF)
   ─ Footer:        dark forest (#031A10)
   ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000); // Reset after 3s
  };

  return (
    <div>
      <Navbar />

      {/* ── HERO SECTION — dark forest bg ── */}
      <section
        className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
        style={{ background: '#031A10', color: '#FFFFFF' }}
      >
        {/* Grid pattern background */}
        <div className="grid-pattern-white grid-fade-b absolute inset-0 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-16">
            {/* Left text column */}
            <div className="flex-1 text-left">
              {/* Badge */}
              <div className="animate-fade-up mb-6">
                <SectionBadge>AI-Powered Classroom</SectionBadge>
              </div>

              {/* Headline */}
              <h1
                className="animate-fade-up animate-fade-up-d1 max-w-lg font-extrabold"
                style={{
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  lineHeight: '1.05',
                  letterSpacing: '-1.52px',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-manrope)',
                }}
              >
                The Future of
                <br />
                Classroom Learning
              </h1>

              {/* Subheading */}
              <p
                className="animate-fade-up animate-fade-up-d2 mt-6 max-w-md text-base md:text-lg"
                style={{
                  color: '#B2B2B2',
                  lineHeight: '1.6',
                  letterSpacing: 'normal',
                }}
              >
                SonaAI brings an AI co-teacher into every live classroom.
                Real-time voice transcripts, intelligent responses, and seamless
                collaboration — all in one place.
              </p>

              {/* CTAs */}
              <div className="animate-fade-up animate-fade-up-d3 mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold"
                  whileHover={{ scale: 1.05, backgroundColor: '#bdec8a' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'var(--es-action-primary)',
                    color: 'var(--es-on-primary)',
                    letterSpacing: '-0.16px',
                  }}
                >
                  Start Teaching
                  <ArrowRight className="h-4 w-4" />
                </motion.a>
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 text-base font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    color: '#FFFFFF',
                    border: '1px solid #264348',
                    letterSpacing: '-0.16px',
                    background: 'transparent',
                  }}
                >
                  Join as Student
                </Link>
              </div>

            </div>

            {/* Right visual — image */}
            <div className="hidden flex-1 md:block">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid #264348',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
              >
                <img src="/Hero-section.png" alt="Hero Interface" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>

          {/* Scroll to explore */}
          <div className="mt-12 flex flex-col items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse-subtle"
              style={{ background: 'var(--es-action-primary)' }}
            />
            <span className="text-xs" style={{ color: '#707070' }}>
              Scroll to Explore
            </span>
            <div
              className="flex h-8 w-5 items-start justify-center rounded-full pt-1.5"
              style={{ border: '1.5px solid #264348' }}
            >
              <div
                className="h-1.5 w-1 rounded-full animate-scroll-bounce"
                style={{ background: '#707070' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section — off-white bg, white cards ── */}
      <section id="features" className="py-20 md:py-28" style={{ background: '#F5F5F5' }}>
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-14">
            <SectionBadge>Features</SectionBadge>
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
              Everything you need for
              <br />
              smarter classrooms
            </h2>
            <p
              className="mt-4 mx-auto max-w-lg text-base"
              style={{ color: '#707070' }}
            >
              Choose a learning track tailored to your goals and interests
            </p>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal animation="fade-up" delay={0}>
              <FeatureCard
                icon={Mic}
                title="Live Voice AI"
                description="An AI co-teacher that listens, understands context, and responds naturally in real-time during live sessions."
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <FeatureCard
                icon={MessageSquare}
                title="Real-Time Transcription"
                description="Every word captured and attributed. Students and teachers see a live transcript scrolling alongside the lesson."
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <FeatureCard
                icon={Users}
                title="Multi-Participant Rooms"
                description="Up to 6 participants per classroom with role-based controls. Teachers lead, students engage, AI assists."
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <FeatureCard
                icon={Brain}
                title="Intelligent Summaries"
                description="End-of-class summaries generated automatically from the full session transcript, downloadable as PDF."
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <FeatureCard
                icon={Zap}
                title="Ultra-Low Latency"
                description="Built on Agora's real-time infrastructure. Sub-50ms audio latency ensures natural, uninterrupted conversation flow."
              />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300}>
              <FeatureCard
                icon={Shield}
                title="Teacher Controls"
                description="Mute the AI, moderate conversations, control classroom flow. Teachers stay in charge at every moment."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── How It Works — white bg ── */}
      <section id="how-it-works" className="py-20 md:py-28" style={{ background: '#FFFFFF' }}>
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-16">
            <SectionBadge>How It Works</SectionBadge>
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
              Three steps to a smarter classroom
            </h2>
          </ScrollReveal>

          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Connecting line (desktop only) */}
            <div
              className="absolute top-7 left-[20%] right-[20%] hidden h-[1px] md:block"
              style={{ background: 'rgba(0,0,0,0.1)' }}
            />

            <ScrollReveal animation="scale-in" delay={0}>
              <StepCard
                number={1}
                title="Create a Room"
                description="Teachers generate a unique classroom code instantly. Share it with students via any channel."
              />
            </ScrollReveal>
            <ScrollReveal animation="scale-in" delay={150}>
              <StepCard
                number={2}
                title="Students Join"
                description="Students enter the 6-character code and join the live session. No downloads, no sign-ups required."
              />
            </ScrollReveal>
            <ScrollReveal animation="scale-in" delay={300}>
              <StepCard
                number={3}
                title="Learn Together"
                description="AI listens, transcribes, and assists. Teachers can mute AI, type questions, and generate summaries."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <FAQAccordion />
      <TestimonialSlider />

      {/* ── CTA Section — white bg ── */}
      <ScrollReveal animation="blur-in" as="section">
        <div className="py-20 md:py-28" style={{ background: '#FFFFFF' }}>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2
              className="mb-4 font-extrabold"
              style={{
                fontSize: '48px',
                lineHeight: '1.2',
                letterSpacing: '-1.488px',
                color: '#000000',
                fontFamily: 'var(--font-manrope)',
              }}
            >
              Ready to transform your classroom?
            </h2>
            <p
              className="mb-8 text-lg"
              style={{ color: '#707070', letterSpacing: 'normal' }}
            >
              Get started in under 30 seconds. No credit card required.
            </p>
            <motion.a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-bold"
              whileHover={{ scale: 1.05, backgroundColor: '#bdec8a' }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'var(--es-action-primary)',
                color: 'var(--es-on-primary)',
                letterSpacing: '-0.16px',
              }}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Footer — dark forest bg ── */}
      <footer style={{ background: '#031A10' }}>
        {/* Top divider */}
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(to right, transparent, #264348, transparent)' }}
        />

        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex flex-col gap-12 md:flex-row md:justify-between">
            {/* Logo + tagline + newsletter */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/SonaAI%20icon1.png" alt="SonaAI Logo" className="h-10 w-10 object-contain bg-white p-1" style={{ borderRadius: '12px' }} />
                <span
                  className="text-xl font-bold"
                  style={{
                    color: '#FFFFFF',
                    letterSpacing: '-0.32px',
                    fontFamily: 'var(--font-manrope)',
                  }}
                >
                  SonaAI
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: '#707070' }}
              >
                Empowering education through AI-powered live classrooms. Join thousands of educators teaching with confidence.
              </p>

              {/* Newsletter */}
              <form
                onSubmit={handleSubscribe}
                className="flex rounded-lg overflow-hidden"
                style={{ border: '1px solid #264348' }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
                  style={{ color: '#FFFFFF' }}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    background: subscribed ? '#4ade80' : 'var(--es-action-primary)',
                    color: subscribed ? '#000000' : 'var(--es-on-primary)',
                  }}
                >
                  {subscribed ? 'Subscribed!' : 'Subscribe'}
                </button>
              </form>
            </div>

            {/* Link columns */}
            <div className="flex flex-wrap gap-16">
              <div>
                <h4
                  className="mb-4 text-sm font-semibold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-manrope)',
                  }}
                >
                  Quick Links
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'Features', href: '#features' },
                    { name: 'How It Works', href: '#how-it-works' },
                    { name: 'Pricing', href: '/pricing' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm transition-colors duration-200 hover:text-white"
                        style={{ color: '#707070' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4
                  className="mb-4 text-sm font-semibold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-manrope)',
                  }}
                >
                  Authentication
                </h4>
                <ul className="space-y-2.5">
                  {['Login', 'Sign Up'].map((item) => (
                    <li key={item}>
                      <Link
                        href="/auth"
                        className="text-sm transition-colors duration-200 hover:text-white"
                        style={{ color: '#707070' }}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4
                  className="mb-4 text-sm font-semibold"
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-manrope)',
                  }}
                >
                  Other Pages
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { name: 'Contact', href: '/contact' },
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Blog', href: '/blog' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm transition-colors duration-200 hover:text-white"
                        style={{ color: '#707070' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
            style={{ borderColor: '#264348' }}
          >
            <p className="text-xs" style={{ color: '#707070' }}>
              &copy; {new Date().getFullYear()} SonaAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Facebook', 'Instagram', 'LinkedIn', 'X (Twitter)'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs transition-colors duration-200 hover:text-white"
                  style={{ color: '#707070' }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
