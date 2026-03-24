import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { communityPosts as initialPosts } from '../data/mockData';
import { Heart, MessageCircle, Send } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState('');
  const [liked, setLiked] = useState([]);

  const guidelines = [t('guideline1'), t('guideline2'), t('guideline3'), t('guideline4')];
  const groups = lang === 'rw'
    ? ["Intwari z'Diyabete", "Inshuti z'Umuvuduko", "Inkunga y'Asthma", "Ubuzima bw'Umutima"]
    : ['Diabetes Warriors', 'BP Buddies', 'Asthma Support', 'Heart Health'];

  const handlePost = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosts(prev => [{
      id: Date.now(), author: user.name,
      condition: user.condition || 'General',
      time: lang === 'rw' ? 'Nonaha' : 'Just now',
      content, likes: 0, comments: 0,
    }, ...prev]);
    setContent('');
  };

  const toggleLike = (id) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, likes: liked.includes(id) ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('communityTitle')}</h1>
        <p className="text-sm text-gray-400 m-0">{t('communitySubtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-start">

        <div className="w-full md:flex-1 flex flex-col gap-4">
          <form onSubmit={handlePost} className="bg-white rounded-xl p-4 shadow-sm">
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder={t('postPlaceholder')} rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-600 transition-colors resize-none" />
            <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
              <span className="text-xs text-gray-400">{t('postingAs')} <strong className="text-gray-600">{user.name}</strong></span>
              <button type="submit" disabled={!content.trim()}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer transition-colors border-0 flex items-center gap-1.5">
                <Send size={14} /> {t('postBtn')}
              </button>
            </div>
          </form>

          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {post.author[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{post.author}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{post.condition}</span>
                    <span className="text-xs text-gray-400">· {post.time}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed m-0 mb-3">{post.content}</p>
              <div className="flex gap-2">
                <button onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border-2 cursor-pointer transition-all
                    ${liked.includes(post.id) ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-700'}`}>
                  <Heart size={14} className={liked.includes(post.id) ? 'fill-red-400' : ''} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border-2 border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-700 cursor-pointer transition-all">
                  <MessageCircle size={14} /> {post.comments}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-60 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('communityGuidelines')}</h3>
            <ul className="m-0 pl-4 flex flex-col gap-1.5">
              {guidelines.map(g => <li key={g} className="text-xs text-gray-500 leading-relaxed">{g}</li>)}
            </ul>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('activeGroups')}</h3>
            <div className="flex flex-col divide-y divide-gray-50">
              {groups.map(g => (
                <div key={g} className="flex items-center gap-2 py-2.5 text-sm text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />{g}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
