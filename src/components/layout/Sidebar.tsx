import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Film, 
  CreditCard, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Language, Theme } from '../../types';

export interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  lang: Language;
  theme: Theme;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  lang,
  theme,
  isCollapsed,
  onToggleCollapse
}) => {
  const isRtl = lang === 'ar';

  const menuItems = [
    { id: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', labelAr: 'محرر الدبلجة', labelEn: 'Studio Editor', icon: Film, badge: 'AI' },
    { id: 'library', labelAr: 'مكتبة الوسائط', labelEn: 'Media Library', icon: FolderOpen },
    { id: 'billing', labelAr: 'الاشتراكات والخطط', labelEn: 'Billing & Plans', icon: CreditCard },
    { id: 'team', labelAr: 'فريق العمل', labelEn: 'Team Members', icon: Users },
    { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <aside
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`h-[calc(100vh-3rem)] sticky top-12 transition-all duration-200 z-30 select-none border-e flex flex-col justify-between ${
        isCollapsed ? 'w-14' : 'w-56'
      } ${
        theme === 'dark' 
          ? 'bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(10,14,22,0.96))] border-white/10 text-gray-300 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]' 
          : 'bg-white/90 border-slate-200 text-slate-700 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]'
      }`}
    >
      <div className="py-2 px-2 flex-1">
        {/* Collapse Toggle Button */}
        <div className={`flex items-center mb-3 px-1 ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
          <button
            onClick={onToggleCollapse}
            className={`p-1 rounded-md text-xs transition-colors ${
              theme === 'dark' ? 'hover:bg-[#1F242C] text-gray-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
            title={isCollapsed ? (isRtl ? 'توسيع القائمة' : 'Expand Sidebar') : (isRtl ? 'طوي القائمة' : 'Collapse Sidebar')}
          >
            {isRtl ? (
              isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = isRtl ? item.labelAr : item.labelEn;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-indigo-600/20 text-indigo-400 border-s-2 border-indigo-500 font-semibold'
                      : 'bg-indigo-50 text-indigo-700 border-s-2 border-indigo-600 font-semibold'
                    : theme === 'dark'
                      ? 'hover:bg-[#1F242C] text-gray-400 hover:text-gray-200'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                title={isCollapsed ? label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                {!isCollapsed && <span className="truncate flex-1 text-start">{label}</span>}
                {!isCollapsed && item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Support Info */}
      {!isCollapsed && (
        <div className={`p-3 border-t text-[11px] ${theme === 'dark' ? 'border-[#262B34] text-gray-500' : 'border-slate-200 text-slate-400'}`}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-indigo-400">{isRtl ? 'DoLag AI v1.0' : 'DoLag AI v1.0'}</span>
          </div>
          <p className="text-[10px] leading-tight">
            {isRtl ? 'محرك دبلجة وترجمة فورية احترافي' : 'Professional AI Dubbing Engine'}
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
