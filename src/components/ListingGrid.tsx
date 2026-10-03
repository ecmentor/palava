'use client';

import { Listing, ListingCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import ListingCard from './ListingCard';
import { useMemo, useState } from 'react';
import { Store, ArrowDownUp } from 'lucide-react';

interface Props {
  listings: Listing[];
}

const ALL = 'all';

type SortOption = 'recent' | 'price_high' | 'price_low';

const SORT_LABELS: Record<SortOption, string> = {
  recent: 'Recently Added',
  price_high: 'Price: High to Low',
  price_low: 'Price: Low to High',
};

export default function ListingGrid({ listings }: Props) {
  const [activeCategory, setActiveCategory] = useState<ListingCategory | typeof ALL>(ALL);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const categories = Array.from(new Set(listings.map((l) => l.category)));

  const filtered =
    activeCategory === ALL
      ? listings
      : listings.filter((l) => l.category === activeCategory);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'price_high') {
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else {
      list.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [filtered, sortBy]);

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(ALL)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === ALL
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Sort control */}
      <div className="flex justify-end mb-6">
        <div className="relative flex-shrink-0">
          <ArrowDownUp className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none pl-7 pr-7 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Store className="w-10 h-10 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-lg font-medium">No listings yet</p>
          <p className="text-sm mt-1">Be the first to post something!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {sorted.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
