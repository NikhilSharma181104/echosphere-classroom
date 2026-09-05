'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';
import type { UserRole } from '@/types/conversation';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence } from 'framer-motion';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ProfileCropperModal from './ProfileCropperModal';

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
  avatar_url?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check Supabase session first (handles OAuth and real email logins)
    supabase.auth.getSession().then(({ data: { session: supaSession } }) => {
      if (supaSession) {
        setSession({
          name: supaSession.user.user_metadata?.name || supaSession.user.email?.split('@')[0] || 'User',
          role: supaSession.user.user_metadata?.role || 'student',
          avatar_url: supaSession.user.user_metadata?.custom_avatar_url || supaSession.user.user_metadata?.avatar_url || null,
        });
      } else {
        // Fallback to local bypass dummy session
        const stored = sessionStorage.getItem('echosphere_session');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setSession({ name: parsed.name, role: parsed.role, avatar_url: parsed.avatar_url });
          } catch {
            router.push('/auth');
          }
        } else {
          router.push('/auth');
        }
      }
    });
  }, [router]);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem('echosphere_session');
    sessionStorage.removeItem('echosphere_meeting');
    window.location.href = '/';
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    
    // Clear input so same file can be selected again
    e.target.value = '';
    
    const url = URL.createObjectURL(file);
    setCropImageUrl(url);
  };

  const handleCroppedSave = async (croppedBlob: Blob) => {
    const { data: { session: supaSession } } = await supabase.auth.getSession();
    
    let finalUrl = '';

    if (supaSession) {
      const fileName = `${supaSession.user.id}-${Math.random()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedBlob, { contentType: 'image/jpeg' });
        
      if (uploadError) {
        console.error('Upload Error:', uploadError);
        alert(`Failed to upload to Supabase: ${uploadError.message}. Please check if your bucket is exactly named "avatars" (lowercase) and that you ran the SQL policy.`);
      } else {
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        finalUrl = data.publicUrl;
        
        await supabase.auth.updateUser({
          data: { custom_avatar_url: finalUrl }
        });
      }
    }

    if (!finalUrl) {
      finalUrl = URL.createObjectURL(croppedBlob);
    }
    
    if (session) {
      const newSession = { ...session, avatar_url: finalUrl };
      setSession(newSession);
      const stored = sessionStorage.getItem('echosphere_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          sessionStorage.setItem('echosphere_session', JSON.stringify({ ...parsed, avatar_url: finalUrl }));
        } catch {}
      }
    }
  };

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
    <div
      className="h-[100dvh] w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed flex flex-col relative"
      style={{ backgroundImage: 'url("/Teacher-Dashboard.png")' }}
    >
      {/* Top bar (Floating Layout) */}
      <div className="absolute top-6 left-0 right-0 z-50 px-4 md:px-8 flex items-center justify-between">
        
        {/* Logo (Far Left) */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <img src="/SonaAI%20icon1.png" alt="SonaAI Logo" className="h-9 w-9 object-contain bg-white p-1" style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{
              color: '#031A10',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            SonaAI
          </span>
        </Link>

        {/* Floating Nav Pill (Center & Profile) */}
        <header
          className="flex items-center gap-6 rounded-[20px] px-3 py-2.5 backdrop-blur-md transition-all duration-300"
          style={{
            background: 'rgba(3, 26, 16, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          {/* Center Nav Links */}
          <div className="hidden items-center gap-6 md:flex pl-4 pr-2">
            {[
              { label: 'Dashboard', active: true },
              { label: 'Classes', active: false },
              { label: 'History', active: false },
              { label: 'Settings', active: false },
            ].map((item) => (
              <a
                key={item.label}
                href="#"
                className="group relative text-sm font-semibold transition-colors duration-200 hover:text-white"
                style={{
                  color: item.active ? '#D0FFA2' : 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-manrope)',
                }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ))}
          </div>
          
          {/* Divider */}
          <div className="w-px h-6 bg-white/20 hidden md:block"></div>

          <div className="flex items-center gap-3 pl-1 pr-2">
            {/* User avatar + info */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-white leading-tight">
                  {session.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                  {session.role}
                </span>
              </div>
              <label className="relative cursor-pointer group flex items-center justify-center">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shadow-md overflow-hidden transition-opacity group-hover:opacity-80"
                  style={{ background: '#D0FFA2', color: '#031A10' }}
                  title="Upload profile picture"
                >
                  {(session as any).avatar_url ? (
                    <img src={(session as any).avatar_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </label>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center rounded-full p-2 transition-colors duration-200 hover:bg-white/10"
              style={{ color: '#FFFFFF' }}
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
      </div>

      {/* Main content - Centered within the viewport below the navbar */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-32 pb-6 overflow-hidden flex flex-col">
        {session.role === 'teacher' ? (
          <TeacherDashboard session={session} />
        ) : (
          <StudentDashboard session={session} onAvatarUpload={handleAvatarUpload} />
        )}
      </main>

      <AnimatePresence>
        {cropImageUrl && (
          <ProfileCropperModal
            imageUrl={cropImageUrl}
            onClose={() => setCropImageUrl(null)}
            onSave={handleCroppedSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
