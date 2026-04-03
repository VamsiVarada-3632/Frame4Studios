import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { getCategories } from '../services/cmsService';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  // Close mobile nav on route change
  useEffect(() => setMobileOpen(false), [location]);

  const navLinks = [
    { label: 'WORK', to: '/works' },
    // Dynamically insert categories
    ...categories
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(c => ({ label: c.name.toUpperCase(), to: `/${c.slug}` })),
    { label: 'CONTACT', to: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5 transition-all duration-500 ${
          scrolled ? 'bg-[#0e0e0e]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(196,30,58,0.2)]' : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="font-serif italic text-2xl font-light tracking-tighter text-[#e5e2e1] z-10">
          FRAME 4 STUDIOS
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 lg:gap-10 items-center">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-ui text-[10px] lg:text-[11px] tracking-[0.18em] transition-colors duration-300 pb-0.5 ${
                  isActive
                    ? 'text-[#c41e3a] border-b border-[#c41e3a]'
                    : 'text-[#e5e2e1] hover:text-[#c41e3a]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Book a Call */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden md:block bg-[#c41e3a] text-white px-6 py-2 font-ui text-[11px] tracking-[0.18em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all duration-300 active:scale-95"
          >
            BOOK A CALL
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-[#e5e2e1] z-10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Full-screen Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0e0e0e] flex flex-col items-center justify-center gap-2"
          >
            {/* Red glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#c41e3a]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-8 h-[70vh] overflow-y-auto no-scrollbar pt-10">
              {navLinks.map(({ label, to }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `font-serif italic text-4xl sm:text-5xl md:text-7xl block transition-all duration-500 hover:tracking-widest ${
                        isActive ? 'text-[#c41e3a]' : 'text-[#e5e2e1]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                className="mt-8 mb-10"
              >
                <Link
                  to="/contact"
                  className="border border-[#c41e3a] text-[#c41e3a] px-12 py-4 font-ui text-xs tracking-widest hover:bg-[#c41e3a] hover:text-white transition-all inline-block"
                >
                  START A PROJECT
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
