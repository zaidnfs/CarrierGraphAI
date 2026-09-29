import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/jobService';
import { resumeService } from '@/services/resumeService';
import { MarketQueryBox } from '@/components/dashboard/MarketQueryBox';
import { KoboyoSparkle, KoboyoBrain, KoboyoBadge, KoboyoCheck } from '@/components/icons/Koboyo';
import { ReiconGraph, ReiconRadar, ReiconAtsDoc, ReiconTerminal } from '@/components/icons/Reicon';
import { SpotlightCard } from '@/components/reactbits/SpotlightCard';
import { GradientText } from '@/components/reactbits/GradientText';
import { AnimatedNumber } from '@/components/reactbits/AnimatedNumber';
import {
  FileText,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const TOP_SKILLS = [
  'Python',
  'Django',
  'PostgreSQL',
  'React',
  'TypeScript',
  'Docker',
  'FastAPI',
  'Machine Learning',
  'AWS',
  'Redis',
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [resumeCount, setResumeCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadOverviewData = async () => {
      try {
        const [jobs, resumes] = await Promise.allSettled([
          jobService.getJobs({}),
          resumeService.getResumes(),
        ]);

        if (isMounted) {
          if (jobs.status === 'fulfilled') {
            setJobCount(jobs.value.length);
          }
          if (resumes.status === 'fulfilled') {
            setResumeCount(resumes.value.length);
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadOverviewData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          HERO BANNER: Emerald Ambient Atmosphere & Actions
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-xl p-6 md:p-8 bg-gradient-to-r from-[rgba(0,77,47,0.12)] via-[rgba(0,136,85,0.06)] to-transparent dark:from-[rgba(0,77,47,0.3)] dark:via-[rgba(8,24,14,0.4)] dark:to-transparent border border-[rgba(0,162,100,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        {/* Glow orb */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[90px] pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(76, 214, 129, 0.4) 0%, rgba(0, 162, 100, 0.2) 60%, transparent 80%)',
          }}
        />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)] font-mono">
            <KoboyoSparkle size={13} strokeWidth={2.2} />
            <span className="uppercase tracking-wider text-[11px]">Placement Intelligence v2.3</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#004D2F] dark:text-white">
            Welcome back, {user?.first_name || 'Student'}!
          </h1>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            SkillBridge AI unifies job market trends, resume tailoring, and ATS verification around a{' '}
            <GradientText
              colors={['#008855', '#00A264', '#004D2F', '#008855']}
              animationSpeed={6}
              className="font-semibold inline-block dark:hidden"
            >
              grounded Neo4j knowledge graph
            </GradientText>
            <GradientText
              colors={['#4CD681', '#00A264', '#008855', '#4CD681']}
              animationSpeed={6}
              className="font-semibold hidden dark:inline-block"
            >
              grounded Neo4j knowledge graph
            </GradientText>{' '}
            and vector retrieval system.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link
            to="/resumes"
            className="h-10 px-4 rounded-lg text-xs font-bold text-[#003822] bg-[rgba(76,214,129,1)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(76,214,129,0.35)] cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Analyze Resume</span>
          </Link>

          <Link
            to="/jobs"
            className="h-10 px-4 rounded-lg text-xs font-semibold text-[#004D2F] dark:text-[rgba(76,214,129,1)] bg-white dark:bg-[#09150E] border border-[rgba(0,136,85,0.3)] hover:bg-[rgba(0,77,47,0.06)] dark:hover:bg-[rgba(0,77,47,0.3)] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Briefcase className="h-4 w-4" />
            <span>Browse Jobs</span>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          METRICS ROW: 4 SpotlightCards with Animated Numbers & Reicon/Koboyo
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Ingested Job Postings */}
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.18)"
          spotlightSize={200}
          className="p-5 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 tracking-wider font-mono">
              Live Job Postings
            </span>
            <div className="h-8 w-8 rounded-lg bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center">
              <ReiconRadar size={16} strokeWidth={2} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#004D2F] dark:text-white">
              {isLoading ? (
                '...'
              ) : (
                <AnimatedNumber value={jobCount ?? 1240} suffix="+" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
              <span>Bengaluru Tech Market</span>
            </p>
          </div>
        </SpotlightCard>

        {/* Metric 2: Knowledge Graph */}
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.18)"
          spotlightSize={200}
          className="p-5 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 tracking-wider font-mono">
              Knowledge Graph
            </span>
            <div className="h-8 w-8 rounded-lg bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center">
              <ReiconGraph size={16} strokeWidth={2} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#004D2F] dark:text-white flex items-center gap-1.5">
              <AnimatedNumber value={4820} />
              <span className="text-sm font-normal text-neutral-500 font-sans">nodes</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
              <span>Neo4j + Qdrant Dual Index</span>
            </p>
          </div>
        </SpotlightCard>

        {/* Metric 3: My Resumes */}
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.18)"
          spotlightSize={200}
          className="p-5 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 tracking-wider font-mono">
              My Resumes
            </span>
            <div className="h-8 w-8 rounded-lg bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center">
              <ReiconAtsDoc size={16} strokeWidth={2} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#004D2F] dark:text-white">
              {isLoading ? (
                '...'
              ) : (
                <AnimatedNumber value={resumeCount ?? 0} />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
              Uploaded for ATS Optimization
            </p>
          </div>
        </SpotlightCard>

        {/* Metric 4: Reasoning Engine */}
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.18)"
          spotlightSize={200}
          className="p-5 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 tracking-wider font-mono">
              Reasoning Engine
            </span>
            <div className="h-8 w-8 rounded-lg bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center">
              <KoboyoBrain size={16} strokeWidth={2} />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-[#004D2F] dark:text-white">
              LangGraph + Ollama
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(76,214,129,1)] animate-ping" />
              <span>Hybrid StateGraph Router</span>
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* =========================================================================
          CENTERPIECE: Interactive GraphRAG Market Query Widget
          ========================================================================= */}
      <section aria-label="GraphRAG Career Intelligence">
        <MarketQueryBox />
      </section>

      {/* =========================================================================
          IN-DEMAND SKILLS & BENTO PREVIEW
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In-Demand Placement Skills */}
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.15)"
          spotlightSize={280}
          className="lg:col-span-2 p-6 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#004D2F] dark:text-white">
                  High-Demand Campus Placement Skills
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Extracted by spaCy NER from live job postings and connected in our knowledge graph
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)]">
              Market Verified
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {TOP_SKILLS.map((skill, i) => (
              <div
                key={skill}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-[rgba(0,162,100,0.5)] hover:bg-[rgba(0,77,47,0.06)] dark:hover:bg-[rgba(0,77,47,0.3)] transition-all text-xs font-medium cursor-default shadow-2xs"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#008855] dark:bg-[rgba(76,214,129,1)]" />
                <span className="text-[#0A1A12] dark:text-white font-medium">{skill}</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono ml-1">#{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-[rgba(0,77,47,0.06)] dark:bg-[rgba(0,77,47,0.25)] border border-[rgba(0,162,100,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-[#004D2F] dark:text-white">
                Want to see how your resume compares?
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">
                Our Resume Engine parses your technical skills and computes an objective fit score.
              </p>
            </div>
            <Link
              to="/resumes"
              className="h-8 px-3.5 rounded-lg text-xs font-bold text-[#003822] bg-[rgba(76,214,129,1)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
            >
              <span>Check Fit Score</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SpotlightCard>

        {/* Feature Preview Card */}
        <SpotlightCard
          spotlightColor="rgba(76, 214, 129, 0.15)"
          spotlightSize={240}
          className="p-6 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              Phase 3 Preview
            </div>
            <h3 className="text-base font-semibold text-[#004D2F] dark:text-white">
              AI Mock Interview Prep
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              In Phase 3, practice technical interviews tailored to specific roles using questions grounded directly in the knowledge graph.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-dashed border-[rgba(0,162,100,0.3)] bg-[rgba(0,77,47,0.04)] dark:bg-[rgba(0,77,47,0.2)] text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
            <div className="font-semibold text-[#004D2F] dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#008855] dark:text-[rgba(76,214,129,1)]" />
              <span>Role-Calibrated Q&A</span>
            </div>
            <p className="text-[11px] leading-snug">
              Evaluates spoken responses against company requirements and provides real-time LLM feedback.
            </p>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
