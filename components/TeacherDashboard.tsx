'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
  Clock,
  Settings,
  RefreshCw,
  Camera,
  Users,
  Video,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { UserRole } from '@/types/conversation';
import DashboardCalendar from './DashboardCalendar';
import DashboardTasks from './DashboardTasks';
import HistoryModal from './HistoryModal';
import { supabase } from '@/lib/supabaseClient';

type SessionData = {
  name: string;
  role: UserRole;
  avatar_url?: string;
};

/** Generate a random 6-character alphanumeric classroom code. */
function generateClassroomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const glassPanel = {
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
};

export default function TeacherDashboard({ session, onAvatarUpload }: { session: SessionData, onAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const router = useRouter();
  const [classroomCode, setClassroomCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [totalStudents, setTotalStudents] = useState<number | string>('...');
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Manage Classroom Code
    const storedCode = localStorage.getItem('echosphere_teacher_code');
    if (storedCode) {
      setClassroomCode(storedCode);
    } else {
      const newCode = generateClassroomCode();
      setClassroomCode(newCode);
      localStorage.setItem('echosphere_teacher_code', newCode);
    }

    // 2. Fetch Stats
    const fetchStats = async () => {
      const { data: { session: supaSession } } = await supabase.auth.getSession();
      if (!supaSession) return;
      
      // Calculate total students who joined classes taught by this teacher
      // Since we don't have a direct relation between classes and teachers yet, 
      // we'll just count total sessions the teacher has started.
      const { count } = await supabase
        .from('sessions_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', supaSession.user.id)
        .eq('role', 'teacher');
        
      setTotalStudents(count || 0);
    };
    fetchStats();
  }, []);

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
    const newCode = generateClassroomCode();
    setClassroomCode(newCode);
    localStorage.setItem('echosphere_teacher_code', newCode);
    setCodeCopied(false);
  }, []);

  const handleStartTeaching = useCallback(async () => {
    if (!session || !classroomCode) return;
    
    // Log session to history
    const { data: { session: supaSession } } = await supabase.auth.getSession();
    if (supaSession) {
      await supabase.from('sessions_history').insert({
        user_id: supaSession.user.id,
        role: 'teacher',
        class_code: classroomCode
      });
    }

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

  // handlePhotoUpload logic moved to global DashboardPage

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 animate-fade-in pb-4">
      
      {/* 1. Profile Card (Spans 1 Col, 2 Rows) */}
      <div 
        className="col-span-1 md:row-span-2 rounded-[24px] relative overflow-hidden group flex flex-col justify-end"
        style={{ ...glassPanel, padding: 0 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-500 group-hover:scale-105"
          style={{ 
            backgroundImage: session.avatar_url ? `url(${session.avatar_url})` : 'url("/hero_classroom_1788611365675.jpg")',
            backgroundPosition: 'center 20%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031A10]/90 via-[#031A10]/30 to-transparent z-10" />
        
        {/* Photo Upload Overlay Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white transition-colors duration-200 hover:bg-black/60 shadow-lg"
          title="Update Profile Photo"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onAvatarUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="relative z-20 p-6">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight font-manrope">{session.name}</h2>
          <div className="flex items-center justify-between">
            <p className="text-[#D0FFA2] text-sm font-medium capitalize">{session.role}</p>
            <span className="px-3 py-1 rounded-full border border-white/30 bg-white/10 text-white text-xs font-medium backdrop-blur-sm">
              Active Now
            </span>
          </div>
        </div>
      </div>

      {/* 2. Start Class Widget (Spans 2 Cols, 1 Row) */}
      <div 
        className="col-span-1 md:col-span-2 md:row-span-1 rounded-[24px] p-5 flex flex-col justify-center gap-4"
        style={glassPanel}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#031A10] font-manrope tracking-tight">Start New Class</h3>
            <p className="text-gray-600 text-xs mt-0.5">Share this code with your students</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#D0FFA2]/20 flex items-center justify-center text-[#031A10]">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/50 border border-white/60 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">Class Code</p>
            <p className="text-2xl font-black text-[#031A10] tracking-[0.2em] font-mono">{classroomCode}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg hover:bg-white/80 transition-colors text-gray-600 hover:text-[#031A10]"
              title="Copy Code"
            >
              {codeCopied ? <Check className="w-4 h-4 text-[#031A10]" /> : <Copy className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleRegenerateCode}
              className="p-1.5 rounded-lg hover:bg-white/80 transition-colors text-gray-600 hover:text-[#031A10]"
              title="Regenerate Code"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Stats Widget (Spans 1 Col, 1 Row) */}
      <div 
        className="col-span-1 md:row-span-1 rounded-[24px] p-6 flex flex-col justify-between"
        style={glassPanel}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-[#031A10] font-manrope">Overview</h3>
          <div className="p-2 rounded-full bg-white/40 border border-white/60 text-[#031A10]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-black text-[#031A10] font-manrope">{totalStudents}</span>
          <span className="text-sm font-medium text-gray-500">Total Classes Taught</span>
        </div>
      </div>

      {/* 4. Quick Actions & Primary CTA (Spans 3 Cols, 1 Row) */}
      <div 
        className="col-span-1 md:col-span-3 md:row-span-1 flex flex-col md:flex-row gap-6"
      >
        {/* Left Side: Secondary Actions */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Action 1: Course Materials */}
          <button 
            onClick={() => router.push('/materials')}
            className="rounded-[24px] p-5 flex flex-col items-start justify-between text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{...glassPanel, gridColumn: 'span 1'}}
          >
            <div className="h-10 w-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-[#031A10] mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#031A10] text-sm">Course Materials</p>
              <p className="text-xs text-gray-500 mt-0.5">Manage slides & notes</p>
            </div>
          </button>
          
          {/* Action 2: View Past Sessions */}
          <button 
            onClick={() => setIsHistoryModalOpen(true)}
            className="rounded-[24px] p-5 flex flex-col items-start justify-between text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={glassPanel}
          >
            <div className="h-10 w-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-[#031A10] mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#031A10] text-sm">History</p>
              <p className="text-xs text-gray-500 mt-0.5">View past sessions</p>
            </div>
          </button>
        </div>

        {/* Right Side: Big Start Button */}
        <div className="flex-1">
          <button
            onClick={handleStartTeaching}
            className="w-full h-full rounded-[24px] p-6 flex items-center justify-between shadow-xl transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: '#031A10',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[#D0FFA2] text-sm font-bold uppercase tracking-wider mb-1">Ready?</span>
              <span className="text-white text-3xl font-black font-manrope tracking-tight">Start<br/>Teaching</span>
            </div>
            <div className="h-16 w-16 rounded-full bg-[#D0FFA2] flex items-center justify-center shadow-[0_0_30px_rgba(208,255,162,0.3)]">
              <ArrowRight className="w-8 h-8 text-[#031A10]" />
            </div>
          </button>
        </div>
      </div>

      {/* 5. Calendar (Spans 2 Cols, 1 Row) */}
      <DashboardCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      {/* 6. Tasks (Spans 2 Cols, 1 Row) */}
      <DashboardTasks selectedDate={selectedDate} />

      <HistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        role="teacher" 
      />
    </div>
  );
}
