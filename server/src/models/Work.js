import mongoose from 'mongoose';

const workSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    // Legacy single-category (kept for backward compat — existing data untouched)
    category: { type: String, lowercase: true, default: '' },
    // New multi-category array — stores all selected category slugs
    categories: { type: [String], default: [] },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    photos: { type: [String], default: [] },
    videoUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    year: { type: Number, default: new Date().getFullYear() },
    client: { type: String, default: '' },
    duration: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Work', workSchema);
