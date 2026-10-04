import React, { useEffect, useState } from 'react';
import { jobService } from '@/services/jobService';
import { JobPosting } from '@/types/jobs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobDetailModal } from '@/components/jobs/JobDetailModal';
import { CardListSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorRetryCard } from '@/components/shared/ErrorRetryCard';
import { AIThinkingOrb } from '@/components/shared/AIThinkingOrb';
import { AILoadingState } from '@/components/shared/AILoadingState';
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EEF7F1] text-[#004D2F] border border-[#D6E8DD] font-mono mb-2">
            <ReiconRadar size={13} strokeWidth={2} />
            <span>Market Feed</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0A1A12]">
            Job Explorer
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Browse and filter live placement opportunities with spaCy-extracted requirements
          </p>
        </div>

        <button
          type="button"
          onClick={fetchJobs}
          disabled={isLoading}
          className="self-start sm:self-auto h-9 px-4 rounded-full text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <AIThinkingOrb state="searching" size={20} color="#008855" />
              <span>Querying...</span>
            </div>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5 text-neutral-500" />
              <span>Refresh Listings</span>
            </>
          )}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl border border-[#E2E8E5] bg-white shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by title, company, skills, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl text-sm border border-neutral-200 bg-[#F8FAF8] text-[#111827] placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-[#008855] focus:ring-2 focus:ring-[#008855]/15 transition-all shadow-xs"
            />
          </div>

          {/* City Filter & Remote Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-11 px-3 rounded-xl border border-neutral-200 bg-[#F8FAF8] text-sm text-[#111827] focus:outline-none focus:bg-white focus:border-[#008855] cursor-pointer shadow-xs"
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
              className={`h-11 px-4 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs ${
                isRemoteOnly
                  ? 'bg-[#008855] text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Remote Only
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="h-11 px-3 rounded-xl text-xs text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-100 font-mono">
          <span>
            Showing <strong className="text-[#0A1A12] font-bold">{jobs.length}</strong> available job listings
          </span>
          {hasActiveFilters && (
            <span className="text-[#008855] font-semibold">
              Filters Active
            </span>
          )}
        </div>
      </div>

      {/* Content Feed */}
      {isLoading ? (
        <AILoadingState
          state="searching"
          size="md"
          title="Querying Live Job Market & Knowledge Graph"
          description="Fetching verified placement roles, filtering location preferences, and matching skill requirements..."
          card={true}
        />
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
