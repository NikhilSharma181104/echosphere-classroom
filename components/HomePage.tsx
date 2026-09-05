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
  ChevronRight,
  Sparkles,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Sticky frosted-glass nav with scroll-aware shadow
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
    <nav
      className={`nav-glass fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'nav-glass-scrolled' : ''}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
               style={{ background: 'var(--es-action-primary)' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.32px' }}
          >
            EchoSphere
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {['Features', 'How It Works', 'Testimonials'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--es-text-secondary)', letterSpacing: '-0.16px' }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth"
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'var(--es-action-primary)',
              letterSpacing: '-0.32px',
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
          style={{ border: '1px solid var(--es-border-subtle)' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1">
            <span
              className={`block h-0.5 w-4 rounded-full transition-transform duration-200 ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`}
              style={{ background: 'var(--es-text-primary)' }}
            />
            <span
              className={`block h-0.5 w-4 rounded-full transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
              style={{ background: 'var(--es-text-primary)' }}
            />
            <span
              className={`block h-0.5 w-4 rounded-full transition-transform duration-200 ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`}
              style={{ background: 'var(--es-text-primary)' }}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t px-6 pb-4 pt-3 md:hidden" style={{ borderColor: 'var(--es-border-subtle)' }}>
          <div className="flex flex-col gap-3">
            {['Features', 'How It Works', 'Testimonials'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium py-1"
                style={{ color: 'var(--es-text-secondary)' }}
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link
              href="/auth"
              className="mt-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
              style={{ background: 'var(--es-action-primary)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature card component
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
    <div
      className="group rounded-[var(--es-radius-lg)] p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        border: '1px solid var(--es-border-subtle)',
        boxShadow: 'var(--es-card-shadow)',
        background: 'var(--es-page-bg)',
      }}
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--es-radius-sm)] transition-colors duration-300 group-hover:scale-105"
        style={{ background: 'var(--es-panel-bg-2)' }}
      >
        <Icon className="h-5 w-5" style={{ color: 'var(--es-text-primary)' }} />
      </div>
      <h3
        className="mb-2 text-lg font-semibold"
        style={{
          color: 'var(--es-text-primary)',
          letterSpacing: '-0.16px',
          lineHeight: '24.75px',
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--es-text-secondary)', letterSpacing: '-0.16px' }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step component for How It Works
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
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white"
        style={{ background: 'var(--es-action-primary)' }}
      >
        {number}
      </div>
      <h3
        className="mb-2 text-lg font-semibold"
        style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
      >
        {title}
      </h3>
      <p
        className="max-w-xs text-sm leading-relaxed"
        style={{ color: 'var(--es-text-secondary)', letterSpacing: '-0.16px' }}
      >
        {description}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Testimonial card
   ───────────────────────────────────────────────────────────── */
function TestimonialCard({
  quote,
  name,
  role,
  initials,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
}) {
  return (
    <div
      className="rounded-[var(--es-radius-lg)] p-6"
      style={{
        border: '1px solid var(--es-border-subtle)',
        boxShadow: 'var(--es-card-shadow)',
        background: 'var(--es-page-bg)',
      }}
    >
      <p
        className="mb-5 text-base leading-7 italic"
        style={{ color: 'var(--es-text-secondary)', letterSpacing: '-0.16px' }}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ background: 'var(--es-action-primary)' }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--es-text-primary)' }}>
            {name}
          </p>
          <p className="text-xs" style={{ color: 'var(--es-text-muted)' }}>
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Animated stat counter
   ───────────────────────────────────────────────────────────── */
function StatCounter({
  value,
  label,
  suffix = '',
}: {
  value: string;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center px-6">
      <span
        className="text-4xl font-bold tracking-tight md:text-5xl"
        style={{ color: 'var(--es-text-primary)', letterSpacing: '-2px' }}
      >
        {value}
        {suffix}
      </span>
      <span className="mt-1 text-sm" style={{ color: 'var(--es-text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main HomePage
   ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: 'var(--es-page-bg)', color: 'var(--es-text-primary)' }}>
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        {/* Grid pattern background */}
        <div className="grid-pattern-subtle grid-fade-b absolute inset-0 -z-10" />

        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
               style={{ border: '1px solid var(--es-border-subtle)', background: 'var(--es-panel-bg)' }}>
            <span
              className="text-[10.4px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--es-text-secondary)', letterSpacing: '0.832px' }}
            >
              Built for AI-powered classrooms
            </span>
            <ChevronRight className="h-3 w-3" style={{ color: 'var(--es-text-muted)' }} />
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up animate-fade-up-d1 mx-auto max-w-4xl font-bold"
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              lineHeight: '0.95',
              letterSpacing: '-4px',
              color: 'var(--es-text-primary)',
            }}
          >
            The Future of
            <br />
            Classroom Learning
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-up animate-fade-up-d2 mx-auto mt-6 max-w-2xl text-lg md:text-xl"
            style={{
              color: 'var(--es-text-secondary)',
              lineHeight: '27px',
              letterSpacing: '-0.4px',
            }}
          >
            EchoSphere brings an AI co-teacher into every live classroom.
            Real-time voice transcripts, intelligent responses, and seamless
            collaboration — all in one place.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up animate-fade-up-d3 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: 'var(--es-action-primary)',
                letterSpacing: '-0.32px',
              }}
            >
              Start Teaching
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                color: 'var(--es-text-primary)',
                border: '1px solid var(--es-border-subtle)',
                letterSpacing: '-0.32px',
              }}
            >
              Join as Student
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <ScrollReveal animation="fade-up" as="section" className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div
            className="flex flex-col items-center justify-center gap-8 rounded-[var(--es-radius-2xl)] py-10 sm:flex-row sm:gap-0 sm:divide-x"
            style={{
              background: 'var(--es-panel-bg)',
              border: '1px solid var(--es-border-subtle)',
              boxShadow: 'var(--es-card-shadow)',
            }}
          >
            <StatCounter value="50ms" label="Latency" />
            <StatCounter value="99.9" label="Uptime" suffix="%" />
            <StatCounter value="10K" label="Classrooms" suffix="+" />
          </div>
        </div>
      </ScrollReveal>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-14">
            <span
              className="mb-3 inline-block text-[10.4px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--es-text-muted)', letterSpacing: '0.832px' }}
            >
              Features
            </span>
            <h2
              className="font-bold"
              style={{
                fontSize: '36px',
                lineHeight: '39.6px',
                letterSpacing: '-1.44px',
                color: 'var(--es-text-primary)',
              }}
            >
              Everything you need for
              <br />
              smarter classrooms
            </h2>
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

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="py-20 md:py-28"
        style={{ background: 'var(--es-panel-bg)' }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-16">
            <span
              className="mb-3 inline-block text-[10.4px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--es-text-muted)', letterSpacing: '0.832px' }}
            >
              How It Works
            </span>
            <h2
              className="font-bold"
              style={{
                fontSize: '36px',
                lineHeight: '39.6px',
                letterSpacing: '-1.44px',
                color: 'var(--es-text-primary)',
              }}
            >
              Three steps to a smarter classroom
            </h2>
          </ScrollReveal>

          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Connecting line (desktop only) */}
            <div
              className="absolute top-7 left-[20%] right-[20%] hidden h-[1px] md:block"
              style={{ background: 'var(--es-border-subtle)' }}
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

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-14">
            <span
              className="mb-3 inline-block text-[10.4px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--es-text-muted)', letterSpacing: '0.832px' }}
            >
              Testimonials
            </span>
            <h2
              className="font-bold"
              style={{
                fontSize: '36px',
                lineHeight: '39.6px',
                letterSpacing: '-1.44px',
                color: 'var(--es-text-primary)',
              }}
            >
              Loved by educators
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal animation="slide-left" delay={0}>
              <TestimonialCard
                quote="EchoSphere transformed how I run my physics lectures. The AI picks up on student questions I might miss, and the end-of-class summary saves me hours of note-taking."
                name="Dr. Sarah Mitchell"
                role="Physics Professor, Stanford"
                initials="SM"
              />
            </ScrollReveal>
            <ScrollReveal animation="slide-right" delay={100}>
              <TestimonialCard
                quote="As a student, the real-time transcript is a game-changer. I can focus on understanding concepts instead of frantically taking notes. The AI even answers follow-up questions."
                name="James Chen"
                role="Graduate Student, MIT"
                initials="JC"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <ScrollReveal animation="blur-in" as="section">
        <div
          className="py-20 md:py-28"
          style={{ background: 'var(--es-panel-bg-2)' }}
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2
              className="mb-4 font-bold"
              style={{
                fontSize: '36px',
                lineHeight: '39.6px',
                letterSpacing: '-1.44px',
                color: 'var(--es-text-primary)',
              }}
            >
              Ready to transform your classroom?
            </h2>
            <p
              className="mb-8 text-lg"
              style={{ color: 'var(--es-text-secondary)', letterSpacing: '-0.4px' }}
            >
              Get started in under 30 seconds. No credit card required.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              style={{
                background: 'var(--es-action-primary)',
                letterSpacing: '-0.32px',
              }}
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--es-footer-bg)' }}>
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Logo + tagline */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{ background: 'var(--es-action-primary)' }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span
                  className="text-base font-semibold"
                  style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.32px' }}
                >
                  EchoSphere
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
              >
                AI-powered live classrooms for the next generation of education.
              </p>
            </div>

            {/* Nav columns */}
            <div className="flex gap-16">
              <div>
                <h4
                  className="mb-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--es-text-muted)', letterSpacing: '0.832px' }}
                >
                  Product
                </h4>
                <ul className="space-y-2">
                  {['Features', 'Pricing', 'Documentation'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:opacity-70"
                        style={{ color: 'var(--es-text-secondary)' }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4
                  className="mb-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--es-text-muted)', letterSpacing: '0.832px' }}
                >
                  Company
                </h4>
                <ul className="space-y-2">
                  {['About', 'Blog', 'Contact'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:opacity-70"
                        style={{ color: 'var(--es-text-secondary)' }}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row"
            style={{ borderColor: 'var(--es-border-subtle)' }}
          >
            <p className="text-xs" style={{ color: 'var(--es-text-muted)' }}>
              &copy; {new Date().getFullYear()} EchoSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--es-text-muted)' }}>
                Powered by
              </span>
              <a
                href="https://agora.io/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--es-text-secondary)' }}
              >
                Agora
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
