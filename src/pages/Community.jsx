import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { api } from '../api';
import { Heart, MessageCircle, Send } from 'lucide-react';

export default function Community() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [liked, setLiked] = useState([]);
  const [joined, setJoined] = useState([]);

  const guidelines = [t('guideline1'), t('guideline2'), t('guideline3'), t('guideline4')];

  useEffect(() => {
    api.listCommunities().then(({ communities }) => {
      setCommunities(communities);
      if (communities.length > 0) setSelectedCommunity(communities[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCommunity) return;
    api.getPosts(selectedCommunity.id).then(({ posts }) => setPosts(posts)).catch(() => {});
  }, [selectedCommunity]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedCommunity) return;
    try {
      const { post } = await api.createPost(selectedCommunity.id, { content });
      setPosts(prev => [{ ...post, authorName: user.name }, ...prev]);
      setContent('');
    } catch (err) {
      // not a member yet — join first
      await api.joinCommunity(selectedCommunity.id);
      setJoined(prev => [...prev, selectedCommunity.id]);
      const { post } = await api.createPost(selectedCommunity.id, { content });
      setPosts(prev => [{ ...post, authorName: user.name }, ...prev]);
      setContent('');
    }
  };

  const toggleLike = (id) => {
    setLiked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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

          {posts.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">No posts yet. Be the first to share!</p>
            : posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {(post.authorName || 'U')[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{post.authorName || 'User'}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{post.community?.name || selectedCommunity?.name}</span>
                      <span className="text-xs text-gray-400">· {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed m-0 mb-3">{post.content}</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border-2 cursor-pointer transition-all
                      ${liked.includes(post.id) ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-700'}`}>
                    <Heart size={14} className={liked.includes(post.id) ? 'fill-red-400' : ''} />
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border-2 border-gray-200 text-gray-500 cursor-pointer">
                    <MessageCircle size={14} />
                  </button>
                </div>
              </div>
            ))
          }
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
              {communities.map(c => (
                <button key={c.id} onClick={() => setSelectedCommunity(c)}
                  className={`flex items-center gap-2 py-2.5 text-sm text-left w-full bg-transparent border-0 cursor-pointer transition-colors
                    ${selectedCommunity?.id === c.id ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-emerald-700'}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selectedCommunity?.id === c.id ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
