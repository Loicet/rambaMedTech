import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const conditionTips = {
  en: {
    Diabetes: ['Check your blood sugar before and 2 hours after meals.', 'Aim for 30 minutes of moderate exercise most days.', 'Stay hydrated — water helps regulate blood sugar levels.'],
    Hypertension: ['Reduce sodium intake — aim for less than 2,300mg per day.', 'Practice deep breathing or meditation to manage stress.', 'Monitor your BP at the same time each day for consistency.'],
    Asthma: ['Keep your rescue inhaler accessible at all times.', 'Track your peak flow readings to detect early changes.', 'Avoid known triggers like dust, smoke, and cold air.'],
    'Cardiovascular Disease': ['Take your medications exactly as prescribed.', 'Monitor your heart rate and report irregularities.', 'Follow a heart-healthy diet low in saturated fats.'],
    default: ['Log your health data daily to spot patterns early.', 'Stay consistent with your medication schedule.', 'Reach out to your care team if you notice changes.'],
  },
  rw: {
    Diabetes: ['Genzura isukari mu maraso mbere no hashize amasaha 2 nyuma y\'ifunguro.', 'Gerageza gukora imyitozo isanzwe iminota 30 buri munsi.', 'Nywa amazi menshi — amazi afasha kugenzura isukari mu maraso.'],
    Hypertension: ['Gabanya ingano ya sodi — gerageza kugabanya munsi ya 2,300mg ku munsi.', 'Kora imyitozo yo guhumeka cyane cyangwa gutekereza kugira ngo ugenzure ingaruka z\'umunaniro.', 'Genzura umuvuduko w\'amaraso ku gihe kimwe buri munsi kugira ngo ubone impinduka.'],
    Asthma: ['Shyira inhaleri yawe hafi igihe cyose.', 'Kurikirana ibipimo by\'umwuka kugira ngo ubone impinduka vuba.', 'Irinde ibintu bitera indwara nk\'umukungugu, umwotsi, n\'umwuka mworo.'],
    'Cardiovascular Disease': ['Fata imiti nk\'uko muganga yabyanditse.', 'Kurikirana imitsi y\'umutima wawe kandi utange raporo iyo habaye impinduka.', 'Kurya ibiryo bifite ubuzima bwiza kandi bifite amavuta make.'],
    default: ['Andika amakuru y\'ubuzima bwawe buri munsi kugira ngo ubone imiterere vuba.', 'Komeza gufata imiti ku gihe.', 'Baza itsinda ryawe ry\'ubuvuzi iyo ubonye impinduka.'],
  },
};

function logBorderColor(type, value) {
  if (type === 'Blood Sugar') {
    const v = parseFloat(value);
    if (v < 70) return 'border-l-orange-400';
    if (v <= 140) return 'border-l-green-500';
    return 'border-l-red-400';
  }
  return 'border-l-emerald-600';
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const { logs, wellbeingLogs } = useHealth();
  const { t, lang } = useLang();

  const recentLogs = logs.slice(0, 3);
  const lastMood = wellbeingLogs[0];
  const tips = conditionTips[lang]?.[user.condition] || conditionTips[lang]?.default || conditionTips.en.default;
  const todayTip = tips[new Date().getDay() % tips.length];

  const quickActions = [
    { to: '/tracker', icon: '', label: t('logHealthData') },
    { to: '/wellbeing', icon: '', label: t('checkIn') },
    { to: '/education', icon: '', label: t('readArticles') },
    { to: '/community', icon: '', label: t('navCommunityApp') },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('hello')}, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 m-0">
            {user.condition ? <>{t('managing')} <strong className="text-emerald-700">{user.condition}</strong></> : t('yourHealthDashboard')}
          </p>
        </div>
        <span className="text-sm text-gray-400 pt-1">
          {new Date().toLocaleDateString(lang === 'rw' ? 'fr-RW' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '', value: logs.length, label: t('healthLogs') },
          { icon: '', value: wellbeingLogs.length, label: t('checkIns') },
          { icon: '', value: 7, label: t('dayStreak') },
          lastMood ? { icon: lastMood.emoji, value: lastMood.mood, label: t('lastMood') } : null,
        ].filter(Boolean).map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex flex-col items-center gap-1 shadow-sm text-center">
            <span className="text-2xl">{s.icon}</span>
            <div className="text-xl font-bold text-emerald-700">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 m-0 mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map(a => (
              <Link key={a.to} to={a.to}
                className="flex flex-col items-center gap-1.5 p-3.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl no-underline text-emerald-700 text-xs font-medium transition-colors text-center">
                <span className="text-2xl">{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-700 m-0">{t('recentLogs')}</h2>
            <Link to="/tracker" className="text-xs text-emerald-700 font-medium no-underline">{t('seeAll')}</Link>
          </div>
          {recentLogs.length === 0 ? (
            <p className="text-gray-400 text-sm">{t('noLogsYet')} <Link to="/tracker" className="text-emerald-700">{t('addFirstLog')}</Link></p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentLogs.map(log => (
                <div key={log.id} className={`p-3 bg-gray-50 rounded-lg border-l-4 ${logBorderColor(log.type, log.value)}`}>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">{log.type}</div>
                  <div className="text-base font-bold text-gray-800">{log.value} <span className="text-xs font-normal text-gray-400">{log.unit}</span></div>
                  <div className="text-[11px] text-gray-300">{log.date} · {log.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 flex gap-3 items-start">
        <span className="text-xl shrink-0"></span>
        <div>
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">
            {user.condition ? `${t('dailyTipFor')} ${user.condition}` : t('dailyTipForYou')}
          </div>
          <p className="text-sm text-emerald-900 m-0 leading-relaxed">{todayTip}</p>
        </div>
      </div>

      {wellbeingLogs.length === 0 && (
        <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border-2 border-dashed border-emerald-200 flex-wrap">
          <span className="text-3xl shrink-0"></span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-800">{t('howAreYouFeeling')}</div>
            <p className="text-xs text-gray-400 m-0 mt-0.5">{t('noCheckinYet')}</p>
          </div>
          <Link to="/wellbeing"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg no-underline transition-colors whitespace-nowrap">
            {t('checkInNow')}
          </Link>
        </div>
      )}
    </div>
  );
}
