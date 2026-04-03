import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCategories } from '../services/cmsService';

/**
 * FilterTabs — fetches categories from the DB and renders dynamic filter buttons.
 * Falls back to an empty list (just "ALL") if the API call fails.
 *
 * Props:
 *   active   — current active filter value (slug string)
 *   onChange — (slug) => void  callback when a tab is clicked
 */
export default function FilterTabs({ active, onChange }) {
  const [filters, setFilters] = useState([{ label: 'ALL', value: 'all' }]);

  useEffect(() => {
    getCategories()
      .then((r) => {
        const cats = r.data || [];
        const tabs = [
          { label: 'ALL', value: 'all' },
          ...cats
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((c) => ({
              label: c.name.toUpperCase(),
              value: c.slug.toLowerCase(),
            })),
        ];
        setFilters(tabs);
      })
      .catch(() => {
        // keep the fallback "ALL" tab
      });
  }, []);

  return (
    <div className="flex flex-wrap gap-3 py-6 border-y border-[#5b4040]/20">
      {filters.map(({ label, value }) => {
        const isActive = active === value;
        return (
          <motion.button
            key={value}
            onClick={() => onChange(value)}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 font-ui text-[10px] tracking-[0.25em] transition-all duration-300 ${
              isActive
                ? 'bg-[#c41e3a]/15 border border-[#c41e3a] text-[#c41e3a]'
                : 'border border-[#e5e2e1]/15 text-[#e3bebd] hover:border-[#c41e3a]/50 hover:text-[#ffb3b4]'
            }`}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
