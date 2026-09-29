import React from 'react';
import { Link } from 'react-router-dom';
import { KoboyoSparkle } from '@/components/icons/Koboyo';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8FAF8] dark:bg-[#060B08] text-[#0A1A12] dark:text-[#EDF2EE]">
      <div className="h-16 w-16 rounded-xl bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center mb-4 border border-[rgba(0,162,100,0.3)] shadow-[0_0_20px_rgba(76,214,129,0.2)]">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-[#004D2F] dark:text-white">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md leading-relaxed">
        The career intelligence view you are looking for does not exist or has been shifted in our knowledge graph.
      </p>
      <Link
        to="/"
        className="mt-6 h-10 px-5 rounded-lg text-xs font-bold text-[#003822] bg-[rgba(76,214,129,1)] hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(76,214,129,0.3)] cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
};
