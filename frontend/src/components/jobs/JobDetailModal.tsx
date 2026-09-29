import React from 'react';
import { JobPosting } from '@/types/jobs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">{job.category || job.extracted_role || 'Job Posting'}</Badge>
            {job.is_remote && <Badge variant="secondary">Remote</Badge>}
          </div>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-foreground font-medium">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {job.location_city || 'India'}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span className="font-mono text-success font-semibold">
                {job.currency} {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Extracted Skills Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Required & Extracted Skills (spaCy NER)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.extracted_skills && job.extracted_skills.length > 0 ? (
                job.extracted_skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No specific skills extracted.</span>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Job Description
            </h4>
            <div className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto p-4 rounded-lg bg-muted/30 border border-border/60">
              {job.description || 'No detailed description provided by the job provider.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
            {job.source_url && (
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                  View on {job.source_provider || 'Adzuna'} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}

            <Button onClick={handleAnalyze} className="w-full sm:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Compare with My Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
