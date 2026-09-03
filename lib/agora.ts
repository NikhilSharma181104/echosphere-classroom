export const DEFAULT_AGENT_UID = 123456;

// Reserved RTC UIDs for classroom participants.
// Each classroom is an isolated channel, so these are safe to reuse across rooms.
// UID 1 is always the teacher; 2–6 are the five student slots (join order).
// DEFAULT_AGENT_UID (123456) is well outside this range.
export const TEACHER_UID = 1;
export const STUDENT_UIDS = [2, 3, 4, 5, 6] as const;

// The full pool passed to remoteUids when starting the agent — teacher + all student slots.
export const ALL_PARTICIPANT_UIDS: string[] = [
  String(TEACHER_UID),
  ...STUDENT_UIDS.map(String),
];
