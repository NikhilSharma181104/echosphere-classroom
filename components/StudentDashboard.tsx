'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  ArrowRight, 
  BookOpen, 
  Calendar,
  Camera,
  Trophy,
  ChevronRight,
  Plus,
  Check,
  Video,
  ChevronLeft,
  Activity
} from 'lucide-react';
import type { UserRole } from '@/types/conversation';

type SessionData = {
  name: string;
  role: UserRole;
  avatar_url?: string;
};

const glassPanel = {
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
};

export default function StudentDashboard({ session, onAvatarUpload }: { session: SessionData, onAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const router = useRouter();
  const [studentCode, setStudentCode] = useState('');
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(currentDate + i - 2);
    return {
      d: d.toLocaleString('default', { weekday: 'short' }),
      n: d.getDate(),
      isToday: i === 2
    };
  });

  const [selectedDate, setSelectedDate] = useState<number>(currentDate);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
              Online
            </span>
          </div>
        </div>
      </div>

      {/* 2. Join Class Widget (Spans 2 Cols, 1 Row) */}
      <div 
        className="col-span-1 md:col-span-2 md:row-span-1 rounded-[24px] p-6 flex flex-col justify-between"
        style={glassPanel}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-[#031A10] font-manrope tracking-tight">Join a Class</h3>
            <p className="text-gray-600 text-sm mt-1">Enter the 6-character code from your teacher</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-[#D0FFA2]/20 flex items-center justify-center text-[#031A10]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <input
            type="text"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
            placeholder="A1B2C3"
            autoComplete="off"
            maxLength={6}
            className="flex-1 bg-white/50 border border-white/60 rounded-xl px-5 py-4 text-2xl font-black uppercase tracking-[0.2em] outline-none transition-all duration-200 text-[#031A10] font-mono shadow-sm focus:border-[#031A10]"
          />
        </div>
      </div>

      {/* 3. Stats Widget (Spans 1 Col, 1 Row) */}
      <div 
        className="col-span-1 md:row-span-1 rounded-[24px] p-6 flex flex-col justify-between"
        style={glassPanel}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-[#031A10] font-manrope">Attendance</h3>
          <div className="p-2 rounded-full bg-white/40 border border-white/60 text-[#031A10]">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-black text-[#031A10] font-manrope">98<span className="text-2xl text-gray-500">%</span></span>
          <span className="text-sm font-medium text-gray-500">Perfect this week</span>
        </div>
      </div>

      {/* 4. Quick Actions & Primary CTA (Spans 3 Cols, 1 Row) */}
      <div 
        className="col-span-1 md:col-span-3 md:row-span-1 flex flex-col md:flex-row gap-6"
      >
        {/* Left Side: Secondary Actions */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <button 
            className="rounded-[24px] p-5 flex flex-col items-start justify-between text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={glassPanel}
          >
            <div className="h-10 w-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-[#031A10] mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#031A10] text-sm">Study Materials</p>
              <p className="text-xs text-gray-500 mt-0.5">Review past notes</p>
            </div>
          </button>
          
          <button 
            className="rounded-[24px] p-5 flex flex-col items-start justify-between text-left transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={glassPanel}
          >
            <div className="h-10 w-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-[#031A10] mb-2">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#031A10] text-sm">Achievements</p>
              <p className="text-xs text-gray-500 mt-0.5">View your progress</p>
            </div>
          </button>
        </div>

        {/* Right Side: Big Join Button */}
        <div className="flex-1">
          <button
            onClick={handleJoinAsStudent}
            disabled={studentCode.trim().length < 4}
            className="w-full h-full rounded-[24px] p-6 flex items-center justify-between shadow-xl transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: '#031A10',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-[#D0FFA2] text-sm font-bold uppercase tracking-wider mb-1">Class Code Ready</span>
              <span className="text-white text-3xl font-black font-manrope tracking-tight">Join<br/>Classroom</span>
            </div>
            <div className="h-16 w-16 rounded-full bg-[#D0FFA2] flex items-center justify-center shadow-[0_0_30px_rgba(208,255,162,0.3)]">
              <ArrowRight className="w-8 h-8 text-[#031A10]" />
            </div>
          </button>
        </div>
      </div>

      {/* 5. Calendar (Spans 2 Cols, 1 Row) */}
      <div 
        className="col-span-1 md:col-span-2 md:row-span-1 rounded-[24px] p-6 flex flex-col justify-center"
        style={glassPanel}
      >
        <div className="flex items-center justify-between mb-6">
          <button className="text-gray-500 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <h3 className="text-sm font-bold text-[#031A10] font-manrope">{currentMonth} {currentYear}</h3>
          <button className="text-gray-500 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
        
        {/* Days Header */}
        <div className="grid grid-cols-5 gap-4 px-12">
          {weekDays.map(day => {
            const isActive = selectedDate === day.n;
            return (
              <button 
                key={day.d} 
                onClick={() => setSelectedDate(day.n)}
                className="flex flex-col items-center group focus:outline-none"
              >
                <span className="text-xs text-gray-500 font-medium mb-2 group-hover:text-[#031A10] transition-colors">{day.d}</span>
                <span className={`text-sm font-bold transition-all ${isActive ? 'text-[#031A10] bg-[#D0FFA2] w-8 h-8 rounded-full flex items-center justify-center shadow-md scale-110' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {day.n}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Tasks (Spans 2 Cols, 1 Row) */}
      <div 
        className="col-span-1 md:col-span-2 md:row-span-1 rounded-[32px] p-6 flex flex-col shadow-2xl"
        style={{ background: '#1A1C19' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-white/90">Tasks</h3>
          <div className="flex items-center gap-3">
            <button className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-lg font-light text-white/50">2/8</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 min-h-0 pointer-events-auto custom-scrollbar overscroll-contain">
          {selectedDate === currentDate ? (
            <>
              {/* Completed Task */}
              <div className="flex items-start gap-3">
                 <div className="mt-0.5 min-w-[16px] w-4 h-4 rounded border border-[#D0FFA2]/50 bg-[#D0FFA2]/10 flex items-center justify-center text-[#D0FFA2]">
                   <Check className="w-3 h-3" />
                 </div>
                 <div>
                   <p className="text-xs font-medium text-white/90">Review assignments</p>
                   <p className="text-[10px] text-white/40 mt-0.5">{currentMonth.slice(0,3)} {currentDate}, 08:30</p>
                 </div>
              </div>
              
              {/* Completed Task */}
              <div className="flex items-start gap-3">
                 <div className="mt-0.5 min-w-[16px] w-4 h-4 rounded border border-[#D0FFA2]/50 bg-[#D0FFA2]/10 flex items-center justify-center text-[#D0FFA2]">
                   <Check className="w-3 h-3" />
                 </div>
                 <div>
                   <p className="text-xs font-medium text-white/90">Team Meeting</p>
                   <p className="text-[10px] text-white/40 mt-0.5">{currentMonth.slice(0,3)} {currentDate}, 10:30</p>
                 </div>
              </div>

              {/* Pending Task */}
              <div className="flex items-start gap-3 opacity-50">
                 <div className="mt-0.5 min-w-[16px] w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center"></div>
                 <div>
                   <p className="text-xs font-medium text-white/90">Project Update</p>
                   <p className="text-[10px] text-white/40 mt-0.5">{currentMonth.slice(0,3)} {currentDate}, 13:00</p>
                 </div>
              </div>
              
              {/* Extra Pending Task for scrolling */}
              <div className="flex items-start gap-3 opacity-50">
                 <div className="mt-0.5 min-w-[16px] w-4 h-4 rounded border border-white/20 bg-white/5 flex items-center justify-center"></div>
                 <div>
                   <p className="text-xs font-medium text-white/90">Study Prep</p>
                   <p className="text-[10px] text-white/40 mt-0.5">{currentMonth.slice(0,3)} {currentDate}, 15:30</p>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full opacity-50 py-8">
              <Calendar className="w-6 h-6 text-white/40 mb-2" />
              <p className="text-xs text-white/70">No tasks for {currentMonth.slice(0,3)} {selectedDate}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
