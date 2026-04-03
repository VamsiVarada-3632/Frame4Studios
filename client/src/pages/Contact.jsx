import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../services/contactService';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', projectType: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', projectType: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  const projectTypes = ['Brand Film', 'Fashion Editorial', 'Event Coverage', 'Portrait Session', 'Videography', 'Other'];

  return (
    <main className="pt-32 min-h-screen bg-[#080808]">
      {/* Breadcrumb */}
      <div className="px-8 mb-8 flex items-center gap-2 font-ui text-[10px] tracking-[0.25em] text-[#e3bebd]/50">
        <span>HOME</span><span className="text-[#c41e3a]">/</span><span className="text-[#e5e2e1]">CONTACT</span>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-2/5"
          >
            <span className="font-ui text-[10px] tracking-[0.5em] text-[#c41e3a] block mb-8">GET IN TOUCH</span>
            <h1 className="font-serif italic text-5xl md:text-6xl leading-tight mb-10">
              Let's create something<br />
              <span className="text-[#c41e3a]">extraordinary.</span>
            </h1>
            <p className="font-body text-base font-light text-[#e3bebd]/70 leading-relaxed mb-16 max-w-sm">
              Whether you have a fully formed brief or a fleeting idea — we want to hear about it.
              Start with hello.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email', value: 'frame4studios@gmai.com', href: 'mailto:frame4studios@gmai.com' },
                { icon: Phone, label: 'Phone', value: '7416522435, 8074582063', href: 'tel:7416522435' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-[#5b4040]/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#c41e3a]" />
                  </div>
                  <div>
                    <span className="font-ui text-[9px] tracking-[0.4em] text-[#e3bebd]/40 block mb-1">{label.toUpperCase()}</span>
                    <a href={href} className="font-body text-sm text-[#e5e2e1] hover:text-[#c41e3a] transition-colors">{value}</a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:w-3/5"
          >
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 border border-[#c41e3a] flex items-center justify-center mb-8">
                  <Send size={28} className="text-[#c41e3a]" />
                </div>
                <h2 className="font-serif italic text-4xl mb-4">Message Received.</h2>
                <p className="font-body text-[#e3bebd]/60 max-w-sm">
                  Thank you for reaching out. We'll frame a response and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-10 font-ui text-[11px] tracking-[0.3em] text-[#c41e3a] border-b border-[#c41e3a]/50 pb-1 hover:tracking-[0.4em] transition-all"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">YOUR NAME *</label>
                    <input name="name" value={form.name} onChange={handle} required placeholder="John Doe" className="admin-input" />
                  </div>
                  <div>
                    <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">EMAIL *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="john@brand.com" className="admin-input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">PHONE</label>
                    <input name="phone" value={form.phone} onChange={handle} placeholder="+91 00000 00000" className="admin-input" />
                  </div>
                  <div>
                    <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">PROJECT TYPE</label>
                    <select name="projectType" value={form.projectType} onChange={handle} className="admin-input">
                      <option value="">Select...</option>
                      {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">YOUR MESSAGE</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handle}
                    rows={6}
                    placeholder="Tell us about your vision... (Optional)"
                    className="admin-input resize-none"
                  />
                </div>

                {error && (
                  <p className="font-ui text-[11px] tracking-wider text-red-400">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center gap-3 bg-[#c41e3a] text-white px-10 py-4 font-ui text-sm tracking-[0.2em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all duration-300 active:scale-95 disabled:opacity-50"
                  data-cursor-hover
                >
                  {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'} <Send size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
