import { articles } from '../data/mockData';

const thCls = 'text-left px-3 py-2.5 bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide font-semibold border-b border-gray-200';
const tdCls = 'px-3 py-3 border-b border-gray-50 text-sm text-gray-700 align-middle';

export default function AdminContent() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">📚 Content Management</h1>
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
                  <td className={tdCls}>
                    <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">{a.condition}</span>
                  </td>
                  <td className={`${tdCls} text-gray-400`}>{a.readTime}</td>
                  <td className={tdCls}>
                    <button className="text-emerald-700 text-xs font-medium hover:underline cursor-pointer bg-transparent border-0 mr-2">Edit</button>
                    <button className="text-red-500 text-xs font-medium hover:underline cursor-pointer bg-transparent border-0">Delete</button>
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
