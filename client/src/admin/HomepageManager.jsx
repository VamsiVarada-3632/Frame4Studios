import { useEffect, useState } from 'react';
import { getHomepage, updateHomepage } from '../services/cmsService';
import { Save, Upload } from 'lucide-react';

// Field MUST be defined outside the parent component.
// Defining it inside causes React to treat it as a new component on every
// keystroke → unmount + remount → input loses focus after one character.
function Field({ name, value, onChange, label, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="admin-input" />
    </div>
  );
}

export default function HomepageManager() {
  const [form, setForm] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getHomepage().then((r) => {
      const d = r.data;
      setForm({
        'featuredReel.title': d.featuredReel?.title || '',
        'featuredReel.client': d.featuredReel?.client || '',
        'featuredReel.category': d.featuredReel?.category || '',
        'featuredReel.year': d.featuredReel?.year || '',
        'featuredReel.videoUrl': d.featuredReel?.videoUrl || '',
        'stats.projectsDelivered': d.stats?.projectsDelivered || '',
        'stats.filmsShot': d.stats?.filmsShot || '',
        'stats.awardsWon': d.stats?.awardsWon || '',
        'stats.clients': d.stats?.clients || '',
        'stats.years': d.stats?.years || '',
        quote: d.quote || '',
        services: d.services?.join(', ') || '',
      });
      if (d.featuredReel?.thumbnail) {
        setPreview(d.featuredReel.thumbnail.startsWith('http') ? d.featuredReel.thumbnail : `/uploads/${d.featuredReel.thumbnail}`);
      }
    }).catch(() => {});
  }, []);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      const services = form.services.split(',').map((s) => s.trim()).filter(Boolean);
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'services') fd.append(k, v);
      });
      fd.append('services', JSON.stringify(services));
      if (thumbnail) fd.append('thumbnail', thumbnail);
      await updateHomepage(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif italic text-4xl text-[#e5e2e1] mb-1">Homepage Manager</h1>
        <p className="font-body text-sm text-[#e3bebd]/50 font-light">Control the featured reel, stats, and services displayed on the homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-14">
        {/* Featured Reel */}
        <div>
          <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#c41e3a] mb-8">FEATURED REEL</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field name="featuredReel.title" value={form['featuredReel.title'] || ''} onChange={handle} label="TITLE" placeholder="The Signature Reel — 2024" />
              <Field name="featuredReel.client" value={form['featuredReel.client'] || ''} onChange={handle} label="CLIENT" placeholder="Global Visionary Ltd." />
              <Field name="featuredReel.category" value={form['featuredReel.category'] || ''} onChange={handle} label="CATEGORY" placeholder="Brand Narrative / Film" />
              <Field name="featuredReel.year" value={form['featuredReel.year'] || ''} onChange={handle} label="YEAR" placeholder="2024" />
              <div className="md:col-span-2">
                <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">VIDEO URL</label>
                <input name="featuredReel.videoUrl" value={form['featuredReel.videoUrl'] || ''} onChange={handle} placeholder="YouTube or Google Drive URL" className="admin-input" />
              </div>
            </div>
            <div>
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">THUMBNAIL</label>
              <div className="aspect-video bg-[#131313] border border-[#5b4040]/30 relative overflow-hidden mb-4">
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : (
                  <div className="flex items-center justify-center h-full"><Upload size={20} className="text-[#5b4040]" /></div>
                )}
              </div>
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" onChange={(e) => { setThumbnail(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }} className="hidden" />
                <span className="border border-[#5b4040]/30 px-4 py-2 font-ui text-[10px] tracking-wider text-[#e3bebd]/50 hover:border-[#c41e3a]/50 transition-all block text-center">CHOOSE IMAGE</span>
              </label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#c41e3a] mb-8">STATS</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <Field name="stats.projectsDelivered" value={form['stats.projectsDelivered'] || ''} onChange={handle} label="PROJECTS" placeholder="200+" />
            <Field name="stats.filmsShot" value={form['stats.filmsShot'] || ''} onChange={handle} label="FILMS" placeholder="450+" />
            <Field name="stats.awardsWon" value={form['stats.awardsWon'] || ''} onChange={handle} label="AWARDS" placeholder="12" />
            <Field name="stats.clients" value={form['stats.clients'] || ''} onChange={handle} label="CLIENTS" placeholder="85" />
            <Field name="stats.years" value={form['stats.years'] || ''} onChange={handle} label="YEARS" placeholder="04" />
          </div>
        </div>

        {/* Quote */}
        <div>
          <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#c41e3a] mb-8">QUOTE</h2>
          <textarea name="quote" value={form.quote || ''} onChange={handle} rows={3} className="admin-input resize-none w-full" placeholder="We don't just capture motion..." />
        </div>

        {/* Services */}
        <div>
          <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#c41e3a] mb-4">SERVICES MARQUEE</h2>
          <p className="font-ui text-[9px] tracking-wider text-[#e3bebd]/30 mb-4">Comma-separated list</p>
          <input name="services" value={form.services || ''} onChange={handle} placeholder="Cinematography, Show Reels, Brand Videos..." className="admin-input" />
        </div>

        {error && <p className="font-ui text-[11px] text-red-400">{error}</p>}
        {saved && <p className="font-ui text-[11px] text-green-400 tracking-wider">✓ SAVED SUCCESSFULLY</p>}

        <button type="submit" disabled={loading} className="flex items-center gap-3 bg-[#c41e3a] text-white px-10 py-4 font-ui text-sm tracking-[0.2em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all disabled:opacity-50">
          <Save size={14} /> {loading ? 'SAVING...' : 'SAVE HOMEPAGE'}
        </button>
      </form>
    </div>
  );
}
