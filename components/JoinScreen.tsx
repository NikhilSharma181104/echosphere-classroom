'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserRole, UserSession } from '@/types/conversation';

/** Generate a random 6-character alphanumeric classroom code. */
function generateClassroomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

type JoinScreenProps = {
  isLoading: boolean;
  error: string | null;
  onJoin: (session: UserSession) => void;
};

export function JoinScreen({ isLoading, error, onJoin }: JoinScreenProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  // For teacher: auto-generated code (display only). For student: typed by user.
  const [teacherCode, setTeacherCode] = useState('');
  const [studentCode, setStudentCode] = useState('');

  // Generate a code when role switches to teacher (and whenever the component mounts as teacher).
  useEffect(() => {
    if (role === 'teacher') {
      setTeacherCode(generateClassroomCode());
    }
  }, [role]);

  const classroomCode = role === 'teacher' ? teacherCode : studentCode;

  const canSubmit =
    name.trim().length > 0 &&
    (role === 'teacher'
      ? teacherCode.length > 0
      : studentCode.trim().length > 0) &&
    !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onJoin({
      name: name.trim(),
      role,
      classroomCode: classroomCode.trim().toUpperCase(),
    });
  };

  return (
    <div
      className="mx-auto flex w-[min(92vw,26.25rem)] animate-fade-up flex-col items-center rounded-[20px] border border-[#2b2b2b] px-10 py-10 text-center shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
      style={{
        backgroundImage:
          'linear-gradient(164.988deg, rgba(54,54,54,0.2) 1.0596%, rgba(0,0,0,0) 96.089%), linear-gradient(90deg, rgb(16,16,16) 0%, rgb(16,16,16) 100%)',
      }}
    >
      <h1 className="text-[28px] font-medium leading-[1.2] text-white">
        Join EchoSphere
      </h1>
      <p className="mt-[14px] text-sm font-medium leading-6 text-muted-foreground">
        AI-powered live classroom — enter your details to join.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        {/* Name input */}
        <div className="text-left">
          <label
            htmlFor="join-name"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Your name
          </label>
          <input
            id="join-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            autoComplete="off"
            maxLength={64}
            className="w-full rounded-lg border border-[#2b2b2b] bg-[#111] px-3 py-2 text-sm text-white placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            aria-required="true"
          />
        </div>

        {/* Role toggle */}
        <div className="text-left">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            I am joining as
          </span>
          <div
            className="flex w-full rounded-lg border border-[#2b2b2b] p-1"
            role="group"
            aria-label="Select role"
          >
            {(['student', 'teacher'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-colors ${
                  role === r
                    ? 'bg-primary text-black'
                    : 'text-muted-foreground hover:text-white'
                }`}
                aria-pressed={role === r}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Classroom code — display (teacher) or input (student) */}
        {role === 'teacher' ? (
          <div className="text-left">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Your classroom code
            </span>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 rounded-lg border border-primary/50 bg-primary/10 px-3 py-2 text-center font-mono text-xl font-bold tracking-widest text-primary"
                aria-label={`Classroom code: ${teacherCode}`}
              >
                {teacherCode}
              </div>
              <button
                type="button"
                onClick={() => setTeacherCode(generateClassroomCode())}
                className="rounded-lg border border-[#2b2b2b] px-3 py-2 text-xs text-muted-foreground hover:text-white transition-colors"
                aria-label="Regenerate classroom code"
              >
                New
              </button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Share this code with your students so they can join your room.
            </p>
          </div>
        ) : (
          <div className="text-left">
            <label
              htmlFor="join-code"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Classroom code
            </label>
            <input
              id="join-code"
              type="text"
              value={studentCode}
              onChange={(e) =>
                setStudentCode(e.target.value.toUpperCase().replace(/\s/g, ''))
              }
              placeholder="e.g. A1B2C3"
              autoComplete="off"
              maxLength={6}
              className="w-full rounded-lg border border-[#2b2b2b] bg-[#111] px-3 py-2 text-center font-mono text-sm uppercase tracking-widest text-white placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              aria-required="true"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Ask your teacher for the 6-character code.
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="mt-4 h-10 w-full rounded-lg border border-primary bg-primary text-sm font-medium text-black hover:border-white hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-black"
          aria-label={isLoading ? 'Joining classroom…' : 'Join classroom'}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining…
            </>
          ) : (
            'Join Classroom'
          )}
        </Button>

        {error && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
