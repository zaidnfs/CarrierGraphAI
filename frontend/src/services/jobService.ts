import api from './api';
import { JobFilterParams, JobMarketQueryResponse, JobPosting } from '../types/jobs';
import { PaginatedResponse } from '../types/api';

export const jobService = {
  async getJobs(params?: JobFilterParams): Promise<JobPosting[]> {
    const response = await api.get<JobPosting[] | PaginatedResponse<JobPosting>>('/jobs/', {
      params: {
        q: params?.q || undefined,
        city: params?.city || undefined,
        remote: params?.remote !== undefined ? params.remote : undefined,
        category: params?.category || undefined,
      },
    });

    // Handle both plain array and paginated format
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.results || [];
  },

  async getJobDetail(id: string): Promise<JobPosting> {
    const response = await api.get<JobPosting>(`/jobs/${id}/`);
    return response.data;
  },

  async queryJobMarket(query: string): Promise<JobMarketQueryResponse> {
    const response = await api.post<JobMarketQueryResponse>('/jobs/query/', {
      query,
    });
    return response.data;
  },
};
