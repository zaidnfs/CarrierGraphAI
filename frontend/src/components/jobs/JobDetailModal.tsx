import React from 'react';
import { JobPosting } from '@/types/jobs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Building2, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ReiconAtsDoc } from '@/components/icons/Reicon';
import { useNavigate } from 'react-router-dom';

interface JobDetailModalProps {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, isOpen, onClose }) => {
  const navigate = useNavigate();
  if (!job) return null;

  const handleAnalyze = () => {
    onClose();
    navigate(`/resumes?jobId=${job.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border border-[#E2E8E5] bg-white rounded-2xl shadow-xl">
        <DialogHeader className="space-y-2 border-b border-neutral-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-[#EEF7F1] text-[#004D2F] border border-[#D6E8DD]">
              {job.category || job.extracted_role || 'Job Posting'}
            </span>
            {job.is_remote && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-[#EEF7F1] text-[#004D2F] border border-[#D6E8DD]">
                Remote
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-[#0A1A12]">
            {job.title}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <Building2 className="h-3.5 w-3.5 text-[#008855]" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
              {job.location_city || 'India'}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span className="font-mono text-[#008855] font-semibold">
                {job.currency} {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Extracted Skills Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Required & Extracted Skills (spaCy NER)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.extracted_skills && job.extracted_skills.length > 0 ? (
                job.extracted_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[#EEF7F1] text-[#004D2F] border border-[#D6E8DD]"
                  >
                    <CheckCircle2 className="h-3 w-3 text-[#008855]" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-400 italic">No specific skills extracted.</span>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              Job Description
            </h4>
            <div className="text-sm text-[#111827] whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E5]">
              {job.description || 'No detailed description provided by the job provider.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100">
            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <span>View on {job.source_provider || 'Adzuna'}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full sm:w-auto h-10 px-5 rounded-full text-xs font-semibold text-white bg-[#008855] hover:bg-[#007347] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#008855]/20 ml-auto"
            >
              <ReiconAtsDoc size={14} strokeWidth={2} />
              <span>Compare with My Resume</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
