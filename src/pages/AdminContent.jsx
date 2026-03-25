import { useState } from 'react';
import { articles as initialArticles } from '../data/mockData';
import { BookOpen, Pencil, Trash2, X } from 'lucide-react';

const inputCls = 'px-3 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white';
const thCls = 'text-left px-3 py-2.5 bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide font-semibold border-b border-gray-200';
const tdCls = 'px-3 py-3 border-b border-gray-50 text-sm text-gray-700 align-middle';

export default function AdminContent() {
  const [articles, setArticles] = useState(initialArticles);
  const [editingArticle, setEditingArticle] = useState(null);

  const deleteArticle = (id) => setArticles(prev => prev.filter(a => a.id !== id));
  const saveArticle = (updated) => {
    setArticles(prev => prev.map(a => a.id === editingArticle.id ? updated : a));
    setEditingArticle(null);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Edit Modal */}
      {editingArticle && (() => {
        const a = editingArticle;
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditingArticle(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">Edit Article</h3>
                <button onClick={() => setEditingArticle(null)} className="bg-transparent border-0 cursor-pointer text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-3">
                {[['Title', 'title'], ['Read Time', 'readTime']].map(([label, field]) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">{label}</label>
                    <input value={a[field]} onChange={e => setEditingArticle({ ...a, [field]: e.target.value })} className={inputCls} />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Summary</label>
                  <textarea value={a.summary} onChange={e => setEditingArticle({ ...a, summary: e.target.value })}
                    rows={3} className={`${inputCls} resize-none`} />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditingArticle(null)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border-0 cursor-pointer">Cancel</button>
                <button onClick={() => saveArticle(a)} className="px-4 py-2 text-sm bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg border-0 cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        );
      })()}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <BookOpen size={22} className="text-emerald-600" /> Content Management
        </h1>
        <p className="text-sm text-gray-400 m-0">Publish, edit, and manage health education articles.</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-gray-700 m-0">Published Articles ({articles.length})</h3>
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors border-0">
            + New Article
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[400px]">
            <thead>
              <tr>{['Title', 'Condition', 'Read Time', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className={tdCls}>{a.title}</td>
                  <td className={tdCls}><span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">{a.condition}</span></td>
                  <td className={`${tdCls} text-gray-400`}>{a.readTime}</td>
                  <td className={tdCls}>
                    <button onClick={() => setEditingArticle(a)} className="text-gray-400 hover:text-emerald-700 cursor-pointer bg-transparent border-0 mr-3 transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deleteArticle(a.id)} className="text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-0 transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
