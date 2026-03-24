import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { MessageSquare, Send } from 'lucide-react';

const threads = [
  {
    id: 1, patient: 'Amara Kamara', condition: 'Diabetes', avatar: 'A', unread: 2,
    lastMessage: 'Thank you for the advice on my diet, I will try the changes.',
    time: '10:24 AM',
    messages: [
      { from: 'patient',   text: 'Good morning Dr. Chidi, I had a high reading this morning — 178 mg/dL.', time: '9:05 AM' },
      { from: 'caregiver', text: "Good morning Amara. Did you eat anything before the reading? Try to log it as fasting vs after-meal.", time: '9:18 AM' },
      { from: 'patient',   text: 'It was after breakfast. I had rice and beans.', time: '9:45 AM' },
      { from: 'caregiver', text: "That explains it. Rice can spike blood sugar. Try smaller portions and add more vegetables. I'll update your plan.", time: '10:02 AM' },
      { from: 'patient',   text: 'Thank you for the advice on my diet, I will try the changes.', time: '10:24 AM' },
    ],
  },
  {
    id: 2, patient: 'Kwame Asante', condition: 'Hypertension', avatar: 'K', unread: 1,
    lastMessage: 'My BP was 148/92 again this morning. Should I be worried?',
    time: 'Yesterday',
    messages: [
      { from: 'patient', text: 'My BP was 148/92 again this morning. Should I be worried?', time: 'Yesterday 6:15 PM' },
    ],
  },
  {
    id: 3, patient: 'Fatima Mensah', condition: 'Asthma', avatar: 'F', unread: 0,
    lastMessage: 'Peak flow was 460 today, feeling much better!',
    time: '2 days ago',
    messages: [
      { from: 'patient',   text: 'Peak flow was 460 today, feeling much better!', time: '2 days ago' },
      { from: 'caregiver', text: 'Excellent Fatima! Keep it up and remember to carry your inhaler during the rainy season.', time: '2 days ago' },
    ],
  },
];

export default function CaregiverMessages() {
  const { t } = useLang();
  const [selected, setSelected] = useState(threads[0]);
  const [reply, setReply] = useState('');
  const [localThreads, setLocalThreads] = useState(threads);

  const sendReply = () => {
    if (!reply.trim()) return;
    const updated = localThreads.map(th =>
      th.id === selected.id
        ? { ...th, lastMessage: reply, time: 'Just now', unread: 0, messages: [...th.messages, { from: 'caregiver', text: reply, time: 'Just now' }] }
        : th
    );
    setLocalThreads(updated);
    setSelected(updated.find(th => th.id === selected.id));
    setReply('');
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <MessageSquare size={22} className="text-emerald-600" />
          {t('caregiverMessages') || 'Patient Messages'}
        </h1>
        <p className="text-sm text-gray-400 m-0">{t('caregiverMessagesSubtitle') || 'Communicate directly with your patients.'}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">

        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          {localThreads.map(th => (
            <button key={th.id} onClick={() => setSelected(th)}
              className={`w-full text-left flex items-center gap-3 p-3.5 bg-white rounded-xl border-2 cursor-pointer transition-all shadow-sm
                ${selected.id === th.id ? 'border-emerald-600 bg-emerald-50' : 'border-transparent hover:border-emerald-200'}`}>
              <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {th.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-gray-900 truncate">{th.patient}</span>
                  {th.unread > 0 && (
                    <span className="bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                      {th.unread}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 truncate">{th.lastMessage}</div>
                <div className="text-[10px] text-gray-300 mt-0.5">{th.time}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm flex flex-col" style={{ minHeight: '420px' }}>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {selected.avatar}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{selected.patient}</div>
              <div className="text-xs text-gray-400">{selected.condition}</div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto">
            {selected.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'caregiver' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.from === 'caregiver'
                    ? 'bg-emerald-700 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  {msg.text}
                  <div className={`text-[10px] mt-1 ${msg.from === 'caregiver' ? 'text-white/60' : 'text-gray-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 p-3 border-t border-gray-100">
            <input value={reply} onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors" />
            <button onClick={sendReply}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors border-0 shrink-0 flex items-center gap-1.5">
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
