'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Copy,
  Check,
  LogOut,
  BookOpen,
  Clock,
  Settings,
  RefreshCw,
  Users,
  Calendar,
} from 'lucide-react';
import type { UserRole } from '@/types/conversation';

/** Generate a random 6-character alphanumeric classroom code. */
function generateClassroomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

type SessionData = {
  name: string;
  role: UserRole;
};

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Teacher state
  const [classroomCode, setClassroomCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Student state
  const [studentCode, setStudentCode] = useState('');

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('echosphere_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession({ name: parsed.name, role: parsed.role });
        if (parsed.role === 'teacher') {
          setClassroomCode(generateClassroomCode());
        }
      } catch {
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(classroomCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [classroomCode]);

  const handleRegenerateCode = useCallback(() => {
    setClassroomCode(generateClassroomCode());
    setCodeCopied(false);
  }, []);

  const handleStartTeaching = useCallback(() => {
    if (!session || !classroomCode) return;
    // Pass session data to meeting page via sessionStorage
    sessionStorage.setItem(
      'echosphere_meeting',
      JSON.stringify({
        name: session.name,
        role: session.role,
        classroomCode,
      }),
    );
    router.push('/meeting');
  }, [session, classroomCode, router]);

  const handleJoinAsStudent = useCallback(() => {
    if (!session || !studentCode.trim()) return;
    sessionStorage.setItem(
      'echosphere_meeting',
      JSON.stringify({
        name: session.name,
        role: session.role,
        classroomCode: studentCode.trim().toUpperCase(),
      }),
    );
    router.push('/meeting');
  }, [session, studentCode, router]);

  const handleSignOut = useCallback(() => {
    sessionStorage.removeItem('echosphere_session');
    sessionStorage.removeItem('echosphere_meeting');
    router.push('/');
  }, [router]);

  if (!mounted || !session) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--es-page-bg)' }}
      >
        <div className="animate-pulse-subtle text-sm" style={{ color: 'var(--es-text-muted)' }}>
          Loading…
        </div>
      </div>
    );
  }

  const initials = session.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen" style={{ background: 'var(--es-panel-bg)' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'var(--es-page-bg)',
          borderBottom: '1px solid var(--es-border-subtle)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'var(--es-action-primary)' }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.32px' }}
            >
              EchoSphere
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* User avatar + info */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--es-text-primary)' }}
                >
                  {session.name}
                </span>
                <span
                  className="text-xs capitalize"
                  style={{ color: 'var(--es-text-muted)' }}
                >
                  {session.role}
                </span>
              </div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: 'var(--es-action-primary)' }}
              >
                {initials}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-70"
              style={{
                color: 'var(--es-text-muted)',
                border: '1px solid var(--es-border-subtle)',
              }}
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        {/* Greeting */}
        <div className="animate-slide-up-enter mb-10">
          <h1
            className="text-3xl font-bold md:text-4xl"
            style={{
              color: 'var(--es-text-primary)',
              letterSpacing: '-1.44px',
              lineHeight: '1.1',
            }}
          >
            {getGreeting()}, {session.name}
          </h1>
          <p
            className="mt-2 text-base"
            style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
          >
            {formatDate()}
          </p>
        </div>

        {session.role === 'teacher' ? (
          /* ── Teacher Dashboard ── */
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
            {/* Start New Class Card */}
            <div
              className="rounded-[var(--es-radius-xl)] p-6 md:p-8"
              style={{
                background: 'var(--es-page-bg)',
                border: '1px solid var(--es-border-subtle)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--es-radius-sm)]"
                  style={{ background: 'var(--es-panel-bg-2)' }}
                >
                  <Plus className="h-5 w-5" style={{ color: 'var(--es-text-primary)' }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
                  >
                    Start New Class
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
                  >
                    Share this code with your students to get started
                  </p>
                </div>
              </div>

              {/* Classroom code display */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div
                  className="flex-1 rounded-[var(--es-radius-md)] px-6 py-4 text-center"
                  style={{
                    background: 'var(--es-panel-bg-2)',
                    border: '1px solid var(--es-border-subtle)',
                  }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-1"
                    style={{ color: 'var(--es-text-muted)', letterSpacing: '0.832px' }}
                  >
                    Classroom Code
                  </p>
                  <p
                    className="text-3xl font-bold tracking-[0.2em] md:text-4xl"
                    style={{
                      color: 'var(--es-text-primary)',
                      fontFamily: 'var(--font-inter), monospace',
                    }}
                  >
                    {classroomCode}
                  </p>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--es-radius-sm)] px-4 py-2.5 text-xs font-medium transition-all duration-200 hover:opacity-80"
                    style={{
                      border: '1px solid var(--es-border-subtle)',
                      color: 'var(--es-text-secondary)',
                      background: 'var(--es-page-bg)',
                    }}
                  >
                    {codeCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--es-radius-sm)] px-4 py-2.5 text-xs font-medium transition-all duration-200 hover:opacity-80"
                    style={{
                      border: '1px solid var(--es-border-subtle)',
                      color: 'var(--es-text-secondary)',
                      background: 'var(--es-page-bg)',
                    }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    New Code
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartTeaching}
                className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: 'var(--es-action-primary)',
                  letterSpacing: '-0.32px',
                }}
              >
                Start Teaching
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: BookOpen, label: 'Create Room', desc: 'New classroom session', active: true },
                { icon: Clock, label: 'View History', desc: 'Past sessions', active: false },
                { icon: Settings, label: 'Settings', desc: 'Preferences', active: false },
              ].map(({ icon: Icon, label, desc, active }) => (
                <button
                  key={label}
                  type="button"
                  disabled={!active}
                  onClick={active ? handleStartTeaching : undefined}
                  className="flex items-center gap-3 rounded-[var(--es-radius-md)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                  style={{
                    background: 'var(--es-page-bg)',
                    border: '1px solid var(--es-border-subtle)',
                    boxShadow: 'var(--es-card-shadow)',
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
                    style={{ background: 'var(--es-panel-bg-2)' }}
                  >
                    <Icon className="h-4 w-4" style={{ color: 'var(--es-text-primary)' }} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
                    >
                      {label}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--es-text-muted)' }}>
                      {desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Sessions */}
            <div
              className="rounded-[var(--es-radius-xl)] p-6"
              style={{
                background: 'var(--es-page-bg)',
                border: '1px solid var(--es-border-subtle)',
                boxShadow: 'var(--es-card-shadow)',
              }}
            >
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
              >
                Recent Sessions
              </h3>
              <div className="flex flex-col items-center py-10 text-center">
                <Calendar className="mb-3 h-10 w-10" style={{ color: 'var(--es-border-subtle)' }} />
                <p className="text-sm" style={{ color: 'var(--es-text-muted)' }}>
                  No sessions yet. Start your first class to see it here.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── Student Dashboard ── */
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
            {/* Join a Class Card */}
            <div
              className="rounded-[var(--es-radius-xl)] p-6 md:p-8"
              style={{
                background: 'var(--es-page-bg)',
                border: '1px solid var(--es-border-subtle)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--es-radius-sm)]"
                  style={{ background: 'var(--es-panel-bg-2)' }}
                >
                  <Users className="h-5 w-5" style={{ color: 'var(--es-text-primary)' }} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
                  >
                    Join a Class
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
                  >
                    Enter the 6-character code from your teacher
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) =>
                    setStudentCode(e.target.value.toUpperCase().replace(/\s/g, ''))
                  }
                  placeholder="A1B2C3"
                  autoComplete="off"
                  maxLength={6}
                  className="w-full rounded-[var(--es-radius-md)] px-6 py-4 text-center text-3xl font-bold uppercase tracking-[0.2em] outline-none transition-all duration-200 md:text-4xl"
                  style={{
                    border: '1px solid var(--es-border-subtle)',
                    background: 'var(--es-panel-bg-2)',
                    color: 'var(--es-text-primary)',
                    fontFamily: 'var(--font-inter), monospace',
                    letterSpacing: '0.2em',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--es-action-primary)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--es-border-subtle)';
                  }}
                  aria-label="Classroom code"
                  aria-required="true"
                />
              </div>

              <button
                type="button"
                onClick={handleJoinAsStudent}
                disabled={studentCode.trim().length < 4}
                className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:hover:scale-100"
                style={{
                  background: 'var(--es-action-primary)',
                  letterSpacing: '-0.32px',
                }}
              >
                Join Classroom
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Your Classes + Upcoming */}
            <div className="grid gap-6 md:grid-cols-2">
              <div
                className="rounded-[var(--es-radius-xl)] p-6"
                style={{
                  background: 'var(--es-page-bg)',
                  border: '1px solid var(--es-border-subtle)',
                  boxShadow: 'var(--es-card-shadow)',
                }}
              >
                <h3
                  className="mb-4 text-lg font-semibold"
                  style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
                >
                  Your Classes
                </h3>
                <div className="flex flex-col items-center py-8 text-center">
                  <BookOpen className="mb-3 h-8 w-8" style={{ color: 'var(--es-border-subtle)' }} />
                  <p className="text-sm" style={{ color: 'var(--es-text-muted)' }}>
                    No classes joined yet
                  </p>
                </div>
              </div>

              <div
                className="rounded-[var(--es-radius-xl)] p-6"
                style={{
                  background: 'var(--es-page-bg)',
                  border: '1px solid var(--es-border-subtle)',
                  boxShadow: 'var(--es-card-shadow)',
                }}
              >
                <h3
                  className="mb-4 text-lg font-semibold"
                  style={{ color: 'var(--es-text-primary)', letterSpacing: '-0.16px' }}
                >
                  Upcoming
                </h3>
                <div className="flex flex-col items-center py-8 text-center">
                  <Calendar className="mb-3 h-8 w-8" style={{ color: 'var(--es-border-subtle)' }} />
                  <p className="text-sm" style={{ color: 'var(--es-text-muted)' }}>
                    No upcoming sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
