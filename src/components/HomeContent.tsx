'use client';

import { useState } from 'react';
import { Listing, Banner } from '@/types';
import ServiceBanner from './ServiceBanner';
import ListingGrid from './ListingGrid';
import { ShoppingBag, Wrench } from 'lucide-react';

interface Props {
  items: Listing[]; // everything except "services" category
  services: Listing[]; // only "services" category
  banners: Banner[]; // admin-curated promo carousel slides
}

type Mode = 'buy-sell' | 'services';

export default function HomeContent({ items, services, banners }: Props) {
  const [mode, setMode] = useState<Mode>('services');

  return (
    <div>
      {/* Primary mode toggle */}
      <div className="inline-flex bg-gray-100 rounded-full p-1 mb-6 sm:mb-8 w-full sm:w-auto">
        <button
          onClick={() => setMode('services')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            mode === 'services'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Wrench className="w-4 h-4" strokeWidth={2} />
          Services
          <span className="text-xs font-normal opacity-60">({services.length})</span>
        </button>
        <button
          onClick={() => setMode('buy-sell')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
            mode === 'buy-sell'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={2} />
          Buy &amp; Sell
          <span className="text-xs font-normal opacity-60">({items.length})</span>
        </button>
      </div>

      {mode === 'buy-sell' ? (
        <ListingGrid listings={items} />
      ) : (
        <div>
          <ServiceBanner banners={banners} />
          <ListingGrid listings={services} />
        </div>
      )}
    </div>
  );
}
