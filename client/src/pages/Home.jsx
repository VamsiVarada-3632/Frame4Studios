import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getHomepage } from '../services/cmsService';
import { getWorks, getWorksCount } from '../services/worksService';
import FeaturedReel from '../components/FeaturedReel';
import CategoryCards from '../components/CategoryCards';
import WorkCard from '../components/WorkCard';
import ServicesMarquee from '../components/ServicesMarquee';
import ContactStrip from '../components/ContactStrip';
import VideoModal from '../components/VideoModal';
import { useVideoModal } from '../hooks/useVideoModal';

export default function Home() {
  const [homepage, setHomepage] = useState(null);
  const [works, setWorks] = useState([]);
  const [featuredWork, setFeaturedWork] = useState(null);
  const [totalWorks, setTotalWorks] = useState(0);
  const { modalWork, openModal, closeModal, isOpen } = useVideoModal();

  useEffect(() => {
    // 1. Fetch CMS homepage settings (for quotes, legacy stats, services)
    getHomepage().then((r) => setHomepage(r.data)).catch(() => {});
    
    // 2. Fetch the latest single featured work from the DB for the Featured Reel
    getWorks({ featured: 'true', limit: 1 })
      .then((r) => {
        if (r.data && r.data.length > 0) {
          setFeaturedWork(r.data[0]);
        }
      })
      .catch(() => {});

    // 3. Fetch recent works for the "Selected Works" section
    getWorks({ limit: 6 }).then((r) => setWorks(r.data)).catch(() => {});

    // 4. Fetch the dynamic true count of total works delivered
    getWorksCount().then((r) => setTotalWorks(r.data?.count || 0)).catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center bg-[#080808] overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 hero-grid opacity-100" />
        {/* Red glow */}
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#c41e3a]/15 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

        {/* Camera brackets */}
        <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-[#c41e3a]/35" />
        <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-[#c41e3a]/35" />
        <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-[#c41e3a]/35" />
        <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-[#c41e3a]/35" />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[13vw] md:text-[10vw] leading-[0.85] font-serif font-light tracking-tighter uppercase mb-6"
          >
            <span className="text-[#c41e3a] italic">FRAME</span> 4
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-serif text-xl md:text-3xl italic text-[#e3bebd]/80 max-w-2xl mx-auto mb-14"
          >
            We frame stories that brands remember.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col md:flex-row gap-5 justify-center items-center"
          >
            <Link
              to="/works"
              className="w-full md:w-auto bg-[#c41e3a] text-white px-10 py-4 font-ui text-sm tracking-[0.2em] transition-all duration-300 hover:bg-[#ffb3b4] hover:text-[#c41e3a] hover:tracking-[0.3em] active:scale-95"
              data-cursor-hover
            >
              VIEW WORKS
            </Link>
            <Link
              to="/contact"
              className="w-full md:w-auto border border-[#5b4040] text-[#e5e2e1] px-10 py-4 font-ui text-sm tracking-[0.2em] transition-all duration-300 hover:border-[#c41e3a] active:scale-95"
              data-cursor-hover
            >
              CONTACT US
            </Link>
          </motion.div>
        </div>

        {/* Rotating badge */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="relative w-28 h-28 flex items-center justify-center animate-[spin_12s_linear_infinite]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <path d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" id="circlePath" />
              <text className="font-ui text-[6px] tracking-[0.4em] fill-[#e3bebd]/50 uppercase">
                <textPath xlinkHref="#circlePath">CREATIVE MEDIA AGENCY · EST. 2020 ·</textPath>
              </text>
            </svg>
            <span className="text-[#c41e3a] text-xl">✦</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-ui text-[9px] tracking-[0.3em] text-[#e3bebd]/40">SCROLL</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#c41e3a]/60 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Reel - dynamically fetched from DB so the user's latest "Mark As Featured" work always shows up here! */}
      <FeaturedReel featuredWork={featuredWork} fallbackHomepageReel={homepage?.featuredReel} onPlay={openModal} />

      {/* Categories */}
      <CategoryCards />

      {/* Selected Works */}
      <section className="py-24 px-8 bg-[#0e0e0e]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <h2 className="font-serif text-5xl md:text-6xl leading-none">Selected Works</h2>
          <Link
            to="/works"
            className="font-ui text-[11px] tracking-[0.3em] text-[#c41e3a] border-b border-[#c41e3a]/50 pb-1 hover:tracking-[0.4em] transition-all"
          >
            VIEW ALL →
          </Link>
        </motion.div>

        {works.length > 0 ? (
          <div className="grid grid-cols-12 gap-5">
            {works.slice(0, 4).map((work, i) => (
              <WorkCard
                key={work._id}
                work={work}
                onPlay={openModal}
                index={i}
                className={i % 3 === 0 ? 'col-span-12 md:col-span-8 aspect-video' : 'col-span-12 md:col-span-4 aspect-[9/11]'}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-[#201f1f] animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* About Strip */}
      <section className="py-32 px-8 bg-[#131313] border-y border-[#5b4040]/15">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="w-16 h-1 bg-[#c41e3a] mx-auto mb-12 rounded-full shadow-[0_0_15px_rgba(196,30,58,0.5)]" />
            <p className="font-serif text-3xl md:text-5xl lg:text-6xl italic leading-relaxed text-[#e5e2e1]">
              {homepage?.quote || '"We don\'t just capture motion; we curate the essence of a brand\'s pulse."'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Marquee */}
      <ServicesMarquee services={homepage?.services} />

      {/* Contact Strip */}
      <ContactStrip />

      {/* Video Modal */}
      {isOpen && <VideoModal work={modalWork} onClose={closeModal} />}
    </>
  );
}
