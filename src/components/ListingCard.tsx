import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const coverImage = listing.images?.[0];
  const CategoryIcon = CATEGORY_ICONS[listing.category];

  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              <CategoryIcon className="w-10 h-10" strokeWidth={1.5} />
            </div>
          )}
          {listing.is_free && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              FREE
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <CategoryIcon className="w-3.5 h-3.5" strokeWidth={2} />
            {CATEGORY_LABELS[listing.category]}
          </p>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug">
            {listing.title}
          </h3>
          <p className="mt-2 text-blue-600 font-bold text-base">
            {formatPrice(listing.price, listing.is_free)}
          </p>
          <p className="mt-1 text-xs text-gray-400">{formatDate(listing.created_at)}</p>
        </div>
      </div>
    </Link>
  );
}
