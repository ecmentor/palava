'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Banner } from '@/types';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  banners: Banner[];
}

const AUTO_ROTATE_MS = 4500;

// Admin-curated promo carousel — independent of the Services/Buy & Sell
// split. Each slide is a hand-picked image + headline that links through
// to a specific listing, managed from the admin dashboard's Banners tab.
export default function ServiceBanner({ banners }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = banners.length;

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-rotate
  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [next, paused, count]);

  if (count === 0) return null;

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 40) prev();
    else if (delta < -40) next();
    touchStartX.current = null;
  }

  return (
    <section
      className="mb-8 sm:mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" strokeWidth={2} />
          Spotlight
        </h2>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={`/listings/${banner.listing_id}`}
              className="relative w-full flex-shrink-0 min-h-[260px] sm:min-h-[340px] flex items-end"
            >
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative z-10 px-6 py-6 sm:px-10 sm:py-8 max-w-xl">
                <h3 className="text-white text-xl sm:text-3xl font-bold leading-tight">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-white/85 text-sm sm:text-base mt-2 line-clamp-2 max-w-md">
                    {banner.subtitle}
                  </p>
                )}
                <span className="inline-block mt-3 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {count > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prev(); }}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next(); }}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); goTo(i); }}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
