'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserRole } from '@/types/conversation';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (tab === 'signin' || name.trim().length > 0) &&
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
      className="flex h-[100dvh] overflow-hidden flex-col items-center justify-center px-4 bg-center bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url("/Auth-Bg.png")' }}
    >

      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: '#707070' }}
      >
        <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        Back
      </Link>

      <div
        className="animate-slide-up-enter w-full max-w-md max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden rounded-xl p-8 md:p-10 shadow-2xl shadow-black/10"
        data-lenis-prevent="true"
        style={{
          border: '1px solid rgba(0,0,0,0.06)',
          background: '#FFFFFF',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img src="/SonaAI%20icon1.png" alt="SonaAI Logo" className="mb-4 h-16 w-16 object-contain bg-white p-1.5" style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
          <h1
            className="text-2xl font-extrabold"
            style={{
              color: '#000000',
              letterSpacing: '-1.44px',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            Welcome to SonaAI
          </h1>
          <p
            className="mt-1.5 text-sm"
            style={{ color: '#707070', letterSpacing: 'normal' }}
          >
            {tab === 'signin'
              ? 'Sign in to your classroom'
              : 'Create your account'}
          </p>
        </div>

        {/* Tab toggle */}
        <div
          className="mb-6 flex rounded-full p-1"
          style={{ background: '#F5F5F5' }}
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
                background: tab === t ? '#FFFFFF' : 'transparent',
                color:
                  tab === t
                    ? '#000000'
                    : '#707070',
                letterSpacing: '-0.32px',
              }}
            >
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Social Logins */}
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#000000' }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ border: '1px solid rgba(0,0,0,0.12)', color: '#000000' }}
          >
            <Github className="h-4 w-4" />
            GitHub
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'rgba(0,0,0,0.12)' }}></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2" style={{ color: '#707070' }}>Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name (sign up only) */}
          <AnimatePresence initial={false}>
            {tab === 'signup' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mb-4">
                  <label
                    htmlFor="auth-name"
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: '#707070', letterSpacing: 'normal' }}
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
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2"
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: '#F5F5F5',
                      color: '#000000',
                      letterSpacing: 'normal',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#031A10';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email (Always visible) */}
          <div className="mb-4">
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: '#707070', letterSpacing: 'normal' }}
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
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#F5F5F5',
                color: '#000000',
                letterSpacing: 'normal',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#031A10';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
              }}
            />
          </div>

          {/* Password (Always visible) */}
          <div className="mb-4">
            <label
              htmlFor="auth-password"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: '#707070', letterSpacing: 'normal' }}
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              maxLength={128}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#F5F5F5',
                color: '#000000',
                letterSpacing: 'normal',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#031A10';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
              }}
            />
          </div>

          {/* Role selector (sign up only) */}
          <AnimatePresence initial={false}>
            {tab === 'signup' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mb-4">
                  <span
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: '#707070', letterSpacing: 'normal' }}
                  >
                    I am a
                  </span>
                  <div
                    className="flex rounded-lg p-1"
                    style={{ border: '1px solid rgba(0,0,0,0.12)' }}
                    role="group"
                    aria-label="Select role"
                  >
                    {(['student', 'teacher'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className="flex-1 rounded-md py-2 text-sm font-medium capitalize transition-all duration-200"
                        style={{
                          background:
                            role === r
                              ? '#031A10'
                              : 'transparent',
                          color:
                            role === r ? '#D0FFA2' : '#707070',
                          letterSpacing: '-0.32px',
                        }}
                        aria-pressed={role === r}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={!canSubmit}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold"
            initial={false}
            animate={{
              backgroundColor: canSubmit ? '#031A10' : '#E5E7EB',
              color: canSubmit ? '#D0FFA2' : '#9CA3AF',
              letterSpacing: '-0.16px',
            }}
            whileHover={canSubmit ? { scale: 1.02, backgroundColor: '#D0FFA2', color: '#031A10' } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2, ease: 'easeOut' }}
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
          </motion.button>
        </form>

        {/* Footer link */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: '#707070', letterSpacing: 'normal' }}
        >
          {tab === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setTab('signup')}
                className="font-medium underline transition-opacity hover:opacity-70"
                style={{ color: '#000000' }}
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
                style={{ color: '#000000' }}
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
        style={{ color: '#707070' }}
      >
        Powered by{' '}
        <a
          href="https://agora.io/en/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline transition-opacity hover:opacity-70"
          style={{ color: '#333333' }}
        >
          Agora
        </a>
      </p>
    </div>
  );
}
