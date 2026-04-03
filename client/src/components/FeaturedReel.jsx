import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

function getThumbnailSrc(featuredObj) {
  const thumb = featuredObj?.thumbnail;
  if (!thumb) return 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200';
  if (thumb.startsWith('http')) return thumb;
  return `/uploads/${thumb}`;
}

export default function FeaturedReel({ featuredWork, fallbackHomepageReel, onPlay }) {
  // Use the actual featured work from DB first, otherwise fallback to homepage manual config
  const reel = featuredWork || fallbackHomepageReel || {};
  const thumb = getThumbnailSrc(reel);

  // If it's a "Work" model object from DB it has multiple categories, otherwise fallback to standard category string
  const categoryString = (Array.isArray(reel.categories) && reel.categories.length > 0)
    ? reel.categories.join(' / ')
    : (reel.category || 'Brand Narrative / Film');

  return (
    <section className="flex flex-col md:flex-row min-h-[600px]">
      {/* Video Thumbnail */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="md:w-3/5 relative aspect-video md:aspect-auto group cursor-pointer overflow-hidden bg-[#0e0e0e]"
        onClick={() => reel.videoUrl && onPlay && onPlay({ ...reel, category: 'featured' })}
        data-cursor-hover
      >
        <img
          src={thumb}
          alt={reel.title || 'Featured Reel'}
          className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-20 h-20 rounded-full border border-white/40 flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:border-[#c41e3a] transition-colors duration-300"
          >
            <Play size={22} className="text-white ml-1" />
          </motion.div>
        </div>

        {/* Red glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c41e3a]/15 rounded-full blur-[80px] pointer-events-none" />
      </motion.div>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="md:w-2/5 bg-[#111111] p-12 md:p-20 flex flex-col justify-center border-l border-[#c41e3a]/15"
      >
        <span className="font-ui text-[10px] tracking-[0.45em] text-[#c41e3a] mb-8 block font-semibold">FEATURED WORK</span>

        <h2 className="font-serif text-4xl md:text-5xl italic leading-tight mb-10">
          {reel.title || 'The Signature Reel — 2024'}
        </h2>

        <div className="space-y-4">
          {[
            { label: 'CLIENT', value: reel.client || 'Global Visionary Ltd.' },
            { label: 'CATEGORY', value: categoryString },
            { label: 'YEAR', value: reel.year || '2024' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between border-b border-[#5b4040]/25 pb-3">
              <span className="font-ui text-[10px] tracking-widest text-[#e3bebd]/60">{label}</span>
              <span className="font-body text-sm font-light text-[#e5e2e1] uppercase">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
