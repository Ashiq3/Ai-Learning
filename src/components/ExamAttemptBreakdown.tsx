import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lock,
  MessageSquare,
  Unlock,
  XCircle,
} from 'lucide-react';
import { CLASS_EXAMS } from '../data/classExams';
import type { ClassId } from '../types/course';
import type { ExamAttemptRecord } from '../types/exam';
import { shouldRevealCorrectAnswer } from '../utils/examLogic';
import { InlineCodeText } from './InlineCodeText';

interface ExamAttemptBreakdownProps {
  attempt: ExamAttemptRecord;
  isInstructor: boolean;
  unlockedByClassHistory?: boolean;
  onJumpToSlide?: (classId: ClassId, slideNumber1Based: number) => void;
}

export function ExamAttemptBreakdown({
  attempt,
  isInstructor,
  unlockedByClassHistory = false,
  onJumpToSlide,
}: ExamAttemptBreakdownProps) {
  const examDef = CLASS_EXAMS[attempt.classId];

  return (
    <div className="space-y-5">
      {/* Option A Unlock Status Notice */}
      {!isInstructor && (
        <div
          className={`flex items-start gap-3 rounded-lg border px-4 py-3.5 text-[14px] leading-relaxed ${
            attempt.answersUnlocked || unlockedByClassHistory
              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
              : 'border-amber-200 bg-amber-50/70 text-amber-950'
          }`}
        >
          {attempt.answersUnlocked || unlockedByClassHistory ? (
            <Unlock className="h-4 w-4 text-emerald-700 shrink-0 mt-1" aria-hidden="true" />
          ) : (
            <Lock className="h-4 w-4 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
          )}
          <div>
            {attempt.answersUnlocked || unlockedByClassHistory ? (
              <>
                <strong className="font-semibold text-emerald-900">
                  Full answer key &amp; explanations unlocked.
                </strong>{' '}
                You can review every correct answer and detailed explanation below anytime.
              </>
            ) : (
              <>
                <strong className="font-semibold text-amber-900">
                  Smart Study Mode (Attempt #{attempt.attemptNumber} of 2):
                </strong>{' '}
                Wrong answers display study hints and slide references instead of direct spoilers. Score 80%+ or reach Attempt #3 to unlock full answer keys.
              </>
            )}
          </div>
        </div>
      )}

      {/* Instructor Review Box (if instructor reviewed) */}
      {attempt.reviewStatus === 'reviewed' && (
        <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1D4ED8]">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Instructor review &amp; feedback
            </span>
            <span className="font-mono text-xs font-semibold text-[#1E40AF] tabular-nums">
              Short answer score: {attempt.shortAnswerScore} / 2
            </span>
          </div>
          {attempt.teacherFeedback ? (
            <p className="text-[14.5px] leading-relaxed text-slate-800">{attempt.teacherFeedback}</p>
          ) : (
            <p className="text-xs italic text-slate-600">Reviewed with no additional comment.</p>
          )}
        </div>
      )}

      {/* Question-by-Question Breakdown */}
      <div className="space-y-4">
        {attempt.answers.map((ans, idx) => {
          const isShort = ans.questionType === 'short-answer';
          const revealAnswer = shouldRevealCorrectAnswer({
            attemptNumber: attempt.attemptNumber,
            scorePercent: attempt.scorePercent,
            isInstructor,
            isQuestionCorrect: ans.isCorrect,
            unlockedByClassHistory: unlockedByClassHistory || attempt.answersUnlocked,
          });
          const rubricGuide = examDef?.questions.find((q) => q.id === ans.questionId)?.rubricGuide;

          return (
            <div
              key={`${attempt.attemptId}-${ans.questionId}`}
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-mono font-semibold text-slate-800">Q{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {ans.questionType === 'mcq'
                      ? 'Single choice'
                      : ans.questionType === 'multi-select'
                        ? 'Multi-select'
                        : 'Short written answer'}
                  </span>
                </div>

                {isShort ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#1D4ED8]">
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {attempt.reviewStatus === 'reviewed'
                      ? `Reviewed (${attempt.shortAnswerScore}/2)`
                      : 'Pending instructor review'}
                  </span>
                ) : ans.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                    <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Incorrect
                  </span>
                )}
              </div>

              <p className="font-display text-[15.5px] font-semibold leading-snug text-slate-900">
                <InlineCodeText text={ans.prompt} />
              </p>

              {/* Student Response Display */}
              {isShort ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <span className="block text-xs font-medium text-slate-500">
                    Written response
                  </span>
                  <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-slate-800">
                    {ans.shortAnswerText || '(No response written)'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ans.options.map((opt, optIdx) => {
                    const wasPicked = ans.selectedIndices.includes(optIdx);
                    const isTrueCorrect = ans.correctIndices.includes(optIdx);

                    let optStyle = 'border-slate-200 bg-slate-50/50 text-slate-600';
                    if (wasPicked && ans.isCorrect) {
                      optStyle = 'border-emerald-300 bg-emerald-50/80 text-emerald-950';
                    } else if (wasPicked && !ans.isCorrect) {
                      optStyle = 'border-red-300 bg-red-50/80 text-red-950';
                    } else if (revealAnswer && isTrueCorrect) {
                      optStyle = 'border-emerald-300 bg-emerald-50/60 text-emerald-950';
                    }

                    return (
                      <div
                        key={opt}
                        className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13.5px] leading-relaxed ${optStyle}`}
                      >
                        <span className="mt-0.5 font-mono text-xs font-semibold shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1">
                          <InlineCodeText text={opt} />
                        </span>
                        {wasPicked && (
                          <span className="text-[11px] font-semibold shrink-0 opacity-85">
                            Picked
                          </span>
                        )}
                        {!wasPicked && revealAnswer && isTrueCorrect && (
                          <span className="text-[11px] font-semibold text-emerald-700 shrink-0">
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Option A Hint vs Unlocked Explanation */}
              {!isShort && !ans.isCorrect && !revealAnswer ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-[13.5px] text-amber-950">
                  <div className="space-y-0.5 flex-1 min-w-[220px]">
                    <span className="block text-xs font-semibold text-amber-800">
                      Study hint (review &amp; retry)
                    </span>
                    <p>
                      <InlineCodeText text={ans.hint} />
                    </p>
                  </div>
                  {onJumpToSlide && (
                    <button
                      type="button"
                      onClick={() => onJumpToSlide(attempt.classId, ans.reviewSlideNumber)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100/60 transition-colors whitespace-nowrap"
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      Review Slide {String(ans.reviewSlideNumber).padStart(2, '0')}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-t border-slate-100 pt-4 text-[13.5px] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      {isShort ? 'Reference model answer' : 'Explanation'}
                    </span>
                    {onJumpToSlide && (
                      <button
                        type="button"
                        onClick={() => onJumpToSlide(attempt.classId, ans.reviewSlideNumber)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline"
                      >
                        Slide {String(ans.reviewSlideNumber).padStart(2, '0')}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="leading-relaxed text-slate-700">
                    <InlineCodeText text={ans.explanationEn} />
                  </p>
                  <p className="rounded-lg bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 leading-relaxed text-slate-700">
                    <strong className="font-semibold text-slate-900 mr-1.5">Banglish note:</strong>
                    <InlineCodeText text={ans.explanationBanglish} />
                  </p>
                  {isInstructor && isShort && rubricGuide && (
                    <p className="rounded-lg border border-blue-200 bg-[#EFF6FF] px-3.5 py-2.5 text-slate-800">
                      <strong className="font-semibold text-[#1D4ED8] mr-1.5">
                        Grading rubric:
                      </strong>
                      {rubricGuide}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
