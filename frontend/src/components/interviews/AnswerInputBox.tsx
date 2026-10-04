import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerInputBoxProps {
  onSubmit: (answer: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  questionOrder: number;
}

export const AnswerInputBox: React.FC<AnswerInputBoxProps> = ({
  onSubmit,
  isLoading,
  disabled = false,
  questionOrder,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on new question
  useEffect(() => {
    if (!disabled && !isLoading) {
      textareaRef.current?.focus();
    }
  }, [questionOrder, disabled, isLoading]);

  const charCount = answer.trim().length;
  const isTooShort = charCount > 0 && charCount < 10;
  const isValid = charCount >= 10;

  const handleSubmit = async () => {
    if (!isValid || isLoading || disabled) {
      if (charCount === 0) {
        setError('Please enter your answer before submitting.');
      } else if (isTooShort) {
        setError('Answers must be at least 10 characters long.');
      }
      return;
    }

    setError(null);
    try {
      await onSubmit(answer.trim());
      setAnswer('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit answer. Please try again.';
      setError(msg);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-white border border-[#D5E5DC] rounded-2xl p-4 shadow-sm focus-within:border-[#008855] focus-within:ring-2 focus-within:ring-[#008855]/10 transition-all">
      {/* Input Area */}
      <textarea
        ref={textareaRef}
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          if (error) setError(null);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        placeholder="Type your technical answer here... Explain your thought process, architecture decisions, trade-offs, and examples."
        rows={4}
        className="w-full resize-none border-none bg-transparent p-0 text-sm text-[#0A1A12] placeholder:text-neutral-400 focus:outline-none focus:ring-0 leading-relaxed"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 mt-2 mb-1">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Footer toolbar */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F0F5F2] mt-2">
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className={cn('font-mono', isTooShort ? 'text-amber-600 font-semibold' : '')}>
            {charCount} characters {isTooShort && '(min 10)'}
          </span>
          <span className="hidden sm:inline-block text-[11px] text-neutral-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-600 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-600 font-mono text-[10px]">Enter</kbd> to submit
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isLoading || disabled}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer',
            isValid && !isLoading && !disabled
              ? 'bg-[#008855] hover:bg-[#007044] shadow-xs hover:shadow-sm active:scale-95'
              : 'bg-neutral-300 cursor-not-allowed opacity-70'
          )}
        >
          {isLoading ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <span>Submit Answer</span>
              <CornerDownLeft size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
