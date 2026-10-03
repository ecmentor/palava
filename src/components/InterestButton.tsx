'use client';

import { useState } from 'react';
import { X, MessageCircleHeart, Loader2, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/mockData';
import { isValidPhone, normalizePhone } from '@/lib/validatePhone';

interface Props {
  listingId: string;
  listingTitle: string;
  sellerName: string;
}

export default function InterestButton({ listingId, listingTitle, sellerName }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function close() {
    setOpen(false);
    // Reset after close animation settles
    setTimeout(() => {
      setDone(false);
      setName('');
      setPhone('');
      setMessage('');
      setError('');
    }, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number');
      return;
    }

    if (!isValidPhone(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);

    if (!isSupabaseConfigured()) {
      // Demo mode — no backend connected yet
      await new Promise((r) => setTimeout(r, 400));
      setSubmitting(false);
      setDone(true);
      return;
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          buyer_name: name.trim(),
          buyer_phone: normalizePhone(phone),
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
      >
        <MessageCircleHeart className="w-4 h-4" strokeWidth={2} />
        I&apos;m Interested
      </button>
      <p className="text-xs text-gray-400 mt-2">
        Share your number and our team will connect you with {sellerName.split(' ')[0]}.
      </p>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={close}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm p-5 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {done ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" strokeWidth={1.5} />
                <h3 className="font-bold text-gray-900 text-lg">Interest sent!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Our admin team will pass your number to {sellerName.split(' ')[0]} shortly.
                </p>
                <button
                  onClick={close}
                  className="mt-4 text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-bold text-gray-900 text-lg">I&apos;m Interested</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-1">{listingTitle}</p>

                <label className="block text-xs font-medium text-gray-600 mb-1">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Jadhav"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-xs font-medium text-gray-600 mb-1">Your phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Message <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a question, suggest a time to connect, etc."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />}
                  Send my interest
                </button>
                <p className="text-[11px] text-gray-400 mt-2 text-center">
                  Your number is shared only with our admin team, never posted publicly.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
