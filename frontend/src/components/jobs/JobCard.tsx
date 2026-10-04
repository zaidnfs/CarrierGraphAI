import React from 'react';
import { JobPosting } from '@/types/jobs';
import { ReiconAtsDoc } from '@/components/icons/Reicon';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
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
    <div
      onClick={() => onSelect(job)}
      className="cursor-pointer rounded-2xl border border-[#E2E8E5] bg-white p-5 flex flex-col justify-between group transition-all shadow-xs hover:border-[#008855]/40 hover:shadow-sm"
    >
      <div className="space-y-3">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="inline-block text-[11px] font-semibold text-[#004D2F] bg-[#EEF7F1] border border-[#D6E8DD] px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
              {job.extracted_role || job.category || 'Software Engineer'}
            </span>
            <h3 className="font-semibold text-base text-[#0A1A12] group-hover:text-[#008855] transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-neutral-500 flex items-center gap-1.5 font-medium">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-[#008855]" />
              <span className="truncate">{job.company}</span>
            </p>
          </div>

          {job.is_remote && (
            <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#EEF7F1] text-[#004D2F] border border-[#D6E8DD]">
              Remote
            </span>
          )}
        </div>

        {/* Location & Salary Info */}
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            {job.location_city || 'India'}
          </span>

          {(job.salary_min || job.salary_max) && (
            <span className="font-mono text-[#008855] font-semibold flex items-center">
              {job.currency} {job.salary_min?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Extracted Skill Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.extracted_skills?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#F8FAF8] text-neutral-700 border border-neutral-200 group-hover:border-[#008855]/30 transition-colors"
            >
              {skill}
            </span>
          ))}
          {(job.extracted_skills?.length || 0) > 4 && (
            <span className="text-[10px] text-neutral-400 self-center px-1 font-mono">
              +{(job.extracted_skills?.length || 0) - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
        <span className="text-neutral-500 group-hover:text-[#008855] transition-colors flex items-center gap-1">
          View details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>

        <button
          type="button"
          onClick={handleAnalyze}
          className="text-xs h-7 px-3 rounded-full font-semibold text-white bg-[#008855] hover:bg-[#007347] active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
        >
          <ReiconAtsDoc size={12} strokeWidth={2} />
          <span>Analyze Fit</span>
        </button>
      </div>
    </div>
  );
};
