import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import StudioEditorPage from './pages/StudioEditorPage';
import MediaLibraryPage from './pages/MediaLibraryPage';
import BillingPage from './pages/BillingPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Language, Theme } from './types';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'auth'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<Theme>('dark');
  const [tenantId, setTenantId] = useState<string>('tenant-2');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Sync theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync dir attribute
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // If viewing landing page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => {
          if (isAuthenticated) {
            setCurrentView('app');
          } else {
            setCurrentView('auth');
          }
        }}
        onLoginClick={() => setCurrentView('auth')}
      />
    );
  }

  // If unauthenticated and on auth page
  if (currentView === 'auth' || !isAuthenticated) {
    return (
      <AuthPage
        lang={lang}
        theme={theme}
        onLoginSuccess={(selectedTenantId) => {
          setTenantId(selectedTenantId);
          setCurrentView('app');
        }}
      />
    );
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            lang={lang}
            theme={theme}
            onOpenProjectEditor={(projId) => {
              setActiveProjectId(projId);
              setActiveTab('editor');
            }}
          />
        );
      case 'editor':
        return (
          <StudioEditorPage
            projectId={activeProjectId}
            lang={lang}
            theme={theme}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        );
      case 'library':
        return <MediaLibraryPage lang={lang} theme={theme} />;
      case 'billing':
        return <BillingPage lang={lang} theme={theme} />;
      default:
        return (
          <DashboardPage
            lang={lang}
            theme={theme}
            onOpenProjectEditor={(projId) => {
              setActiveProjectId(projId);
              setActiveTab('editor');
            }}
          />
        );
    }
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={
        theme === 'dark'
          ? 'min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),_transparent_30%),linear-gradient(180deg,#090d16_0%,#0d111a_100%)] text-gray-100'
          : 'min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_25%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900'
      }
    >
      {/* Top Studio Header Bar */}
      <Header
        tenantId={tenantId}
        currentLang={lang}
        theme={theme}
        onLanguageChange={(newLang) => setLang(newLang)}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onSelectTenant={(id) => setTenantId(id)}
        onLogout={() => {
          logout();
          setCurrentView('landing');
        }}
      />

      <div className="flex">
        {/* Collapsible Left Rail Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'landing') {
              setCurrentView('landing');
            } else {
              setActiveTab(tab);
            }
          }}
          lang={lang}
          theme={theme}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Viewport Content Area */}
        <main className="flex-1 overflow-x-hidden px-2 py-3 sm:px-4 lg:px-6">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
