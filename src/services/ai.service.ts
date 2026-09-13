import { apiClient } from './api';

export interface ComplianceCheckResult {
  status: 'PASSED' | 'FAILED' | 'WARNING';
  checks: Array<{
    type: string;
    passed: boolean;
    detail: string;
  }>;
}

export interface JobStatusResult {
  status: string;
  progress: number;
  errorMessage?: string;
}

export const aiService = {
  async previewTTS(text: string, speakerLabel: string, projectId: string): Promise<{ audioUrl: string; durationMs: number }> {
    return apiClient.post<{ audioUrl: string; durationMs: number }>('/ai/tts/preview', {
      text,
      speakerLabel,
      projectId,
    });
  },

  async checkCompliance(url: string): Promise<ComplianceCheckResult> {
    return apiClient.post<ComplianceCheckResult>('/ai/compliance/check', { url });
  },

  async getJobStatus(jobId: string): Promise<JobStatusResult> {
    return apiClient.get<JobStatusResult>(`/ai/jobs/${jobId}`);
  },

  subscribeToProjectStream(
    projectId: string, 
    onUpdate: (data: { status: string; progress: number; stage: string }) => void
  ): () => void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    const eventSource = new EventSource(`${wsUrl.replace('ws://', 'http://')}/projects/${projectId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onUpdate(data);
      } catch (err) {
        console.error('Error parsing SSE stream update', err);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  },
};
