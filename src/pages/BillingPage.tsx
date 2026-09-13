import React from 'react';
import { CreditCard, Check, Zap, ShieldCheck, Sparkles, Clock, HardDrive, Download } from 'lucide-react';
import { Language, Theme } from '../types';

export interface BillingPageProps {
  lang: Language;
  theme: Theme;
}

export const BillingPage: React.FC<BillingPageProps> = ({ lang, theme }) => {
  const isRtl = lang === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <span>{isRtl ? 'الاشتراكات وإدارة الفواتير' : 'Subscription & Quota Dashboard'}</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {isRtl ? 'إدارة خطتك الحالية، متابعة رصيد ساعات الدبلجة، واستعراض الفواتير' : 'Manage subscription plan, monitor video processing hours quota, and view invoice history'}
        </p>
      </div>

      {/* Active Subscription Summary & Gauge */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-inherit">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">PRO PLAN ★</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {isRtl ? 'دورة الاشتراك: شهري ($49/شهر) • يتجدد في 13 أكتوبر 2026' : 'Billing: Monthly ($49/mo) • Renews Oct 13, 2026'}
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30">
            {isRtl ? 'تعديل الخطة أو الدفع' : 'Manage Subscription'}
          </button>
        </div>

        {/* Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          {/* Quota Gauge 1: Dubbing Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {isRtl ? 'ساعات الدبلجة' : 'Video Dubbing Hours'}
              </span>
              <span className="font-mono font-bold text-indigo-400">32.5 / 50.0 Hrs</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[65%]" />
            </div>
            <p className="text-[10px] text-gray-500">{isRtl ? 'متبقي 17.5 ساعة للشهر الحالي' : '17.5 hours remaining in cycle'}</p>
          </div>

          {/* Quota Gauge 2: Storage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                {isRtl ? 'التخزين السحابي' : 'Asset Storage'}
              </span>
              <span className="font-mono font-bold text-purple-400">12.4 GB / Unlimited</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[25%]" />
            </div>
            <p className="text-[10px] text-gray-500">{isRtl ? 'تخزين دائم بلا حدود زمني' : 'Infinite retention enabled'}</p>
          </div>

          {/* Quota Gauge 3: Active Projects */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                {isRtl ? 'المشاريع المتزامنة' : 'Concurrent Jobs'}
              </span>
              <span className="font-mono font-bold text-emerald-400">3 / 10 Max</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[30%]" />
            </div>
            <p className="text-[10px] text-gray-500">{isRtl ? 'أولوية الطابور: عالية (Priority Queue)' : 'Priority Queue Active'}</p>
          </div>

        </div>
      </div>

      {/* Tier Comparison Matrix */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold">{isRtl ? 'باقات واشتراكات منصة DoLag' : 'Choose the Right Subscription Tier'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Starter Plan */}
          <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
            theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-2">
              <h3 className="font-bold text-sm">STARTER (FREE)</h3>
              <p className="text-2xl font-extrabold">$0 <span className="text-xs font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 pt-3 text-xs text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 5 Hours dubbing / mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Standard Processing Queue</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Temp Storage</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1 Member per workspace</li>
              </ul>
            </div>
            <button className="w-full py-2 rounded-lg border border-gray-700 text-xs font-semibold hover:bg-gray-800">
              {isRtl ? 'الخطة الحالية' : 'Current Tier'}
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className={`p-5 rounded-xl border-2 border-indigo-500 flex flex-col justify-between space-y-4 relative ${
            theme === 'dark' ? 'bg-indigo-950/20' : 'bg-indigo-50/50'
          }`}>
            <span className="absolute -top-3 right-4 px-2 py-0.5 text-[9px] font-bold rounded bg-indigo-600 text-white uppercase">
              POPULAR ★
            </span>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-indigo-400">PRO PLAN</h3>
              <p className="text-2xl font-extrabold">$49 <span className="text-xs font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 pt-3 text-xs text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> 50 Hours dubbing / mo</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> Priority Queue Dispatch</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> Infinite Asset Storage</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> 10 Members per team</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400 font-bold" /> Webhook Integration</li>
              </ul>
            </div>
            <button className="w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30">
              {isRtl ? 'خيارك الحالي' : 'Active Plan'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
            theme === 'dark' ? 'bg-[#16191E] border-[#262B34]' : 'bg-white border-slate-200'
          }`}>
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-purple-400">ENTERPRISE</h3>
              <p className="text-2xl font-extrabold">Custom</p>
              <ul className="space-y-2 pt-3 text-xs text-gray-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Unlimited Dubbing Hours</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Dedicated Worker Nodes</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Custom S3 Storage Bucket</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> HMAC Signed Webhooks</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> 99.9% SLA Guarantee</li>
              </ul>
            </div>
            <button className="w-full py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/10 text-xs font-semibold">
              {isRtl ? 'التواصل مع المبيعات' : 'Contact Sales'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default BillingPage;
