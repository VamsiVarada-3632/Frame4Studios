import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorks } from '../services/worksService';
import { getContacts } from '../services/contactService';
import { getCategories } from '../services/cmsService';
import { Film, FolderOpen, MessageSquare, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({ works: 0, featured: 0, categories: 0, inquiries: 0, unread: 0 });

  useEffect(() => {
    Promise.all([
      getWorks({ limit: 200 }),
      getCategories(),
      getContacts(),
    ]).then(([w, c, i]) => {
      const works = w.data;
      const contacts = i.data;
      setStats({
        works: works.length,
        featured: works.filter((x) => x.featured).length,
        categories: c.data.length,
        inquiries: contacts.length,
        unread: contacts.filter((x) => !x.read).length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Works', value: stats.works, icon: Film, to: '/admin/works', color: 'text-[#c41e3a]' },
    { label: 'Featured', value: stats.featured, icon: Star, to: '/admin/works', color: 'text-[#ffb3b4]' },
    { label: 'Categories', value: stats.categories, icon: FolderOpen, to: '/admin/categories', color: 'text-[#c41e3a]' },
    { label: 'Inquiries', value: `${stats.unread} new`, icon: MessageSquare, to: '/admin/inquiries', color: 'text-[#ffb3b4]' },
  ];

  const quickActions = [
    { label: 'Add New Work', to: '/admin/works/new', icon: Plus },
    { label: 'View Works', to: '/admin/works', icon: Film },
    { label: 'Manage Categories', to: '/admin/categories', icon: FolderOpen },
    { label: 'View Inquiries', to: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-serif italic text-4xl text-[#e5e2e1] mb-2">Dashboard</h1>
        <p className="font-body text-sm text-[#e3bebd]/50 font-light">Welcome back. Here's your studio at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
        {cards.map(({ label, value, icon: Icon, to, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link to={to} className="block bg-[#131313] border border-[#5b4040]/30 p-8 hover:border-[#c41e3a]/50 transition-colors group" data-cursor-hover>
              <Icon size={20} className={`${color} mb-6`} />
              <div className="font-serif text-4xl mb-2">{value}</div>
              <div className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 uppercase">{label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#e3bebd]/40 mb-6 uppercase">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 border border-[#5b4040]/25 px-5 py-4 font-ui text-[10px] tracking-wider text-[#e3bebd]/60 hover:text-[#c41e3a] hover:border-[#c41e3a]/40 transition-all"
            >
              <Icon size={14} /> {label.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
