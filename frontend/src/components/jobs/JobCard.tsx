import React from 'react';
import { JobPosting } from '@/types/jobs';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { ReiconAtsDoc, ReiconRadar } from '@/components/icons/Reicon';
import { Building2, MapPin, ArrowRight, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: JobPosting;
  onSelect: (job: JobPosting) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const navigate = useNavigate();

  const handleAnalyze = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/resumes?jobId=${job.id}`);
  };

  return (
    <SpotlightCard
      onClick={() => onSelect(job)}
      spotlightColor="rgba(76, 214, 129, 0.16)"
      spotlightSize={220}
      className="cursor-pointer rounded-xl border border-[rgba(0,162,100,0.22)] bg-card p-5 flex flex-col justify-between group transition-all shadow-2xs hover:border-[rgba(0,162,100,0.45)]"
    >
      <div className="space-y-3">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#008855] dark:text-[rgba(76,214,129,1)] uppercase tracking-wider font-mono">
              {job.extracted_role || job.category || 'Software Engineer'}
            </span>
            <h3 className="font-semibold text-base text-[#004D2F] dark:text-white group-hover:text-[#008855] dark:group-hover:text-[rgba(76,214,129,1)] transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5 font-medium">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
              <span className="truncate">{job.company}</span>
            </p>
          </div>

          {job.is_remote && (
            <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.25)]">
              Remote
            </span>
          )}
        </div>

        {/* Location & Salary Info */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location_city || 'India'}
          </span>

          {(job.salary_min || job.salary_max) && (
            <span className="font-mono text-[#008855] dark:text-[rgba(76,214,129,1)] font-semibold flex items-center">
              {job.currency} {job.salary_min?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Extracted Skill Badges (8px Sleek Corners) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.extracted_skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 text-[#0A1A12] dark:text-neutral-300 border border-neutral-200 dark:border-white/10 group-hover:border-[rgba(0,162,100,0.3)] transition-colors"
            >
              {skill}
            </span>
          ))}
          {(job.extracted_skills?.length || 0) > 4 && (
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 self-center px-1 font-mono">
              +{(job.extracted_skills?.length || 0) - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs">
        <span className="text-neutral-500 dark:text-neutral-400 group-hover:text-[#004D2F] dark:group-hover:text-white transition-colors flex items-center gap-1">
          View details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>

        <button
          type="button"
          onClick={handleAnalyze}
          className="text-xs h-7 px-3 rounded-md font-semibold text-[#004D2F] dark:text-[rgba(76,214,129,1)] bg-[rgba(0,136,85,0.08)] dark:bg-[rgba(0,77,47,0.3)] border border-[rgba(0,162,100,0.3)] hover:bg-[rgba(76,214,129,1)] hover:text-[#003822] dark:hover:bg-[rgba(76,214,129,1)] dark:hover:text-[#003822] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
        >
          <ReiconAtsDoc size={12} strokeWidth={2} />
          <span>Analyze Fit</span>
        </button>
      </div>
    </SpotlightCard>
  );
};
