import React, { useEffect, useState } from 'react';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/jobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetailModal } from '@/components/jobs/JobDetailModal';
import { CardListSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorRetryCard } from '@/components/shared/ErrorRetryCard';
import { ReiconRadar } from '@/components/icons/Reicon';
import { Search, Briefcase, RefreshCw, X } from 'lucide-react';

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[rgba(0,136,85,0.1)] text-[#004D2F] dark:text-[rgba(76,214,129,1)] border border-[rgba(0,162,100,0.3)] font-mono mb-2">
            <ReiconRadar size={13} strokeWidth={2} />
            <span>Market Feed</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#004D2F] dark:text-white">
            Job Explorer
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Browse and filter live placement opportunities with spaCy-extracted requirements
          </p>
        </div>

        <button
          type="button"
          onClick={fetchJobs}
          disabled={isLoading}
          className="self-start sm:self-auto h-9 px-3.5 rounded-lg text-xs font-semibold text-[#004D2F] dark:text-[rgba(76,214,129,1)] bg-white dark:bg-[#09150E] border border-[rgba(0,136,85,0.3)] hover:bg-[rgba(0,77,47,0.06)] dark:hover:bg-[rgba(0,77,47,0.3)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Listings</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-[rgba(0,162,100,0.22)] bg-card shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title, company, skills, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm border border-neutral-300 dark:border-[rgba(0,162,100,0.3)] bg-white dark:bg-[#09150E] text-[#0A1A12] dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] focus:ring-1 focus:ring-[#008855] dark:focus:ring-[rgba(76,214,129,1)] transition-all"
            />
          </div>

          {/* City Filter & Remote Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-10 px-3 rounded-lg border border-neutral-300 dark:border-[rgba(0,162,100,0.3)] bg-white dark:bg-[#09150E] text-sm text-[#0A1A12] dark:text-white focus:outline-none focus:border-[#008855] dark:focus:border-[rgba(76,214,129,1)] cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Remote Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsRemoteOnly(!isRemoteOnly)}
              className={`h-10 px-3 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isRemoteOnly
                  ? 'bg-[rgba(76,214,129,1)] text-[#003822] shadow-xs'
                  : 'bg-white dark:bg-[#09150E] border border-neutral-300 dark:border-[rgba(0,162,100,0.3)] text-neutral-700 dark:text-neutral-300 hover:border-[#008855]'
              }`}
            >
              Remote Only
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="h-10 px-3 rounded-lg text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-white/10 font-mono">
          <span>
            Showing <strong className="text-[#004D2F] dark:text-white font-bold">{jobs.length}</strong> available job listings
          </span>
          {hasActiveFilters && (
            <span className="text-[#008855] dark:text-[rgba(76,214,129,1)] font-semibold">
              Filters Active
            </span>
          )}
        </div>
      </div>

      {/* Content Feed */}
      {isLoading ? (
        <CardListSkeleton count={6} />
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
