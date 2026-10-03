import Image from 'next/image';
import Link from 'next/link';
import { MessagesSquare, LayoutGrid, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About — Palava Market',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
          Our Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">About Palava Market</h1>
        <p className="text-gray-600 mt-3 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          A small idea born out of a very common township problem — too many WhatsApp groups,
          too many messages, and genuinely useful posts getting buried in minutes.
        </p>
      </div>

      {/* Why section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Why this exists</h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
          Every day, residents post things for sale, services they offer, or things they&apos;re
          looking for — all scattered across random WhatsApp groups. It spams everyone&apos;s
          phone, and within minutes a good post is buried under unrelated messages, never to be
          found again.
        </p>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Palava Market is an initiative to fix exactly that: one simple, lightweight place for our
          township to buy, sell, and discover local services — without flooding anyone&apos;s
          WhatsApp, and without anything getting lost. Everything in one place, easy to browse,
          easy to find.
        </p>
      </div>

      {/* What it solves */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-50 rounded-xl p-5 text-center">
          <MessagesSquare className="w-7 h-7 mx-auto mb-2 text-indigo-600" strokeWidth={1.75} />
          <p className="text-sm font-semibold text-gray-900">No more spam</p>
          <p className="text-xs text-gray-500 mt-1">Keeps WhatsApp groups free of clutter</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 text-center">
          <LayoutGrid className="w-7 h-7 mx-auto mb-2 text-indigo-600" strokeWidth={1.75} />
          <p className="text-sm font-semibold text-gray-900">Everything in one place</p>
          <p className="text-xs text-gray-500 mt-1">Items, services &amp; more, easy to browse</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5 text-center">
          <ShieldCheck className="w-7 h-7 mx-auto mb-2 text-indigo-600" strokeWidth={1.75} />
          <p className="text-sm font-semibold text-gray-900">Safe &amp; moderated</p>
          <p className="text-xs text-gray-500 mt-1">Every listing is reviewed before it goes live</p>
        </div>
      </div>

      {/* Creator */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white shadow-sm">
          <Image src="/about/profile.jpg" alt="Apoorva" fill className="object-cover" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
            Built &amp; maintained by
          </p>
          <h3 className="text-xl font-bold text-gray-900">Apoorva</h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            A fellow resident who got tired of scrolling past buried WhatsApp messages and
            decided to build a better way for our township to connect — one listing at a time.
          </p>
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Post your first listing
        </Link>
      </div>
    </div>
  );
}
