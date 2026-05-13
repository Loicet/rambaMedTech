import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import LangToggle from '../components/LangToggle';
import RambaLogo from '../components/RambaLogo';
import { ArrowRight, ArrowLeft, Heart, CheckCircle, Sparkles } from 'lucide-react';

export default function WellnessQuiz() {
  const { t } = useLang();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const questions = [
    {
      key: 'q1', text: t('quizQ1'),
      options: [t('quizOpt1a'), t('quizOpt1b'), t('quizOpt1c')],
    },
    {
      key: 'q2', text: t('quizQ2'),
      options: [t('quizOpt2a'), t('quizOpt2b'), t('quizOpt2c')],
    },
    {
      key: 'q3', text: t('quizQ3'),
      options: [t('quizOpt3a'), t('quizOpt3b'), t('quizOpt3c')],
    },
    {
      key: 'q4', text: t('quizQ4'),
      options: [t('quizOpt4a'), t('quizOpt4b'), t('quizOpt4c')],
    },
    {
      key: 'q5', text: t('quizQ5'),
      options: [t('quizOpt5a'), t('quizOpt5b'), t('quizOpt5c')],
    },
    {
      key: 'q6', text: t('quizQ6'),
      options: [t('quizOpt6a'), t('quizOpt6b'), t('quizOpt6c')],
    },
    {
      key: 'q7', text: t('quizQ7'),
      options: [t('quizOpt7a'), t('quizOpt7b'), t('quizOpt7c')],
    },
  ];

  const total = questions.length;
  const q = questions[current];
  const selected = answers[q?.key];
  const progress = ((current) / total) * 100;

  const handleSelect = (option) => {
    setAnswers(prev => ({ ...prev, [q.key]: option }));
  };

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(prev => prev + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(prev => prev - 1);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex flex-col">
        <nav className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white font-bold text-base">
            <RambaLogo size={22} leafColor="#6ee7b7" crossColor="#047857" />
            RambaMedTech
          </div>
          <LangToggle />
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl flex flex-col gap-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <Sparkles size={32} className="text-emerald-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('quizResultTitle')}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{t('quizResultBody')}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-left flex flex-col gap-3">
              {[
                { icon: '💧', text: 'Stay hydrated throughout the day' },
                { icon: '🚶', text: 'Aim for at least 20 minutes of movement daily' },
                { icon: '😴', text: 'Prioritize 7–8 hours of quality sleep' },
                { icon: '🥗', text: 'Include more whole foods in your meals' },
              ].map((tip, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-emerald-800">
                  <span className="text-base">{tip.icon}</span>
                  {tip.text}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed italic">
              {t('quizResultEncourage')}
            </p>

            <div className="flex flex-col gap-3">
              <Link to="/register"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl no-underline transition-colors text-sm flex items-center justify-center gap-2">
                {t('quizResultBtn')} <ArrowRight size={16} />
              </Link>
              <Link to="/"
                className="text-sm text-gray-400 hover:text-emerald-700 no-underline transition-colors">
                {t('quizResultBtn2')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex flex-col">

      {/* Nav */}
      <nav className="px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-white font-bold text-base">
          <RambaLogo size={22} leafColor="#6ee7b7" crossColor="#047857" />
          RambaMedTech
        </div>
        <LangToggle />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl flex flex-col gap-6">

          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Heart size={22} className="text-emerald-600" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{t('quizTitle')}</h1>
            <p className="text-sm text-gray-400">{t('quizSubtitle')}</p>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{t('quizProgress')(current + 1, total)}</span>
              <span>{Math.round(((current + 1) / total) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${((current + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div>
            <p className="text-base font-semibold text-gray-800 mb-4 leading-relaxed">{q.text}</p>
            <div className="flex flex-col gap-2.5">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer
                    ${selected === option
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${selected === option ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                      {selected === option && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {current > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-semibold rounded-xl cursor-pointer hover:border-gray-300 transition-colors bg-white"
              >
                <ArrowLeft size={15} /> {t('quizBack')}
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!selected}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl cursor-pointer transition-colors border-0"
            >
              {current === total - 1 ? t('quizSubmit') : t('quizNext')}
              <ArrowRight size={15} />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 font-medium no-underline hover:underline">
              {t('navSignIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
