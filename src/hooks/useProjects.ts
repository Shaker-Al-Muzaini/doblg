import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { projectsService } from '../services/projects.service';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectsService.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: {
    title: string;
    sourceOrigin: 'UPLOAD' | 'URL';
    sourceUrl?: string;
    legalConsented?: boolean;
  }) => {
    const newProject = await projectsService.createProject(data);
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const deleteProject = async (id: string) => {
    await projectsService.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    deleteProject,
  };
}
