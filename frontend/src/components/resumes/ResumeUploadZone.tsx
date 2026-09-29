import React, { useState, useRef } from 'react';
import { UploadCloud, AlertCircle, Loader2 } from 'lucide-react';
import { ReiconAtsDoc } from '@/components/icons/Reicon';
import { resumeService } from '@/services/resumeService';
import { ResumeSummary } from '@/types/resumes';

interface ResumeUploadZoneProps {
  onUploadSuccess: (resume: ResumeSummary) => void;
}

export const ResumeUploadZone: React.FC<ResumeUploadZoneProps> = ({ onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileProcess = async (file: File) => {
    // Client-side validations
    const allowedExtensions = ['.pdf', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setUploadError(`Unsupported file format. Please upload a .pdf or .docx document.`);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setUploadError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 5MB maximum limit.`
      );
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const summary = await resumeService.uploadResume(file);
      onUploadSuccess(summary);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.file?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Failed to upload and parse resume. Please ensure the file is valid.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileProcess(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[rgba(0,162,100,0.8)] bg-[rgba(0,77,47,0.08)] dark:bg-[rgba(0,77,47,0.3)] scale-[1.01]'
            : 'border-[rgba(0,162,100,0.3)] bg-card hover:bg-[rgba(0,77,47,0.04)] dark:hover:bg-[rgba(0,77,47,0.2)] hover:border-[rgba(0,162,100,0.5)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="h-12 w-12 rounded-lg bg-[rgba(0,136,85,0.1)] dark:bg-[rgba(0,77,47,0.4)] text-[#008855] dark:text-[rgba(76,214,129,1)] flex items-center justify-center mb-3">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ReiconAtsDoc size={24} strokeWidth={2} />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-[#004D2F] dark:text-white">
            {isUploading ? 'Parsing Technical Skills via NER...' : 'Click or drag your resume to upload'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Supports PDF and DOCX files up to 5MB
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
            PDF
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-white/10">
            DOCX
          </span>
        </div>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
