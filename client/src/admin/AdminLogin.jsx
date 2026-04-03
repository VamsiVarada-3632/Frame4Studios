import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const { isAuthenticated, login: setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Restore native cursor on the admin login page
  useEffect(() => {
    document.body.style.cursor = 'auto';
    document.body.classList.add('admin-mode');
    return () => {
      document.body.style.cursor = '';
      document.body.classList.remove('admin-mode');
    };
  }, []);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      setAuth(res.data.admin, res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c41e3a]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Camera brackets */}
        <div className="absolute -top-6 -left-6 w-8 h-8 border-t border-l border-[#c41e3a]/30" />
        <div className="absolute -bottom-6 -right-6 w-8 h-8 border-b border-r border-[#c41e3a]/30" />

        <div className="bg-[#131313] border border-[#5b4040]/30 p-12">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="font-serif italic text-3xl text-[#e5e2e1] mb-2">FRAME 4 STUDIOS</div>
            <div className="font-ui text-[10px] tracking-[0.4em] text-[#c41e3a]">ADMIN ACCESS</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">EMAIL</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                required
                placeholder="admin@frame4studios.com"
                className="admin-input"
              />
            </div>

            <div>
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">PASSWORD</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  required
                  placeholder="••••••••"
                  className="admin-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-0 bottom-2 text-[#e3bebd]/40 hover:text-[#c41e3a] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-ui text-[11px] tracking-wider text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c41e3a] text-white py-4 font-ui text-sm tracking-[0.25em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all duration-300 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <p className="font-ui text-[9px] tracking-widest text-[#e3bebd]/20 text-center mt-10">
            SECURED ACCESS · FRAME 4 STUDIOS
          </p>
        </div>
      </motion.div>
    </div>
  );
}
