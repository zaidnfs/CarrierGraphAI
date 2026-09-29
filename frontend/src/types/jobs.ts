export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description?: string;
  location_city: string;
  location_country: string;
  is_remote: boolean;
  salary_min: string | number | null;
  salary_max: string | number | null;
  currency: string;
  category: string;
  posted_date: string | null;
  source_provider: string;
  source_id?: string;
  source_url: string;
  extracted_skills: string[];
  extracted_role: string;
  is_processed: boolean;
}

export interface JobMarketQueryResponse {
  query: string;
  strategy?: string;
  answer: string;
  evidence_sources?: Array<{
    type: string;
    description: string;
    details?: any;
  }>;
  suggested_followups?: string[];
}

export interface JobFilterParams {
  q?: string;
  city?: string;
  remote?: boolean;
  category?: string;
  page?: number;
}
