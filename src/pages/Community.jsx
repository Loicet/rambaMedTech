import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { api } from '../api';
import { Heart, MessageCircle, Send, ChevronDown, ChevronUp, Pencil, Check, X } from 'lucide-react';

function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getComments(postId)
      .then(({ comments }) => setComments(comments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { comment } = await api.addComment(postId, { content: text });
      setComments(prev => [...prev, { ...comment, authorName: user.name }]);
      setText('');
    } catch {}
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
      {loading ? (
        <p className="text-xs text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-gray-400">No comments yet. Be the first!</p>
      ) : (
        comments.map(c => (
          <div key={c.id} className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              {(c.authorName || 'U')[0]}
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-700">{c.authorName}</div>
              <div className="text-xs text-gray-600 mt-0.5 break-words">{c.content}</div>
            </div>
          </div>
        ))
      )}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-1">
        <input value={text} onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600 transition-colors min-w-0" />
        <button type="submit" disabled={!text.trim()}
          className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border-0 transition-colors shrink-0">
          Post
        </button>
      </form>
    </div>
  );
}

function PostCard({ post, onLike, onDelete, onEdit, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [saving, setSaving] = useState(false);

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText === post.content) { setEditing(false); return; }
    setSaving(true);
    await onEdit(post.id, editText);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {(post.authorName || 'U')[0]}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{post.authorName || 'User'}</div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                {post.community?.name}
              </span>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                · {new Date(post.createdAt).toLocaleDateString()}
                {post.edited && <span className="ml-1 text-gray-300">(edited)</span>}
              </span>
            </div>
          </div>
        </div>
        {post.authorId === currentUserId && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => { setEditing(true); setEditText(post.content); }}
              className="text-gray-300 hover:text-emerald-600 cursor-pointer bg-transparent border-0 p-1 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(post.id)}
              className="text-gray-300 hover:text-red-500 text-base cursor-pointer bg-transparent border-0 px-1 transition-colors">
              ✕
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-2 mb-3">
          <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3}
            className="w-full border-2 border-emerald-400 rounded-lg px-3 py-2 text-sm outline-none resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border-0 cursor-pointer">
              <X size={12} /> Cancel
            </button>
            <button onClick={handleSaveEdit} disabled={saving}
              className="flex items-center gap-1 text-xs text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 px-3 py-1.5 rounded-lg border-0 cursor-pointer">
              <Check size={12} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed m-0 mb-3 break-words">{post.content}</p>
      )}

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border-2 cursor-pointer transition-all
            ${post.likedByMe ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-700'}`}>
          <Heart size={14} className={post.likedByMe ? 'fill-red-400' : ''} />
          {post.likeCount > 0 && <span className="text-xs font-semibold">{post.likeCount}</span>}
        </button>
        <button onClick={() => setShowComments(prev => !prev)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm border-2 border-gray-200 text-gray-500 hover:border-emerald-600 hover:text-emerald-700 cursor-pointer transition-all">
          <MessageCircle size={14} />
          {post.commentCount > 0 && <span className="text-xs font-semibold">{post.commentCount}</span>}
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
}

export default function Community() {
  const { user, updateUser } = useAuth();
  const { t } = useLang();
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [joining, setJoining] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postError, setPostError] = useState('');
  // For users with no condition
  const [allConditions, setAllConditions] = useState([]);
  const [pickingCondition, setPickingCondition] = useState(false);
  const [conditionLoading, setConditionLoading] = useState(false);

  const guidelines = [t('guideline1'), t('guideline2'), t('guideline3'), t('guideline4')];

  useEffect(() => {
    api.listCommunities().then(({ communities }) => {
      setCommunities(communities);
      const joined = communities.find(c => c.isMember);
      setSelectedCommunity(joined || communities[0] || null);
    }).catch(() => {});

    // Load all conditions if user has none
    if (!user?.condition) {
      api.getConditions().then(({ conditions }) => setAllConditions(conditions)).catch(() => {});
    }
  }, []);

  const handlePickCondition = async (conditionId, conditionName) => {
    setConditionLoading(true);
    try {
      const { community } = await api.addCondition({ conditionId });
      // Update user context with new condition
      updateUser({ condition: conditionName });
      // Refresh communities
      const { communities: updated } = await api.listCommunities();
      setCommunities(updated);
      const joined = updated.find(c => c.isMember) || (community && updated.find(c => c.id === community.id));
      setSelectedCommunity(joined || updated[0] || null);
      setPickingCondition(false);
    } catch (err) {
      console.error(err);
    }
    setConditionLoading(false);
  };

  useEffect(() => {
    if (!selectedCommunity) return;
    setLoadingPosts(true);
    api.getPosts(selectedCommunity.id)
      .then(({ posts }) => setPosts(posts))
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, [selectedCommunity]);

  const isMember = selectedCommunity
    ? communities.find(c => c.id === selectedCommunity.id)?.isMember
    : false;

  const handleJoin = async () => {
    if (!selectedCommunity) return;
    setJoining(true);
    try {
      await api.joinCommunity(selectedCommunity.id);
      setCommunities(prev => prev.map(c => c.id === selectedCommunity.id ? { ...c, isMember: true } : c));
      setSelectedCommunity(prev => ({ ...prev, isMember: true }));
    } catch {}
    setJoining(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedCommunity) return;
    setPostError('');
    try {
      const { post } = await api.createPost(selectedCommunity.id, { content });
      // Mark as member in local state (backend auto-joins)
      setCommunities(prev => prev.map(c => c.id === selectedCommunity.id ? { ...c, isMember: true } : c));
      setPosts(prev => [{ ...post, authorName: user.name, likeCount: 0, likedByMe: false, commentCount: 0 }, ...prev]);
      setContent('');
    } catch (err) {
      setPostError(err.message || 'Failed to post. Please try again.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const { liked, likeCount } = await api.toggleLike(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedByMe: liked, likeCount } : p));
    } catch {}
  };

  const handleDelete = async (postId) => {
    try {
      await api.deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {}
  };

  const handleEdit = async (postId, newContent) => {
    try {
      const { post } = await api.editPost(postId, { content: newContent });
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: post.content, edited: true } : p));
    } catch {}
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('communityTitle')}</h1>
        <p className="text-sm text-gray-400 m-0">{t('communitySubtitle')}</p>
      </div>

      {/* No condition — prompt user to pick one */}
      {!user?.condition && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-800 m-0 mb-1">Choose your health condition to join your community</p>
            <p className="text-xs text-emerald-600 m-0">You'll be automatically added to the community for your condition.</p>
          </div>
          {!pickingCondition ? (
            <button onClick={() => setPickingCondition(true)}
              className="self-start bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg border-0 cursor-pointer transition-colors">
              Select My Condition
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allConditions.map(c => (
                <button key={c.id} onClick={() => handlePickCondition(c.id, c.name)}
                  disabled={conditionLoading}
                  className="px-3 py-2.5 rounded-xl border-2 border-emerald-200 bg-white hover:border-emerald-600 hover:bg-emerald-50 text-sm font-medium text-gray-700 cursor-pointer transition-all disabled:opacity-50 text-left">
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Main feed */}
        <div className="w-full md:flex-1 flex flex-col gap-4 min-w-0">

          {/* Community selector on mobile */}
          {communities.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
              {communities.map(c => (
                <button key={c.id} onClick={() => setSelectedCommunity(c)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border-2 cursor-pointer transition-all whitespace-nowrap
                    ${selectedCommunity?.id === c.id ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'}`}>
                  {c.name}
                  {c.isMember && <span className="ml-1 text-emerald-500">✓</span>}
                </button>
              ))}
            </div>
          )}

          {/* Post composer */}
          <form onSubmit={handlePost} className="bg-white rounded-xl p-4 shadow-sm">
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder={selectedCommunity ? `Share something in ${selectedCommunity.name}...` : t('postPlaceholder')}
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-emerald-600 transition-colors resize-none" />
            {postError && (
              <p className="text-xs text-red-500 mt-2">{postError}</p>
            )}
            <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
              <span className="text-xs text-gray-400">{t('postingAs')} <strong className="text-gray-600">{user.name}</strong></span>
              <button type="submit" disabled={!content.trim() || !selectedCommunity}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg cursor-pointer transition-colors border-0 flex items-center gap-1.5">
                <Send size={14} /> {t('postBtn')}
              </button>
            </div>
          </form>

          {loadingPosts ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No posts yet. Be the first to share!</p>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} onDelete={handleDelete}
                onEdit={handleEdit} currentUserId={user.id} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-60 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('communityGuidelines')}</h3>
            <ul className="m-0 pl-4 flex flex-col gap-1.5">
              {guidelines.map(g => <li key={g} className="text-xs text-gray-500 leading-relaxed">{g}</li>)}
            </ul>
          </div>

          {/* Community list — hidden on mobile (shown as pills above) */}
          <div className="hidden md:block bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('activeGroups')}</h3>
            <div className="flex flex-col divide-y divide-gray-50">
              {communities.map(c => (
                <button key={c.id} onClick={() => setSelectedCommunity(c)}
                  className={`flex items-center gap-2 py-2.5 text-sm text-left w-full bg-transparent border-0 cursor-pointer transition-colors
                    ${selectedCommunity?.id === c.id ? 'text-emerald-700 font-semibold' : 'text-gray-600 hover:text-emerald-700'}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${selectedCommunity?.id === c.id ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                  <span className="flex-1 truncate">{c.name}</span>
                  {c.isMember && <span className="text-emerald-500 text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Membership status */}
          {selectedCommunity && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Your status</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isMember ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {isMember ? '✓ Member' : 'Not joined'}
                </span>
              </div>
              {isMember && (
                <button onClick={async () => {
                  await api.leaveCommunity(selectedCommunity.id);
                  setCommunities(prev => prev.map(c => c.id === selectedCommunity.id ? { ...c, isMember: false } : c));
                  setPosts([]);
                }} className="mt-2 text-xs text-gray-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0 transition-colors">
                  Leave community
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
