import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { BookOpen, MessageSquare, Search, ClipboardList } from 'lucide-react';

const resources = [
  {
    category: 'Clinical Guidelines',
    Icon: ClipboardList,
    items: [
      { title: 'WHO Diabetes Management Protocol', desc: 'Evidence-based guidelines for type 2 diabetes care in low-resource settings.', tag: 'Diabetes', time: '8 min' },
      { title: 'Hypertension Treatment Ladder', desc: 'Step-by-step medication and lifestyle approach for hypertension control.', tag: 'Hypertension', time: '6 min' },
      { title: 'Asthma Action Plan Template', desc: 'Customizable action plan for patients with mild to severe asthma.', tag: 'Asthma', time: '5 min' },
    ],
  },
  {
    category: 'Patient Communication',
    Icon: MessageSquare,
    items: [
      { title: 'Motivational Interviewing Basics', desc: 'Techniques to encourage patients to take ownership of their health journey.', tag: 'Communication', time: '7 min' },
      { title: 'Explaining Lab Results Simply', desc: 'How to communicate blood sugar, BP, and cholesterol results to patients clearly.', tag: 'Education', time: '5 min' },
    ],
  },
  {
    category: 'Monitoring & Alerts',
    Icon: Search,
    items: [
      { title: 'When to Escalate: Red Flag Symptoms', desc: 'Critical signs across chronic conditions that require immediate referral.', tag: 'Safety', time: '4 min' },
      { title: 'Interpreting Mood & Wellbeing Trends', desc: 'How to use patient check-in data to identify emotional health risks early.', tag: 'Wellbeing', time: '6 min' },
    ],
  },
];

const tagColors = {
  Diabetes: 'bg-blue-50 text-blue-700',
  Hypertension: 'bg-red-50 text-red-700',
  Asthma: 'bg-purple-50 text-purple-700',
  Communication: 'bg-yellow-50 text-yellow-700',
  Education: 'bg-emerald-50 text-emerald-700',
  Safety: 'bg-orange-50 text-orange-700',
  Wellbeing: 'bg-pink-50 text-pink-700',
};

export default function CaregiverResources() {
  const { t } = useLang();
  const [search, setSearch] = useState('');

  const filtered = resources.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item => !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.tag.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2"><BookOpen size={22} className="text-emerald-700" />{t('caregiverResources') || 'Clinical Resources'}</h1>
          <p className="text-sm text-gray-400 m-0">{t('caregiverResourcesSubtitle') || 'Guidelines, protocols, and tools to support your patients.'}</p>
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search resources..."
          className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors w-full sm:w-56"
        />
      </div>

      {filtered.map(cat => (
        <div key={cat.category}>
          <div className="flex items-center gap-2 mb-3">
            <cat.Icon size={15} className="text-emerald-600" />
            <h2 className="text-sm font-semibold text-gray-600 m-0">{cat.category}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.items.map(item => (
              <div key={item.title} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagColors[item.tag] || 'bg-gray-100 text-gray-600'}`}>
                    {item.tag}
                  </span>
                  <span className="text-xs text-gray-300 shrink-0">{item.time} read</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 m-0 leading-snug">{item.title}</h3>
                <p className="text-xs text-gray-400 m-0 leading-relaxed flex-1">{item.desc}</p>
                <button className="text-xs text-emerald-700 font-semibold text-left hover:underline cursor-pointer bg-transparent border-0 p-0 mt-1">
                  Read article →
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
