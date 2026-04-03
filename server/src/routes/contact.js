import express from 'express';
import Contact from '../models/Contact.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contact — public submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, projectType, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const inquiry = new Contact({ name, email, phone, projectType, message });
    await inquiry.save();
    res.status(201).json({ message: 'Your message has been received. We\'ll be in touch.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — admin protected
router.get('/', protect, async (req, res) => {
  try {
    const { read } = req.query;
    const filter = {};
    if (read === 'true') filter.read = true;
    if (read === 'false') filter.read = false;
    const inquiries = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/contact/:id/read — mark as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const inquiry = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/contact/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
