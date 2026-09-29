import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { jobService } from '@/services/jobService';
import { JobMarketQueryResponse } from '@/types/jobs';
import { Sparkles, Send, Network, Database, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

const PRESET_QUERIES = [
  'What backend skills are most in demand in Bengaluru?',
  'What skills are commonly required alongside Python and Django?',
  'What roles are available for React and TypeScript developers?',
  'What are the core requirements for a Machine Learning Engineer?',
];

export const MarketQueryBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JobMarketQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await jobService.queryJobMarket(queryText);
      setResult(response);
    } catch (err: any) {
      const detail =
        err.response?.data?.error ||
        err.response?.data?.details ||
        'Unable to query the GraphRAG intelligence layer. Please ensure backend services are active.';
      setError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const getStrategyBadge = (strategy?: string) => {
    switch (strategy?.toLowerCase()) {
      case 'graph':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 font-mono">
            <Network className="h-3 w-3" /> Neo4j Knowledge Graph
          </Badge>
        );
      case 'vector':
        return (
          <Badge variant="info" className="flex items-center gap-1 font-mono">
            <Database className="h-3 w-3" /> Qdrant Semantic Vector
          </Badge>
        );
      case 'hybrid':
      default:
        return (
          <Badge variant="default" className="flex items-center gap-1 font-mono">
            <Sparkles className="h-3 w-3" /> LangGraph Hybrid Strategy
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/80 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">GraphRAG Career Intelligence</CardTitle>
              <CardDescription className="text-xs">
                Query live placement trends, skill relationships, and role requirements grounded in Neo4j & Qdrant
              </CardDescription>
            </div>
          </div>
          {result?.strategy && getStrategyBadge(result.strategy)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search input form */}
        <form onSubmit={onSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Ask anything about placement trends, skill co-occurrences, or roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="pr-10"
            />
          </div>
          <Button type="submit" disabled={!query.trim() || isLoading} isLoading={isLoading}>
            <Send className="h-4 w-4 mr-1.5" />
            Query
          </Button>
        </form>

        {/* Preset query chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Examples:
          </span>
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQuery(preset);
                handleSearch(preset);
              }}
              className="text-xs bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full border border-border/60 transition-colors text-left"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-xs">Query Failed</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 space-y-3 animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary animate-spin" />
              <span className="text-xs font-semibold text-primary">
                Agent synthesizing knowledge graph and vector evidence...
              </span>
            </div>
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        )}

        {/* Synthesized Response Output */}
        {result && !isLoading && (
          <div className="p-4 sm:p-5 rounded-xl border bg-card/60 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Grounded Agent Synthesis
              </span>
              {result.strategy && getStrategyBadge(result.strategy)}
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground leading-relaxed whitespace-pre-line">
              {result.answer}
            </div>

            {/* Evidence Sources */}
            {result.evidence_sources && result.evidence_sources.length > 0 && (
              <div className="pt-3 border-t border-border/60">
                <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Knowledge Sources ({result.evidence_sources.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.evidence_sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-border/80 bg-background/50 text-xs space-y-1"
                    >
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {src.type || 'Knowledge Evidence'}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{src.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
