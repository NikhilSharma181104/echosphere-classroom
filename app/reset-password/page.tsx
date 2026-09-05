'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      return alert('Password must be at least 6 characters long');
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      alert('Password updated successfully! You can now log in.');
      router.push('/auth');
    } catch (error: any) {
      alert(error.message || 'An error occurred while updating the password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex h-[100dvh] overflow-hidden flex-col items-center justify-center px-4 bg-center bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url("/Auth-Bg.png")' }}
    >
      <Link
        href="/auth"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: '#707070' }}
      >
        <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        Back to Login
      </Link>

      <div
        className="animate-slide-up-enter w-full max-w-md rounded-xl p-8 md:p-10 shadow-2xl shadow-black/10"
        style={{
          border: '1px solid rgba(0,0,0,0.06)',
          background: '#FFFFFF',
        }}
      >
        <div className="mb-8 text-center">
          <h1
            className="text-2xl font-extrabold"
            style={{
              color: '#000000',
              letterSpacing: '-1.44px',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            Reset Password
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: '#707070' }}>
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-xs font-medium"
              style={{ color: '#707070' }}
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200"
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                background: '#F5F5F5',
                color: '#000000',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#031A10';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!password || isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition-all"
            style={{ 
              backgroundColor: password && !isLoading ? '#031A10' : '#E5E7EB', 
              color: password && !isLoading ? '#D0FFA2' : '#9CA3AF' 
            }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
