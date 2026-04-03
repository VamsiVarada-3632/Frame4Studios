import { AnimatePresence, motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { X } from 'lucide-react';
import { useEffect } from 'react';

// Convert Google Drive share link to embeddable
function normalizeVideoUrl(url) {
  if (!url) return '';
  // Handle Google Drive: /file/d/{id}/view → /file/d/{id}/preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return url;
}

export default function VideoModal({ work, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const isDrive = work?.videoUrl?.includes('drive.google.com');
  const embedUrl = normalizeVideoUrl(work?.videoUrl);

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="video-modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 flex items-center gap-2 font-ui text-xs tracking-widest text-[#e5e2e1] hover:text-[#c41e3a] transition-colors"
            aria-label="Close video"
          >
            CLOSE <X size={16} />
          </button>

          {/* Camera brackets */}
          <div className="camera-bracket-tl" />
          <div className="camera-bracket-br" />

          {/* Work meta */}
          <div className="mb-4 px-1">
            <span className="font-ui text-[10px] tracking-[0.4em] text-[#c41e3a]">
              {work?.category?.toUpperCase()} · {work?.year}
            </span>
            <h3 className="font-serif italic text-2xl text-[#e5e2e1] mt-1">{work?.title}</h3>
          </div>

          {/* Player */}
          <div className="aspect-video bg-[#131313] border border-[#5b4040]/30 overflow-hidden">
            {isDrive ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay"
                allowFullScreen
                title={work?.title}
              />
            ) : (
              <ReactPlayer
                url={work?.videoUrl}
                width="100%"
                height="100%"
                controls
                playing
                config={{
                  youtube: { playerVars: { modestbranding: 1, rel: 0 } },
                }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
