import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWork, createWork, updateWork } from '../services/worksService';
import { getCategories } from '../services/cmsService';
import { Save, Upload, ExternalLink, Check } from 'lucide-react';

const EMPTY = {
  title: '', categories: [], description: '', videoUrl: '',
  year: new Date().getFullYear(), client: '', duration: '', featured: false, order: 0,
};

export default function WorkForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY);
  const [dbCategories, setDbCategories] = useState([]);  // live from DB
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [photos, setPhotos] = useState([]);      // new bulk photos state
  const [photoPreviews, setPhotoPreviews] = useState([]); // optional preview strings for existing DB or newly chosen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load DB categories
  useEffect(() => {
    getCategories()
      .then((r) => setDbCategories(r.data || []))
      .catch(() => {});
  }, []);

  // If editing, load existing work
  useEffect(() => {
    if (isEdit) {
      getWork(id).then((r) => {
        const w = r.data;
        // Support both old single-category and new multi-category array
        const cats = Array.isArray(w.categories) && w.categories.length > 0
          ? w.categories
          : w.category ? [w.category] : [];
        setForm({
          title: w.title || '',
          categories: cats,
          description: w.description || '',
          videoUrl: w.videoUrl || '',
          year: w.year || new Date().getFullYear(),
          client: w.client || '',
          duration: w.duration || '',
          featured: w.featured || false,
          order: w.order || 0,
        });
        if (w.thumbnail) {
          setPreview(w.thumbnail.startsWith('http') ? w.thumbnail : `/uploads/${w.thumbnail}`);
        }
        if (w.photos && w.photos.length > 0) {
          setPhotoPreviews(w.photos.map(p => p.startsWith('http') ? p : `/uploads/${p}`));
        }
      });
    }
  }, [id]);

  const isPhotography = form.categories.includes('photography');

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // Toggle a category slug in/out of the array
  const toggleCategory = (slug) => {
    setForm((f) => {
      const current = f.categories || [];
      return {
        ...f,
        categories: current.includes(slug)
          ? current.filter((c) => c !== slug)
          : [...current, slug],
      };
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setPhotos(files);
    setPhotoPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categories || form.categories.length === 0) {
      setError('Please select at least one category.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      // Append all scalar fields
      const { categories, featured, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      fd.append('featured', featured ? 'true' : 'false');
      // Append categories as JSON string — server parses it
      fd.append('categories', JSON.stringify(categories));
      // Keep legacy category in sync (first item)
      fd.append('category', categories[0] || '');

      if (thumbnail) fd.append('thumbnail', thumbnail);
      if (photos.length > 0) {
        photos.forEach(p => fd.append('photos', p));
      }
      
      if (isEdit) await updateWork(id, fd);
      else await createWork(fd);
      navigate('/admin/works');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save work');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <button
          onClick={() => navigate('/admin/works')}
          className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/40 hover:text-[#c41e3a] mb-4 flex items-center gap-1 transition-colors"
        >
          ← BACK TO WORKS
        </button>
        <h1 className="font-serif italic text-4xl text-[#e5e2e1]">{isEdit ? 'Edit Work' : 'Add New Work'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left — 2 cols */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">TITLE</label>
              <input name="title" value={form.title} onChange={handle} placeholder="Work title (Optional)" className="admin-input" />
            </div>
            <div>
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">CLIENT</label>
              <input name="client" value={form.client} onChange={handle} placeholder="Client name" className="admin-input" />
            </div>
            <div>
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">YEAR</label>
              <input name="year" type="number" value={form.year} onChange={handle} className="admin-input" />
            </div>
          </div>

          {/* ── Multi-Category Selector ── */}
          <div>
            <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-4">
              CATEGORIES * <span className="text-[#c41e3a]/60 ml-2 tracking-normal normal-case">(select one or more)</span>
            </label>
            {dbCategories.length === 0 ? (
              <p className="font-ui text-[10px] tracking-wider text-[#e3bebd]/30">Loading categories…</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {dbCategories
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((cat) => {
                    const slug = cat.slug.toLowerCase();
                    const selected = form.categories.includes(slug);
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => toggleCategory(slug)}
                        className={`flex items-center gap-2 px-4 py-2 font-ui text-[10px] tracking-[0.2em] border transition-all duration-200 ${
                          selected
                            ? 'border-[#c41e3a] bg-[#c41e3a]/15 text-[#c41e3a]'
                            : 'border-[#5b4040]/40 text-[#e3bebd]/60 hover:border-[#c41e3a]/50 hover:text-[#c41e3a]'
                        }`}
                      >
                        {selected && <Check size={10} strokeWidth={3} />}
                        {cat.name.toUpperCase()}
                      </button>
                    );
                  })}
              </div>
            )}
            {form.categories.length > 0 && (
              <p className="font-ui text-[9px] tracking-wider text-[#e3bebd]/30 mt-3">
                Selected: {form.categories.join(', ')}
              </p>
            )}
          </div>

          <div>
            <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">DESCRIPTION</label>
            <textarea name="description" value={form.description} onChange={handle} rows={4} placeholder="Brief description..." className="admin-input resize-none" />
          </div>

          {/* Conditional Video or Photo Bulk Upload fields */}
          {!isPhotography ? (
            <>
              <div>
                <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3 flex items-center gap-2">
                  VIDEO URL <ExternalLink size={12} className="text-[#c41e3a]" />
                </label>
                <input name="videoUrl" value={form.videoUrl} onChange={handle} placeholder="YouTube URL or Google Drive share link" className="admin-input" />
                <p className="font-ui text-[9px] tracking-wider text-[#e3bebd]/25 mt-2">Supports: YouTube, Google Drive (share link auto-converts)</p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">DURATION</label>
                  <input name="duration" value={form.duration} onChange={handle} placeholder="e.g. 2:34" className="admin-input" />
                </div>
                <div>
                  <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">ORDER</label>
                  <input name="order" type="number" value={form.order} onChange={handle} className="admin-input" />
                </div>
              </div>
            </>
          ) : (
            <div className="border border-[#5b4040]/30 p-6 bg-[#131313]">
              <label className="font-ui text-[10px] tracking-[0.3em] text-[#c41e3a] block mb-3">PHOTOGRAPHY GALLERY UPLOAD</label>
              <p className="font-ui text-[9px] tracking-wider text-[#e3bebd]/50 mb-6">Select all the high-resolution images you want to tie to this photography catalog.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {photoPreviews.map((src, i) => (
                  <div key={i} className="aspect-square bg-[#0e0e0e] border border-[#5b4040]/30 overflow-hidden">
                    <img src={src} alt="Gallery item" className="w-full h-full object-cover opacity-80" />
                  </div>
                ))}
              </div>

              <label className="cursor-pointer inline-block">
                <input type="file" multiple accept="image/*" onChange={handlePhotos} className="hidden" />
                <span className="border border-[#5b4040]/40 px-6 py-3 font-ui text-[10px] tracking-[0.25em] text-[#e3bebd]/50 hover:bg-[#c41e3a]/10 hover:border-[#c41e3a]/50 hover:text-[#c41e3a] transition-all block text-center">
                  SELECT IMAGES TO UPLOAD
                </span>
              </label>
            </div>
          )}

          {isPhotography && (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">ORDER</label>
                <input name="order" type="number" value={form.order} onChange={handle} className="admin-input" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input id="featured" name="featured" type="checkbox" checked={form.featured} onChange={handle} className="w-4 h-4 accent-[#c41e3a]" />
            <label htmlFor="featured" className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/60 cursor-pointer">MARK AS FEATURED</label>
          </div>

          {error && <p className="font-ui text-[11px] tracking-wider text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 bg-[#c41e3a] text-white px-10 py-4 font-ui text-sm tracking-[0.2em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all disabled:opacity-50"
          >
            <Save size={14} /> {loading ? 'SAVING...' : 'SAVE WORK'}
          </button>
        </div>

        {/* Right — thumbnail */}
        <div className="lg:col-span-1">
          <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-3">THUMBNAIL</label>
          <div className="aspect-[16/10] bg-[#131313] border border-[#5b4040]/30 relative overflow-hidden mb-4">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Upload size={24} className="text-[#5b4040]" />
              </div>
            )}
          </div>
          <label className="cursor-pointer block">
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <span className="border border-[#5b4040]/30 px-6 py-3 font-ui text-[10px] tracking-[0.25em] text-[#e3bebd]/50 hover:border-[#c41e3a]/50 hover:text-[#c41e3a] transition-all block text-center">
              CHOOSE IMAGE
            </span>
          </label>
        </div>
      </form>
    </div>
  );
}
