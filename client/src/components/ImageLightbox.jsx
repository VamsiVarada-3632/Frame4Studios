import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const activeImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-[#e3bebd] hover:text-[#c41e3a] hover:bg-black transition-all"
        >
          <X size={24} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-8 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-black/50 text-[#e3bebd] hover:text-[#c41e3a] hover:bg-black transition-all"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-8 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-black/50 text-[#e3bebd] hover:text-[#c41e3a] hover:bg-black transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}

        <div className="w-full h-full p-10 md:p-20 flex flex-col items-center justify-center">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={activeImage.src}
            alt={activeImage.work?.title || 'Gallery image'}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl"
          />
          
          <div className="mt-8 text-center">
            {activeImage.work?.title && (
              <h3 className="font-serif italic text-2xl mb-2 text-[#e5e2e1]">{activeImage.work.title}</h3>
            )}
            <span className="font-ui text-[10px] tracking-[0.4em] text-[#e3bebd]/60 uppercase">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
