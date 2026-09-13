import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Mic2, 
  Languages, 
  AudioLines, 
  Check, 
  ArrowRight,
  ChevronRight,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLoginClick }) => {
  const [isArabic, setIsArabic] = useState(false);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  return (
    <div className={`min-h-screen bg-[#0D0F12] text-gray-100 selection:bg-indigo-500 selection:text-white ${isArabic ? 'font-sans' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0D0F12]/80 border-b border-gray-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onGetStarted}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-indigo-300">
              DoLag <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">AI Studio</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700/60 bg-gray-800/40 text-xs text-gray-300 hover:text-white hover:bg-gray-800 transition"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isArabic ? 'English' : 'عرض بالعربية'}</span>
            </button>

            <button
              onClick={onLoginClick || onGetStarted}
              className="hidden sm:inline-flex text-sm text-gray-300 hover:text-white transition px-3 py-1.5"
            >
              {isArabic ? 'تسجيل الدخول' : 'Sign In'}
            </button>

            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center gap-2"
            >
              <span>{isArabic ? 'ابدأ التجربة المجانية' : 'Start Free Trial'}</span>
              <ArrowRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{isArabic ? 'الجيل الجديد من دبلجة الفيديو بالذكاء الاصطناعي' : 'Next-Gen AI Video Translation & Dubbing'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {isArabic ? (
              <>دبلجة وتترجمة أي فيديو إلى <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">اللغة العربية</span> خلال دقائق</>
            ) : (
              <>Dub Any Video to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Arabic</span>. In Minutes, Not Days.</>
            )}
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {isArabic ? (
              'منصة متكاملة لتحويل المحتوى الصوتي والفيديوهات إلى العربية بدقة متناهية مع مطابقة طبقة الصوت (Voice Cloning) وتزامن وحركة الشفاه.'
            ) : (
              'Enterprise-grade AI dubbing pipeline with natural Arabic voice cloning, frame-accurate lip sync calibration, and interactive time-coded timeline editor.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-base rounded-xl shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <span>{isArabic ? 'ابدأ مشروعك الأول مجاناً' : 'Start Your First Project Free'}</span>
              <ChevronRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
            <a
              href="#demo-video"
              className="w-full sm:w-auto px-8 py-4 bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 text-gray-200 hover:text-white font-semibold text-base rounded-xl transition flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              <span>{isArabic ? 'شاهد العرض التوضيحي' : 'Watch 1-Min Demo'}</span>
            </a>
          </div>

          {/* Video Preview Container */}
          <div id="demo-video" className="relative rounded-2xl border border-gray-800 bg-[#16191E]/90 p-3 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 mb-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-gray-500">DoLag Studio Editor v2.4 — Interactive AI Dubbing Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  ● LIVE AI CLONING
                </span>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#090D16] group flex items-center justify-center border border-indigo-500/20">
              <iframe
                className="w-full h-full object-cover rounded-xl"
                src="https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=1&loop=1&playlist=jfKfPfyJRdk&modestbranding=1"
                title="DoLag AI Video Translation & Dubbing Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Real-time Dubbing UI Overlay */}
              <div className="absolute inset-x-0 bottom-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex flex-col justify-end pointer-events-none z-10">
                <div className="bg-gray-900/90 border border-indigo-500/40 backdrop-blur-md rounded-xl p-3 max-w-xl mx-auto text-center shadow-2xl">
                  <div className="text-xs text-indigo-400 font-mono mb-1 flex items-center justify-center gap-2">
                    <AudioLines className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                    <span>AI Voice Synthesis: Speaker #1 (Arabic Voice Clone Active)</span>
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white tracking-wide font-sans" dir="rtl">
                    "مرحباً بكم في الجيل الجديد من منصة DoLag لدبلجة المحتوى بالذكاء الاصطناعي."
                  </div>
                </div>
              </div>

              {/* Overlaid Badge */}
              <div className="absolute top-4 left-4 backdrop-blur-md bg-black/80 border border-indigo-500/40 px-3 py-1.5 rounded-lg text-xs font-mono text-indigo-300 flex items-center gap-2 shadow-lg z-10">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Source: EN ➔ Target: AR (Modern Standard Arabic)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-gray-800/80 bg-[#16191E]/50 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">10,000+</div>
            <div className="text-sm text-gray-400">{isArabic ? 'فيديو تم دبلجته' : 'Videos Dubbed'}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-1">98.4%</div>
            <div className="text-sm text-gray-400">{isArabic ? 'دقة التزامن والتصحيح' : 'Sync Accuracy Score'}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 mb-1">50+</div>
            <div className="text-sm text-gray-400">{isArabic ? 'لغة مصدر مدعومة' : 'Source Languages'}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 mb-1">&lt; 10 mins</div>
            <div className="text-sm text-gray-400">{isArabic ? 'متوسط وقت المعالجة' : 'Avg Processing Time'}</div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {isArabic ? 'مميزات تقنية احترافية لدبلجة فائقة الدقة' : 'Built for Speed, Precision & Quality'}
          </h2>
          <p className="text-gray-400 text-lg">
            {isArabic ? 'استمتع بأدوات الاستوديو الاحترافية للتحكم بالخط الزمني والنصوص الصوتية.' : 'Everything you need to turn raw foreign video into high-converting Arabic audio.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#16191E] border border-gray-800 hover:border-indigo-500/40 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Mic2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {isArabic ? 'استنساخ الأصوات الاصطناعي' : 'Natural Voice Cloning'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isArabic ? 'مطابقة البصمة الصوتية للمتحدث الأصلي وتوليد صوت عربي بنفس النبرة والإحساس.' : 'Preserve emotion, tone, and vocal characteristics of original speakers in fluent Arabic.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#16191E] border border-gray-800 hover:border-purple-500/40 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {isArabic ? 'محرر خط زمني تفاعلي' : 'Time-Synced DAW Timeline'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isArabic ? 'تعديل النصوص والجمل بالسنتيمتر مع معاينة فورية ومزامنة دقيقة للصوت.' : 'Visually inspect timecodes, drag boundaries, and edit Arabic transcriptions in real time.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#16191E] border border-gray-800 hover:border-pink-500/40 transition duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {isArabic ? 'سير عمل فائق السرعة' : 'Instant AI Processing'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isArabic ? 'معالجة الفيديو تلقائياً من روابط YouTube أو الملفات المباشرة بسرعة فائقة.' : 'Extract, transcribe, translate, and synthesize automatically with robust GPU queues.'}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-[#16191E]/30 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {isArabic ? 'خطط أسعار مرنة ومناسبة للجميع' : 'Transparent Pricing for Creators & Teams'}
            </h2>
            <p className="text-gray-400 text-lg">
              {isArabic ? 'اختر الخطة المناسبة لاحتياجاتك وابدأ الدبلجة الآن' : 'Start free and upgrade as your channel or workflow grows.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Starter */}
            <div className="p-8 rounded-2xl bg-[#16191E] border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Starter</h3>
                <div className="text-3xl font-extrabold text-white mb-4">$0 <span className="text-sm font-normal text-gray-400">/ mo</span></div>
                <p className="text-xs text-gray-400 mb-6">Perfect for trying out DoLag studio features.</p>
                <ul className="space-y-3 text-sm text-gray-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>15 minutes of dubbing / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Standard Arabic TTS voices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>720p Video Export</span>
                  </li>
                </ul>
              </div>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-gray-700 text-white hover:bg-gray-800 transition font-medium">
                {isArabic ? 'ابدأ مجاناً' : 'Get Started Free'}
              </button>
            </div>

            {/* Pro tier */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-[#16191E] border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Pro Studio</h3>
                <div className="text-3xl font-extrabold text-white mb-4">$49 <span className="text-sm font-normal text-gray-400">/ mo</span></div>
                <p className="text-xs text-gray-400 mb-6">For professional video creators and agencies.</p>
                <ul className="space-y-3 text-sm text-gray-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>300 minutes (5 hrs) dubbing / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>AI Neural Voice Cloning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>4K Ultra-HD Video Export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-400" />
                    <span>DAW Multi-track Export</span>
                  </li>
                </ul>
              </div>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition">
                {isArabic ? 'اشترك في برو' : 'Upgrade to Pro'}
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-[#16191E] border border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Enterprise</h3>
                <div className="text-3xl font-extrabold text-white mb-4">Custom</div>
                <p className="text-xs text-gray-400 mb-6">Dedicated infrastructure & custom models.</p>
                <ul className="space-y-3 text-sm text-gray-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Unlimited hours & API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Custom Arabic Dialects (Egyptian, Gulf, Levantine)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>SLA Support & On-premise deployment</span>
                  </li>
                </ul>
              </div>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition font-medium">
                {isArabic ? 'تواصل مع المبيعات' : 'Contact Sales'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#0D0F12] py-12 px-6 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="font-semibold text-gray-300">DoLag AI Studio</span>
            <span>— Next-Gen Video Dubbing & Translation</span>
          </div>
          <div>
            © {new Date().getFullYear()} DoLag Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
