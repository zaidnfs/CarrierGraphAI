import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Check,
  Search,
  Code2,
  Terminal,
  FileText,
  Briefcase,
  Network,
  Copy,
  ExternalLink,
  ChevronRight,
  Star,
  Layers,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const DesignShowcasePage: React.FC = () => {
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'resume' | 'graph' | 'tokens'>('dashboard');
  const [segmentedTab, setSegmentedTab] = useState<'overview' | 'api' | 'components'>('overview');
  const [pillNav, setPillNav] = useState<'realtime' | 'historical'>('realtime');
  const [copied, setCopied] = useState(false);
  const [queryInput, setQueryInput] = useState('What backend skills are most in demand in Bengaluru?');
  const [queryStrategy, setQueryStrategy] = useState<'hybrid' | 'graph' | 'vector'>('hybrid');

  const isDark = theme === 'dark';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDark ? 'bg-[#090D14] text-[#F3F4F6]' : 'bg-[#FFFFFF] text-[#0B0F19]'
      }`}
    >
      {/* Top Sticky Bar — System Controls & Live Theme Switcher */}
      <header
        className={`sticky top-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#090D14]/90 border-white/10 text-white'
            : 'bg-white/90 border-black/5 text-[#0B0F19]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-full bg-[#00D4A4] flex items-center justify-center text-[#0B0F19] font-bold shadow-[0_0_15px_rgba(0,212,164,0.4)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-base flex items-center gap-1.5">
              SkillBridge <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#00D4A4]/15 text-[#00D4A4] font-semibold border border-[#00D4A4]/30">Mintlify Edition</span>
            </span>
          </Link>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-3">
          {/* Pill Tab selector */}
          <div
            className={`hidden sm:flex items-center p-1 rounded-full border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}
          >
            {(['dashboard', 'resume', 'tokens'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1 text-xs font-medium rounded-full capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#00D4A4] text-[#0B0F19] font-semibold shadow-sm'
                    : isDark
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                : 'bg-black/5 hover:bg-black/10 border-black/10 text-[#0B0F19]'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[#00D4A4]" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-indigo-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <Link
            to="/"
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all font-medium ${
              isDark
                ? 'border-white/15 hover:bg-white/5 text-neutral-300'
                : 'border-black/10 hover:bg-black/5 text-neutral-700'
            }`}
          >
            Back to App
          </Link>
        </div>
      </header>

      {/* Hero Section — Mintlify Atmospheric Hero Band */}
      <section
        className={`relative overflow-hidden pt-16 pb-20 px-4 md:px-8 border-b transition-all ${
          isDark
            ? 'bg-gradient-to-br from-[#06181b] via-[#08181e] to-[#090D14] border-white/10'
            : 'bg-gradient-to-b from-[#E0F2FE] via-[#F0FDF4] to-[#FFFFFF] border-black/5'
        }`}
      >
        {/* Atmospheric Glow Mesh */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] blur-[120px] pointer-events-none rounded-full opacity-40 ${
            isDark ? 'bg-[#00D4A4]/20' : 'bg-[#38BDF8]/25'
          }`}
        />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm transition-all bg-white/70 dark:bg-white/5 border-black/10 dark:border-white/15">
            <span className="h-2 w-2 rounded-full bg-[#00D4A4] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              GraphRAG Career Intelligence System
            </span>
            <span className="text-neutral-400">|</span>
            <span className="text-[#00D4A4] font-medium font-mono text-[11px]">v2.3 Mintlify Design</span>
          </div>

          {/* Main Title: Tight leading 1.05 & negative letter spacing */}
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-2px] leading-[1.05] max-w-4xl mx-auto ${
              isDark ? 'text-white' : 'text-[#0B0F19]'
            }`}
          >
            The intelligent knowledge platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4A4] to-[#2563EB]">career placement</span>.
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            Unified GraphRAG reasoning across live job postings, verified skill relationships, tailored ATS resume scoring, and AI mock interview evaluations.
          </p>

          {/* CTA Button Row — Signature Pill Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* button-accent-green: Mint pill */}
            <button className="bg-[#00D4A4] text-[#0B0F19] rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#00B88E] shadow-[0_0_25px_rgba(0,212,164,0.35)] transition-all active:scale-[0.98] flex items-center gap-2">
              <span>Try Graph Query</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* button-primary or button-on-dark */}
            <button
              className={`rounded-full px-6 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
                isDark
                  ? 'bg-white text-[#0B0F19] hover:bg-neutral-200'
                  : 'bg-[#0B0F19] text-white hover:bg-neutral-800'
              }`}
            >
              Analyze Resume
            </button>

            {/* button-secondary: Outlined pill */}
            <button
              className={`rounded-full px-5 py-3 text-sm font-medium border transition-all ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/5'
                  : 'border-black/15 text-[#0B0F19] hover:bg-black/5'
              }`}
            >
              Browse 1,240+ Placements
            </button>
          </div>
        </div>

        {/* Level 3 Mockup Frame (hero-product-mockup with deep diffuse shadow) */}
        <div className="max-w-5xl mx-auto mt-12 relative z-10">
          <div
            className={`rounded-xl border overflow-hidden transition-all shadow-[0_24px_48px_-8px_rgba(0,0,0,0.25)] ${
              isDark
                ? 'bg-[#0F172A] border-white/10'
                : 'bg-white border-black/10'
            }`}
          >
            {/* Mockup Window Header Bar */}
            <div
              className={`px-4 py-3 border-b flex items-center justify-between text-xs ${
                isDark
                  ? 'bg-[#0B0F19]/80 border-white/10 text-neutral-400'
                  : 'bg-neutral-50 border-black/5 text-neutral-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="font-mono text-[11px] ml-2 text-neutral-400">
                  career_graph_rag.py
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#00D4A4]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00D4A4] animate-ping" />
                  Neo4j Bolt Connected
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Query Box inside the mockup */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-400">
                    Natural Language Placement Query
                  </label>
                  <div className="flex gap-1.5">
                    {(['hybrid', 'graph', 'vector'] as const).map((strat) => (
                      <button
                        key={strat}
                        onClick={() => setQueryStrategy(strat)}
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border transition-all ${
                          queryStrategy === strat
                            ? 'bg-[#00D4A4]/20 text-[#00D4A4] border-[#00D4A4]/40 font-semibold'
                            : isDark
                            ? 'text-neutral-400 border-white/10 hover:border-white/20'
                            : 'text-neutral-600 border-black/10 hover:border-black/20'
                        }`}
                      >
                        {strat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className={`w-full h-12 px-4 rounded-lg font-mono text-sm border focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#0B0F19] border-white/10 text-white focus:border-[#00D4A4] focus:ring-1 focus:ring-[#00D4A4]'
                        : 'bg-neutral-50 border-black/10 text-[#0B0F19] focus:border-[#00D4A4] focus:ring-1 focus:ring-[#00D4A4]'
                    }`}
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-400">
                      ⌘ Enter
                    </span>
                  </div>
                </div>

                {/* Example Query Chips */}
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className="text-neutral-400 text-xs self-center">Try:</span>
                  {[
                    'What backend skills are most in demand in Bengaluru?',
                    'Compare Python vs Java demand for 2026 graduates',
                    'Which skills co-occur most with React and Docker?',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQueryInput(example)}
                      className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
                        queryInput === example
                          ? 'border-[#00D4A4] text-[#00D4A4] bg-[#00D4A4]/10'
                          : isDark
                          ? 'border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                          : 'border-black/10 text-neutral-600 hover:text-black hover:border-black/20'
                      }`}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesized Response Terminal */}
              <div
                className={`p-5 rounded-lg border font-mono text-xs leading-relaxed space-y-3 ${
                  isDark
                    ? 'bg-[#0B0F19] border-white/10 text-neutral-300'
                    : 'bg-neutral-50 border-black/5 text-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 dark:border-white/10">
                  <span className="text-[11px] text-[#00D4A4] font-semibold flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> LangGraph Hybrid Strategy Synthesis
                  </span>
                  <span className="text-[10px] text-neutral-400">Response time: 420ms</span>
                </div>

                <p className="text-sm leading-relaxed font-sans">
                  Across <strong>1,240+ verified tech postings</strong> in Bengaluru, <strong>Python</strong> leads backend demand with a <strong>68.4%</strong> presence rate, predominantly paired with <strong>FastAPI</strong>, <strong>PostgreSQL</strong>, and <strong>Docker</strong>.
                </p>

                {/* Grounded Code / Entities Block */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {[
                    { skill: 'Python', role: 'Role: Backend', match: '94% Co-occurrence' },
                    { skill: 'PostgreSQL', role: 'Storage: SQL', match: '82% Co-occurrence' },
                    { skill: 'Docker', role: 'DevOps: Container', match: '76% Co-occurrence' },
                    { skill: 'FastAPI', role: 'Framework: REST', match: '69% Co-occurrence' },
                  ].map((item) => (
                    <div
                      key={item.skill}
                      className={`p-3 rounded-lg border ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'
                      }`}
                    >
                      <div className="font-bold text-[#00D4A4] font-mono text-sm">{item.skill}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{item.role}</div>
                      <div className="text-[10px] font-semibold text-emerald-500 mt-1">{item.match}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 3-Column Developer Grid Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12">
        {/* Section Heading with Inter font & tight letter-spacing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-black/10 dark:border-white/10">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#00D4A4] font-semibold">
              Live Core Modules
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-semibold tracking-[-0.5px] mt-1 ${
                isDark ? 'text-white' : 'text-[#0B0F19]'
              }`}
            >
              Developer-Grade Intelligence Density
            </h2>
          </div>

          {/* Underline-style segmented tab navigation */}
          <div className="flex items-center gap-6 text-sm">
            {(['overview', 'api', 'components'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSegmentedTab(tab)}
                className={`pb-2 capitalize font-medium transition-all relative ${
                  segmentedTab === tab
                    ? isDark
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#00D4A4]'
                      : 'text-[#0B0F19] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0B0F19]'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Bento Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Fit Score Calibration Card (4 cols) */}
          <div
            className={`lg:col-span-4 rounded-xl border p-6 flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-400">
                  Resume Match Calibration
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#00D4A4]/15 text-[#00D4A4] border border-[#00D4A4]/30">
                  ATS Verified
                </span>
              </div>

              {/* Circular Gauge Display */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="w-36 h-36 rotate-[-90deg]">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-neutral-200 dark:text-neutral-800"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#00D4A4"
                      strokeWidth="10"
                      strokeDasharray="377"
                      strokeDashoffset="45"
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold font-mono tracking-tight">88</span>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                      Fit Score
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    Excellent Match (Tier 1)
                  </span>
                  <p className="text-xs text-neutral-400 mt-2 max-w-[240px]">
                    Candidate profile matches 8 out of 9 hard technical requirements for <strong>Senior Python Engineer</strong>.
                  </p>
                </div>
              </div>

              {/* Matched vs Gaps Chips */}
              <div className="space-y-3 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="text-xs font-semibold text-neutral-400">Matched Skills (8)</div>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker', 'REST API', 'Redis'].map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono"
                    >
                      <Check className="h-3 w-3" />
                      {s}
                    </span>
                  ))}
                </div>

                <div className="text-xs font-semibold text-neutral-400 pt-2">Identified Skill Gap (1)</div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono">
                    <Zap className="h-3 w-3" />
                    Kubernetes (Phase 3 Learning Path)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button className="w-full bg-[#00D4A4] text-[#0B0F19] rounded-full py-2.5 text-xs font-semibold hover:bg-[#00B88E] transition-all flex items-center justify-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                Generate Tailored ATS Resume (.docx)
              </button>
            </div>
          </div>

          {/* Column 2: Job Explorer & Knowledge Evidence (4 cols) */}
          <div
            className={`lg:col-span-4 rounded-xl border p-6 flex flex-col justify-between transition-all ${
              isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-400">
                  Live Opportunity Match
                </span>
                <span className="text-[11px] font-mono text-neutral-400">ID: job-5481</span>
              </div>

              {/* Job Card Details */}
              <div
                className={`p-4 rounded-lg border space-y-3 ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-black/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#00D4A4]/15 text-[#00D4A4]">
                      Full-Time
                    </span>
                    <h3 className="font-semibold text-base mt-2">Staff Platform Engineer</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">Razorpay • Bengaluru, IN (Hybrid)</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-500">₹28L - ₹36L</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                  Building next-generation distributed transaction routing engines utilizing high-throughput Python async services, Neo4j graph indexing, and Kubernetes orchestration.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Python', 'AsyncIO', 'Neo4j', 'Redis', 'Docker'].map((sk) => (
                    <span
                      key={sk}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-white border-black/10 text-neutral-700'
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Neo4j Relationship Insight Box */}
              <div
                className={`p-4 rounded-lg border space-y-2 ${
                  isDark ? 'bg-[#06181B] border-[#00D4A4]/25' : 'bg-[#E6FAF5] border-[#00D4A4]/30'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00D4A4]">
                  <Network className="h-4 w-4" />
                  Knowledge Graph Relationship
                </div>
                <p className="text-xs text-neutral-400 dark:text-neutral-300 font-mono">
                  (Role: Staff Platform Engineer)-[:REQUIRES]-&gt;(Skill: Python) co-occurs in 89.2% of fintech backend postings.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                className={`w-full rounded-full py-2.5 text-xs font-medium border transition-all ${
                  isDark
                    ? 'border-white/20 text-white hover:bg-white/5'
                    : 'border-black/15 text-[#0B0F19] hover:bg-black/5'
                }`}
              >
                View Full Requirements & Apply →
              </button>
            </div>
          </div>

          {/* Column 3: Signature Mintlify Cards & Testimonial (4 cols) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            {/* Signature Featured Tier Card with 2px Mint Border & Brand Glow */}
            <div
              className={`rounded-xl p-6 border-2 border-[#00D4A4] shadow-[0_8px_30px_rgba(0,212,164,0.12)] relative ${
                isDark ? 'bg-[#0B0F19]' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider font-mono text-[#00D4A4]">
                  Featured Campus Program
                </span>
                <span className="bg-[#00D4A4] text-[#0B0F19] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                  Batch 2026
                </span>
              </div>

              <h3 className="text-xl font-bold mt-1">Placement Acceleration</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Automated ATS tailoring, GraphRAG reasoning, and technical interview simulation.
              </p>

              <div className="my-4 pt-3 border-t border-black/10 dark:border-white/10 space-y-2 text-xs">
                {[
                  'Unlimited GraphRAG Market Queries',
                  'One-Click Tailored ATS DOCX Export',
                  'Live Knowledge Graph Co-occurrence Map',
                  'Mock Interview Simulation (Phase 3)',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#00D4A4]" />
                    <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{feat}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#00D4A4] text-[#0B0F19] rounded-full py-2.5 text-xs font-bold hover:bg-[#00B88E] transition-all mt-2">
                Enroll In Program
              </button>
            </div>

            {/* Signature Warm Testimonial Card ({colors.testimonial-orange} = #FF5C35) */}
            <div className="rounded-xl p-6 bg-[#FF5C35] text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between text-white/80 text-xs">
                <span className="font-mono uppercase tracking-wider text-[11px] font-semibold">
                  Student Success Story
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-white text-white" />
                  ))}
                </div>
              </div>

              <p className="text-sm font-medium leading-snug">
                &ldquo;SkillBridge pinpointed the exact 2 missing skills I needed for the Bangalore backend drive. Tailored my resume, practiced the questions, and cleared all technical rounds.&rdquo;
              </p>

              <div className="pt-2 border-t border-white/20 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  ZA
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Zaid Alam</div>
                  <div className="text-[10px] text-white/80">Placed at Tier-1 FinTech • CSE 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Token & Anatomy Gallery (Documentation Style) */}
        <div className="pt-12 border-t border-black/10 dark:border-white/10 space-y-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#00D4A4] font-semibold">
              Design System Specification
            </div>
            <h3
              className={`text-xl font-bold tracking-tight mt-1 ${
                isDark ? 'text-white' : 'text-[#0B0F19]'
              }`}
            >
              Component Tokens & Micro-Interactions
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Extracted directly from the updated <span className="font-mono text-[#00D4A4]">DESIGN.md</span> token registry.
            </p>
          </div>

          {/* Tokens Showcase Table / Grid */}
          <div
            className={`rounded-xl border overflow-hidden ${
              isDark ? 'bg-[#0B0F19] border-white/10' : 'bg-white border-black/10'
            }`}
          >
            {/* Row 1: Buttons */}
            <div className="p-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#00D4A4]">Pill Buttons</span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Universal <code className="font-mono text-[11px] text-neutral-300">rounded-full</code> pills across marketing & docs
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 items-center">
                {/* button-accent-green */}
                <button className="bg-[#00D4A4] text-[#0B0F19] rounded-full px-4 py-2 text-xs font-semibold shadow-sm">
                  button-accent-green
                </button>
                {/* button-primary */}
                <button className="bg-[#0B0F19] text-white dark:bg-white dark:text-[#0B0F19] rounded-full px-4 py-2 text-xs font-medium shadow-sm">
                  button-primary
                </button>
                {/* button-secondary */}
                <button className="border border-current rounded-full px-4 py-2 text-xs font-medium bg-transparent">
                  button-secondary
                </button>
                {/* button-icon-circular */}
                <button className="h-8 w-8 rounded-full border border-current flex items-center justify-center text-xs">
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Row 2: Badges & Annotation Chips */}
            <div className="p-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#00D4A4]">Badges & Property Chips</span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Geist Mono technical chips, required flags, and category tags
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-[#EF4444] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded tracking-wider">
                  REQUIRED
                </span>
                <span className="bg-[#00D4A4] text-[#0B0F19] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  SAVE 20%
                </span>
                <span className="bg-[#3772CF]/15 text-[#3772CF] text-xs font-mono font-semibold px-2 py-0.5 rounded">
                  &lt;Tabs&gt;
                </span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded border ${
                    isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-neutral-100 border-black/10 text-neutral-700'
                  }`}
                >
                  string | number
                </span>
                <span className="bg-emerald-500/15 text-emerald-500 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Match
                </span>
              </div>
            </div>

            {/* Row 3: Documentation Property Row */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#00D4A4]">Documentation Property Row</span>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Dense developer reading format for parameters & API contracts
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border font-mono text-xs max-w-md w-full ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-black/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">job_required_skills</span>
                  <span className="text-[10px] text-neutral-400 bg-white/10 px-1.5 py-0.2 rounded">
                    List[str]
                  </span>
                  <span className="bg-[#EF4444] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    REQUIRED
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans mt-1">
                  Canonical skills list extracted by spaCy NER against the job description for graph calibration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner with Feedback / Proceed action */}
        <div
          className={`p-6 rounded-2xl border text-center space-y-3 ${
            isDark
              ? 'bg-gradient-to-r from-[#06181B] via-[#0B0F19] to-[#06181B] border-[#00D4A4]/30'
              : 'bg-gradient-to-r from-[#F0FDF4] via-white to-[#E0F2FE] border-black/10'
          }`}
        >
          <div className="h-10 w-10 rounded-full bg-[#00D4A4]/20 text-[#00D4A4] flex items-center justify-center mx-auto">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">How does this Mintlify aesthetic look to you?</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Review the colors, the pill buttons, the atmospheric hero, the dark/light mode contrast, and the developer-dense bento cards. Let me know your feedback or if you would like me to transform the entire application to match this style!
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#00D4A4] text-[#0B0F19] shadow-sm hover:bg-[#00B88E] transition-all"
            >
              Toggle to {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <Link
              to="/"
              className={`px-5 py-2.5 rounded-full text-xs font-medium border transition-all ${
                isDark
                  ? 'border-white/20 text-white hover:bg-white/5'
                  : 'border-black/15 text-[#0B0F19] hover:bg-black/5'
              }`}
            >
              Back to Current Application
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
