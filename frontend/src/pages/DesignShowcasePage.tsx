import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  Moon,
  ArrowRight,
  Check,
  FileText,
  Network,
  Zap,
  Star,
  Database,
  Palette,
} from 'lucide-react';

// Exact Palette provided by User:
// Color 1: rgba(0, 77, 47, 1)   - Deep Forest Emerald (#004D2F) -> High contrast headings, dark accents, solid borders
// Color 2: rgba(0, 136, 85, 1)  - Vibrant Emerald     (#008855) -> Secondary CTAs, active highlights, badge accents
// Color 3: rgba(0, 162, 100, 1) - Bright Jade Green   (#00A264) -> Borders, focus rings, tag outlines
// Color 4: rgba(76, 214, 129, 1)- Luminous Mint Green (#4CD681) -> Dark mode glowing accent, gauges, luminous badges

const PALETTE = [
  { name: 'Deep Forest', rgba: 'rgba(0, 77, 47, 1)', hex: '#004D2F', role: 'Primary Text in Light Mode, Dark Buttons & Surfaces' },
  { name: 'Vibrant Emerald', rgba: 'rgba(0, 136, 85, 1)', hex: '#008855', role: 'Interactive Links, Badges & Solid CTAs' },
  { name: 'Bright Jade', rgba: 'rgba(0, 162, 100, 1)', hex: '#00A264', role: 'Focus Rings, Borders & Accent Accouterments' },
  { name: 'Luminous Mint', rgba: 'rgba(76, 214, 129, 1)', hex: '#4CD681', role: 'Primary Glowing Accent in Dark Mode & Gauge Strokes' },
];

export const DesignShowcasePage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [segmentedTab, setSegmentedTab] = useState<'overview' | 'api' | 'components'>('overview');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState('What backend skills are most in demand in Bengaluru?');
  const [queryStrategy, setQueryStrategy] = useState<'hybrid' | 'graph' | 'vector'>('hybrid');

  const isDark = theme === 'dark';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        isDark ? 'dark bg-[#060B08] text-[#EDF2EE]' : 'bg-[#F8FAF8] text-[#0A1A12]'
      }`}
    >
      {/* Top Header — Control Bar */}
      <header
        className={`sticky top-0 z-50 px-4 md:px-8 h-16 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#060B08]/90 border-[rgba(0,162,100,0.18)] text-white'
            : 'bg-white/95 border-[rgba(0,136,85,0.15)] text-[#004D2F] shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[rgba(76,214,129,1)] flex items-center justify-center text-[#004D2F] font-bold shadow-[0_0_18px_rgba(76,214,129,0.4)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-base flex items-center gap-2">
              SkillBridge{' '}
              <span
                className={`font-mono text-xs px-2.5 py-0.5 rounded-md font-semibold border ${
                  isDark
                    ? 'bg-[rgba(0,77,47,0.3)] text-[rgba(76,214,129,1)] border-[rgba(0,162,100,0.35)]'
                    : 'bg-[rgba(0,136,85,0.1)] text-[#004D2F] border-[rgba(0,136,85,0.25)]'
                }`}
              >
                Emerald Edition
              </span>
            </span>
          </Link>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-[rgba(0,77,47,0.35)] hover:bg-[rgba(0,77,47,0.6)] border-[rgba(0,162,100,0.3)] text-white'
                : 'bg-white hover:bg-[#EEF7F1] border-[rgba(0,136,85,0.25)] text-[#004D2F] shadow-xs'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="h-3.5 w-3.5 text-[rgba(76,214,129,1)]" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-[#008855]" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <Link
            to="/"
            className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all font-semibold ${
              isDark
                ? 'border-white/10 hover:bg-white/5 text-neutral-300'
                : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
            }`}
          >
            Back to App
          </Link>
        </div>
      </header>

      {/* Interactive Color Palette Ribbon */}
      <div
        className={`px-4 md:px-8 py-3 border-b text-xs transition-colors flex flex-wrap items-center justify-between gap-3 ${
          isDark
            ? 'bg-[#08120B] border-[rgba(0,162,100,0.12)]'
            : 'bg-[#EEF7F1] border-[rgba(0,136,85,0.15)]'
        }`}
      >
        <div className={`flex items-center gap-2 text-xs font-semibold ${
          isDark ? 'text-neutral-400' : 'text-[#004D2F]'
        }`}>
          <Palette className={`h-4 w-4 ${isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'}`} />
          <span>Active 4-Color Palette (Click to copy):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PALETTE.map((c) => (
            <button
              key={c.name}
              onClick={() => copyToClipboard(c.rgba)}
              title={`Click to copy: ${c.rgba} (${c.role})`}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-[#0C1A10] border-[rgba(0,162,100,0.25)] text-neutral-200'
                  : 'bg-white border-[rgba(0,136,85,0.25)] text-[#004D2F] shadow-xs'
              }`}
            >
              <span
                className="h-3.5 w-3.5 rounded shadow-sm border border-black/20"
                style={{ backgroundColor: c.rgba }}
              />
              <span className="font-semibold">{c.name}</span>
              <span className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{c.hex}</span>
              {copiedColor === c.rgba && (
                <span className={`text-[10px] font-bold ${isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'}`}>
                  Copied!
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Atmospheric Hero Section */}
      <section
        className={`relative overflow-hidden pt-16 pb-20 px-4 md:px-8 border-b transition-all ${
          isDark
            ? 'bg-gradient-to-b from-[#091C12] via-[#07130C] to-[#060B08] border-[rgba(0,162,100,0.15)]'
            : 'bg-gradient-to-b from-[#E7F6ED] via-[#F2FAF5] to-[#F8FAF8] border-[rgba(0,136,85,0.15)]'
        }`}
      >
        {/* Emerald Glow Mesh using User's Colors */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] blur-[140px] pointer-events-none rounded-full opacity-45"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(76, 214, 129, 0.28) 0%, rgba(0, 162, 100, 0.22) 40%, rgba(0, 77, 47, 0.35) 70%, transparent 90%)'
              : 'radial-gradient(ellipse at center, rgba(76, 214, 129, 0.35) 0%, rgba(0, 162, 100, 0.15) 50%, rgba(0, 77, 47, 0.05) 80%, transparent 100%)',
          }}
        />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Eyebrow Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold tracking-wide border shadow-sm transition-all ${
              isDark
                ? 'bg-[rgba(0,77,47,0.35)] border-[rgba(0,162,100,0.35)] text-[rgba(76,214,129,1)]'
                : 'bg-white border-[rgba(0,136,85,0.25)] text-[#004D2F]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[rgba(76,214,129,1)] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
              Grounded Career Intelligence Engine
            </span>
            <span className={isDark ? 'text-neutral-500' : 'text-neutral-400'}>|</span>
            <span className={`font-mono text-[11px] font-bold ${
              isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'
            }`}>
              Neo4j + Qdrant + LangGraph
            </span>
          </div>

          {/* Main Title */}
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-2px] leading-[1.05] max-w-4xl mx-auto ${
              isDark ? 'text-white' : 'text-[#004D2F]'
            }`}
          >
            Placement intelligence grounded in{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: isDark
                  ? 'linear-gradient(135deg, rgba(76, 214, 129, 1) 0%, rgba(0, 162, 100, 1) 60%, rgba(0, 136, 85, 1) 100%)'
                  : 'linear-gradient(135deg, #004D2F 0%, #008855 50%, #00A264 100%)',
              }}
            >
              live market graphs
            </span>
            .
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-neutral-300' : 'text-[#0F291B]'
            }`}
          >
            Transform raw job postings into queryable knowledge graphs. Calibrate your resume with objective fit scoring and export optimized ATS DOCX resumes.
          </p>

          {/* Sleek Rectangular Buttons in Palette Colors */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* Luminous Mint Button */}
            <button
              className="rounded-lg px-6 py-3 text-sm font-bold text-[#003822] transition-all hover:brightness-105 active:scale-[0.98] flex items-center gap-2 shadow-[0_0_24px_rgba(76,214,129,0.35)]"
              style={{ backgroundColor: 'rgba(76, 214, 129, 1)' }}
            >
              <span>Explore GraphRAG Query</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Deep Forest Emerald Button */}
            <button
              className="rounded-lg px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] border shadow-sm flex items-center gap-2"
              style={{
                backgroundColor: isDark ? 'rgba(0, 77, 47, 0.45)' : 'rgba(0, 77, 47, 1)',
                borderColor: 'rgba(0, 162, 100, 0.45)',
                color: isDark ? 'rgba(76, 214, 129, 1)' : '#FFFFFF',
              }}
            >
              <FileText className="h-4 w-4" />
              <span>Analyze Resume</span>
            </button>

            {/* Vibrant Emerald Outline Button */}
            <button
              className={`rounded-lg px-5 py-3 text-sm font-semibold border transition-all ${
                isDark
                  ? 'border-[rgba(0,162,100,0.3)] hover:bg-[rgba(0,77,47,0.25)] text-neutral-200'
                  : 'border-[rgba(0,136,85,0.4)] hover:bg-[#EEF7F1] text-[#004D2F] bg-white shadow-xs'
              }`}
            >
              Browse 1,240+ Live Postings
            </button>
          </div>
        </div>

        {/* Level 3 Mockup Frame — GraphRAG Terminal */}
        <div className="max-w-5xl mx-auto mt-12 relative z-10">
          <div
            className={`rounded-xl border overflow-hidden transition-all shadow-[0_24px_48px_-8px_rgba(0,0,0,0.35)] ${
              isDark
                ? 'bg-[#09150E] border-[rgba(0,162,100,0.25)]'
                : 'bg-white border-[rgba(0,136,85,0.25)]'
            }`}
          >
            {/* Window Header */}
            <div
              className={`px-4 py-3 border-b flex items-center justify-between text-xs ${
                isDark
                  ? 'bg-[#050D08] border-[rgba(0,162,100,0.18)] text-neutral-400'
                  : 'bg-[#EEF7F1] border-[rgba(0,136,85,0.15)] text-[#004D2F]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className={`font-mono text-[11px] ml-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600 font-semibold'
                }`}>
                  career_graph_rag_engine.py
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-0.5 rounded-md font-semibold border"
                  style={{
                    backgroundColor: isDark ? 'rgba(0, 77, 47, 0.4)' : 'rgba(0, 136, 85, 0.12)',
                    borderColor: isDark ? 'rgba(0, 162, 100, 0.4)' : 'rgba(0, 136, 85, 0.3)',
                    color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                  }}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-[rgba(76,214,129,1)]' : 'bg-[#008855]'} animate-ping`} />
                  Neo4j Graph Active
                </span>
              </div>
            </div>

            {/* Query Form Body */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold uppercase tracking-wider font-mono flex items-center gap-2 ${
                    isDark ? 'text-neutral-400' : 'text-[#004D2F]'
                  }`}>
                    <Database className={`h-3.5 w-3.5 ${isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'}`} />
                    Market Query Terminal
                  </label>
                  <div className="flex gap-1.5">
                    {(['hybrid', 'graph', 'vector'] as const).map((strat) => (
                      <button
                        key={strat}
                        onClick={() => setQueryStrategy(strat)}
                        className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border transition-all ${
                          queryStrategy === strat
                            ? isDark
                              ? 'bg-[rgba(0,162,100,0.25)] text-[rgba(76,214,129,1)] border-[rgba(0,162,100,0.6)] font-bold'
                              : 'bg-[rgba(0,136,85,0.12)] text-[#004D2F] border-[rgba(0,136,85,0.4)] font-bold'
                            : isDark
                            ? 'text-neutral-400 border-white/10 hover:border-white/20'
                            : 'text-neutral-700 border-neutral-300 hover:border-neutral-400 font-medium'
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
                    className={`w-full h-11 px-4 rounded-lg font-mono text-sm border focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#050D08] border-[rgba(0,162,100,0.3)] text-white focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[rgba(76,214,129,1)]'
                        : 'bg-white border-[rgba(0,136,85,0.3)] text-[#004D2F] font-semibold focus:border-[rgba(0,136,85,1)] focus:ring-1 focus:ring-[rgba(0,136,85,1)] shadow-xs'
                    }`}
                  />
                  <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isDark
                        ? 'bg-[rgba(0,77,47,0.3)] text-[rgba(76,214,129,1)] border-[rgba(0,162,100,0.25)]'
                        : 'bg-[#EEF7F1] text-[#004D2F] border-[rgba(0,136,85,0.25)] font-semibold'
                    }`}>
                      ⌘ Enter
                    </span>
                  </div>
                </div>

                {/* Example Query Chips */}
                <div className="flex flex-wrap gap-2 text-xs pt-1">
                  <span className={`text-xs self-center font-semibold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    Try:
                  </span>
                  {[
                    'What backend skills are most in demand in Bengaluru?',
                    'Compare Python vs Java demand for freshers',
                    'Which skills co-occur most with React and Docker?',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQueryInput(example)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                        queryInput === example
                          ? isDark
                            ? 'border-[rgba(76,214,129,0.7)] text-[rgba(76,214,129,1)] bg-[rgba(0,77,47,0.3)] font-semibold'
                            : 'border-[rgba(0,136,85,0.5)] text-[#004D2F] bg-[rgba(0,136,85,0.12)] font-bold'
                          : isDark
                          ? 'border-white/10 text-neutral-400 hover:text-white'
                          : 'border-neutral-300 text-neutral-700 hover:text-[#004D2F] hover:border-[rgba(0,136,85,0.4)]'
                      }`}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthesized Output in Palette Accents */}
              <div
                className={`p-5 rounded-lg border font-mono text-xs leading-relaxed space-y-3 ${
                  isDark
                    ? 'bg-[#050D08] border-[rgba(0,162,100,0.2)] text-neutral-200'
                    : 'bg-[#F2FAF5] border-[rgba(0,136,85,0.25)] text-[#051A10]'
                }`}
              >
                <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-white/10' : 'border-[rgba(0,136,85,0.15)]'}`}>
                  <span className={`text-[11px] font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                  }`}>
                    <Zap className="h-3.5 w-3.5" /> LangGraph Hybrid Strategy Synthesis
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600 font-semibold'}`}>
                    Retrieval latency: 380ms
                  </span>
                </div>

                <p className={`text-sm leading-relaxed font-sans ${isDark ? 'text-neutral-200' : 'text-[#0F291B]'}`}>
                  Across <strong>1,240+ verified tech postings</strong> in Bengaluru, <strong>Python</strong> leads backend demand with a <strong>68.4%</strong> presence rate, predominantly paired with <strong>FastAPI</strong>, <strong>PostgreSQL</strong>, and <strong>Docker</strong>.
                </p>

                {/* Grounded Entity Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {[
                    { skill: 'Python', role: 'Role: Backend', match: '94% Co-occurrence' },
                    { skill: 'PostgreSQL', role: 'Storage: SQL', match: '82% Co-occurrence' },
                    { skill: 'Docker', role: 'DevOps: Container', match: '76% Co-occurrence' },
                    { skill: 'FastAPI', role: 'Framework: REST', match: '69% Co-occurrence' },
                  ].map((item) => (
                    <div
                      key={item.skill}
                      className={`p-3 rounded-md border ${
                        isDark
                          ? 'bg-[rgba(0,77,47,0.2)] border-[rgba(0,162,100,0.25)]'
                          : 'bg-white border-[rgba(0,136,85,0.22)] shadow-xs'
                      }`}
                    >
                      <div className={`font-bold font-mono text-sm ${
                        isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                      }`}>
                        {item.skill}
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600 font-medium'
                      }`}>
                        {item.role}
                      </div>
                      <div className={`text-[10px] font-semibold mt-1 ${
                        isDark ? 'text-[rgba(76,214,129,0.9)]' : 'text-[#008855]'
                      }`}>
                        {item.match}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid — 3 Column Developer Density */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-12">
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 ${
          isDark ? 'border-white/10' : 'border-neutral-200'
        }`}>
          <div>
            <div className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
              isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'
            }`}>
              Integrated Capabilities
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-semibold tracking-[-0.5px] mt-1 ${
                isDark ? 'text-white' : 'text-[#004D2F]'
              }`}
            >
              Developer-Grade Intelligence Density
            </h2>
          </div>

          {/* Underline Tabs */}
          <div className="flex items-center gap-6 text-sm">
            {(['overview', 'api', 'components'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSegmentedTab(tab)}
                className={`pb-2 capitalize font-semibold transition-all relative ${
                  segmentedTab === tab
                    ? isDark
                      ? 'text-[rgba(76,214,129,1)] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[rgba(76,214,129,1)]'
                      : 'text-[#004D2F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#008855]'
                    : isDark
                    ? 'text-neutral-400 hover:text-neutral-200'
                    : 'text-neutral-600 hover:text-[#004D2F]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Bento Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Resume Match Calibration */}
          <div
            className={`lg:col-span-4 rounded-xl border p-6 flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-[#09150E] border-[rgba(0,162,100,0.22)]'
                : 'bg-white border-[rgba(0,136,85,0.22)] shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                  isDark ? 'text-neutral-400' : 'text-[#004D2F]'
                }`}>
                  Fit Score Calibration
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border font-mono"
                  style={{
                    backgroundColor: isDark ? 'rgba(0, 77, 47, 0.3)' : 'rgba(0, 136, 85, 0.1)',
                    borderColor: isDark ? 'rgba(0, 162, 100, 0.4)' : 'rgba(0, 136, 85, 0.3)',
                    color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                  }}
                >
                  ATS Verified
                </span>
              </div>

              {/* Gauge Display with Palette Stroke */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="w-36 h-36 rotate-[-90deg]">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="10"
                      className={isDark ? 'text-[#0C2014]' : 'text-neutral-100'}
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke={isDark ? 'rgba(76, 214, 129, 1)' : 'rgba(0, 162, 100, 1)'}
                      strokeWidth="10"
                      strokeDasharray="377"
                      strokeDashoffset="45"
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className={`text-4xl font-bold font-mono tracking-tight ${
                      isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                    }`}>
                      88
                    </span>
                    <span className={`text-[10px] uppercase font-semibold tracking-wider ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      Fit Score
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span
                    className="inline-block px-3 py-1 rounded-md text-xs font-semibold border"
                    style={{
                      backgroundColor: isDark ? 'rgba(0, 77, 47, 0.35)' : 'rgba(0, 136, 85, 0.12)',
                      borderColor: isDark ? 'rgba(0, 162, 100, 0.4)' : 'rgba(0, 136, 85, 0.3)',
                      color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                    }}
                  >
                    Excellent Match (Tier 1)
                  </span>
                  <p className={`text-xs mt-2 max-w-[240px] ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Candidate profile matches 8 out of 9 technical requirements for <strong className={isDark ? 'text-white' : 'text-[#004D2F]'}>Senior Python Engineer</strong>.
                  </p>
                </div>
              </div>

              {/* Matched vs Skill Gaps */}
              <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div className={`text-xs font-semibold ${isDark ? 'text-neutral-400' : 'text-[#004D2F]'}`}>
                  Matched Skills (8)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker', 'REST API', 'Redis'].map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-mono"
                      style={{
                        backgroundColor: isDark ? 'rgba(0, 77, 47, 0.25)' : 'rgba(0, 136, 85, 0.08)',
                        borderColor: isDark ? 'rgba(0, 162, 100, 0.3)' : 'rgba(0, 136, 85, 0.25)',
                        color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                        borderWidth: '1px',
                      }}
                    >
                      <Check className={`h-3 w-3 ${isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'}`} />
                      {s}
                    </span>
                  ))}
                </div>

                <div className={`text-xs font-semibold pt-2 ${isDark ? 'text-neutral-400' : 'text-[#004D2F]'}`}>
                  Identified Skill Gap (1)
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-mono border ${
                    isDark
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  }`}>
                    <Zap className="h-3 w-3" />
                    Kubernetes (Curated Learning Resource in Phase 3)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                className="w-full rounded-lg py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                style={{
                  backgroundColor: 'rgba(76, 214, 129, 1)',
                  color: '#003B24',
                }}
              >
                <FileText className="h-3.5 w-3.5" />
                Generate Tailored ATS Resume (.docx)
              </button>
            </div>
          </div>

          {/* Card 2: Live Opportunity Match */}
          <div
            className={`lg:col-span-4 rounded-xl border p-6 flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-[#09150E] border-[rgba(0,162,100,0.22)]'
                : 'bg-white border-[rgba(0,136,85,0.22)] shadow-xs'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                  isDark ? 'text-neutral-400' : 'text-[#004D2F]'
                }`}>
                  Live Placement Match
                </span>
                <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500 font-semibold'}`}>
                  ID: job-5481
                </span>
              </div>

              <div
                className={`p-4 rounded-lg border space-y-3 ${
                  isDark
                    ? 'bg-[#050D08] border-[rgba(0,162,100,0.2)]'
                    : 'bg-[#F2FAF5] border-[rgba(0,136,85,0.2)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: isDark ? 'rgba(0, 77, 47, 0.4)' : 'rgba(0, 136, 85, 0.12)',
                        color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                      }}
                    >
                      Full-Time
                    </span>
                    <h3 className={`font-semibold text-base mt-2 ${isDark ? 'text-white' : 'text-[#004D2F]'}`}>
                      Staff Platform Engineer
                    </h3>
                    <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Razorpay • Bengaluru, IN (Hybrid)
                    </p>
                  </div>
                  <span className={`font-mono text-xs font-bold ${
                    isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                  }`}>
                    ₹28L - ₹36L
                  </span>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-3 ${
                  isDark ? 'text-neutral-300' : 'text-[#1C3829]'
                }`}>
                  Building distributed transaction routing engines using high-throughput async Python microservices, Neo4j knowledge graph indexing, and container orchestration.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Python', 'AsyncIO', 'Neo4j', 'Redis', 'Docker'].map((sk) => (
                    <span
                      key={sk}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark
                          ? 'bg-[rgba(0,77,47,0.2)] border-[rgba(0,162,100,0.25)] text-neutral-200'
                          : 'bg-white border-[rgba(0,136,85,0.2)] text-[#004D2F] font-semibold'
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Neo4j Relationship Insight Box */}
              <div
                className="p-4 rounded-lg border space-y-2"
                style={{
                  backgroundColor: isDark ? 'rgba(0, 77, 47, 0.25)' : 'rgba(0, 136, 85, 0.08)',
                  borderColor: isDark ? 'rgba(0, 162, 100, 0.35)' : 'rgba(0, 136, 85, 0.25)',
                }}
              >
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                  isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                }`}>
                  <Network className="h-4 w-4" />
                  Knowledge Graph Co-occurrence
                </div>
                <p className={`text-xs font-mono ${
                  isDark ? 'text-neutral-300' : 'text-[#0A2618]'
                }`}>
                  (Role: Staff Platform Engineer)-[:REQUIRES]-&gt;(Skill: Python) co-occurs in 89.2% of fintech backend postings.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                className={`w-full rounded-lg py-2.5 text-xs font-semibold border transition-all ${
                  isDark
                    ? 'border-[rgba(0,162,100,0.3)] hover:bg-[rgba(0,77,47,0.3)] text-neutral-200'
                    : 'border-[rgba(0,136,85,0.35)] hover:bg-[#EEF7F1] text-[#004D2F] bg-white shadow-xs'
                }`}
              >
                View Full Requirements & Apply →
              </button>
            </div>
          </div>

          {/* Card 3: Signature Featured Tier & Testimonial */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            {/* Featured Tier Card */}
            <div
              className={`rounded-xl p-6 border-2 relative transition-all ${
                isDark ? 'bg-[#09150E]' : 'bg-white shadow-xs'
              }`}
              style={{
                borderColor: 'rgba(0, 162, 100, 1)',
                boxShadow: isDark ? '0 8px 30px rgba(0, 162, 100, 0.16)' : '0 8px 30px rgba(0, 136, 85, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                  isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'
                }`}>
                  Featured Placement Program
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase"
                  style={{
                    backgroundColor: 'rgba(76, 214, 129, 1)',
                    color: '#003B24',
                  }}
                >
                  Batch 2026
                </span>
              </div>

              <h3 className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-[#004D2F]'}`}>
                Placement Acceleration
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Automated ATS tailoring, GraphRAG reasoning, and technical interview simulation.
              </p>

              <div className={`my-4 pt-3 border-t space-y-2 text-xs ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                {[
                  'Unlimited GraphRAG Market Queries',
                  'One-Click Tailored ATS DOCX Export',
                  'Live Knowledge Graph Co-occurrence Map',
                  'Mock Interview Simulation (Phase 3)',
                ].map((feat) => (
                  <div key={feat} className={`flex items-center gap-2 ${isDark ? 'text-neutral-200' : 'text-[#143021]'}`}>
                    <Check className={`h-3.5 w-3.5 ${isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'}`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                className="w-full rounded-lg py-2.5 text-xs font-bold transition-all mt-2"
                style={{
                  backgroundColor: 'rgba(0, 136, 85, 1)',
                  color: '#FFFFFF',
                }}
              >
                Enroll In Program
              </button>
            </div>

            {/* Testimonial Card — Rendered in Deep Forest Emerald */}
            <div
              className="rounded-xl p-6 text-white space-y-3 shadow-md border"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 77, 47, 1) 0%, #032014 100%)',
                borderColor: 'rgba(0, 162, 100, 0.35)',
              }}
            >
              <div className="flex items-center justify-between text-white/80 text-xs">
                <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-[rgba(76,214,129,1)]">
                  Student Success Story
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-[rgba(76,214,129,1)] text-[rgba(76,214,129,1)]" />
                  ))}
                </div>
              </div>

              <p className="text-sm font-medium leading-snug text-neutral-100">
                &ldquo;SkillBridge pinpointed the exact 2 missing skills I needed for the Bangalore backend drive. Tailored my resume, practiced the questions, and cleared all technical rounds.&rdquo;
              </p>

              <div className="pt-2 border-t border-white/20 flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded font-bold text-xs flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(76, 214, 129, 0.25)',
                    color: 'rgba(76, 214, 129, 1)',
                  }}
                >
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

        {/* Tokens & Components Gallery in Exact Palette */}
        <div className={`pt-12 border-t space-y-8 ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
          <div>
            <div className={`text-[11px] font-mono uppercase tracking-widest font-bold ${
              isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#008855]'
            }`}>
              Color Token Implementation
            </div>
            <h3
              className={`text-xl font-bold tracking-tight mt-1 ${
                isDark ? 'text-white' : 'text-[#004D2F]'
              }`}
            >
              Buttons, Badges & Technical UI Components
            </h3>
            <p className={`text-xs mt-1 max-w-xl ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Applying the 4 exact user colors across buttons, chips, and property documentation rows.
            </p>
          </div>

          <div
            className={`rounded-xl border overflow-hidden ${
              isDark
                ? 'bg-[#09150E] border-[rgba(0,162,100,0.2)]'
                : 'bg-white border-[rgba(0,136,85,0.22)] shadow-xs'
            }`}
          >
            {/* Row 1: Buttons */}
            <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <div>
                <span className={`font-mono text-xs font-bold ${
                  isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                }`}>
                  Button Variants
                </span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Primary Mint, Deep Forest, Vibrant Emerald, and Outlined Jade
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 items-center">
                {/* Mint Button */}
                <button
                  className="rounded-lg px-4 py-2 text-xs font-bold"
                  style={{ backgroundColor: 'rgba(76, 214, 129, 1)', color: '#003B24' }}
                >
                  Mint Accent
                </button>
                {/* Vibrant Emerald Button */}
                <button
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-white"
                  style={{ backgroundColor: 'rgba(0, 136, 85, 1)' }}
                >
                  Vibrant Emerald
                </button>
                {/* Deep Forest Button */}
                <button
                  className="rounded-lg px-4 py-2 text-xs font-semibold border"
                  style={{
                    backgroundColor: 'rgba(0, 77, 47, 1)',
                    color: '#FFFFFF',
                    borderColor: 'rgba(0, 162, 100, 0.4)',
                  }}
                >
                  Deep Forest
                </button>
                {/* Jade Outlined */}
                <button
                  className="rounded-lg px-4 py-2 text-xs font-medium border"
                  style={{
                    borderColor: 'rgba(0, 162, 100, 0.6)',
                    color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                    backgroundColor: isDark ? 'transparent' : 'rgba(0, 162, 100, 0.05)',
                  }}
                >
                  Jade Outlined
                </button>
              </div>
            </div>

            {/* Row 2: Badges */}
            <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <div>
                <span className={`font-mono text-xs font-bold ${
                  isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                }`}>
                  Badges & Tags
                </span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Category tags, verified checkmarks, and data signatures
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <span
                  className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: isDark ? 'rgba(0, 77, 47, 0.3)' : 'rgba(0, 136, 85, 0.1)',
                    borderColor: isDark ? 'rgba(0, 162, 100, 0.4)' : 'rgba(0, 136, 85, 0.3)',
                    color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                  }}
                >
                  Active Node
                </span>
                <span
                  className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: isDark ? 'rgba(0, 136, 85, 0.2)' : 'rgba(0, 136, 85, 0.08)',
                    borderColor: isDark ? 'rgba(0, 136, 85, 0.4)' : 'rgba(0, 136, 85, 0.25)',
                    color: isDark ? '#FFFFFF' : '#004D2F',
                  }}
                >
                  Neo4j Relationship
                </span>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'rgba(76, 214, 129, 1)',
                    color: '#003B24',
                  }}
                >
                  Tier 1 Match
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                }`}>
                  Skill Gap
                </span>
              </div>
            </div>

            {/* Row 3: Documentation Row */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className={`font-mono text-xs font-bold ${
                  isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'
                }`}>
                  API Contract Property Row
                </span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Dense developer reading format with semantic palette badges
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border font-mono text-xs max-w-md w-full ${
                  isDark
                    ? 'bg-[#050D08] border-[rgba(0,162,100,0.2)]'
                    : 'bg-[#F2FAF5] border-[rgba(0,136,85,0.22)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-bold font-mono ${isDark ? 'text-[rgba(76,214,129,1)]' : 'text-[#004D2F]'}`}>
                    graph_co_occurrence
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.2 rounded border font-semibold"
                    style={{
                      backgroundColor: isDark ? 'rgba(0, 77, 47, 0.35)' : 'rgba(0, 136, 85, 0.1)',
                      borderColor: isDark ? 'rgba(0, 162, 100, 0.3)' : 'rgba(0, 136, 85, 0.3)',
                      color: isDark ? 'rgba(76, 214, 129, 1)' : '#004D2F',
                    }}
                  >
                    float
                  </span>
                  <span className="bg-[#DC2626] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    REQUIRED
                  </span>
                </div>
                <p className={`text-[11px] font-sans mt-1 ${isDark ? 'text-neutral-400' : 'text-[#1C3829]'}`}>
                  Calibrated frequency weighting between extracted role and skill entities in Neo4j.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
