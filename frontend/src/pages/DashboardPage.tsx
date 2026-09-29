import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { jobService } from '@/services/jobService';
import { resumeService } from '@/services/resumeService';
import { MarketQueryBox } from '@/components/dashboard/MarketQueryBox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  FileText,
  Network,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle,
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
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase tracking-wider font-mono">
              Placement Intelligence v2.3
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.first_name || 'Student'}!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            SkillBridge AI unifies job market trends, resume tailoring, and ATS verification around a grounded Neo4j knowledge graph and vector retrieval system.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild variant="default" className="shadow-md shadow-primary/20">
            <Link to="/resumes">
              <FileText className="h-4 w-4 mr-1.5" />
              Analyze Resume
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/jobs">
              <Briefcase className="h-4 w-4 mr-1.5" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Ingested Job Postings
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {isLoading ? '...' : (jobCount ?? 'Active')}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" /> Synced via Adzuna API
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Knowledge Graph
            </CardTitle>
            <Network className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">Neo4j + Qdrant</div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-success" /> Roles & Co-occurrences
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              My Resumes
            </CardTitle>
            <FileText className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {isLoading ? '...' : (resumeCount ?? 0)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Uploaded for ATS Optimization
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Reasoning Engine
            </CardTitle>
            <Sparkles className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">LangGraph</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Ollama + StateGraph Planner
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Centerpiece: Interactive GraphRAG Market Query Widget */}
      <section aria-label="GraphRAG Career Intelligence">
        <MarketQueryBox />
      </section>

      {/* In-Demand Skills & Quick Action Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In-Demand Placement Skills */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">High-Demand Campus Placement Skills</CardTitle>
              </div>
              <Badge variant="success">Market Verified</Badge>
            </div>
            <CardDescription className="text-xs">
              Extracted by spaCy NER from live job postings and connected in our knowledge graph
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 pt-1">
              {TOP_SKILLS.map((skill, i) => (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 transition-colors text-xs font-medium cursor-default"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{skill}</span>
                  <span className="text-[10px] text-muted-foreground font-mono ml-1">#{i + 1}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-foreground">Want to see how your resume compares?</p>
                <p className="text-muted-foreground">
                  Our Resume Engine parses your technical skills and computes an objective fit score.
                </p>
              </div>
              <Button asChild size="sm" variant="default" className="shrink-0">
                <Link to="/resumes">
                  Check Fit Score <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <Badge variant="outline" className="w-fit mb-2">Phase 3 Preview</Badge>
            <CardTitle className="text-base font-semibold">AI Mock Interview Prep</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              In Phase 3, you will be able to practice technical interviews tailored to specific roles using questions grounded directly in the knowledge graph.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="p-3 rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-secondary" /> Role-Calibrated Q&A
              </div>
              <p>
                Evaluates responses against company requirements and provides real-time LLM feedback.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
