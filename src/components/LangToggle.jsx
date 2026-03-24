import { useLang } from '../context/LanguageContext';

export default function LangToggle({ light = false }) {
  const { lang, switchLang } = useLang();

  return (
    <div className={`flex items-center rounded-full p-0.5 gap-0.5 ${light ? 'bg-white/15' : 'bg-gray-100'}`}>
      {['en', 'rw'].map(l => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer border-0 transition-all uppercase
            ${lang === l
              ? light ? 'bg-white text-emerald-800' : 'bg-emerald-700 text-white'
              : light ? 'text-white/70 hover:text-white bg-transparent' : 'text-gray-400 hover:text-gray-600 bg-transparent'
            }`}
        >
          {l === 'en' ? 'EN' : 'KIN'}
        </button>
      ))}
    </div>
  );
}
