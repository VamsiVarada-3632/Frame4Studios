import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/cmsService';
import { Plus, Trash2, Pencil, Save, X } from 'lucide-react';

const EMPTY = { name: '', slug: '', description: '', icon: '', order: 0 };

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => getCategories().then((r) => setCategories(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon, order: cat.order });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (editId) await updateCategory(editId, fd);
      else await createCategory(fd);
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div>
      <h1 className="font-serif italic text-4xl text-[#e5e2e1] mb-2">Categories</h1>
      <p className="font-body text-sm text-[#e3bebd]/50 font-light mb-12">{categories.length} categories</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#c41e3a] mb-8">
            {editId ? 'EDIT CATEGORY' : 'ADD CATEGORY'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { name: 'name', label: 'NAME', placeholder: 'Fashion' },
              { name: 'slug', label: 'SLUG', placeholder: 'fashion' },
              { name: 'description', label: 'DESCRIPTION', placeholder: 'Brief description...' },
              { name: 'icon', label: 'ICON (Material Symbol)', placeholder: 'apparel' },
              { name: 'order', label: 'DISPLAY ORDER', placeholder: '1', type: 'number' },
            ].map(({ name, label, placeholder, type = 'text' }) => (
              <div key={name}>
                <label className="font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50 block mb-2">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle} placeholder={placeholder} className="admin-input" />
              </div>
            ))}

            {error && <p className="font-ui text-[11px] text-red-400">{error}</p>}

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="flex items-center gap-2 bg-[#c41e3a] text-white px-8 py-3 font-ui text-xs tracking-[0.2em] hover:bg-[#ffb3b4] hover:text-[#c41e3a] transition-all disabled:opacity-50">
                <Save size={13} /> {loading ? 'SAVING...' : 'SAVE'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(EMPTY); }} className="flex items-center gap-2 border border-[#5b4040]/30 text-[#e3bebd]/50 px-6 py-3 font-ui text-xs tracking-wider hover:border-[#c41e3a]/40 transition-all">
                  <X size={13} /> CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div>
          <h2 className="font-ui text-[11px] tracking-[0.4em] text-[#c41e3a] mb-8">ALL CATEGORIES</h2>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between border border-[#5b4040]/20 px-5 py-4 hover:border-[#5b4040]/40 transition-colors">
                <div>
                  <span className="font-serif italic text-lg">{cat.name}</span>
                  <span className="font-ui text-[9px] tracking-[0.3em] text-[#e3bebd]/35 ml-3">/{cat.slug}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(cat)} className="text-[#e3bebd]/40 hover:text-[#c41e3a] transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="text-[#e3bebd]/40 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="font-serif italic text-[#e3bebd]/30 py-10 text-center">No categories yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
