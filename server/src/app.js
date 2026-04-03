import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import worksRoutes from './routes/works.js';
import categoriesRoutes from './routes/categories.js';
import homepageRoutes from './routes/homepage.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// Allow any localhost port (Vite dev server can land on 5173, 5174, etc.)
// In production set ALLOWED_ORIGIN env var to the real domain.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://frame4-studios.vercel.app',
  'https://frame4studios.onrender.com',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow curl / Postman (no origin) and any allowed origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── No-cache for dynamic API responses ───────────────────────────────────────
// Ensures admin edits are always reflected immediately — no stale browser cache.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// ─── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/works', worksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/contact', contactRoutes);

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'FRAME 4 STUDIOS API running' }));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Connect MongoDB & start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🎬 FRAME 4 STUDIOS API → Port: ${PORT}`);
  
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      // Not calling process.exit(1) here so the server stays alive
      // and Render's port scan succeeds.
    });
});

export default app;

