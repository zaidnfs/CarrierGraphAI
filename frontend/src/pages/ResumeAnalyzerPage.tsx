import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resumeService } from '@/services/resumeService';
import { jobService } from '@/services/jobService';
import { ResumeSummary, FitScoreResult } from '@/types/resumes';
import { JobPosting } from '@/types/jobs';
import { ResumeUploadZone } from '@/components/resumes/ResumeUploadZone';
import { ScoreGauge } from '@/components/shared/ScoreGauge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorRetryCard } from '@/components/shared/ErrorRetryCard';
import {
  FileText,
  Briefcase,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Plus,
  Clock,
  Loader2,
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedJobId = searchParams.get('jobId');

  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>(preselectedJobId || '');

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingAts, setIsGeneratingAts] = useState(false);
  const [fitResult, setFitResult] = useState<FitScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUploadZone, setShowUploadZone] = useState(false);

  // Load initial resumes & jobs list
  const loadData = async () => {
    setIsLoadingData(true);
    setError(null);
    try {
      const [resumesData, jobsData] = await Promise.all([
        resumeService.getResumes(),
        jobService.getJobs({}),
      ]);

      setResumes(resumesData);
      setJobs(jobsData);

      if (resumesData.length > 0 && !selectedResumeId) {
        setSelectedResumeId(resumesData[0].id);
      }
      if (preselectedJobId) {
        setSelectedJobId(preselectedJobId);
      } else if (jobsData.length > 0 && !selectedJobId) {
        setSelectedJobId(jobsData[0].id);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to load resume or job data. Please check connection to backend.'
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadSuccess = (newResume: ResumeSummary) => {
    setResumes((prev) => [newResume, ...prev]);
    setSelectedResumeId(newResume.id);
    setShowUploadZone(false);
    setFitResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId || !selectedJobId) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await resumeService.analyzeResume(selectedResumeId, selectedJobId);
      setFitResult(result);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to run fit analysis against the selected job posting.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadAts = async () => {
    if (!selectedResumeId) return;
    setIsGeneratingAts(true);

    try {
      const blob = await resumeService.downloadAtsResume(selectedResumeId, selectedJobId || undefined);
      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ATS_Tailored_Resume_${Date.now()}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to generate ATS resume. Please try again.');
    } finally {
      setIsGeneratingAts(false);
    }
  };

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Resume Analyzer & ATS Engine
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compute job-fit calibration, uncover skill gaps, and export optimized ATS DOCX resumes
          </p>
        </div>

        <Button
          variant={showUploadZone ? 'secondary' : 'default'}
          size="sm"
          onClick={() => setShowUploadZone(!showUploadZone)}
        >
          {showUploadZone ? 'Hide Uploader' : (
            <>
              <Plus className="h-4 w-4 mr-1.5" />
              Upload New Resume
            </>
          )}
        </Button>
      </div>

      {/* Upload Zone (collapsible) */}
      {(showUploadZone || resumes.length === 0) && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upload Candidate Resume</CardTitle>
            <CardDescription className="text-xs">
              Upload your resume in PDF or DOCX format to parse skills and experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeUploadZone onUploadSuccess={handleUploadSuccess} />
          </CardContent>
        </Card>
      )}

      {/* Main Analyzer Workflow */}
      {isLoadingData ? (
        <div className="p-12 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading resumes and job data...</p>
        </div>
      ) : error ? (
        <ErrorRetryCard message={error} onRetry={loadData} />
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes uploaded yet"
          description="Upload your first resume in PDF or DOCX format to start comparing against live market jobs."
          actionLabel="Upload Resume"
          onAction={() => setShowUploadZone(true)}
        />
      ) : (
        <div className="space-y-6">
          {/* Selectors Bar */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Resume Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-primary" />
                    Select Your Resume
                  </label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => {
                      setSelectedResumeId(e.target.value);
                      setFitResult(null);
                    }}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {resumes.map((res) => (
                      <option key={res.id} value={res.id}>
                        {res.original_filename} ({res.skills?.length || 0} skills identified)
                      </option>
                    ))}
                  </select>

                  {selectedResume && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="font-mono uppercase">{selectedResume.file_type}</span>
                      <span>•</span>
                      <span>{(selectedResume.file_size / 1024).toFixed(0)} KB</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(selectedResume.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Job Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-secondary" />
                    Target Job Listing
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      setFitResult(null);
                    }}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} — {job.company} ({job.location_city || 'India'})
                      </option>
                    ))}
                  </select>

                  {selectedJob && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span className="font-semibold text-foreground">{selectedJob.company}</span>
                      <span>•</span>
                      <span>{selectedJob.extracted_skills?.length || 0} skills required</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Compares parsed candidate skills against job requirements using our NER & semantic scoring engine.
                </span>

                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedResumeId || !selectedJobId || isAnalyzing}
                  isLoading={isAnalyzing}
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Fit Score
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results View */}
          {fitResult && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Score & Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Gauge Card */}
                <Card className="flex flex-col items-center justify-center p-6 text-center">
                  <CardHeader className="p-0 pb-4 text-center">
                    <CardTitle className="text-base font-semibold">Match Score</CardTitle>
                    <CardDescription className="text-xs">Objective calibration against listing</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col items-center">
                    <ScoreGauge score={Math.round(fitResult.fit_score)} size={140} />
                    <p className="text-xs text-muted-foreground mt-4">
                      {fitResult.total_matched_skills} of {fitResult.total_required_skills} required skills matched
                    </p>
                  </CardContent>
                </Card>

                {/* Analysis Summary & ATS Action */}
                <Card className="lg:col-span-2 flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Executive Evaluation</CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {fitResult.job_title}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Algorithmically evaluated by SkillBridge Resume Engine
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/60">
                      {fitResult.summary}
                    </p>

                    {fitResult.recommendations && fitResult.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-warning" /> Recommendations for ATS Optimization
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                          {fitResult.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        Ready to apply? Generate a formatted, ATS-compliant DOCX document highlighting matched keywords.
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownloadAts}
                        isLoading={isGeneratingAts}
                        className="shrink-0"
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        Download ATS Resume (.docx)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Matched & Missing Skills Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <CardTitle className="text-base font-semibold">Matched Skills</CardTitle>
                      </div>
                      <Badge variant="success">
                        {fitResult.matched_skills.length} Present
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Skills found in both your resume and the target job posting
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fitResult.matched_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {fitResult.matched_skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="success"
                            className="px-2.5 py-1 text-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        No direct required skills matched for this listing yet.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Missing Skills (Skill Gaps) */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        <CardTitle className="text-base font-semibold">Missing Skills (Skill Gaps)</CardTitle>
                      </div>
                      <Badge variant="warning">
                        {fitResult.missing_skills.length} Gaps
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Target requirements missing from your resume (learning recommendations in Phase 3)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fitResult.missing_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {fitResult.missing_skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="warning"
                            className="px-2.5 py-1 text-xs flex items-center gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-success font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Great job! You match all listed requirements.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
