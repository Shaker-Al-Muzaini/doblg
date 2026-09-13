import React, { useState } from 'react';
import { Zap, ShieldCheck, Check, ArrowRight, Building2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language, Theme } from '../types';

export interface AuthPageProps {
  lang: Language;
  theme: Theme;
  onLoginSuccess: (tenantId: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ lang, theme, onLoginSuccess }) => {
  const { login, register } = useAuth();
  const isRtl = lang === 'ar';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'AUTH' | 'TENANT_SELECT'>('AUTH');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedTenant, setSelectedTenant] = useState('tenant-2');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickDemoLogin = async () => {
    setEmail('demo@dolag.ai');
    setPassword('123456');
    setIsSubmitting(true);
    setError(null);
    try {
      await login('demo@dolag.ai', '123456');
      setStep('TENANT_SELECT');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === 'register') {
        const fullName = name.trim() || email.split('@')[0] || 'المستخدم';
        await register({ email, name: fullName, password });
        await login(email, password);
      } else {
        await login(email, password);
      }
      setStep('TENANT_SELECT');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Incorrect email or password') || msg.includes('401') || msg.includes('Invalid credentials')) {
        setError(isRtl 
          ? 'البريد أو كلمة المرور غير صحيحة. انقر على "إنشاء حساب جديد" بالأسفل للتسجيل فوراً.' 
          : 'Incorrect email or password. Click "Register now" below to create an account.'
        );
      } else {
        setError(msg || (isRtl ? 'حدث خطأ، تحقق من بياناتك' : 'Login failed. Check your credentials.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSelect = () => {
    onLoginSuccess(selectedTenant);
  };


  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`min-h-screen w-full flex ${theme === 'dark' ? 'bg-[#0D0F12] text-gray-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Left Panel: Dynamic Feature Highlights (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-[#16191E] to-[#0D0F12] border-e border-[#262B34] relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DoLag Studio
          </span>
        </div>

        <div className="space-y-6 z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isRtl ? 'منصة دبلجة وترجمة صوتية مدعومة بالذكاء الاصطناعي' : 'AI-Powered Video Translation & Dubbing SaaS'}</span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight">
            {isRtl ? 'دبلجة الفيديوهات إلى العربية بدقة متناهية وبصوتك الطبيعي' : 'Dub Videos to Arabic with Frame-Accurate Precision & Natural Voices'}
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed">
            {isRtl 
              ? 'معمارية استوديو احترافية تتيح لك عزل الصوت، الترجمة التلقائية مع محاذاة البصمة الصوتية والتوقيت الزمني، ومراجعة التايم لاين تفاعلياً.'
              : 'Studio-grade interactive pipeline for stem separation, speech-to-text, context-aware translation, speaker prosody transfer, and timeline editing.'
            }
          </p>

          <div className="space-y-3 pt-2">
            {[
              isRtl ? 'عزل الأصوات الخلفية والموسيقى تلقائياً' : 'Automatic Vocal & Background M&E Separation',
              isRtl ? 'ترجمة دقيقة تحافظ على طول وتوقيت الجمل' : 'Context-Aware Translation with Timing Constraints',
              isRtl ? 'استوديو تفاعلي مدمج لتحرير النصوص والـ Waveforms' : 'Multi-Track Waveform & Subtitle Script Inspector'
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 z-10">
          © 2026 DoLag SaaS Platform. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </div>

      {/* Right Panel: Auth Form & Tenant Selector */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          {step === 'AUTH' ? (
            <>
              <div className="space-y-2 text-center sm:text-start">
                <h2 className="text-2xl font-bold">
                  {isRtl ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
                </h2>
                <p className="text-xs text-gray-400">
                  {isRtl ? 'أدخل بياناتك للمتابعة إلى استوديو الدبلجة' : 'Enter your details to access the dubbing studio'}
                </p>
              </div>

              {/* SSO & Quick Demo Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  theme === 'dark' ? 'bg-[#16191E] border-[#262B34] hover:bg-[#1F242C]' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  <span>Google</span>
                </button>
                <button type="button" className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  theme === 'dark' ? 'bg-[#16191E] border-[#262B34] hover:bg-[#1F242C]' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Quick Demo Login Button */}
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>⚡ {isRtl ? 'دخول سريع بحساب تجريبي (demo@dolag.ai)' : 'Quick Demo Login (demo@dolag.ai)'}</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-[#262B34] w-full" />
                <span className="bg-[#0D0F12] px-3 text-[11px] text-gray-500 uppercase tracking-wider absolute">
                  {isRtl ? 'أو عبر البريد الإلكتروني' : 'or continue with email'}
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">

                {/* Error Banner */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    <span>⚠️ {error}</span>
                  </div>
                )}

                {/* Name field (register mode only) */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">
                      {isRtl ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isRtl ? 'أحمد العلي' : 'John Doe'}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs border transition-all ${
                        theme === 'dark' ? 'bg-[#16191E] border-[#262B34] text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    {isRtl ? 'البريد الإلكتروني' : 'Email address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute top-3 left-3 rtl:right-3 rtl:left-auto" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full py-2.5 px-9 rounded-lg text-xs border transition-all ${
                        theme === 'dark' ? 'bg-[#16191E] border-[#262B34] text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">
                    {isRtl ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute top-3 left-3 rtl:right-3 rtl:left-auto" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full py-2.5 px-9 rounded-lg text-xs border transition-all ${
                        theme === 'dark' ? 'bg-[#16191E] border-[#262B34] text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  {isSubmitting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  )}
                  <span>
                    {mode === 'register'
                      ? (isRtl ? 'إنشاء الحساب والدخول' : 'Create Account & Continue')
                      : (isRtl ? 'متابعة إلى اختيار مساحة العمل' : 'Continue to Workspace')
                    }
                  </span>
                </button>

                {/* Toggle login/register */}
                <p className="text-center text-[11px] text-gray-500">
                  {mode === 'login'
                    ? (isRtl ? 'ليس لديك حساب؟' : "Don't have an account?")
                    : (isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?')
                  }{' '}
                  <button
                    type="button"
                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    {mode === 'login'
                      ? (isRtl ? 'إنشاء حساب جديد' : 'Register now')
                      : (isRtl ? 'تسجيل الدخول' : 'Sign in')
                    }
                  </button>
                </p>
              </form>

            </>
          ) : (
            /* Tenant Selector Step */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="space-y-1 text-center sm:text-start">
                <h2 className="text-2xl font-bold">
                  {isRtl ? 'اختر مساحة العمل' : 'Select your workspace'}
                </h2>
                <p className="text-xs text-gray-400">
                  {isRtl ? 'حدد مساحة العمل للبدء في إدارة المشاريع' : 'Choose a workspace to launch the studio'}
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'tenant-1', name: 'Personal Studio', plan: 'FREE', members: '1 Member' },
                  { id: 'tenant-2', name: 'Acme Media Corp', plan: 'PRO', members: '8 Members' },
                  { id: 'tenant-3', name: 'Global Dubbing Network', plan: 'ENTERPRISE', members: '24 Members' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTenant(t.id)}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      selectedTenant === t.id
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : theme === 'dark' ? 'bg-[#16191E] border-[#262B34] hover:border-gray-700' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="text-start">
                        <p className="font-bold text-xs">{t.name}</p>
                        <p className="text-[10px] text-gray-400">{t.members}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {t.plan}
                      </span>
                      {selectedTenant === t.id && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleFinalSelect}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'الدخول إلى استوديو DoLag' : 'Launch DoLag Studio'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default AuthPage;
