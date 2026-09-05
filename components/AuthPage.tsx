'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import type { UserRole } from '@/types/conversation';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    name.trim().length > 0 &&
    (tab === 'signin' || email.trim().length > 0) &&
    !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);

    // Store session in sessionStorage for persistence across page navigations
    const session = {
      name: name.trim(),
      role,
      timestamp: Date.now(),
    };
    sessionStorage.setItem('echosphere_session', JSON.stringify(session));

    // Navigate to dashboard
    router.push('/dashboard');
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: 'var(--es-page-bg)' }}
    >
      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--es-text-secondary)' }}
      >
        <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        Back
      </Link>

      <div
        className="animate-slide-up-enter w-full max-w-md rounded-[var(--es-radius-xl)] p-8 md:p-10"
        style={{
          border: '1px solid var(--es-border-subtle)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          background: 'var(--es-page-bg)',
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--es-radius-md)]"
            style={{ background: 'var(--es-action-primary)' }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--es-text-primary)', letterSpacing: '-1.44px' }}
          >
            Welcome to SonaAI
          </h1>
          <p
            className="mt-1.5 text-sm"
            style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
          >
            {tab === 'signin'
              ? 'Sign in to your classroom'
              : 'Create your account'}
          </p>
        </div>

        {/* Tab toggle */}
        <div
          className="mb-6 flex rounded-full p-1"
          style={{ background: 'var(--es-panel-bg-2)' }}
          role="tablist"
        >
          {(['signin', 'signup'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="flex-1 rounded-full py-2 text-sm font-medium transition-all duration-200"
              style={{
                background: tab === t ? 'var(--es-page-bg)' : 'transparent',
                color:
                  tab === t
                    ? 'var(--es-text-primary)'
                    : 'var(--es-text-muted)',
                boxShadow: tab === t ? 'var(--es-card-shadow)' : 'none',
                letterSpacing: '-0.32px',
              }}
            >
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="auth-name"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
            >
              Your name
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              autoComplete="name"
              maxLength={64}
              className="w-full rounded-[var(--es-radius-sm)] px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                border: '1px solid var(--es-border-subtle)',
                background: 'var(--es-page-bg)',
                color: 'var(--es-text-primary)',
                boxShadow: 'var(--es-input-shadow)',
                letterSpacing: '-0.16px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--es-action-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--es-border-subtle)';
              }}
              aria-required="true"
            />
          </div>

          {/* Email (sign up only) */}
          {tab === 'signup' && (
            <div className="animate-fade-up">
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-medium"
                style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
              >
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                autoComplete="email"
                maxLength={128}
                className="w-full rounded-[var(--es-radius-sm)] px-4 py-2.5 text-sm outline-none transition-all duration-200"
                style={{
                  border: '1px solid var(--es-border-subtle)',
                  background: 'var(--es-page-bg)',
                  color: 'var(--es-text-primary)',
                  boxShadow: 'var(--es-input-shadow)',
                  letterSpacing: '-0.16px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--es-action-primary)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--es-border-subtle)';
                }}
              />
            </div>
          )}

          {/* Role selector */}
          <div>
            <span
              className="mb-1.5 block text-xs font-medium"
              style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
            >
              I am a
            </span>
            <div
              className="flex rounded-[var(--es-radius-sm)] p-1"
              style={{ border: '1px solid var(--es-border-subtle)' }}
              role="group"
              aria-label="Select role"
            >
              {(['student', 'teacher'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="flex-1 rounded-[8px] py-2 text-sm font-medium capitalize transition-all duration-200"
                  style={{
                    background:
                      role === r
                        ? 'var(--es-action-primary)'
                        : 'transparent',
                    color:
                      role === r ? '#ffffff' : 'var(--es-text-muted)',
                    letterSpacing: '-0.32px',
                  }}
                  aria-pressed={role === r}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
            style={{
              background: 'var(--es-action-primary)',
              letterSpacing: '-0.32px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {tab === 'signin' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              <>
                {tab === 'signin' ? 'Continue' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: 'var(--es-text-muted)', letterSpacing: '-0.16px' }}
        >
          {tab === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="font-medium underline transition-opacity hover:opacity-70"
                style={{ color: 'var(--es-text-primary)' }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="font-medium underline transition-opacity hover:opacity-70"
                style={{ color: 'var(--es-text-primary)' }}
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>

      {/* Attribution */}
      <p
        className="mt-6 text-xs"
        style={{ color: 'var(--es-text-muted)' }}
      >
        Powered by{' '}
        <a
          href="https://agora.io/en/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline transition-opacity hover:opacity-70"
          style={{ color: 'var(--es-text-secondary)' }}
        >
          Agora
        </a>
      </p>
    </div>
  );
}
