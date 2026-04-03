import { useEffect, useState } from 'react';
import { getContacts, markRead, deleteContact } from '../services/contactService';
import { Mail, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    getContacts()
      .then((r) => setInquiries(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id) => {
    await markRead(id);
    setInquiries((prev) => prev.map((i) => i._id === id ? { ...i, read: true } : i));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await deleteContact(id);
    setSelected(null);
    load();
  };

  const filtered = filter === 'unread' ? inquiries.filter((i) => !i.read) : inquiries;
  const unreadCount = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      <div className="flex items-center gap-6 mb-10 flex-wrap">
        <div>
          <h1 className="font-serif italic text-4xl text-[#e5e2e1] mb-1">Contact Inquiries</h1>
          <p className="font-body text-sm text-[#e3bebd]/50 font-light">{unreadCount} unread · {inquiries.length} total</p>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        {[['all', 'ALL'], ['unread', 'UNREAD']].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`px-5 py-2 font-ui text-[10px] tracking-[0.25em] transition-all ${
              filter === v ? 'bg-[#c41e3a]/15 border border-[#c41e3a] text-[#c41e3a]' : 'border border-[#5b4040]/30 text-[#e3bebd]/50'
            }`}
          >
            {l} {v === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-2">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-[#201f1f] animate-pulse" />)
          ) : filtered.length === 0 ? (
            <p className="font-serif italic text-[#e3bebd]/30 py-16 text-center">No inquiries found.</p>
          ) : (
            filtered.map((inq, i) => (
              <motion.div
                key={inq._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setSelected(inq); if (!inq.read) handleMarkRead(inq._id); }}
                className={`border p-5 cursor-pointer transition-all ${
                  selected?._id === inq._id
                    ? 'border-[#c41e3a] bg-[#c41e3a]/5'
                    : 'border-[#5b4040]/20 hover:border-[#5b4040]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {!inq.read && <div className="w-2 h-2 rounded-full bg-[#c41e3a] flex-shrink-0 mt-1" />}
                    <div>
                      <p className="font-serif italic text-base">{inq.name}</p>
                      <p className="font-body text-xs text-[#e3bebd]/50">{inq.email}</p>
                    </div>
                  </div>
                  <span className="font-ui text-[9px] tracking-wider text-[#e3bebd]/30 flex-shrink-0">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {inq.projectType && (
                  <span className="font-ui text-[9px] tracking-[0.25em] text-[#c41e3a] mt-2 block">{inq.projectType.toUpperCase()}</span>
                )}
                <p className="font-body text-sm text-[#e3bebd]/50 mt-2 line-clamp-2">{inq.message}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#131313] border border-[#5b4040]/30 p-8 h-fit"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="font-serif italic text-2xl mb-1">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="font-body text-sm text-[#c41e3a] hover:underline">{selected.email}</a>
              </div>
              <button onClick={() => handleDelete(selected._id)} className="text-[#e3bebd]/30 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>

            <div className="space-y-4 mb-8">
              {selected.phone && (
                <div>
                  <span className="font-ui text-[9px] tracking-[0.3em] text-[#e3bebd]/30 block mb-1">PHONE</span>
                  <p className="font-body text-sm">{selected.phone}</p>
                </div>
              )}
              {selected.projectType && (
                <div>
                  <span className="font-ui text-[9px] tracking-[0.3em] text-[#e3bebd]/30 block mb-1">PROJECT TYPE</span>
                  <span className="font-ui text-[10px] tracking-wider text-[#c41e3a]">{selected.projectType.toUpperCase()}</span>
                </div>
              )}
              <div>
                <span className="font-ui text-[9px] tracking-[0.3em] text-[#e3bebd]/30 block mb-1">DATE</span>
                <p className="font-body text-sm">{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <span className="font-ui text-[9px] tracking-[0.3em] text-[#e3bebd]/30 block mb-3">MESSAGE</span>
              <p className="font-body text-sm text-[#e3bebd]/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.projectType || 'Your Inquiry'} — FRAME 4 STUDIOS`}
                className="flex items-center gap-2 bg-[#c41e3a] text-white px-6 py-3 font-ui text-[10px] tracking-widest hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all"
              >
                <Mail size={13} /> REPLY
              </a>
              {!selected.read && (
                <button onClick={() => handleMarkRead(selected._id)} className="flex items-center gap-2 border border-[#5b4040]/30 text-[#e3bebd]/50 px-5 py-3 font-ui text-[10px] tracking-widest hover:border-[#c41e3a]/40 transition-all">
                  <Check size={13} /> MARK READ
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
