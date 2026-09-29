export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  error?: string;
  detail?: string;
  details?: string | Record<string, any>;
  [key: string]: any;
}
