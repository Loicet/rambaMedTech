import { useState } from 'react';
import { articles, conditions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { Clock, BookOpen, Star } from 'lucide-react';

export default function Education() {
  const { user } = useAuth();
  const { t } = useLang();

  const userCondition = user?.condition || null;
  const [filter, setFilter] = useState(userCondition || 'All');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'All' ? articles : articles.filter(a => a.condition === filter);

  if (selected) {
    return (
      <div className="flex flex-col gap-5">
        <button onClick={() => setSelected(null)}
          className="text-emerald-700 text-sm font-medium bg-transparent border-0 cursor-pointer p-0 text-left w-fit hover:underline flex items-center gap-1">
          ← {t('educationTitle')}
        </button>
        <div className="bg-white rounded-xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {selected.condition}
            </span>
            {selected.condition === userCondition && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full">
                <Star size={10} /> For You
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 mb-2">{selected.title}</h1>
          <p className="text-xs text-gray-400 mb-5 flex items-center gap-1"><Clock size={11} /> {selected.readTime} {t('minRead')}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{selected.summary}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{t('articleBody1')}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{t('articleBody2')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('educationTitle')}</h1>
        <p className="text-sm text-gray-400 m-0">{t('educationSubtitle')}</p>
      </div>

      {/* Personalised banner */}
      {userCondition && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <BookOpen size={18} className="text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 m-0">
            Showing articles for <strong>{userCondition}</strong> — your condition.
            {filter !== userCondition && (
              <button onClick={() => setFilter(userCondition)}
                className="ml-2 text-emerald-700 underline bg-transparent border-0 cursor-pointer text-sm p-0">
                Back to my topics
              </button>
            )}
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setFilter('All')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 cursor-pointer transition-all whitespace-nowrap shrink-0
            ${filter === 'All' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-600 hover:text-emerald-700'}`}>
          {t('filterAll')}
        </button>
        {conditions.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 cursor-pointer transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5
              ${filter === c ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-600 hover:text-emerald-700'}`}>
            {c === userCondition && <Star size={10} className={filter === c ? 'text-amber-300' : 'text-amber-400'} />}
            {c}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(article => {
          const isForUser = article.condition === userCondition;
          return (
            <div key={article.id} onClick={() => setSelected(article)}
              className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm border-2 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2
                ${isForUser ? 'border-emerald-200 hover:border-emerald-500' : 'border-transparent hover:border-emerald-600'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {article.condition}
                </span>
                {isForUser && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full">
                    <Star size={9} /> For You
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 m-0 leading-snug">{article.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed m-0 flex-1">{article.summary}</p>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                <span className="text-emerald-700 font-medium">{t('readMore')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No articles found for this condition yet.</div>
      )}
    </div>
  );
}
