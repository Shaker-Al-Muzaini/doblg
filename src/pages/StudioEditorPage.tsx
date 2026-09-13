import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Link2, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Mic, 
  Music, 
  Lock,
  RefreshCw,
  ChevronLeft,
  Loader
} from 'lucide-react';
import { Language, Theme, TimelineBlock } from '../types';
import { apiClient } from '../services/api';

export interface StudioEditorPageProps {
  projectId: string;
  lang: Language;
  theme: Theme;
  onBackToDashboard: () => void;
}

export const StudioEditorPage: React.FC<StudioEditorPageProps> = ({
  projectId,
  lang,
  theme,
  onBackToDashboard
}) => {
  const isRtl = lang === 'ar';
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioMode, setAudioMode] = useState<'ORIGINAL' | 'DUBBED' | 'ME'>('DUBBED');
  const [blocks, setBlocks] = useState<TimelineBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('https://www.w3schools.com/html/mov_bbb.mp4');
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      } else {
        videoRef.current.play().catch(() => {});
        const currentBlock = blocks.find(b => b.id === selectedBlockId);
        if (currentBlock && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(currentBlock.translatedText);
          utterance.lang = 'ar-SA';
          window.speechSynthesis.speak(utterance);
        }
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // --- Load timeline and project from API ---
  const fetchTimeline = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load project info
      const project = await apiClient.get<any>(`/projects/${projectId}`);
      setProjectTitle(project.title);
      if (project.sourceUrl && project.sourceUrl.startsWith('http')) {
        setVideoUrl(project.sourceUrl);
      }

      // Load timeline blocks
      const tlBlocks = await apiClient.get<TimelineBlock[]>(`/projects/${projectId}/timeline`);
      setBlocks(tlBlocks);
      if (tlBlocks.length > 0) setSelectedBlockId(tlBlocks[0].id);
    } catch (err: any) {
      setError(err.message || 'Failed to load timeline');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  // --- Save single block via PATCH ---
  const handleSaveBlock = async (block: TimelineBlock) => {
    try {
      setIsSaving(true);
      await apiClient.patch(`/timeline/blocks/${block.id}`, {
        translatedText: block.translatedText,
        startTimeMs: block.startTimeMs,
        endTimeMs: block.endTimeMs,
        status: block.status === 'AUTO' ? 'EDITED' : block.status,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBlockText = (id: string, newText: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, translatedText: newText, status: 'EDITED' } : b));
  };

  // --- Approve timeline and start rendering ---
  const handleApproveAndRender = async () => {
    setIsApproving(true);
    try {
      await apiClient.post(`/projects/${projectId}/timeline/approve`);
      alert(isRtl ? 'تم اعتماد الترجمة وبدأت عملية التوليد الصوتي!' : 'Timeline approved! Synthesis has started.');
      onBackToDashboard();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsApproving(false);
    }
  };

  const getSyncBadge = (deltaPct: number) => {
    if (deltaPct <= 5.0) {
      return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🟢 +{deltaPct.toFixed(1)}%</span>;
    } else if (deltaPct <= 15.0) {
      return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">🟡 +{deltaPct.toFixed(1)}%</span>;
    } else {
      return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">🔴 +{deltaPct.toFixed(1)}%</span>;
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`h-[calc(100vh-3rem)] flex flex-col ${theme === 'dark' ? 'bg-[#0D0F12] text-gray-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Toolbar */}
      <div className={`h-10 px-4 border-b flex items-center justify-between text-xs ${
        theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button onClick={onBackToDashboard} className="text-gray-400 hover:text-white flex items-center gap-1 font-semibold">
            <ChevronLeft className="w-4 h-4" />
            <span>{isRtl ? 'الرئيسية' : 'Dashboard'}</span>
          </button>
          <span className="text-gray-600">|</span>
          <span className="font-bold truncate max-w-xs">{projectTitle || `Project #${projectId}`}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {isRtl ? 'جار التحرير' : 'EDITING'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {error && (
            <span className="text-red-400 text-[10px] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {error}
            </span>
          )}
          {saveSuccess && (
            <span className="text-emerald-400 text-[10px] flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {isRtl ? 'تم الحفظ' : 'Saved!'}
            </span>
          )}
          <button
            onClick={() => {
              const selected = blocks.find(b => b.id === selectedBlockId);
              if (selected) handleSaveBlock(selected);
            }}
            disabled={isSaving}
            className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center gap-1"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'حفظ التعديل' : 'Save Block'}</span>
          </button>
          <button
            onClick={handleApproveAndRender}
            disabled={isApproving || blocks.length === 0}
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold flex items-center gap-1"
          >
            {isApproving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            <span>{isRtl ? 'اعتماد وتوليد الصوت' : 'Approve & Render'}</span>
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm text-gray-400">{isRtl ? 'جار تحميل الخط الزمني...' : 'Loading timeline...'}</p>
          </div>
        </div>
      )}

      {/* Main 3-Pane Workspace */}
      {!isLoading && (
        <div className="flex-1 grid grid-rows-12 gap-1 p-1 overflow-hidden">
          
          {/* Top 7 Rows: Video Viewport & Script Inspector */}
          <div className="row-span-7 grid grid-cols-12 gap-1 overflow-hidden">
            
            {/* Pane 1: Video Preview Player */}
            <div className={`col-span-6 rounded-lg border p-3 flex flex-col justify-between ${
              theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
            }`}>
              <div 
                onClick={togglePlay}
                className="relative aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center border border-gray-900 group cursor-pointer"
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                />

                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-indigo-600/80 border border-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/50">
                      <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}
                
                {/* Subtitle Overlay */}
                {selectedBlockId && (
                  <div className="absolute bottom-4 inset-x-6 text-center pointer-events-none">
                    <span className="px-3 py-1.5 rounded bg-black/85 text-white font-bold text-sm border border-white/20 leading-relaxed shadow-lg" dir="rtl">
                      {blocks.find(b => b.id === selectedBlockId)?.translatedText || '...'}
                    </span>
                  </div>
                )}

                {/* Timecode Overlay */}
                <div className="absolute top-3 left-3 bg-black/80 text-indigo-400 font-mono font-bold text-xs px-2.5 py-1 rounded border border-indigo-500/30 pointer-events-none">
                  {blocks.find(b => b.id === selectedBlockId) 
                    ? `${((blocks.find(b => b.id === selectedBlockId)!.startTimeMs) / 1000).toFixed(2)}s`
                    : '00:00:00'
                  }
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button onClick={togglePlay} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <span className="font-mono text-xs text-gray-400">
                    {blocks.length} {isRtl ? 'مقطع' : 'blocks'}
                  </span>
                </div>

                {/* Audio Stream Switcher */}
                <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-lg border border-[#262B34] text-xs">
                  {(['ORIGINAL', 'DUBBED', 'ME'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAudioMode(mode)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        audioMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pane 2: Script & Alignment Inspector */}
            <div className={`col-span-6 rounded-lg border p-3 flex flex-col ${
              theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-inherit mb-2">
                <h3 className="text-xs font-bold text-indigo-400">{isRtl ? 'السكريبت التفاعلي والمحاذاة' : 'Script & Alignment Inspector'}</h3>
                <span className="text-[10px] text-gray-400">{blocks.length} {isRtl ? 'مقاطع' : 'blocks'}</span>
              </div>

              {blocks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <Mic className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">{isRtl ? 'لا توجد مقاطع بعد. ابدأ معالجة الفيديو أولاً.' : 'No blocks yet. Start video processing first.'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-3 py-1">
                  {blocks.map((blk) => (
                    <div
                      key={blk.id}
                      onClick={() => setSelectedBlockId(blk.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedBlockId === blk.id
                          ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500'
                          : theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34] hover:border-gray-600' : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-indigo-300">{blk.speakerLabel || `Block #${blk.sequenceOrder}`}</span>
                        <div className="flex items-center gap-2">
                          {getSyncBadge(blk.timingDeltaPct || 0)}
                          <span className="text-[10px] font-mono text-gray-400">
                            {(blk.startTimeMs / 1000).toFixed(1)}s → {(blk.endTimeMs / 1000).toFixed(1)}s
                          </span>
                        </div>
                      </div>

                      {blk.sourceText && (
                        <p className="text-gray-400 text-[11px] mb-1.5 italic">EN: {blk.sourceText}</p>
                      )}

                      <textarea
                        rows={2}
                        dir="rtl"
                        value={blk.translatedText}
                        onChange={(e) => handleUpdateBlockText(blk.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full p-2 rounded border text-xs leading-relaxed transition-all ${
                          theme === 'dark' ? 'bg-[#16191E] border-[#262B34] text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
                        }`}
                      />

                      {blk.flagReason && (
                        <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {blk.flagReason}
                        </p>
                      )}

                      {/* Confidence badge */}
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-gray-500">
                          {isRtl ? 'الثقة:' : 'Confidence:'} {((blk.confidence || 0) * 100).toFixed(1)}%
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          blk.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                          blk.status === 'EDITED' ? 'bg-blue-500/20 text-blue-400' :
                          blk.status === 'FLAGGED' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {blk.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Bottom 5 Rows: Multi-Track Waveform Timeline */}
          <div className={`row-span-5 rounded-lg border p-3 flex flex-col ${
            theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
          }`}>
            {/* Timeline Toolbar */}
            <div className="flex items-center justify-between pb-2 border-b border-inherit">
              <div className="flex items-center gap-2">
                <button className="p-1 rounded bg-gray-800 text-gray-300 hover:text-white" title="Split block (S)"><Scissors className="w-3.5 h-3.5" /></button>
                <button className="p-1 rounded bg-gray-800 text-gray-300 hover:text-white" title="Merge blocks (M)"><Link2 className="w-3.5 h-3.5" /></button>
                <span className="text-gray-600">|</span>
                <span className="text-[10px] text-gray-400 font-mono">Zoom: {zoomLevel}%</span>
                <input type="range" min="10" max="100" value={zoomLevel} onChange={(e) => setZoomLevel(Number(e.target.value))} className="w-20 accent-indigo-500" />
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> {isRtl ? 'الصوت الأصلي' : 'Vocal Stem'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> {isRtl ? 'الدبلجة العربية' : 'Arabic Dub'}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {isRtl ? 'المؤثرات' : 'Music M&E'}</span>
              </div>
            </div>

            {/* Tracks Viewport */}
            <div className="flex-1 bg-[#0D0F12] rounded border border-[#262B34] p-2 space-y-2 overflow-x-auto relative mt-2">
              {/* Playhead */}
              <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-red-500 z-20 pointer-events-none" />

              {/* Track 1: Original Vocals */}
              <div className="h-7 bg-indigo-950/40 rounded border border-indigo-800/30 flex items-center px-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-indigo-400 w-20 shrink-0 flex items-center gap-1"><Lock className="w-3 h-3" /> Vocals</span>
                <div className="flex-1 h-4 rounded overflow-hidden flex gap-0.5" style={{ minWidth: `${zoomLevel * 3}%` }}>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 bg-indigo-500/40 rounded-sm" style={{ height: `${Math.random() * 100}%`, alignSelf: 'center' }} />
                  ))}
                </div>
              </div>

              {/* Track 2: Dubbed Speech Clips */}
              <div className="h-7 bg-purple-950/40 rounded border border-purple-800/30 flex items-center px-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-purple-400 w-20 shrink-0 flex items-center gap-1"><Mic className="w-3 h-3" /> Dubbed</span>
                <div className="flex-1 flex gap-2">
                  {blocks.slice(0, 4).map((blk, i) => (
                    <div
                      key={blk.id}
                      onClick={() => setSelectedBlockId(blk.id)}
                      className={`h-5 rounded px-2 text-[10px] text-white flex items-center font-bold shadow-sm cursor-pointer transition-all ${
                        selectedBlockId === blk.id ? 'bg-purple-500 ring-1 ring-white' : 'bg-purple-600/60 hover:bg-purple-500'
                      }`}
                      style={{ minWidth: `${Math.max(60, (blk.endTimeMs - blk.startTimeMs) / 100)}px` }}
                    >
                      #{blk.sequenceOrder}
                    </div>
                  ))}
                </div>
              </div>

              {/* Track 3: Background M&E */}
              <div className="h-7 bg-emerald-950/40 rounded border border-emerald-800/30 flex items-center px-2 relative overflow-hidden">
                <span className="text-[10px] font-bold text-emerald-400 w-20 shrink-0 flex items-center gap-1"><Music className="w-3 h-3" /> M&E</span>
                <div className="flex-1 h-3 bg-emerald-500/30 rounded" />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default StudioEditorPage;
