import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  Link as LinkIcon, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Film, 
  Sparkles, 
  RefreshCw, 
  ArrowUpRight,
  Filter,
  Play,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Language, Theme, Project } from '../types';
import { apiClient } from '../services/api';

export interface DashboardPageProps {
  lang: Language;
  theme: Theme;
  onOpenProjectEditor: (projectId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ lang, theme, onOpenProjectEditor }) => {
  const isRtl = lang === 'ar';
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Fetch projects from real API ---
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<Project[]>('/projects');
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const intervalId = setInterval(() => {
      fetchProjects();
    }, 2500);
    return () => clearInterval(intervalId);
  }, []);

  const handleSelectFile = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setUrlInput('');
  };

  // --- Create project via API ---
  const handleStartIngest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalUrl = urlInput.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4';
    const finalTitle = titleInput.trim() || (isRtl ? 'مشروع ترجمة ودبلجة جديد' : 'New Video Dubbing Project');
    setIsSubmitting(true);
    setError(null);
    try {
      const isUploadMode = !!selectedFile;
      const newProj = await apiClient.post<Project>('/projects', {
        title: finalTitle,
        sourceOrigin: isUploadMode ? 'UPLOAD' : 'URL',
        sourceUrl: isUploadMode ? selectedFile?.name || finalUrl : finalUrl,
        legalConsented: true,
      });

      if (isUploadMode) {
        const formData = new FormData();
        formData.append('file', selectedFile as File);
        await apiClient.upload(`/projects/${newProj.id}/upload`, formData);
      }

      await apiClient.post(`/projects/${newProj.id}/start`).catch(() => {});
      setProjects((prev) => [newProj, ...prev]);
      setUrlInput('');
      setTitleInput('');
      setLegalAccepted(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onOpenProjectEditor(newProj.id);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Delete project via API ---
  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Delete this project?')) return;
    try {
      await apiClient.delete(`/projects/${projectId}`);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {isRtl ? 'مكتمل' : 'COMPLETE'}
        </span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" /> {isRtl ? 'فشل' : 'FAILED'}
        </span>;
      case 'CREATED':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-500/20 text-gray-400 border border-gray-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {isRtl ? 'جديد' : 'PENDING'}
        </span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1 animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin" /> {status}
        </span>;
    }
  };

  const activeCount = projects.filter(p => !['COMPLETED', 'FAILED', 'CREATED'].includes(p.status)).length;
  const completedCount = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Global Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-red-100">✕</button>
        </div>
      )}

      {/* 1. Top Metric Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { labelAr: 'المشاريع النشطة', labelEn: 'Active Jobs', value: String(activeCount), icon: Activity, color: 'text-indigo-400', subAr: 'معالجة جارية', subEn: 'In pipeline' },
          { labelAr: 'مشاريع مكتملة', labelEn: 'Completed', value: String(completedCount), icon: CheckCircle2, color: 'text-emerald-400', subAr: 'جاهزة للتحميل', subEn: 'Ready to download' },
          { labelAr: 'إجمالي المشاريع', labelEn: 'Total Projects', value: String(projects.length), icon: Film, color: 'text-purple-400', subAr: 'كل المشاريع', subEn: 'All projects' },
          { labelAr: 'الرصيد المتبقي', labelEn: 'Remaining Credits', value: '17.5 h', icon: Clock, color: 'text-amber-400', subAr: 'ينتهي بعد 18 يوماً', subEn: 'Resets in 18 days' },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border transition-all backdrop-blur-sm ${
              theme === 'dark' ? 'bg-[linear-gradient(180deg,rgba(17,24,39,0.8),rgba(15,23,42,0.95))] border-white/10 shadow-[0_12px_28px_rgba(15,23,42,0.2)]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">{isRtl ? m.labelAr : m.labelEn}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <p className="text-2xl font-extrabold font-mono">{m.value}</p>
              <p className="text-[10px] text-gray-500 mt-1">{isRtl ? m.subAr : m.subEn}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Quick Ingest Zone */}
      <div className={`p-5 rounded-2xl border bg-gradient-to-br ${
        theme === 'dark' ? 'from-[#171d2a] via-[#121a26] to-[#0f1622] border-white/10 shadow-[0_18px_40px_rgba(15,23,42,0.35)]' : 'from-white via-indigo-50/40 to-slate-50 border-slate-200 shadow-sm'
      }`}>
        <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-indigo-400" />
          <span>{isRtl ? 'رفع فيديو جديد أو رابط خارجي' : 'Quick Media Ingest Zone'}</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Drag & Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const file = e.dataTransfer.files?.[0] ?? null;
              handleSelectFile(file);
            }}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragOver 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : theme === 'dark' ? 'border-[#262B34] hover:border-gray-600 bg-[#0D0F12]' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mov,video/webm,audio/mp3,audio/wav"
              className="hidden"
              onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
            />
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold">{selectedFile ? selectedFile.name : (isRtl ? 'اسحب ملف الفيديو هنا أو اضغط للاختيار' : 'Drag & drop video files here or click to browse')}</p>
            <p className="text-[10px] text-gray-500 mt-1">MP4, MOV, MP3, WAV (Up to 2GB per file)</p>
          </div>

          {/* External URL Form */}
          <form onSubmit={handleStartIngest} className="flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400">
                {isRtl ? 'عنوان المشروع' : 'Project Title'}
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={isRtl ? 'مثال: شرح نظام المعالجة الصوتية' : 'e.g. System Design Masterclass EP4'}
                className={`w-full py-2.5 px-3 rounded-lg text-xs border transition-all ${
                  theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34] text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                }`}
              />
              <label className="text-xs font-semibold text-gray-400">
                {isRtl ? 'أو أدخل رابط فيديو خارجي' : 'Or import via Direct Video URL'}
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-gray-400 absolute top-3 left-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full py-2.5 px-9 rounded-lg text-xs border transition-all ${
                    theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34] text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* Legal Consent Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="legalCheck"
                checked={legalAccepted}
                onChange={(e) => setLegalAccepted(e.target.checked)}
                className="mt-0.5 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="legalCheck" className="text-[11px] text-gray-400 leading-tight cursor-pointer">
                {isRtl 
                  ? 'أؤكد أنني أملك الحقوق القانونية لترجمة ودبلجة هذا المحتوى وفقاً للشروط.' 
                  : 'I confirm I hold legal authorization to translate and dub this media file.'
                }
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
            >
              {isSubmitting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>{isRtl ? 'بدء المعالجة والتكشيف' : 'Start Pipeline Ingestion'}</span>
            </button>
          </form>

        </div>
      </div>

      {/* 3. Project Status Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Film className="w-4 h-4 text-indigo-400" />
            <span>{isRtl ? 'مشاريع الدبلجة' : 'Dubbing Projects'}</span>
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={fetchProjects}
              className={`px-2.5 py-1 rounded-md border text-gray-400 flex items-center gap-1 ${
                theme === 'dark' ? 'bg-[#16191E] border-[#262B34] hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-400'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isRtl ? 'تحديث' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className={`p-4 rounded-xl border animate-pulse h-40 ${theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-slate-100 border-slate-200'}`} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && projects.length === 0 && (
          <div className={`p-10 rounded-xl border text-center ${theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'}`}>
            <Film className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-400">
              {isRtl ? 'لا توجد مشاريع حتى الآن' : 'No projects yet'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {isRtl ? 'أضف رابط أو فيديو أعلاه لبدء الدبلجة' : 'Add a URL or upload a video above to start dubbing'}
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  theme === 'dark' ? 'bg-[#16191E] border-[#262B34] hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                }`}
              >
                <div className="flex gap-3">
                  {proj.thumbnailUrl ? (
                    <img src={proj.thumbnailUrl} alt={proj.title} className="w-24 h-16 rounded-lg object-cover border border-inherit shrink-0" />
                  ) : (
                    <div className="w-24 h-16 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                      <Film className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold truncate leading-snug">{proj.title}</h3>
                      {getStatusBadge(proj.status)}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {proj.sourceOrigin} • {proj.durationMs > 0 ? `${(proj.durationMs / 60000).toFixed(1)} mins` : '—'}
                    </p>
                    <p className="text-[10px] text-gray-600">
                      {proj.createdAt ? new Date(proj.createdAt).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', { dateStyle: 'medium' }) : ''}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{isRtl ? 'تقدم المعالجة' : 'Pipeline Progress'}</span>
                    <span className="font-mono">{proj.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        proj.status === 'COMPLETED' ? 'bg-emerald-500' :
                        proj.status === 'FAILED' ? 'bg-red-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${proj.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-inherit pt-2">
                  <span className="text-[10px] text-gray-400">
                    {proj.confidenceScore ? `${isRtl ? 'دقة التزامن:' : 'Confidence:'} ${proj.confidenceScore}%` : ''}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      className="p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 transition-colors"
                      title={isRtl ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenProjectEditor(proj.id)}
                      className="px-3 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isRtl ? 'فتح المحرر' : 'Open Editor'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
