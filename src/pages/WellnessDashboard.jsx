import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { BookOpen, Droplets, Footprints, Apple, Moon, Lightbulb, Heart, Users, Scale, Sparkles, ChevronRight } from 'lucide-react';

const insights = {
  en: [
    "Small consistent actions matter more than perfect ones. You're doing great.",
    "Your body is always working for you. Give it the care it deserves today.",
    "Rest is not laziness — it's part of a healthy life.",
    "One glass of water, one deep breath, one kind thought. That's enough.",
    "Progress isn't always visible, but it's always happening.",
    "You don't have to be perfect to be healthy. Just be consistent.",
    "Every good habit you build today is a gift to your future self.",
  ],
  rw: [
    "Ibikorwa bito ariko bihoraho ni ingenzi kuruta ibikorwa byiza ariko bitagira gahunda.",
    "Umubiri wawe urakora ubugiraneza bwawe buri gihe. Umwite neza uyu munsi.",
    "Kupumuka si ubunebwe — ni igice cy'ubuzima bwiza.",
    "Inzupa imwe y'amazi, guhumeka inshuro imwe, igitekerezo kimwe cyiza. Bihagije.",
    "Iterambere ntirireba igihe cyose, ariko rihoraho.",
    "Ntukeneye kuba utagira inenge kugira ngo ugire ubuzima bwiza. Komeza gusa.",
    "Imyifatire myiza wubaka uyu munsi ni impano ku muturage wawe w'ejo.",
  ],
};

const reflectionPrompts = {
  en: [
    "What's one thing you did this week that made you feel good?",
    "How has your energy been lately? What might be affecting it?",
    "What's one habit you'd like to strengthen next week?",
    "How are you sleeping? Is there anything you could improve?",
    "What are you grateful for about your health this week?",
  ],
  rw: [
    "Ni iki kimwe wakoze iki cyumweru kikakugirira akamaro?",
    "Ingufu zawe zari zite vuba? Ni iki gishobora kuzitera ingaruka?",
    "Ni imyifatire izihe ushaka gukomeza icyumweru gitaha?",
    "Usinzira gute? Hari ikintu wabona ko ushobora kunoza?",
    "Ni iki ushimira ku buzima bwawe iki cyumweru?",
  ],
};

const habits = [
  { id: 'water',    icon: Droplets,   label: 'Hydration',  sub: '8 glasses of water',    color: 'bg-blue-50',    iconColor: 'text-blue-500',    ring: 'ring-blue-400' },
  { id: 'move',     icon: Footprints, label: 'Movement',   sub: '20 min walk or stretch', color: 'bg-emerald-50', iconColor: 'text-emerald-600', ring: 'ring-emerald-400' },
  { id: 'eat',      icon: Apple,      label: 'Nutrition',  sub: 'Eat something wholesome', color: 'bg-orange-50',  iconColor: 'text-orange-500',  ring: 'ring-orange-400' },
  { id: 'sleep',    icon: Moon,       label: 'Sleep',      sub: 'Aim for 7–9 hours',      color: 'bg-indigo-50',  iconColor: 'text-indigo-500',  ring: 'ring-indigo-400' },
];

export default function WellnessDashboard() {
  const { user } = useAuth();
  const { wellbeingLogs } = useHealth();
  const { lang } = useLang();

  const [checked, setChecked] = useState({});
  const [reflection, setReflection] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  const tip = (insights[lang] || insights.en)[new Date().getDay() % 7];
  const prompt = (reflectionPrompts[lang] || reflectionPrompts.en)[new Date().getDay() % 5];

  const lastMood = wellbeingLogs[0];
  const moodColors = { GREAT: 'text-green-600 bg-green-50', GOOD: 'text-lime-600 bg-lime-50', OKAY: 'text-yellow-600 bg-yellow-50', LOW: 'text-orange-500 bg-orange-50', BAD: 'text-red-500 bg-red-50' };

  const bmi = user?.height && user?.weight
    ? (user.weight / ((user.height / 100) ** 2)).toFixed(1) : null;
  const bmiStatus = bmi
    ? bmi < 18.5 ? { label: 'Underweight', color: 'text-blue-600' }
    : bmi < 25   ? { label: 'Normal', color: 'text-emerald-600' }
    : bmi < 30   ? { label: 'Overweight', color: 'text-yellow-600' }
    : { label: 'Obese', color: 'text-red-600' }
    : null;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">
            Good to see you, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 m-0">Small steps, every day. That's all it takes.</p>
        </div>
        <span className="text-sm text-gray-400 pt-1">
          {new Date().toLocaleDateString(lang === 'rw' ? 'fr-RW' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Motivational insight */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-2xl p-5 flex gap-3 items-start text-white">
        <Sparkles size={20} className="shrink-0 mt-0.5 text-emerald-200" />
        <p className="text-sm leading-relaxed m-0 text-emerald-50">{tip}</p>
      </div>

      {/* Daily habits — interactive */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-700 m-0">Today's habits</h2>
          <span className="text-xs text-emerald-700 font-semibold">{doneCount}/{habits.length} done</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {habits.map(({ id, icon: Icon, label, sub, color, iconColor, ring }) => {
            const done = checked[id];
            return (
              <button key={id} onClick={() => toggle(id)}
                className={`flex flex-col gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all text-left
                  ${done ? `${color} border-transparent ring-2 ${ring}` : 'bg-gray-50 border-gray-100 hover:border-emerald-200'}`}>
                <Icon size={20} className={done ? iconColor : 'text-gray-400'} />
                <div className="text-sm font-semibold text-gray-800">{label}</div>
                <div className="text-xs text-gray-500">{sub}</div>
                {done && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Done ✓</span>}
              </button>
            );
          })}
        </div>
        {doneCount === habits.length && (
          <div className="mt-4 bg-emerald-50 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium text-center">
            You completed all your habits today. That's something to be proud of.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Mood snapshot */}
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-gray-700 m-0">How are you feeling?</h2>
          </div>
          {lastMood ? (
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full capitalize ${moodColors[lastMood.emotion] || 'text-gray-600 bg-gray-50'}`}>
                {lastMood.emotion?.toLowerCase()}
              </span>
              <span className="text-xs text-gray-400">{new Date(lastMood.checkedAt).toLocaleDateString()}</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 m-0">You haven't checked in yet today.</p>
          )}
          <Link to="/wellbeing"
            className="flex items-center gap-1 text-xs text-emerald-700 font-medium no-underline mt-auto">
            {lastMood ? 'Check in again' : 'Do a quick check-in'} <ChevronRight size={13} />
          </Link>
        </div>

        {/* BMI card */}
        <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-gray-700 m-0">Your BMI</h2>
          </div>
          {bmi ? (
            <div className="flex items-end gap-2">
              <span className={`text-3xl font-bold ${bmiStatus.color}`}>{bmi}</span>
              <span className="text-sm text-gray-400 mb-1">{bmiStatus.label}</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 m-0">Add your height and weight to see your BMI.</p>
              <Link to="/profile" className="text-xs text-emerald-700 font-medium no-underline">Update profile →</Link>
            </>
          )}
        </div>
      </div>

      {/* Weekly reflection */}
      <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-emerald-600" />
          <h2 className="text-sm font-semibold text-gray-700 m-0">Weekly reflection</h2>
        </div>
        <p className="text-sm text-gray-500 m-0 italic">"{prompt}"</p>
        {!reflectionSaved ? (
          <>
            <textarea value={reflection} onChange={e => setReflection(e.target.value)}
              placeholder="Write a few thoughts... (just for you)"
              rows={3}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors resize-none" />
            <button
              disabled={!reflection.trim()}
              onClick={() => setReflectionSaved(true)}
              className="self-end bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg border-0 cursor-pointer transition-colors">
              Save reflection
            </button>
          </>
        ) : (
          <div className="bg-emerald-50 rounded-xl px-4 py-3 text-sm text-emerald-700">
            Reflection saved. Come back next week for a new prompt.
          </div>
        )}
      </div>

      {/* Explore */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 m-0 mb-4">Explore</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { to: '/education', Icon: BookOpen, label: 'Health Articles' },
            { to: '/wellbeing', Icon: Heart,    label: 'Mood Check-in' },
            { to: '/community', Icon: Users,    label: 'Community' },
          ].map(({ to, Icon, label }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-1.5 p-3.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl no-underline text-emerald-700 text-xs font-medium transition-colors text-center">
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
