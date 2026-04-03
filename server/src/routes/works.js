import express from 'express';
import Work from '../models/Work.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/works/count — returns total count of works
// ─────────────────────────────────────────────────────────────────────────────
router.get('/count', async (req, res) => {
  try {
    const count = await Work.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/works — public, filterable by category
// Matches against BOTH legacy `category` field AND new `categories` array
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 50 } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      // Match legacy single-category OR new multi-category array
      filter.$or = [
        { category: category.toLowerCase() },
        { categories: category.toLowerCase() },
      ];
    }

    if (featured === 'true') filter.featured = true;

    const works = await Work.find(filter).sort({ order: 1, createdAt: -1 }).limit(Number(limit));
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/works/:id
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ error: 'Work not found' });
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const cpUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'photos', maxCount: 50 }
]);

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/works — admin protected
// Accepts `categories` as a JSON string array from FormData
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', protect, cpUpload, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files['thumbnail']) data.thumbnail = req.files['thumbnail'][0].filename;
    if (req.files && req.files['photos']) data.photos = req.files['photos'].map(f => f.filename);

    // Parse multi-category array sent as JSON string from FormData
    if (data.categories && typeof data.categories === 'string') {
      try { data.categories = JSON.parse(data.categories); } catch { data.categories = [data.categories]; }
    }
    if (!Array.isArray(data.categories)) data.categories = [];

    // Keep legacy `category` in sync with first selected category
    if (data.categories.length > 0) {
      data.category = data.categories[0];
    }

    const work = new Work(data);
    await work.save();
    res.status(201).json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/works/:id — admin protected
// ─────────────────────────────────────────────────────────────────────────────
router.put('/:id', protect, cpUpload, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files['thumbnail']) data.thumbnail = req.files['thumbnail'][0].filename;
    
    // Only update photos if new files were actually uploaded
    if (req.files && req.files['photos']) {
      data.photos = req.files['photos'].map(f => f.filename);
    }

    // Parse multi-category array
    if (data.categories && typeof data.categories === 'string') {
      try { data.categories = JSON.parse(data.categories); } catch { data.categories = [data.categories]; }
    }
    if (!Array.isArray(data.categories)) data.categories = [];

    // Keep legacy `category` in sync
    if (data.categories.length > 0) {
      data.category = data.categories[0];
    }

    const work = await Work.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: false });
    if (!work) return res.status(404).json({ error: 'Work not found' });
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/works/:id — admin protected
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const work = await Work.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ error: 'Work not found' });
    res.json({ message: 'Work deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
