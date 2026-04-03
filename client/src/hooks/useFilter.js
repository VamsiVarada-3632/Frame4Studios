import { useState, useMemo } from 'react';

/**
 * useFilter — supports BOTH legacy `category` (string) and new `categories` (array).
 * A work matches the active filter if:
 *   - activeFilter is 'all', OR
 *   - work.category === activeFilter (legacy), OR
 *   - work.categories includes activeFilter (multi-category array)
 */
export function useFilter(items = [], key = 'category') {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return items;
    const slug = activeFilter.toLowerCase();
    return items.filter((item) => {
      // Legacy single-category check
      const legacyMatch = item[key]?.toLowerCase() === slug;
      // Multi-category array check
      const multiMatch = Array.isArray(item.categories) && item.categories.includes(slug);
      return legacyMatch || multiMatch;
    });
  }, [items, activeFilter, key]);

  return { filtered, activeFilter, setActiveFilter };
}
