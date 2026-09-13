import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Globe, 
  Sun, 
  Moon, 
  Clock, 
  Sparkles, 
  Search, 
  Bell, 
  Plus, 
  Check, 
  ShieldCheck, 
  Zap,
  Sliders,
  User,
  LogOut,
  Settings,
  CreditCard
} from 'lucide-react';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  avatarUrl?: string;
  status: 'active' | 'quota_warning' | 'suspended';
}

export interface ConsumptionData {
  usedHours: number;
  totalHours: number;
  unlimited?: boolean;
}

export interface HeaderProps {
  tenantId: string;
  currentLang: 'ar' | 'en';
  theme: 'dark' | 'light';
  onLanguageChange: (lang: 'ar' | 'en') => void;
  onThemeToggle: () => void;
  tenants?: Tenant[];
  onSelectTenant?: (tenantId: string) => void;
  onCreateTenant?: () => void;
  consumption?: ConsumptionData;
  onOpenCommandPalette?: () => void;
  unreadNotifications?: number;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

const DEFAULT_TENANTS: Tenant[] = [
  { id: 'tenant-1', name: 'Personal Studio', slug: 'personal', plan: 'FREE', status: 'active' },
  { id: 'tenant-2', name: 'Acme Media Corp', slug: 'acme-media', plan: 'PRO', status: 'active' },
  { id: 'tenant-3', name: 'Global Dubbing Network', slug: 'gdn', plan: 'ENTERPRISE', status: 'quota_warning' }
];

const DEFAULT_CONSUMPTION: ConsumptionData = {
  usedHours: 4.2,
  totalHours: 5.0,
  unlimited: false
};

export const Header: React.FC<HeaderProps> = ({
  tenantId,
  currentLang,
  theme,
  onLanguageChange,
  onThemeToggle,
  tenants = DEFAULT_TENANTS,
  onSelectTenant,
  onCreateTenant,
  consumption = DEFAULT_CONSUMPTION,
  onOpenCommandPalette,
  unreadNotifications = 3,
  user = { name: 'أحمد محمود', email: 'ahmed@dolag.ai' },
  onLogout
}) => {
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isConsumptionHovered, setIsConsumptionHovered] = useState(false);

  const tenantRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const isRtl = currentLang === 'ar';
  const currentTenant = tenants.find((t) => t.id === tenantId) || tenants[0];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tenantRef.current && !tenantRef.current.contains(event.target as Node)) {
        setIsTenantDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Consumption percentage calculation
  const consumptionPercentage = consumption.unlimited 
    ? 0 
    : Math.min(100, Math.round((consumption.usedHours / consumption.totalHours) * 100));

  const getMeterColor = (pct: number) => {
    if (pct >= 90) return 'bg-red-500 text-red-400 border-red-500/30';
    if (pct >= 75) return 'bg-amber-500 text-amber-400 border-amber-500/30';
    return 'bg-indigo-500 text-indigo-400 border-indigo-500/30';
  };

  const getPlanBadge = (plan: Tenant['plan']) => {
    switch (plan) {
      case 'ENTERPRISE':
        return <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">ENT</span>;
      case 'PRO':
        return <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">PRO</span>;
      default:
        return <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-gray-500/20 text-gray-400 border border-gray-500/30">FREE</span>;
    }
  };

  return (
    <header 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`h-12 w-full border-b select-none transition-colors duration-200 z-40 sticky top-0 backdrop-blur-xl ${
        isRtl ? 'font-sans-ar' : 'font-sans-en'
      } ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-white/10 text-[#F3F4F6] shadow-[0_8px_30px_rgba(15,23,42,0.35)]' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-[0_8px_30px_rgba(148,163,184,0.18)]'
      }`}
    >
      <div className="h-full px-3 flex items-center justify-between gap-2">
        
        {/* Left Section: Logo & Workspace Selector */}
        <div className="flex items-center gap-3">
          {/* Logo Branding */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-150">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              DoLag
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 uppercase font-mono">
              Studio
            </span>
          </div>

          <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-[#262B34]' : 'bg-gray-200'}`} />

          {/* Workspace / Tenant Switcher Dropdown */}
          <div className="relative" ref={tenantRef}>
            <button
              onClick={() => setIsTenantDropdownOpen(!isTenantDropdownOpen)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'hover:bg-[#1F242C] text-gray-200 hover:text-white border border-transparent hover:border-[#262B34]'
                  : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-transparent hover:border-slate-200'
              }`}
              aria-expanded={isTenantDropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-4 h-4 rounded bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                <Building2 className="w-3 h-3" />
              </div>
              <span className="max-w-[120px] sm:max-w-[160px] truncate font-semibold">
                {currentTenant.name}
              </span>
              {getPlanBadge(currentTenant.plan)}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isTenantDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isTenantDropdownOpen && (
              <div className={`absolute top-full mt-1.5 ${isRtl ? 'right-0' : 'left-0'} w-64 rounded-lg border shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                theme === 'dark'
                  ? 'bg-[#16191E] border-[#262B34] text-gray-200'
                  : 'bg-white border-slate-200 text-slate-800 shadow-slate-300/50'
              }`}>
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-inherit">
                  {isRtl ? 'مساحات العمل' : 'Workspaces'}
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTenant?.(t.id);
                        setIsTenantDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                        t.id === currentTenant.id
                          ? theme === 'dark' ? 'bg-indigo-600/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                          : theme === 'dark' ? 'hover:bg-[#1F242C] text-gray-300' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded bg-gray-700/40 flex items-center justify-center text-[10px] font-bold">
                          {t.name.charAt(0)}
                        </div>
                        <span className="truncate">{t.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getPlanBadge(t.plan)}
                        {t.id === currentTenant.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-inherit pt-1 mt-1 px-1">
                  <button
                    onClick={() => {
                      onCreateTenant?.();
                      setIsTenantDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-xs text-indigo-400 hover:bg-indigo-500/10 transition-colors font-medium`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إنشاء مساحة عمل جديدة' : 'Create New Workspace'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Quick Search Command Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
          <button
            onClick={onOpenCommandPalette}
            className={`w-full flex items-center justify-between px-3 py-1 rounded-md text-xs border transition-all ${
              theme === 'dark'
                ? 'bg-[#0D0F12] border-[#262B34] text-gray-400 hover:border-indigo-500/50 hover:text-gray-200'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span>{isRtl ? 'ابحث في المشاريع والأوامر...' : 'Search projects, commands...'}</span>
            </div>
            <kbd className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-gray-800/60 border border-gray-700 text-gray-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Meter, Language Toggle, Theme Toggle, Notifications & Profile */}
        <div className="flex items-center gap-2">
          
          {/* Consumption Meter Badge */}
          <div 
            className="relative"
            onMouseEnter={() => setIsConsumptionHovered(true)}
            onMouseLeave={() => setIsConsumptionHovered(false)}
          >
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs border transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-[#0D0F12] border-[#262B34]' : 'bg-slate-50 border-slate-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-semibold text-xs">
                  {consumption.usedHours.toFixed(1)} / {consumption.unlimited ? '∞' : consumption.totalHours.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  {isRtl ? 'ساعة' : 'Hrs'}
                </span>
              </div>
              
              {/* Progress bar pill */}
              {!consumption.unlimited && (
                <div className="w-12 h-1.5 bg-gray-700/40 rounded-full overflow-hidden hidden sm:block">
                  <div 
                    className={`h-full transition-all duration-300 ${getMeterColor(consumptionPercentage)}`}
                    style={{ width: `${consumptionPercentage}%` }}
                  />
                </div>
              )}
            </div>

            {/* Hover Tooltip Details */}
            {isConsumptionHovered && (
              <div className={`absolute top-full mt-2 ${isRtl ? 'left-0' : 'right-0'} w-56 p-3 rounded-lg border shadow-xl text-xs z-50 ${
                theme === 'dark' ? 'bg-[#16191E] border-[#262B34] text-gray-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{isRtl ? 'رصيد الدبلجة' : 'Dubbing Credits'}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    consumptionPercentage >= 90 ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {consumptionPercentage}% {isRtl ? 'مستغل' : 'Used'}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700/40 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all ${getMeterColor(consumptionPercentage)}`}
                    style={{ width: `${consumptionPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {isRtl 
                    ? `متبقى ${Math.max(0, consumption.totalHours - consumption.usedHours).toFixed(1)} ساعة هذا الشهر.`
                    : `${Math.max(0, consumption.totalHours - consumption.usedHours).toFixed(1)} hours remaining in billing period.`
                  }
                </p>
              </div>
            )}
          </div>

          <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-[#262B34]' : 'bg-gray-200'}`} />

          {/* Language Switcher Button (RTL/LTR) */}
          <button
            onClick={() => onLanguageChange(currentLang === 'ar' ? 'en' : 'ar')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'hover:bg-[#1F242C] text-gray-300 hover:text-white'
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
            title={isRtl ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="uppercase text-[11px]">{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Theme Switcher Toggle (Dark/Light) */}
          <button
            onClick={onThemeToggle}
            className={`p-1.5 rounded-md text-xs transition-all ${
              theme === 'dark'
                ? 'hover:bg-[#1F242C] text-amber-400'
                : 'hover:bg-slate-100 text-indigo-600'
            }`}
            title={theme === 'dark' ? (isRtl ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode') : (isRtl ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <button
            className={`relative p-1.5 rounded-md text-xs transition-all ${
              theme === 'dark'
                ? 'hover:bg-[#1F242C] text-gray-300 hover:text-white'
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#16191E]" />
            )}
          </button>

          <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-[#262B34]' : 'bg-gray-200'}`} />

          {/* User Profile Menu Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
            </button>

            {isUserDropdownOpen && (
              <div className={`absolute top-full mt-1.5 ${isRtl ? 'left-0' : 'right-0'} w-52 rounded-lg border shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                theme === 'dark' ? 'bg-[#16191E] border-[#262B34] text-gray-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-3 py-2 border-b border-inherit">
                  <p className="font-semibold text-xs truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                    theme === 'dark' ? 'hover:bg-[#1F242C]' : 'hover:bg-slate-50'
                  }`}>
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{isRtl ? 'الملف الشخصي' : 'Profile Settings'}</span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                    theme === 'dark' ? 'hover:bg-[#1F242C]' : 'hover:bg-slate-50'
                  }`}>
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    <span>{isRtl ? 'الاشتراكات والفواتير' : 'Billing & Subscriptions'}</span>
                  </button>
                </div>

                <div className="border-t border-inherit pt-1">
                  <button 
                    onClick={onLogout}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
