import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Listing } from '@/types';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { getMockListingById, isSupabaseConfigured } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import InterestButton from '@/components/InterestButton';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data: Listing | undefined;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: dbData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();
    data = dbData ?? undefined;
  } else {
    // No Supabase project connected yet — serve mock listing for UI preview
    data = getMockListingById(id);
  }

  if (!data) notFound();

  const listing: Listing = data;
  const CategoryIcon = CATEGORY_ICONS[listing.category];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Back to listings
      </Link>

      {/* Images */}
      {listing.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 rounded-xl overflow-hidden">
          {listing.images.map((url, i) => (
            <div
              key={url}
              className={`relative aspect-[4/3] bg-gray-100 ${
                i === 0 && listing.images.length > 1 ? 'sm:col-span-2 sm:row-span-2' : ''
              }`}
            >
              <Image src={url} alt={`${listing.title} image ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <CategoryIcon className="w-3.5 h-3.5" strokeWidth={2} />
              {CATEGORY_LABELS[listing.category]}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{listing.title}</h1>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 flex-shrink-0">
            {formatPrice(listing.price, listing.is_free)}
          </p>
        </div>

        <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {listing.description}
        </p>

        <hr className="my-5 border-gray-100" />

        {/* Seller contact */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Seller</p>
          <p className="font-semibold text-gray-900">{listing.contact_name}</p>
          <InterestButton
            listingId={listing.id}
            listingTitle={listing.title}
            sellerName={listing.contact_name}
          />
        </div>

        <p className="text-xs text-gray-400 mt-4">Posted on {formatDate(listing.created_at)}</p>
      </div>
    </div>
  );
}
