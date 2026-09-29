import React from 'react';
import { JobPosting } from '@/types/jobs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Building2, MapPin, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border border-[rgba(0,162,100,0.25)] bg-background">
        <DialogHeader className="space-y-2 border-b border-border/70 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-[rgba(0,136,85,0.12)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)]">
              {job.category || job.extracted_role || 'Job Posting'}
            </span>
            {job.is_remote && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/30">
                Remote
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold text-[#004D2F] dark:text-white">
            {job.title}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Building2 className="h-3.5 w-3.5 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {job.location_city || 'India'}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span className="font-mono text-[#008855] dark:text-[rgba(76,214,129,1)] font-semibold">
                {job.currency} {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Extracted Skills Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Required & Extracted Skills (spaCy NER)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.extracted_skills && job.extracted_skills.length > 0 ? (
                job.extracted_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[rgba(0,136,85,0.08)] dark:bg-[rgba(0,77,47,0.3)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)]"
                  >
                    <CheckCircle2 className="h-3 w-3 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No specific skills extracted.</span>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
              Job Description
            </h4>
            <div className="text-sm text-[#0A1A12] dark:text-[#EDF2EE] whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto p-4 rounded-lg bg-muted/30 border border-border/60">
              {job.description || 'No detailed description provided by the job provider.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <span>View on {job.source_provider || 'Adzuna'}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              className="w-full sm:w-auto h-10 px-4 rounded-lg text-xs font-bold text-[#003822] bg-[rgba(76,214,129,1)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(76,214,129,0.3)] ml-auto"
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
