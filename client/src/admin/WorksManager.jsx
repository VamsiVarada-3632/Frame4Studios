import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getWorks, deleteWork } from '../services/worksService';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['fashion', 'events', 'bikes', 'portrait', 'videography', 'commercial', 'other'];

export default function WorksManager() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    getWorks({ limit: 200 })
      .then((r) => setWorks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteWork(id);
    load();
  };

  const filtered = filter === 'all' ? works : works.filter((w) => w.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="font-serif italic text-4xl text-[#e5e2e1] mb-1">Works</h1>
          <p className="font-body text-sm text-[#e3bebd]/50 font-light">{works.length} total works</p>
        </div>
        <Link
          to="/admin/works/new"
          className="flex items-center gap-2 bg-[#c41e3a] text-white px-6 py-3 font-ui text-xs tracking-[0.2em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all"
        >
          <Plus size={14} /> ADD WORK
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['all', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 font-ui text-[10px] tracking-[0.2em] transition-all ${
              filter === c
                ? 'bg-[#c41e3a]/15 border border-[#c41e3a] text-[#c41e3a]'
                : 'border border-[#5b4040]/30 text-[#e3bebd]/50 hover:border-[#c41e3a]/40'
            }`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-[#201f1f] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif italic text-2xl text-[#e3bebd]/30">No works found.</p>
          <Link to="/admin/works/new" className="font-ui text-[11px] tracking-[0.3em] text-[#c41e3a] mt-6 inline-block border-b border-[#c41e3a]/50 pb-1">
            ADD YOUR FIRST WORK
          </Link>
        </div>
      ) : (
        <div className="border border-[#5b4040]/20">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#5b4040]/20 bg-[#131313]">
            <span className="col-span-1 font-ui text-[9px] tracking-widest text-[#e3bebd]/30">#</span>
            <span className="col-span-5 font-ui text-[9px] tracking-widest text-[#e3bebd]/30">TITLE</span>
            <span className="col-span-2 font-ui text-[9px] tracking-widest text-[#e3bebd]/30">CATEGORY</span>
            <span className="col-span-1 font-ui text-[9px] tracking-widest text-[#e3bebd]/30">YEAR</span>
            <span className="col-span-1 font-ui text-[9px] tracking-widest text-[#e3bebd]/30">★</span>
            <span className="col-span-2 font-ui text-[9px] tracking-widest text-[#e3bebd]/30">ACTIONS</span>
          </div>

          {filtered.map((work, i) => (
            <motion.div
              key={work._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#5b4040]/15 hover:bg-[#201f1f] transition-colors items-center"
            >
              <span className="col-span-1 font-body text-xs text-[#e3bebd]/30">{i + 1}</span>
              <div className="col-span-5 flex items-center gap-4">
                {work.thumbnail ? (
                  <img
                    src={work.thumbnail.startsWith('http') ? work.thumbnail : `/uploads/${work.thumbnail}`}
                    alt={work.title}
                    className="w-12 h-8 object-cover flex-shrink-0 opacity-70"
                  />
                ) : (
                  <div className="w-12 h-8 bg-[#201f1f] flex-shrink-0" />
                )}
                <span className="font-serif italic text-base truncate">{work.title}</span>
              </div>
              <span className="col-span-2 font-ui text-[10px] tracking-wider text-[#c41e3a]">{work.category?.toUpperCase()}</span>
              <span className="col-span-1 font-body text-sm text-[#e3bebd]/50">{work.year}</span>
              <span className="col-span-1">
                {work.featured && <Star size={14} className="text-[#ffb3b4] fill-[#ffb3b4]" />}
              </span>
              <div className="col-span-2 flex gap-3">
                <button
                  onClick={() => navigate(`/admin/works/edit/${work._id}`)}
                  className="text-[#e3bebd]/40 hover:text-[#c41e3a] transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(work._id, work.title)}
                  className="text-[#e3bebd]/40 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
