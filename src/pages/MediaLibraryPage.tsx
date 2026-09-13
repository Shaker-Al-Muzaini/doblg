import React, { useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  HardDrive, 
  Snowflake, 
  Flame, 
  Download, 
  Eye, 
  RefreshCw, 
  Trash2, 
  Database
} from 'lucide-react';
import { Language, Theme, MediaAsset } from '../types';

export interface MediaLibraryPageProps {
  lang: Language;
  theme: Theme;
}

const MOCK_ASSETS: MediaAsset[] = [
  {
    id: 'ast-1',
    projectId: 'proj-1',
    role: 'ORIGINAL_VIDEO',
    fileName: 'system_design_ep4_master.mp4',
    mimeType: 'video/mp4',
    fileSizeBytes: 1288490188, // 1.2 GB
    storageTier: 'HOT',
    createdAt: '2026-09-12 14:30'
  },
  {
    id: 'ast-2',
    projectId: 'proj-1',
    role: 'VOCAL_STEM',
    fileName: 'system_design_ep4_vocals.wav',
    mimeType: 'audio/wav',
    fileSizeBytes: 356515840, // 340 MB
    storageTier: 'HOT',
    createdAt: '2026-09-12 14:32'
  },
  {
    id: 'ast-3',
    projectId: 'proj-1',
    role: 'BACKGROUND_STEM',
    fileName: 'system_design_ep4_bg_music.wav',
    mimeType: 'audio/wav',
    fileSizeBytes: 325058560, // 310 MB
    storageTier: 'HOT',
    createdAt: '2026-09-12 14:32'
  },
  {
    id: 'ast-4',
    projectId: 'proj-1',
    role: 'SYNTHESIZED_VOICE',
    fileName: 'system_design_ep4_arabic_voice.wav',
    mimeType: 'audio/wav',
    fileSizeBytes: 293601280, // 280 MB
    storageTier: 'HOT',
    createdAt: '2026-09-12 14:45'
  },
  {
    id: 'ast-5',
    projectId: 'proj-2',
    role: 'FINAL_VIDEO',
    fileName: 'product_keynote_q4_dubbed_final.mp4',
    mimeType: 'video/mp4',
    fileSizeBytes: 1503238553, // 1.4 GB
    storageTier: 'COLD',
    createdAt: '2026-08-28 10:15'
  }
];

export const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({ lang, theme }) => {
  const isRtl = lang === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<MediaAsset[]>(MOCK_ASSETS);

  const getStorageBadge = (tier: MediaAsset['storageTier']) => {
    switch (tier) {
      case 'HOT':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <Flame className="w-3 h-3 text-emerald-400" /> Hot (Instant)
        </span>;
      case 'COLD':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
          <Snowflake className="w-3 h-3 text-sky-400" /> Cold (Glacier)
        </span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Warm
        </span>;
    }
  };

  const filteredAssets = assets.filter(a => a.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            <span>{isRtl ? 'مكتبة الوسائط والتخزين السحابي' : 'Comprehensive Media Asset Library'}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {isRtl ? 'إدارة ملفات الفيديو، المسارات الصوتية المعزولة، والملفات النهائية' : 'Manage raw media files, vocal stems, synthesized audio, and cold archives'}
          </p>
        </div>

        {/* Storage Summary */}
        <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
          theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
        }`}>
          <Database className="w-4 h-4 text-indigo-400" />
          <div>
            <p className="font-bold">3.53 GB / 50 GB</p>
            <p className="text-[10px] text-gray-400">{isRtl ? 'مساحة السحابة المستعملة' : 'S3 Storage Used'}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
        theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
      }`}>
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute top-3 left-3 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isRtl ? 'بحث باسم الملف...' : 'Search assets by filename...'}
            className={`w-full py-2 px-9 rounded-lg text-xs border transition-all ${
              theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34] text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button className={`px-3 py-1.5 rounded-lg border text-gray-300 flex items-center gap-1.5 ${
            theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34]' : 'bg-slate-50 border-slate-200'
          }`}>
            <Filter className="w-3.5 h-3.5" />
            <span>{isRtl ? 'جميع المستويات' : 'All Tiers'}</span>
          </button>
        </div>
      </div>

      {/* Data Grid Table */}
      <div className={`rounded-xl border overflow-hidden ${
        theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className={`border-b uppercase text-[10px] font-bold tracking-wider ${
              theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34] text-gray-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <tr>
                <th className="p-3">{isRtl ? 'اسم الملف' : 'File Name'}</th>
                <th className="p-3">{isRtl ? 'الدور' : 'Role'}</th>
                <th className="p-3">{isRtl ? 'الحجم' : 'Size'}</th>
                <th className="p-3">{isRtl ? 'مستوى التخزين' : 'Storage Tier'}</th>
                <th className="p-3">{isRtl ? 'تاريخ الإضافة' : 'Created At'}</th>
                <th className="p-3 text-end">{isRtl ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className={`transition-colors ${
                  theme === 'dark' ? 'hover:bg-[#1F242C]' : 'hover:bg-slate-50'
                }`}>
                  <td className="p-3 font-semibold truncate max-w-xs">{asset.fileName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-gray-800 text-gray-300">
                      {asset.role}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{(asset.fileSizeBytes / 1048576).toFixed(1)} MB</td>
                  <td className="p-3">{getStorageBadge(asset.storageTier)}</td>
                  <td className="p-3 text-gray-400">{asset.createdAt}</td>
                  <td className="p-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1 rounded hover:bg-gray-800 text-gray-300" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded hover:bg-gray-800 text-indigo-400" title="Download"><Download className="w-3.5 h-3.5" /></button>
                      {asset.storageTier === 'COLD' && (
                        <button className="px-2 py-0.5 text-[10px] rounded bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white font-bold">
                          {isRtl ? 'طلب استرجاع' : 'Restore'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MediaLibraryPage;
