import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resumeService } from '@/services/resumeService';
import { jobService } from '@/services/jobService';
import { ResumeSummary, FitScoreResult } from '@/types/resumes';
import { JobPosting } from '@/types/jobs';
import { ResumeUploadZone } from '@/components/resumes/ResumeUploadZone';
import { ScoreGauge } from '@/components/shared/ScoreGauge';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorRetryCard } from '@/components/shared/ErrorRetryCard';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { ReiconAtsDoc, ReiconRadar } from '@/components/icons/Reicon';
import { KoboyoSparkle, KoboyoBrain, KoboyoCheck } from '@/components/icons/Koboyo';
import {
  FileText,
  Briefcase,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)] font-mono mb-2">
            <ReiconAtsDoc size={13} strokeWidth={2} />
            <span>ATS Engine v2.3</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#004D2F] dark:text-white">
            Resume Analyzer & ATS Engine
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Compute job-fit calibration, uncover skill gaps, and export optimized ATS DOCX resumes
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadZone(!showUploadZone)}
          className="self-start sm:self-auto h-9 px-3.5 rounded-lg text-xs font-semibold text-[#004D2F] dark:text-[rgba(76,214,129,1)] bg-white dark:bg-[#09150E] border border-[rgba(0,136,85,0.3)] hover:bg-[rgba(0,77,47,0.06)] dark:hover:bg-[rgba(0,77,47,0.3)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {showUploadZone ? (
            'Hide Uploader'
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Upload New Resume</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Zone (collapsible) */}
      {(showUploadZone || resumes.length === 0) && (
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.16)"
          spotlightSize={280}
          className="p-6 rounded-xl border border-[rgba(0,162,100,0.25)] bg-card shadow-xs space-y-3"
        >
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#004D2F] dark:text-white">Upload Candidate Resume</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Upload your resume in PDF or DOCX format to parse skills and experience
            </p>
          </div>
          <ResumeUploadZone onUploadSuccess={handleUploadSuccess} />
        </SpotlightCard>
      )}

      {/* Main Analyzer Workflow */}
      {isLoadingData ? (
        <div className="p-12 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#008855] dark:text-[rgba(76,214,129,1)] mx-auto" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading resumes and job data...</p>
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
          <SpotlightCard
            spotlightColor="rgba(76, 214, 129, 0.14)"
            spotlightSize={280}
            className="p-5 sm:p-6 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Resume Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#004D2F] dark:text-white flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
                  Select Your Resume
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value);
                    setFitResult(null);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-[rgba(0,162,100,0.3)] bg-white dark:bg-[#09150E] text-sm text-[#0A1A12] dark:text-white focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] cursor-pointer"
                >
                  {resumes.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.original_filename} ({res.skills?.length || 0} skills identified)
                    </option>
                  ))}
                </select>

                {selectedResume && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-0.5 font-mono">
                    <span className="uppercase">{selectedResume.file_type}</span>
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#004D2F] dark:text-white flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
                  Target Job Listing
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setFitResult(null);
                  }}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-[rgba(0,162,100,0.3)] bg-white dark:bg-[#09150E] text-sm text-[#0A1A12] dark:text-white focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] cursor-pointer"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.company} ({job.location_city || 'India'})
                    </option>
                  ))}
                </select>

                {selectedJob && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 pt-0.5 font-mono">
                    <span className="font-semibold text-foreground">{selectedJob.company}</span>
                    <span>•</span>
                    <span>{selectedJob.extracted_skills?.length || 0} skills required</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Compares parsed candidate skills against job requirements using NER & semantic scoring engine.
              </span>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedResumeId || !selectedJobId || isAnalyzing}
                className="w-full sm:w-auto h-10 px-5 rounded-lg text-xs font-bold text-[#003822] bg-[rgba(76,214,129,1)] hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(76,214,129,0.3)] cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing Fit...</span>
                  </>
                ) : (
                  <>
                    <KoboyoSparkle size={14} strokeWidth={2.2} />
                    <span>Analyze Fit Score</span>
                  </>
                )}
              </button>
            </div>
          </SpotlightCard>

          {/* Analysis Results View */}
          {fitResult && (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              {/* Score & Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Gauge Card */}
                <SpotlightCard
                  spotlightColor="rgba(76, 214, 129, 0.2)"
                  spotlightSize={220}
                  className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-[rgba(0,162,100,0.25)] bg-card shadow-xs"
                >
                  <div className="pb-3 text-center">
                    <h3 className="text-base font-semibold text-[#004D2F] dark:text-white">Match Score</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Objective calibration against listing</p>
                  </div>
                  <ScoreGauge score={Math.round(fitResult.fit_score)} size={140} />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 font-mono">
                    {fitResult.total_matched_skills} of {fitResult.total_required_skills} required skills matched
                  </p>
                </SpotlightCard>

                {/* Analysis Summary & ATS Action */}
                <SpotlightCard
                  spotlightColor="rgba(76, 214, 129, 0.16)"
                  spotlightSize={300}
                  className="lg:col-span-2 p-6 rounded-xl border border-[rgba(0,162,100,0.25)] bg-card shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                      <div>
                        <h3 className="text-lg font-bold text-[#004D2F] dark:text-white">Executive Evaluation</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Algorithmically evaluated by SkillBridge Resume Engine
                        </p>
                      </div>
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)]">
                        {fitResult.job_title}
                      </span>
                    </div>

                    <p className="text-sm text-[#0A1A12] dark:text-[#EDF2EE] leading-relaxed bg-[rgba(0,77,47,0.04)] dark:bg-[rgba(0,77,47,0.2)] p-4 rounded-xl border border-[rgba(0,162,100,0.2)]">
                      {fitResult.summary}
                    </p>

                    {fitResult.recommendations && fitResult.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Recommendations for ATS Optimization
                        </h4>
                        <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                          {fitResult.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#008855] dark:bg-[rgba(76,214,129,1)] mt-1 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Ready to apply? Generate a formatted, ATS-compliant DOCX document highlighting matched keywords.
                    </span>
                    <button
                      type="button"
                      onClick={handleDownloadAts}
                      disabled={isGeneratingAts}
                      className="shrink-0 h-10 px-4 rounded-lg text-xs font-bold text-[#003822] bg-[rgba(76,214,129,1)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(76,214,129,0.3)] disabled:opacity-50"
                    >
                      {isGeneratingAts ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download ATS Resume (.docx)</span>
                        </>
                      )}
                    </button>
                  </div>
                </SpotlightCard>
              </div>

              {/* Matched & Missing Skills Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <SpotlightCard
                  spotlightColor="rgba(76, 214, 129, 0.16)"
                  spotlightSize={240}
                  className="p-5 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
                      <h3 className="text-base font-semibold text-[#004D2F] dark:text-white">Matched Skills</h3>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-[rgba(0,136,85,0.12)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)]">
                      {fitResult.matched_skills.length} Present
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Skills found in both your resume and the target job posting
                  </p>

                  {fitResult.matched_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {fitResult.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)] flex items-center gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 italic">
                      No direct required skills matched for this listing yet.
                    </p>
                  )}
                </SpotlightCard>

                {/* Missing Skills (Skill Gaps) */}
                <SpotlightCard
                  spotlightColor="rgba(245, 158, 11, 0.16)"
                  spotlightSize={240}
                  className="p-5 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="text-base font-semibold text-[#004D2F] dark:text-white">Missing Skills (Skill Gaps)</h3>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      {fitResult.missing_skills.length} Gaps
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Target requirements missing from your resume (learning recommendations in Phase 3)
                  </p>

                  {fitResult.missing_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {fitResult.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#008855] dark:text-[rgba(76,214,129,1)] font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Great job! You match all listed requirements.
                    </p>
                  )}
                </SpotlightCard>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
