import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import LangToggle from '../components/LangToggle';
import {
  Activity, BookOpen, Heart, Users, Bell, Stethoscope,
  CheckCircle, TrendingUp, Lightbulb, Hand, Globe,
  ShieldCheck, Smile, ArrowRight,
} from 'lucide-react';
import RambaLogo from '../components/RambaLogo';

export default function Landing() {
  const { t } = useLang();

  const features = [
    { icon: Activity,     title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: BookOpen,     title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: Heart,        title: t('feat3Title'), desc: t('feat3Desc') },
    { icon: Users,        title: t('feat4Title'), desc: t('feat4Desc') },
    { icon: Bell,         title: t('feat5Title'), desc: t('feat5Desc') },
    { icon: Stethoscope,  title: t('feat6Title'), desc: t('feat6Desc') },
  ];

  const testimonials = [
    { name: 'Amara K.',  location: 'Kigali, Rwanda',  tag: 'Wellness',   quote: t('test1Quote') },
    { name: 'Kwame A.',  location: 'Accra, Ghana',    tag: 'Hypertension', quote: t('test2Quote') },
    { name: 'Fatima M.', location: 'Lagos, Nigeria',  tag: 'Asthma',     quote: t('test3Quote') },
  ];

  const paths = [
    {
      icon: Smile,
      label: t('path1Label'),
      desc: t('path1Desc'),
      color: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-600',
      items: ['Wellness tips', 'Mood check-ins', 'Risk awareness', 'Habit tracking'],
    },
    {
      icon: Activity,
      label: t('path2Label'),
      desc: t('path2Desc'),
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      items: ['Vitals tracking', 'Medication reminders', 'Caregiver tools', 'Advanced monitoring'],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-base shrink-0">
            <RambaLogo size={24} leafColor="#047857" crossColor="#ffffff" />
            <span className="hidden xs:inline">RambaMedTech</span>
            <span className="xs:hidden">Ramba</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#how-it-works" className="hidden md:block text-sm text-gray-500 hover:text-emerald-700 no-underline transition-colors">{t('navFeatures')}</a>
            <a href="#paths"        className="hidden md:block text-sm text-gray-500 hover:text-emerald-700 no-underline transition-colors">{t('navConditions')}</a>
            <a href="#community"    className="hidden md:block text-sm text-gray-500 hover:text-emerald-700 no-underline transition-colors">{t('navCommunity')}</a>
            <LangToggle />
            <Link to="/login"    className="text-xs sm:text-sm text-emerald-700 font-medium no-underline whitespace-nowrap">{t('navSignIn')}</Link>
            <Link to="/register" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg no-underline transition-colors whitespace-nowrap">
              {t('navJoinFree')}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-16 lg:py-24 flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            <Globe size={11} /> {t('heroBadge')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {t('heroTitle1v2')}<br />
            <span className="text-emerald-700">{t('heroTitle2v2')}</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">{t('heroDescv2')}</p>
          <div className="flex flex-col xs:flex-row gap-3 mb-8">
            <Link to="/register"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl no-underline transition-all text-sm text-center flex items-center justify-center gap-2">
              {t('heroBtn1v2')}
            </Link>
            <Link to="/wellness-quiz"
              className="border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold px-5 py-3 rounded-xl no-underline transition-colors text-sm text-center">
              {t('heroBtn2v2')}
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div><div className="text-lg sm:text-xl font-bold text-emerald-700">1,200+</div><div className="text-xs text-gray-400">{t('heroStat1Labelv2')}</div></div>
            <div className="w-px h-8 bg-gray-200" />
            <div><div className="text-lg sm:text-xl font-bold text-emerald-700">6</div><div className="text-xs text-gray-400">{t('heroStat2Labelv2')}</div></div>
            <div className="w-px h-8 bg-gray-200" />
            <div><div className="text-lg sm:text-xl font-bold text-emerald-700">4</div><div className="text-xs text-gray-400">{t('heroStat3Labelv2')}</div></div>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center w-full">
          <div className="w-52 sm:w-60 bg-gray-900 rounded-[32px] p-2.5 shadow-2xl">
            <div className="bg-gray-50 rounded-[24px] p-4 flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                  {t('heroMockGreeting')} <Hand size={10} className="text-yellow-400" />
                </span>
                <span className="text-[9px] text-gray-400">{t('heroMockToday')}</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5">
                <div className="text-[9px] text-gray-400 mb-1">Today's wellness</div>
                <div className="flex gap-1.5">
                  {['😴', '💧', '🏃', '🥗'].map((e, i) => (
                    <div key={i} className="flex-1 bg-white rounded-lg p-1.5 text-center text-sm">{e}</div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl px-2.5 py-2 flex justify-between items-center">
                <span className="text-[10px] text-gray-500">{t('heroMockMoodLabel')}</span>
                <span className="text-[10px] font-semibold text-gray-800 flex items-center gap-1">
                  <Heart size={10} className="text-emerald-500" /> {t('moodGood')}
                </span>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-2.5 text-[10px] text-emerald-800 leading-relaxed flex gap-1.5 items-start">
                <Lightbulb size={11} className="shrink-0 mt-0.5 text-yellow-500" />{t('heroMockTip')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two Paths ── */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20" id="paths">
        <div className="max-w-5xl mx-auto px-4">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">
            {t('pathSectionTitle')}
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-snug">
            {t('pathSectionSubtitle')}
          </h2>
          <p className="text-sm text-gray-500 mb-8 max-w-xl">
            {t('heroDescv2')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {paths.map((path) => {
              const Icon = path.icon;
              return (
                <div key={path.label} className={`rounded-2xl border-2 p-6 flex flex-col gap-4 ${path.color}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Icon size={20} className={path.iconColor} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 m-0">{path.label}</h3>
                      <p className="text-xs text-gray-500 m-0 mt-0.5">{path.desc}</p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                    {path.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={14} className={path.iconColor} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/register"
                    className={`mt-auto flex items-center gap-1.5 text-sm font-semibold no-underline transition-colors ${path.iconColor} hover:underline`}>
                    Get started <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Wellness Quiz CTA ── */}
      <section className="py-12 sm:py-16" id="how-it-works">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-500 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                Free · 2 minutes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
                {t('quizTitle')}
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                {t('quizSubtitle')}
              </p>
              <Link to="/wellness-quiz"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-6 py-3 rounded-xl no-underline hover:bg-gray-100 transition-colors text-sm">
                {t('heroBtn2v2')} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white/10 rounded-2xl p-5 flex flex-col gap-3">
                {[t('quizQ1'), t('quizQ4'), t('quizQ5')].map((q, i) => (
                  <div key={i} className="bg-white/20 rounded-xl px-4 py-3">
                    <p className="text-white text-xs font-medium m-0">{q}</p>
                    <div className="flex gap-1.5 mt-2">
                      {[t('quizOpt1a'), t('quizOpt1b'), t('quizOpt1c')].slice(0, 2).map((o, j) => (
                        <span key={j} className="bg-white/30 text-white text-[10px] px-2 py-0.5 rounded-full">{o}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50" id="features">
        <div className="max-w-5xl mx-auto px-4">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">{t('featuresSectionLabel')}</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-8 leading-snug">{t('featuresSectionTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white border-2 border-gray-100 hover:border-emerald-600 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-emerald-700" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed m-0">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-12 sm:py-16 lg:py-20" id="community">
        <div className="max-w-5xl mx-auto px-4">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-wide uppercase">{t('testimonialsSectionLabel')}</span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-8 leading-snug">{t('testimonialsSectionTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map(t_ => (
              <div key={t_.name} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed italic flex-1 m-0">"{t_.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">{t_.name[0]}</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t_.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{t_.location} · <span className="text-emerald-600">{t_.tag}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-emerald-800 to-emerald-600 py-14 sm:py-20 text-center px-4">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-3">{t('ctaTitle')}</h2>
        <p className="text-white/80 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">{t('ctaDesc')}</p>
        <div className="flex flex-col xs:flex-row gap-3 justify-center items-center">
          <Link to="/register"       className="w-full xs:w-auto bg-white text-emerald-800 font-bold px-6 py-3 rounded-xl no-underline hover:bg-gray-100 transition-colors text-sm text-center">{t('ctaBtn1')}</Link>
          <Link to="/wellness-quiz"  className="w-full xs:w-auto border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl no-underline hover:bg-white/10 transition-colors text-sm text-center">{t('heroBtn2v2')}</Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-emerald-900 py-8 text-center px-4">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-base mb-2">
          <RambaLogo size={20} leafColor="#6ee7b7" crossColor="#047857" /> RambaMedTech
        </div>
        <p className="text-emerald-300 text-sm italic mb-1">{t('footerTagline')}</p>
        <p className="text-emerald-400/70 text-xs m-0">{t('footerCopy')}</p>
      </footer>
    </div>
  );
}
