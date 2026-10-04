import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Check, Brain, Sliders, Zap } from 'lucide-react';
import { interviewService } from '@/services/interviewService';
import { RoleSuggestion, InterviewDifficulty, CreateSessionPayload } from '@/types/interview';
import { cn } from '@/lib/utils';

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (payload: CreateSessionPayload) => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_ROLES = [
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Software Engineer',
];

export const InterviewSetupModal: React.FC<InterviewSetupModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState('Backend Developer');
  const [customRole, setCustomRole] = useState('');
  const [suggestedRoles, setSuggestedRoles] = useState<RoleSuggestion[]>([]);
  const [targetSkills, setTargetSkills] = useState<string[]>(['Python', 'Django', 'PostgreSQL']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('intermediate');

  // Fetch role and skill recommendations from knowledge graph
  useEffect(() => {
    let mounted = true;
    interviewService
      .getSuggestedRoles()
      .then((res) => {
        if (mounted && res.roles && res.roles.length > 0) {
          setSuggestedRoles(res.roles);
        }
      })
      .catch(() => {
        // graceful offline fallback
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Update suggested skills whenever role selection changes
  useEffect(() => {
    const activeRole = customRole.trim() || selectedRole;
    const match = suggestedRoles.find(
      (r) => r.role_title.toLowerCase() === activeRole.toLowerCase()
    );
    if (match && match.top_skills.length > 0) {
      setTargetSkills(match.top_skills);
    } else if (selectedRole === 'Backend Developer') {
      setTargetSkills(['Python', 'Django', 'PostgreSQL', 'Docker']);
    } else if (selectedRole === 'Frontend Developer') {
      setTargetSkills(['React', 'TypeScript', 'Tailwind CSS', 'Next.js']);
    } else if (selectedRole === 'Full Stack Developer') {
      setTargetSkills(['React', 'Node.js', 'Python', 'PostgreSQL']);
    } else if (selectedRole === 'Data Scientist') {
      setTargetSkills(['Python', 'Pandas', 'Machine Learning', 'SQL']);
    } else if (selectedRole === 'DevOps Engineer') {
      setTargetSkills(['Docker', 'Kubernetes', 'CI/CD', 'Linux']);
    }
  }, [selectedRole, customRole, suggestedRoles]);

  if (!isOpen) return null;

  const handleToggleSkill = (skill: string) => {
    if (targetSkills.includes(skill)) {
      setTargetSkills(targetSkills.filter((s) => s !== skill));
    } else {
      setTargetSkills([...targetSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !targetSkills.includes(clean)) {
      setTargetSkills([...targetSkills, clean]);
      setNewSkillInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = customRole.trim() || selectedRole;
    await onStartSession({
      role_title: finalRole,
      target_skills: targetSkills,
      num_questions: numQuestions,
      difficulty,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#D5E5DC] rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAF2ED] bg-[#F8FAF9]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#008855] text-white flex items-center justify-center shadow-xs">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0A1A12]">Configure Mock Interview</h2>
              <p className="text-xs text-neutral-500">
                Grounded in live Knowledge Graph skill demand and role criteria
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-8 w-8 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Target Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#004D2F] uppercase tracking-wider mb-2">
              1. Select Target Job Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEFAULT_ROLES.map((role) => {
                const isSelected = selectedRole === role && !customRole;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setCustomRole('');
                    }}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer flex items-center justify-between',
                      isSelected
                        ? 'bg-[#EEF7F1] border-[#008855] text-[#004D2F] shadow-2xs font-bold'
                        : 'border-[#E2ECE5] bg-white text-neutral-600 hover:bg-[#F4F9F6]'
                    )}
                  >
                    <span>{role}</span>
                    {isSelected && <Check size={14} className="text-[#008855]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom role input */}
            <div className="mt-2.5">
              <input
                type="text"
                placeholder="Or specify another custom role (e.g. Cloud Security Architect)"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#D5E5DC] rounded-xl focus:outline-none focus:border-[#008855] focus:ring-1 focus:ring-[#008855]"
              />
            </div>
          </div>

          {/* Target Skills Focus */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#004D2F] uppercase tracking-wider">
                2. Target Skills & Topics
              </label>
              <span className="text-[11px] text-neutral-400">Click to toggle focus</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#F8FAF9] border border-[#E5EFE9]">
              {targetSkills.map((skill) => (
                <span
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white border border-[#D5E5DC] text-[#004D2F] shadow-2xs cursor-pointer hover:border-red-300 hover:text-red-700 transition-colors"
                  title="Click to remove"
                >
                  <Sparkles size={12} className="text-[#008855]" />
                  <span>{skill}</span>
                  <X size={12} className="opacity-40 hover:opacity-100" />
                </span>
              ))}

              {/* Add custom skill input */}
              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSkill(e);
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-transparent border-b border-[#B8D5C4] focus:outline-none focus:border-[#008855] w-24 focus:w-36 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Difficulty and Questions count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Number of questions */}
            <div>
              <label className="block text-xs font-semibold text-[#004D2F] uppercase tracking-wider mb-2">
                3. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map((num) => {
                  const isSelected = numQuestions === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumQuestions(num)}
                      className={cn(
                        'py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer',
                        isSelected
                          ? 'bg-[#EEF7F1] border-[#008855] text-[#004D2F] font-bold'
                          : 'border-[#E2ECE5] bg-white text-neutral-600 hover:bg-[#F4F9F6]'
                      )}
                    >
                      {num} {num === 1 ? 'Question' : 'Questions'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-[#004D2F] uppercase tracking-wider mb-2">
                4. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as InterviewDifficulty[]).map((diff) => {
                  const isSelected = difficulty === diff;
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={cn(
                        'py-2 rounded-xl text-xs font-semibold border capitalize text-center transition-all cursor-pointer',
                        isSelected
                          ? 'bg-[#EEF7F1] border-[#008855] text-[#004D2F] font-bold'
                          : 'border-[#E2ECE5] bg-white text-neutral-600 hover:bg-[#F4F9F6]'
                      )}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#EAF2ED] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!selectedRole && !customRole)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#008855] hover:bg-[#007044] shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Questions...</span>
                </>
              ) : (
                <>
                  <Zap size={15} />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
