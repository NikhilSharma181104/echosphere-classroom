/**
 * Server-side prompts used by the inject-think route.
 * Kept here (not in the route file) so Next.js route validation doesn't reject
 * non-handler exports from app/api/ route modules.
 */

// The structured summary prompt sent to the agent at end-of-class.
// Headers are deliberately ALL-CAPS so the client-side PDF parser can
// split sections reliably.
export const SUMMARY_PROMPT =
  'Class is ending. Based on our conversation today, please give a structured post-class summary using EXACTLY these three section headers on their own lines: ' +
  'OVERALL SUMMARY, COMMON LEARNING GAPS, STUDENTS NEEDING SUPPORT. ' +
  'Under OVERALL SUMMARY write 2-3 sentences describing what was covered. ' +
  'Under COMMON LEARNING GAPS list the concepts multiple students seemed to struggle with, including any concepts where students answered quiz questions incorrectly or hesitated — quiz performance is a strong signal for gaps. ' +
  'Under STUDENTS NEEDING SUPPORT list each student by name with a brief reason why they may need follow-up, explicitly including students who struggled on quiz questions or got answers wrong during any quiz run in this session. ' +
  'If there are no gaps or no students needing support, say "None identified." ' +
  'Keep the entire response factual, concise, and based only on what was actually discussed.';
