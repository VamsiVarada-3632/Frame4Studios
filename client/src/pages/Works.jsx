import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorks } from '../services/worksService';
import WorkCard from '../components/WorkCard';
import FilterTabs from '../components/FilterTabs';
import VideoModal from '../components/VideoModal';
import ContactStrip from '../components/ContactStrip';
import { useVideoModal } from '../hooks/useVideoModal';
import { useFilter } from '../hooks/useFilter';

export default function Works() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { modalWork, openModal, closeModal, isOpen } = useVideoModal();
  const { filtered, activeFilter, setActiveFilter } = useFilter(works);

  useEffect(() => {
    setLoading(true);
    getWorks({ limit: 50 })
      .then((r) => setWorks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <main className="pt-32">
        <section className="px-8 mb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-ui text-[10px] tracking-[0.25em] text-[#e3bebd]/50 mb-8">
            <span>HOME</span>
            <span className="text-[#c41e3a]">/</span>
            <span className="text-[#e5e2e1]">WORKS</span>
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-serif text-6xl md:text-8xl font-light leading-none mb-10"
          >
            All Our <span className="italic text-[#c41e3a]">Works</span>
          </motion.h1>

          <FilterTabs active={activeFilter} onChange={setActiveFilter} />
        </section>

        {/* Grid */}
        <section className="px-8 pb-24">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-video bg-[#201f1f] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-serif italic text-2xl text-[#e3bebd]/40">No works in this category yet.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-12 gap-5 items-start"
              >
                {filtered.map((work, i) => {
                  const isLarge = i % 5 === 0;
                  return (
                    <WorkCard
                      key={work._id}
                      work={work}
                      onPlay={openModal}
                      index={i}
                      className={
                        isLarge
                          ? 'col-span-12 md:col-span-8 aspect-[16/10]'
                          : i % 5 === 1
                          ? 'col-span-12 md:col-span-4 aspect-[16/10]'
                          : 'col-span-12 md:col-span-6 aspect-[16/10]'
                      }
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      <ContactStrip />

      {isOpen && <VideoModal work={modalWork} onClose={closeModal} />}
    </>
  );
}
