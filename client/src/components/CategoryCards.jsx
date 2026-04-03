import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/cmsService';

export default function CategoryCards() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((r) => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-24 px-8 bg-[#080808]">
      <div className={`grid gap-px bg-[#5b4040]/20 max-w-full overflow-hidden`} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
        {categories
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((c, i) => {
            const num = (i + 1).toString().padStart(2, '0');
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <Link
                  to={`/${c.slug}`}
                  className="group relative bg-[#080808] flex flex-col items-center justify-center p-12 text-center transition-all duration-500 overflow-hidden h-full min-h-[250px] w-full"
                  data-cursor-hover
                >
                  {/* Top line hover effect */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#c41e3a] group-hover:w-full transition-all duration-700" />
                  {/* Bottom line */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#c41e3a] group-hover:w-full transition-all duration-700 delay-100" />
                  {/* Red glow bg */}
                  <div className="absolute inset-0 bg-[#c41e3a]/0 group-hover:bg-[#c41e3a]/5 transition-colors duration-500" />

                  {/* Number */}
                  <span className="font-serif text-6xl opacity-10 mb-4 block transition-all duration-500 group-hover:opacity-100 group-hover:text-[#c41e3a]">
                    {num}
                  </span>

                  {/* Label */}
                  <h3 className="font-ui text-sm tracking-[0.3em] uppercase relative z-10 transition-colors duration-300 group-hover:text-[#c41e3a]">
                    {c.name}
                  </h3>
                </Link>
              </motion.div>
            );
        })}
      </div>
    </section>
  );
}
