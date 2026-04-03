import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Film, FolderOpen, Home, MessageSquare, LogOut, Menu, X
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Works', to: '/admin/works', icon: Film },
  { label: 'Categories', to: '/admin/categories', icon: FolderOpen },
  { label: 'Homepage', to: '/admin/homepage', icon: Home },
  { label: 'Inquiries', to: '/admin/inquiries', icon: MessageSquare },
];

export default function AdminLayout() {
  const { isAuthenticated, logout, admin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Restore the native OS cursor while inside the admin panel.
  // The global body has cursor:none for the cinematic custom cursor;
  // admin forms need the real cursor so users can see the text caret.
  useEffect(() => {
    const prev = document.body.style.cursor;
    document.body.style.cursor = 'auto';
    document.body.classList.add('admin-mode');
    return () => {
      document.body.style.cursor = prev;
      document.body.classList.remove('admin-mode');
    };
  }, []);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-mode min-h-screen bg-[#0e0e0e] text-[#e5e2e1] flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#131313] border-r border-[#5b4040]/30 z-50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-8 border-b border-[#5b4040]/30">
          <div className="font-serif italic text-xl text-[#e5e2e1]">FRAME 4 STUDIOS</div>
          <div className="font-ui text-[9px] tracking-[0.3em] text-[#c41e3a] mt-1">ADMIN PANEL</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-6 space-y-1">
          {navItems.map(({ label, to, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-ui text-xs tracking-wider transition-all duration-200 ${
                  active
                    ? 'bg-[#c41e3a]/10 text-[#c41e3a] border-l-2 border-[#c41e3a]'
                    : 'text-[#e3bebd]/70 hover:text-[#e5e2e1] hover:bg-[#201f1f]'
                }`}
              >
                <Icon size={16} />
                {label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div className="p-6 border-t border-[#5b4040]/30">
          <p className="font-ui text-[9px] tracking-widest text-[#e3bebd]/40 mb-1">LOGGED IN AS</p>
          <p className="font-body text-sm text-[#e5e2e1] mb-4">{admin?.username}</p>
          <button
            onClick={logout}
            className="flex items-center gap-2 font-ui text-[10px] tracking-wider text-[#e3bebd]/50 hover:text-[#c41e3a] transition-colors"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#131313] border-b border-[#5b4040]/30 flex items-center justify-between px-6 z-40 md:hidden">
        <span className="font-serif italic text-lg">F4S Admin</span>
        <button onClick={() => setSidebarOpen((v) => !v)}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
