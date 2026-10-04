import React, { useRef, useEffect } from 'react';
import {
  Sparkles,
  User as UserIcon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flag,
  RotateCcw,
} from 'lucide-react';
import { InterviewSession, InterviewQuestion } from '@/types/interview';
import { KoboyoBrain, KoboyoSparkle } from '@/components/icons/Koboyo';
import { QuestionFeedbackCard } from './QuestionFeedbackCard';
import { AnswerInputBox } from './AnswerInputBox';
import { InterviewSummaryReport } from './InterviewSummaryReport';
import { cn } from '@/lib/utils';

interface InterviewChatViewProps {
  session: InterviewSession;
  onSubmitAnswer: (answer: string) => Promise<void>;
  onCompleteSession: () => Promise<void>;
  onNewInterview: () => void;
  isSubmitting: boolean;
}

export const InterviewChatView: React.FC<InterviewChatViewProps> = ({
  session,
  onSubmitAnswer,
  onCompleteSession,
  onNewInterview,
  isSubmitting,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const questions = session.questions || [];
  const currentIdx = session.current_question_index;
  const isCompleted = session.status === 'completed';

  // Scroll to latest message or input box
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentIdx, questions.length, isCompleted]);

  const activeQuestion = questions.find((q) => !q.answered_at) || questions[currentIdx];

  return (
    <div className="space-y-6">
      {/* Session Progress Header */}
      <div className="bg-white border border-[#D5E5DC] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#008855] text-white flex items-center justify-center shadow-xs shrink-0">
            <KoboyoBrain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0A1A12]">{session.role_title}</h2>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider',
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-[#EEF7F1] text-[#004D2F] border border-[#D6E8DD]'
                )}
              >
                {session.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {session.target_skills.slice(0, 4).join(' • ') || 'Core Engineering Competencies'}
            </p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {questions.map((q, idx) => {
              const isAnswered = q.answered_at !== null;
              const isCurrent = idx === currentIdx && !isCompleted;
              return (
                <div
                  key={q.id || idx}
                  className={cn(
                    'h-7 px-2.5 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all',
                    isAnswered
                      ? 'bg-[#EEF7F1] text-[#008855] border border-[#D6E8DD]'
                      : isCurrent
                      ? 'bg-[#008855] text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-400'
                  )}
                  title={`Question ${idx + 1}: ${q.skill_focus}`}
                >
                  <span>Q{idx + 1}</span>
                  {isAnswered && q.score !== null && (
                    <span className="ml-1 text-[10px] font-semibold opacity-80">({q.score})</span>
                  )}
                </div>
              );
            })}
          </div>

          {!isCompleted && (
            <button
              type="button"
              onClick={onCompleteSession}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Finalize interview early"
            >
              <Flag size={13} />
              <span className="hidden sm:inline">Finish Early</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          // Render answered questions and the active unanswered question
          if (idx > currentIdx && !isCompleted) return null;

          const isAnswered = q.answered_at !== null;
          const isCurrentActive = idx === currentIdx && !isCompleted;

          return (
            <div key={q.id || idx} className="space-y-4 animate-in fade-in-50 duration-300">
              {/* Interviewer Message Bubble */}
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#004D2F] text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <KoboyoSparkle size={18} />
                </div>

                <div className="flex-1 max-w-3xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#004D2F]">AI Interviewer</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F1F6F3] border border-[#D5E5DC] text-[#004D2F] font-mono">
                      Question {q.order} of {session.total_questions}
                    </span>
                    {q.skill_focus && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#D5E5DC] text-neutral-600 font-semibold">
                        {q.skill_focus}
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-400 capitalize">{q.difficulty}</span>
                  </div>

                  <div className="rounded-2xl rounded-tl-sm bg-white border border-[#D5E5DC] p-5 shadow-xs text-sm text-[#0A1A12] leading-relaxed">
                    <p className="font-medium">{q.question_text}</p>
                  </div>
                </div>
              </div>

              {/* Candidate Submitted Response Bubble (if answered) */}
              {isAnswered && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 max-w-2xl space-y-1.5 flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-500">Your Response</span>
                      {q.answered_at && (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(q.answered_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <div className="rounded-2xl rounded-tr-sm bg-[#EEF7F1] border border-[#D6E8DD] p-4 text-xs sm:text-sm text-[#0A1A12] leading-relaxed whitespace-pre-wrap">
                      {q.user_answer}
                    </div>
                  </div>

                  <div className="h-9 w-9 rounded-xl bg-[#DDEEE4] text-[#004D2F] border border-[#BBDDCB] flex items-center justify-center font-bold text-xs shrink-0 font-mono mt-0.5">
                    <UserIcon size={16} />
                  </div>
                </div>
              )}

              {/* Instant Evaluation Card for answered questions */}
              {isAnswered && q.evaluation && (
                <div className="pl-12 max-w-3xl">
                  <QuestionFeedbackCard
                    evaluation={q.evaluation}
                    score={q.score}
                    expectedPoints={q.expected_points}
                  />
                </div>
              )}

              {/* Active Input Box below current question */}
              {isCurrentActive && (
                <div className="pl-12 max-w-3xl pt-2">
                  <AnswerInputBox
                    onSubmit={onSubmitAnswer}
                    isLoading={isSubmitting}
                    questionOrder={q.order}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* If session is finished, render final summary report */}
        {isCompleted && (
          <div className="pt-4 border-t border-[#D5E5DC]">
            <InterviewSummaryReport session={session} onRetake={onNewInterview} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
