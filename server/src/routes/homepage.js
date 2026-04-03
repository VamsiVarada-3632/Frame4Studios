import express from 'express';
import Homepage from '../models/Homepage.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// GET /api/homepage — public
router.get('/', async (req, res) => {
  try {
    let data = await Homepage.findOne();
    if (!data) data = await Homepage.create({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/homepage — admin protected
router.put('/', protect, upload.single('thumbnail'), async (req, res) => {
  try {
    let data = await Homepage.findOne();
    if (!data) data = new Homepage();

    const body = req.body;

    if (body['featuredReel.title']) data.featuredReel.title = body['featuredReel.title'];
    if (body['featuredReel.client']) data.featuredReel.client = body['featuredReel.client'];
    if (body['featuredReel.category']) data.featuredReel.category = body['featuredReel.category'];
    if (body['featuredReel.year']) data.featuredReel.year = body['featuredReel.year'];
    if (body['featuredReel.videoUrl']) data.featuredReel.videoUrl = body['featuredReel.videoUrl'];
    if (req.file) data.featuredReel.thumbnail = req.file.filename;

    if (body['stats.projectsDelivered']) data.stats.projectsDelivered = body['stats.projectsDelivered'];
    if (body['stats.filmsShot']) data.stats.filmsShot = body['stats.filmsShot'];
    if (body['stats.awardsWon']) data.stats.awardsWon = body['stats.awardsWon'];
    if (body['stats.clients']) data.stats.clients = body['stats.clients'];
    if (body['stats.years']) data.stats.years = body['stats.years'];
    if (body.quote) data.quote = body.quote;
    if (body.services) data.services = JSON.parse(body.services);

    data.markModified('featuredReel');
    data.markModified('stats');
    await data.save();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
