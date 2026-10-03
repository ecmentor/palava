import { ShieldCheck } from 'lucide-react';

interface Props {
  listingCount: number;
  serviceCount: number;
  categoryCount: number;
}

export default function Hero({ listingCount, serviceCount, categoryCount }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-6 py-8 sm:px-14 sm:py-16 mb-8 sm:mb-10 flex items-center justify-between gap-6">
      {/* Text content */}
      <div className="max-w-xl relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
          Trusted by Palava Residents
        </span>
        <h1 className="text-gray-900 text-3xl sm:text-5xl font-extrabold mt-4 leading-tight">
          Welcome to Palava Market
        </h1>
        <p className="text-gray-600 text-sm sm:text-lg mt-3 max-w-md">
          Discover homepreneurs, local services, and marketplace essentials across Palava Phase 2.
        </p>
      </div>

      {/* Right stats strip — informative rather than purely decorative */}
      <div className="hidden sm:flex items-center gap-6 lg:gap-8 flex-shrink-0 relative z-10 bg-white/60 rounded-xl px-6 py-5 lg:px-8 lg:py-6">
        <Stat value={listingCount} label="Listings" />
        <div className="w-px h-10 bg-gray-300/60" />
        <Stat value={serviceCount} label="Services" />
        <div className="w-px h-10 bg-gray-300/60" />
        <Stat value={categoryCount} label="Categories" />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
