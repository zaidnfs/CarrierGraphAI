import React, { useEffect, useState, useMemo } from 'react';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/jobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetailModal } from '@/components/jobs/JobDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardListSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorRetryCard } from '@/components/shared/ErrorRetryCard';
import { Search, MapPin, Briefcase, Filter, RefreshCw } from 'lucide-react';

const CITIES = ['All Cities', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Chennai'];

export const JobExplorerPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);

  // Selected job for modal
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobs({
        q: searchQuery || undefined,
        city: selectedCity !== 'All Cities' ? selectedCity : undefined,
        remote: isRemoteOnly || undefined,
      });
      setJobs(data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to load job listings. Please verify that the backend API is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCity, isRemoteOnly]);

  const handleOpenModal = (job: JobPosting) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('All Cities');
    setIsRemoteOnly(false);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCity !== 'All Cities' || isRemoteOnly;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Job Explorer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and filter live placement opportunities with spaCy-extracted requirements
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchJobs}
          disabled={isLoading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Listings
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border bg-card shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, skills, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Remote Filter Toggle */}
            <Button
              type="button"
              variant={isRemoteOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsRemoteOnly(!isRemoteOnly)}
              className="h-10 text-xs shrink-0"
            >
              Remote Only
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-10 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <span>
            Showing <strong className="text-foreground">{jobs.length}</strong> available job listings
          </span>
          {hasActiveFilters && <span className="text-primary">Filters active</span>}
        </div>
      </div>

      {/* Content Feed */}
      {isLoading ? (
        <CardListSkeleton count={4} />
      ) : error ? (
        <ErrorRetryCard message={error} onRetry={fetchJobs} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job listings found"
          description="We couldn't find any job postings matching your current search or filter criteria. Try adjusting your search query or clearing filters."
          actionLabel={hasActiveFilters ? 'Clear All Filters' : undefined}
          onAction={hasActiveFilters ? handleClearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onSelect={handleOpenModal} />
          ))}
        </div>
      )}

      {/* Detail Slide-over / Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
