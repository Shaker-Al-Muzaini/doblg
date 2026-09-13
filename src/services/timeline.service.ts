import { apiClient } from './api';
import { TimelineBlock } from '../types';

export const timelineService = {
  async getTimeline(projectId: string): Promise<TimelineBlock[]> {
    return apiClient.get<TimelineBlock[]>(`/projects/${projectId}/timeline`);
  },

  async updateBlock(blockId: string, data: Partial<TimelineBlock>): Promise<TimelineBlock> {
    return apiClient.patch<TimelineBlock>(`/timeline/blocks/${blockId}`, data);
  },

  async approveTimeline(projectId: string): Promise<void> {
    return apiClient.post<void>(`/projects/${projectId}/timeline/approve`);
  },

  async splitBlock(blockId: string, splitAtMs: number): Promise<[TimelineBlock, TimelineBlock]> {
    return apiClient.post<[TimelineBlock, TimelineBlock]>(`/timeline/blocks/${blockId}/split`, { splitAtMs });
  },

  async mergeBlocks(blockIds: string[]): Promise<TimelineBlock> {
    return apiClient.post<TimelineBlock>('/timeline/blocks/merge', { blockIds });
  },
};
