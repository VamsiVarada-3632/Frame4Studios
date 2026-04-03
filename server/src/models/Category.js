import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    order: { type: Number, default: 0 },
    icon: { type: String, default: '' }, // material symbol name
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
