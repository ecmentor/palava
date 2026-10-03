'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingCategory, CATEGORY_LABELS, SubmitListingPayload, isServiceCategory } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import { PartyPopper, ShoppingBag, Wrench, ArrowLeft } from 'lucide-react';
import { isValidPhone, normalizePhone } from '@/lib/validatePhone';

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS) as [ListingCategory, string][];
const ITEM_CATEGORIES = ALL_CATEGORIES.filter(([value]) => !isServiceCategory(value));
const SERVICE_CATEGORY_OPTIONS = ALL_CATEGORIES.filter(([value]) => isServiceCategory(value));

type PostType = 'product' | 'service';

export default function SubmitPage() {
  const router = useRouter();
  const [postType, setPostType] = useState<PostType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as ListingCategory | '',
    price: '',
    is_free: false,
    contact_name: '',
    contact_number: '',
  });

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function chooseType(type: PostType) {
    setPostType(type);
    setForm((f) => ({ ...f, category: '' }));
  }

  function backToTypeSelection() {
    setPostType(null);
    setError('');
  }

  const isService = postType === 'service';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.category) {
      setError(isService ? 'Please select a service type.' : 'Please select a category.');
      return;
    }

    if (!isValidPhone(form.contact_number)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const isFree = isService ? false : form.is_free;

    const payload: SubmitListingPayload = {
      title: form.title,
      description: form.description,
      category: form.category as ListingCategory,
      price: isFree || !form.price ? null : parseFloat(form.price),
      is_free: isFree,
      contact_name: form.contact_name,
      contact_number: normalizePhone(form.contact_number),
      images,
    };

    setSubmitting(true);
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.');
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <PartyPopper className="w-14 h-14 mx-auto mb-4 text-amber-500" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Submitted!</h2>
        <p className="text-gray-500 mb-6">
          Your listing is under review. It will appear once approved by the admin.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  // Step 1 — choose what kind of listing to post
  if (!postType) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">What would you like to post?</h1>
        <p className="text-gray-500 text-sm mb-8">
          Choose an option to see the relevant form.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => chooseType('product')}
            className="text-left bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 transition-colors group"
          >
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              <ShoppingBag className="w-5 h-5" strokeWidth={2} />
            </div>
            <h3 className="font-semibold text-gray-900">Sell a Product</h3>
            <p className="text-sm text-gray-500 mt-1">
              Furniture, electronics, vehicles, books, and other items you want to sell or give away.
            </p>
          </button>

          <button
            type="button"
            onClick={() => chooseType('service')}
            className="text-left bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 transition-colors group"
          >
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
              <Wrench className="w-5 h-5" strokeWidth={2} />
            </div>
            <h3 className="font-semibold text-gray-900">Promote a Service</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tutoring, home repair, fitness, cleaning, or any service you offer to residents.
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        type="button"
        onClick={backToTypeSelection}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Change type
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {isService ? 'Promote a Service' : 'Sell a Product'}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Your listing will be reviewed before it goes live.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isService ? 'Service Name *' : 'Title *'}
          </label>
          <input
            type="text"
            required
            maxLength={100}
            placeholder={isService ? 'e.g. Home Tutor for Maths & Science' : 'e.g. Samsung 32-inch LED TV'}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isService ? 'Service Type *' : 'Category *'}
          </label>
          <select
            required
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">{isService ? 'Select a service type' : 'Select a category'}</option>
            {(isService ? SERVICE_CATEGORY_OPTIONS : ITEM_CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            maxLength={1000}
            placeholder={
              isService
                ? 'Describe what you offer, your experience, and availability.'
                : 'Describe the item — condition, reason for selling, etc.'
            }
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isService ? 'Starting Price' : 'Price'}
          </label>
          {!isService && (
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_free}
                  onChange={(e) => set('is_free', e.target.checked)}
                  className="rounded"
                />
                This item is free
              </label>
            </div>
          )}
          {!(form.is_free && !isService) && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder={isService ? 'Leave blank for "Price on request"' : '0 for negotiable'}
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos {isService && <span className="text-gray-400 font-normal">(optional)</span>}
          </label>
          <ImageUpload images={images} onChange={setImages} maxImages={3} />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              required
              placeholder="Full name"
              value={form.contact_name}
              onChange={(e) => set('contact_name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Phone *</label>
            <input
              type="tel"
              required
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={form.contact_number}
              onChange={(e) => set('contact_number', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  );
}
