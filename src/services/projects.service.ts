import { apiClient } from './api';
import { Project, MediaAsset } from '../types';

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    return apiClient.get<Project[]>('/projects');
  },

  async getProject(id: string): Promise<Project> {
    return apiClient.get<Project>(`/projects/${id}`);
  },

  async createProject(data: {
    title: string;
    sourceOrigin: 'UPLOAD' | 'URL';
    sourceUrl?: string;
    legalConsented?: boolean;
  }): Promise<Project> {
    return apiClient.post<Project>('/projects', data);
  },

  async deleteProject(id: string): Promise<void> {
    return apiClient.delete<void>(`/projects/${id}`);
  },

  async startProcessing(projectId: string): Promise<Project> {
    return apiClient.post<Project>(`/projects/${projectId}/start`);
  },

  async retryJob(projectId: string, jobType: string): Promise<void> {
    return apiClient.post<void>(`/projects/${projectId}/retry`, { jobType });
  },

  uploadProjectMedia(
    projectId: string, 
    file: File, 
    onProgress?: (pct: number) => void
  ): Promise<MediaAsset> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      const token = localStorage.getItem('dolag_token');

      xhr.open('POST', `${baseUrl}/projects/${projectId}/upload`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  },
};
