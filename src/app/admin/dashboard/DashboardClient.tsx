'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Listing, ListingStatus, Inquiry, InquiryStatus, Banner, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types';
import { formatPrice, formatDate, formatPhone } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import {
  Building2, Check, X, Trash2, CheckCircle2, Phone, MessageCircleHeart,
  Sparkles, ArrowUp, ArrowDown, Eye, EyeOff, Plus,
} from 'lucide-react';

const STATUS_FILTERS: { label: string; value: ListingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const STATUS_COLORS: Record<ListingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-amber-100 text-amber-800',
  closed: 'bg-gray-100 text-gray-600',
};

export default function AdminDashboardClient({
  listings: initial,
  inquiries: initialInquiries,
  banners: initialBanners,
}: {
  listings: Listing[];
  inquiries: Inquiry[];
  banners: Banner[];
}) {
  const router = useRouter();
  const [listings, setListings] = useState(initial);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [banners, setBanners] = useState(initialBanners);
  const [tab, setTab] = useState<'listings' | 'inquiries' | 'banners'>('listings');
  const [filter, setFilter] = useState<ListingStatus | 'all'>('pending');
  const [loading, setLoading] = useState<string | null>(null);

  // New banner form state
  const [newBannerListingId, setNewBannerListingId] = useState('');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImages, setNewBannerImages] = useState<string[]>([]);
  const [bannerSubmitting, setBannerSubmitting] = useState(false);
  const [bannerError, setBannerError] = useState('');

  const approvedListings = listings.filter((l) => l.status === 'approved');

  const filtered = filter === 'all' ? listings : listings.filter((l) => l.status === filter);
  const pendingCount = listings.filter((l) => l.status === 'pending').length;
  const newInquiryCount = inquiries.filter((i) => i.status === 'new').length;

  async function updateStatus(id: string, status: ListingStatus) {
    setLoading(id);
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    if (res.ok) {
      setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    }
  }

  async function deleteListing(id: string) {
    if (!confirm('Delete this listing permanently?')) return;
    setLoading(id);
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    setLoading(null);
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  async function updateInquiryStatus(id: string, status: InquiryStatus) {
    setLoading(id);
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    if (res.ok) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    }
  }

  async function deleteInquiry(id: string) {
    if (!confirm('Delete this inquiry?')) return;
    setLoading(id);
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    setLoading(null);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  }

  async function addBanner(e: React.FormEvent) {
    e.preventDefault();
    setBannerError('');

    if (!newBannerListingId || !newBannerTitle.trim() || newBannerImages.length === 0) {
      setBannerError('Please select a listing, add an image, and enter a title.');
      return;
    }

    setBannerSubmitting(true);
    const res = await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listing_id: newBannerListingId,
        image_url: newBannerImages[0],
        title: newBannerTitle.trim(),
        subtitle: newBannerSubtitle.trim() || undefined,
      }),
    });
    const data = await res.json();
    setBannerSubmitting(false);

    if (!res.ok) {
      setBannerError(data.error || 'Something went wrong. Please try again.');
      return;
    }

    setBanners((prev) => [...prev, data.banner]);
    setNewBannerListingId('');
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImages([]);
  }

  async function toggleBannerActive(banner: Banner) {
    setLoading(banner.id);
    const res = await fetch(`/api/banners/${banner.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !banner.is_active }),
    });
    setLoading(null);
    if (res.ok) {
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
      );
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm('Remove this slide from the carousel?')) return;
    setLoading(id);
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    setLoading(null);
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }

  async function moveBanner(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const sorted = [...banners].sort((a, b) => a.display_order - b.display_order);
    const a = sorted[index];
    const b = sorted[targetIndex];

    setLoading(a.id);
    await Promise.all([
      fetch(`/api/banners/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: b.display_order }),
      }),
      fetch(`/api/banners/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: a.display_order }),
      }),
    ]);
    setLoading(null);

    setBanners((prev) =>
      prev.map((banner) => {
        if (banner.id === a.id) return { ...banner, display_order: b.display_order };
        if (banner.id === b.id) return { ...banner, display_order: a.display_order };
        return banner;
      })
    );
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-900" strokeWidth={2} />
          <span className="font-bold text-gray-900">Admin Dashboard</span>
          {pendingCount > 0 && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {pendingCount}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Main tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('listings')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'listings' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setTab('inquiries')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'inquiries' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageCircleHeart className="w-4 h-4" strokeWidth={2} />
            Inquiries
            {newInquiryCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {newInquiryCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('banners')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'banners' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            Banners
          </button>
        </div>

        {tab === 'listings' ? (
        <>
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(({ label, value }) => {
            const count = value === 'all' ? listings.length : listings.filter((l) => l.status === value).length;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Listings */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2" strokeWidth={1.5} />
            <p>No listings in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
              >
                {/* Image thumbnail */}
                <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {listing.images?.[0] ? (
                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      {(() => {
                        const CategoryIcon = CATEGORY_ICONS[listing.category];
                        return <CategoryIcon className="w-8 h-8" strokeWidth={1.5} />;
                      })()}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[listing.status]}`}
                      >
                        {listing.status}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-1">{listing.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {(() => {
                          const CategoryIcon = CATEGORY_ICONS[listing.category];
                          return <CategoryIcon className="w-3.5 h-3.5" strokeWidth={2} />;
                        })()}
                        {CATEGORY_LABELS[listing.category]} ·{' '}
                        {formatPrice(listing.price, listing.is_free)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(listing.created_at)}</p>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{listing.description}</p>

                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-medium">{listing.contact_name}</span> ·{' '}
                    {formatPhone(listing.contact_number)}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {listing.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(listing.id, 'approved')}
                        disabled={loading === listing.id}
                        className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Approve
                      </button>
                    )}
                    {listing.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(listing.id, 'rejected')}
                        disabled={loading === listing.id}
                        className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Reject
                      </button>
                    )}
                    {listing.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(listing.id, 'approved')}
                        disabled={loading === listing.id}
                        className="hidden"
                      />
                    )}
                    <button
                      onClick={() => deleteListing(listing.id)}
                      disabled={loading === listing.id}
                      className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
        ) : tab === 'inquiries' ? (
          <>
            {/* Inquiries */}
            {inquiries.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <MessageCircleHeart className="w-10 h-10 mx-auto mb-2" strokeWidth={1.5} />
                <p>No inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${INQUIRY_STATUS_COLORS[inquiry.status]}`}
                        >
                          {inquiry.status}
                        </span>
                        <h3 className="font-semibold text-gray-900 mt-1">
                          {inquiry.listing?.title ?? 'Listing removed'}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(inquiry.created_at)}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">
                          Interested buyer
                        </p>
                        <p className="text-sm font-medium text-gray-900">{inquiry.buyer_name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                          {formatPhone(inquiry.buyer_phone)}
                        </p>
                        {inquiry.message && (
                          <p className="text-xs text-gray-500 mt-1.5 italic">&ldquo;{inquiry.message}&rdquo;</p>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium mb-1">
                          Seller (relay this lead to)
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {inquiry.listing?.contact_name ?? '—'}
                        </p>
                        {inquiry.listing?.contact_number && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                            {formatPhone(inquiry.listing.contact_number)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {inquiry.status !== 'contacted' && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}
                          disabled={loading === inquiry.id}
                          className="flex items-center gap-1 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Mark Contacted
                        </button>
                      )}
                      {inquiry.status !== 'closed' && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'closed')}
                          disabled={loading === inquiry.id}
                          className="flex items-center gap-1 text-xs bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
                        disabled={loading === inquiry.id}
                        className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Banners — admin-curated promo carousel */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add a carousel slide
              </h3>
              <form onSubmit={addBanner} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Linked listing *</label>
                  <select
                    value={newBannerListingId}
                    onChange={(e) => setNewBannerListingId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select an approved listing</option>
                    {approvedListings.map((l) => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slide image *</label>
                  <ImageUpload images={newBannerImages} onChange={setNewBannerImages} maxImages={1} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Headline *</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="e.g. AC Repair & Servicing at Your Doorstep"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Subtitle <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={150}
                    value={newBannerSubtitle}
                    onChange={(e) => setNewBannerSubtitle(e.target.value)}
                    placeholder="e.g. Same-day visits available across Palava Phase 2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {bannerError && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {bannerError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={bannerSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {bannerSubmitting ? 'Adding…' : 'Add Slide'}
                </button>
              </form>
            </div>

            {banners.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Sparkles className="w-10 h-10 mx-auto mb-2" strokeWidth={1.5} />
                <p>No carousel slides yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...banners]
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((banner, i, arr) => (
                    <div
                      key={banner.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="relative w-full sm:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={banner.image_url} alt={banner.title} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                banner.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {banner.is_active ? 'Active' : 'Hidden'}
                            </span>
                            <h3 className="font-semibold text-gray-900 mt-1">{banner.title}</h3>
                            {banner.subtitle && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{banner.subtitle}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Links to: {banner.listing?.title ?? 'Listing removed'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            onClick={() => moveBanner(i, -1)}
                            disabled={i === 0 || loading === banner.id}
                            className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40"
                          >
                            <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => moveBanner(i, 1)}
                            disabled={i === arr.length - 1 || loading === banner.id}
                            className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40"
                          >
                            <ArrowDown className="w-3.5 h-3.5" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => toggleBannerActive(banner)}
                            disabled={loading === banner.id}
                            className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50"
                          >
                            {banner.is_active ? (
                              <><EyeOff className="w-3.5 h-3.5" strokeWidth={2} /> Hide</>
                            ) : (
                              <><Eye className="w-3.5 h-3.5" strokeWidth={2} /> Show</>
                            )}
                          </button>
                          <button
                            onClick={() => deleteBanner(banner.id)}
                            disabled={loading === banner.id}
                            className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
