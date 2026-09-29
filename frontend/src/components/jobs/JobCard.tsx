import React from 'react';
import { JobPosting } from '@/types/jobs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, ArrowRight, FileCheck } from 'lucide-react';
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
    <Card
      onClick={() => onSelect(job)}
      className="cursor-pointer hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group"
    >
      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider font-mono">
                {job.extracted_role || job.category || 'Engineering'}
              </span>
              <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{job.company}</span>
              </p>
            </div>

            {job.is_remote && (
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                Remote
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 pb-3 space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location_city || 'India'}
            </span>

            {(job.salary_min || job.salary_max) && (
              <span className="font-mono text-success font-semibold">
                {job.currency} {job.salary_min?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Extracted Skill Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.extracted_skills?.slice(0, 4).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-[11px] bg-muted/60 text-foreground/80 hover:bg-muted"
              >
                {skill}
              </Badge>
            ))}
            {(job.extracted_skills?.length || 0) > 4 && (
              <span className="text-[10px] text-muted-foreground self-center px-1">
                +{(job.extracted_skills?.length || 0) - 4} more
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
          View details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={handleAnalyze}
          className="text-xs h-7 px-2.5 text-primary border-primary/30 hover:bg-primary hover:text-white"
        >
          <FileCheck className="h-3.5 w-3.5 mr-1" />
          Analyze Fit
        </Button>
      </CardFooter>
    </Card>
  );
};
