import api from './api';
import {
  InterviewSession,
  InterviewSessionListItem,
  CreateSessionPayload,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  SuggestedRolesResponse,
} from '../types/interview';

export const interviewService = {
  /**
   * Initiate a new AI mock interview session.
   */
  async createSession(payload: CreateSessionPayload): Promise<InterviewSession> {
    const response = await api.post<InterviewSession>('/interviews/sessions/', payload);
    return response.data;
  },

  /**
   * List all past interview sessions for the authenticated candidate.
   */
  async listSessions(): Promise<InterviewSessionListItem[]> {
    const response = await api.get<InterviewSessionListItem[]>('/interviews/sessions/');
    return response.data;
  },

  /**
   * Fetch full details of an interview session, including questions and evaluations.
   */
  async getSession(sessionId: string): Promise<InterviewSession> {
    const response = await api.get<InterviewSession>(`/interviews/sessions/${sessionId}/`);
    return response.data;
  },

  /**
   * Submit an answer to a question in an active interview session.
   */
  async submitAnswer(
    sessionId: string,
    payload: SubmitAnswerPayload
  ): Promise<SubmitAnswerResponse> {
    const response = await api.post<SubmitAnswerResponse>(
      `/interviews/sessions/${sessionId}/answer/`,
      payload
    );
    return response.data;
  },

  /**
   * Finalize a session and calculate overall readiness summary.
   */
  async completeSession(sessionId: string): Promise<InterviewSession> {
    const response = await api.post<InterviewSession>(
      `/interviews/sessions/${sessionId}/complete/`
    );
    return response.data;
  },

  /**
   * Delete an interview session.
   */
  async deleteSession(sessionId: string): Promise<void> {
    await api.delete(`/interviews/sessions/${sessionId}/`);
  },

  /**
   * Fetch standard canonical roles with top skills from the knowledge graph.
   */
  async getSuggestedRoles(): Promise<SuggestedRolesResponse> {
    const response = await api.get<SuggestedRolesResponse>('/interviews/roles/');
    return response.data;
  },
};
