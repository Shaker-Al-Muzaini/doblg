import { useState, useEffect, useCallback } from 'react';
import { TimelineBlock } from '../types';
import { timelineService } from '../services/timeline.service';

export function useTimeline(projectId: string) {
  const [blocks, setBlocks] = useState<TimelineBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeline = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await timelineService.getTimeline(projectId);
      setBlocks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const updateBlock = async (blockId: string, data: Partial<TimelineBlock>) => {
    const updated = await timelineService.updateBlock(blockId, data);
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? updated : b)));
    return updated;
  };

  const approveTimeline = async () => {
    await timelineService.approveTimeline(projectId);
  };

  const splitBlock = async (blockId: string, splitAtMs: number) => {
    const [b1, b2] = await timelineService.splitBlock(blockId, splitAtMs);
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1, b1, b2);
      return next;
    });
  };

  const mergeBlocks = async (blockIds: string[]) => {
    const merged = await timelineService.mergeBlocks(blockIds);
    setBlocks((prev) => {
      const filtered = prev.filter((b) => !blockIds.includes(b.id));
      return [...filtered, merged].sort((a, b) => a.startTimeMs - b.startTimeMs);
    });
  };

  return {
    blocks,
    loading,
    error,
    refetch: fetchTimeline,
    updateBlock,
    approveTimeline,
    splitBlock,
    mergeBlocks,
  };
}
