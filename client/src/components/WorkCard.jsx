import { motion } from 'framer-motion';
import { Play, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function getThumbnailSrc(work) {
  if (!work.thumbnail) return 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800';
  if (work.thumbnail.startsWith('http')) return work.thumbnail;
  return `/uploads/${work.thumbnail}`;
}

export default function WorkCard({ work, onPlay, index = 0, className = '' }) {
  const navigate = useNavigate();
  const hasVideo = !!work.videoUrl;
  const isPhotography = work.category?.toLowerCase() === 'photography';
  const thumb = getThumbnailSrc(work);

  const handleClick = () => {
    if (hasVideo && onPlay) {
      onPlay(work);
    } else if (isPhotography) {
      navigate('/photography');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative overflow-hidden bg-[#201f1f] cursor-pointer ${className}`}
      onClick={handleClick}
      data-cursor-hover
    >
      {/* Thumbnail */}
      <img
        src={thumb}
        alt={work.title}
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-75 group-hover:opacity-100 grayscale-[30%] group-hover:grayscale-0"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Camera brackets */}
      <div className="camera-bracket-tl" />
      <div className="camera-bracket-br" />

      {/* Hover border */}
      <div className="absolute inset-0 border border-transparent group-hover:border-[#c41e3a]/50 transition-colors duration-300" />

      {/* Play / view icon */}
      {hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-black/20 group-hover:border-[#c41e3a] transition-colors">
            <Play size={20} className="text-white ml-1" />
          </div>
        </div>
      )}

      {!hasVideo && (
        <div className="absolute top-4 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye size={18} className="text-[#c41e3a]" />
        </div>
      )}

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
        <span className="font-ui text-[10px] tracking-[0.35em] text-[#c41e3a] block mb-1">
          {work.category?.toUpperCase()} {work.year ? `/ ${work.year}` : ''}
        </span>
        <h3 className="font-serif italic text-xl md:text-2xl text-[#e5e2e1]">{work.title}</h3>
        {work.client && (
          <p className="font-body text-xs text-[#e3bebd]/60 mt-1">{work.client}</p>
        )}
      </div>

      {/* Featured badge */}
      {work.featured && (
        <div className="absolute top-4 left-4 bg-[#c41e3a] px-3 py-1">
          <span className="font-ui text-[9px] tracking-[0.25em] text-white">FEATURED</span>
        </div>
      )}
    </motion.div>
  );
}
