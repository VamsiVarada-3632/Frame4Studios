import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getWorks } from '../services/worksService';
import { getCategories } from '../services/cmsService';
import WorkCard from '../components/WorkCard';
import VideoModal from '../components/VideoModal';
import ImageLightbox from '../components/ImageLightbox';
import ContactStrip from '../components/ContactStrip';
import { useVideoModal } from '../hooks/useVideoModal';

export default function DynamicCategoryPage() {
  const { slug } = useParams();
  
  const [categories, setCategories] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Video player hook
  const { modalWork, openModal, closeModal, isOpen: isVideoOpen } = useVideoModal();
  
  // Lightbox properties
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Load backend categories
  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  // Load works
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getWorks({ category: slug, limit: 20 })
      .then((r) => setWorks(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const currentCategory = categories.find((c) => c.slug.toLowerCase() === slug?.toLowerCase());

  const isPhotography = slug?.toLowerCase() === 'photography';

  // Compute the unrolled massive image catalog array for Photography mode
  const photographyGallery = useMemo(() => {
    if (!isPhotography || !works.length) return [];
    const flat = [];
    works.forEach(w => {
      if (w.photos && w.photos.length > 0) {
        w.photos.forEach(p => {
          flat.push({ src: p.startsWith('http') ? p : `/uploads/${p}`, work: w });
        });
      } else if (w.thumbnail) {
        flat.push({ src: w.thumbnail.startsWith('http') ? w.thumbnail : `/uploads/${w.thumbnail}`, work: w });
      }
    });
    return flat;
  }, [works, isPhotography]);

  // Open the lightbox dynamically exactly where the user clicked
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (categories.length === 0) return null;
  
  if (!currentCategory && categories.length > 0) {
     return <Navigate to="/404" replace />;
  }

  const title = currentCategory.name;
  const tagline = currentCategory.description || `${title} showcase.`;
  const heroImage = currentCategory.thumbnail 
    ? (currentCategory.thumbnail.startsWith('http') ? currentCategory.thumbnail : `/uploads/${currentCategory.thumbnail}`)
    : 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400';

  const others = categories.filter((c) => c.slug !== currentCategory.slug).sort((a,b) => (a.order??0) - (b.order??0));

  return (
    <>
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="px-8 mb-8 flex items-center gap-2 font-ui text-[10px] tracking-[0.3em] text-[#e3bebd]/50">
          <Link to="/" className="hover:text-[#c41e3a] transition-colors">HOME</Link>
          <span className="text-[#c41e3a]">/</span>
          <span className="text-[#e5e2e1]">{title.toUpperCase()}</span>
        </div>

        {/* Hero */}
        <motion.section
          key={slug} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[60vh] w-full overflow-hidden flex flex-col justify-end px-8 pb-16 border-b-[2px] border-[#c41e3a] bg-[#131313]"
        >
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover opacity-35 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] to-transparent" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c41e3a]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />

          <div className="relative z-10 text-right">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif italic font-light text-7xl md:text-[8rem] lg:text-[10rem] leading-none mb-4 uppercase"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-ui tracking-[0.2em] text-[#e3bebd]/60 uppercase max-w-md ml-auto"
            >
              {tagline}
            </motion.p>
          </div>
        </motion.section>

        {/* Content Section / Dual Layout Branching */}
        <section className="px-8 py-20 min-h-[50vh]">
          {loading ? (
            <div className="masonry-grid">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-[#201f1f] animate-pulse rounded-sm" style={{ gridRow: `span ${i % 3 === 0 ? 3 : 2}` }} />
              ))}
            </div>
          ) : isPhotography ? (
            // PHOTOGRAPHY CATALOG LAYOUT
            photographyGallery.length === 0 ? (
              <div className="py-32 text-center h-full flex flex-col items-center justify-center">
                <p className="font-serif italic text-2xl text-[#e3bebd]/40">No photo galleries uploaded yet.</p>
              </div>
            ) : (
                <div className="photo-columns">
                  {photographyGallery.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => openLightbox(i)}
                      className="photo-columns-item relative w-full cursor-pointer overflow-hidden border border-[#5b4040]/10 hover:border-[#c41e3a] transition-all"
                    >
                      <img src={img.src} alt={img.work.title || `Photo ${i}`} className="w-full h-auto block opacity-70 hover:opacity-100 transition-all duration-700 hover:scale-105" />
                    </motion.div>
                  ))}
                </div>
            )
          ) : (
            // STANDARD VIDEO REEL LAYOUT
            works.length === 0 ? (
              <div className="py-32 text-center h-full flex flex-col items-center justify-center">
                <p className="font-serif italic text-2xl text-[#e3bebd]/40">No {title.toLowerCase()} works yet.</p>
              </div>
            ) : (
              <div className="masonry-grid">
                {works.map((work, i) => (
                  <WorkCard
                    key={work._id}
                    work={work}
                    onPlay={openModal}
                    index={i}
                    className={i % 4 === 0 ? 'masonry-span-v' : i % 5 === 2 ? 'masonry-span-h' : ''}
                  />
                ))}
              </div>
            )
          )}
        </section>

        {/* Explore Other Categories */}
        {others.length > 0 && (
          <section className="py-24 bg-[#131313] overflow-hidden border-t border-[#5b4040]/20">
            <div className="px-8 mb-12">
              <h2 className="font-serif italic text-4xl">Explore Other Categories</h2>
              <div className="w-24 h-px bg-[#c41e3a] mt-4" />
            </div>
            <div className="flex overflow-x-auto gap-6 px-8 no-scrollbar pb-8">
              {others.map((cat) => (
                <Link key={cat.slug} to={`/${cat.slug}`} className="flex-none w-72 group">
                  <div className="aspect-[4/5] bg-[#201f1f] overflow-hidden relative border border-[#5b4040]/20 transition-all duration-500 group-hover:border-[#c41e3a]">
                    {cat.thumbnail && (
                      <img 
                        src={cat.thumbnail.startsWith('http') ? cat.thumbnail : `/uploads/${cat.thumbnail}`} 
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100" 
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-[#0e0e0e] to-transparent">
                      <h4 className="font-serif italic text-3xl group-hover:text-[#c41e3a] transition-colors uppercase">{cat.name}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <ContactStrip />

      {isVideoOpen && <VideoModal work={modalWork} onClose={closeModal} />}
      
      {lightboxOpen && (
        <ImageLightbox 
          images={photographyGallery} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxOpen(false)} 
        />
      )}
    </>
  );
}
