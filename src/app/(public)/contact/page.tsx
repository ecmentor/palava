import { Mail, Phone, MessagesSquare, Megaphone } from 'lucide-react';

export const metadata = {
  title: 'Contact — Palava Market',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <MessagesSquare className="w-3.5 h-3.5" strokeWidth={2.5} />
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-3 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Have a question, found an issue, or want to report a listing? Reach out — we&apos;re
          happy to help.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Email</p>
            <p className="text-sm text-gray-600 mt-0.5">hello@palavamarket.com</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Phone / WhatsApp</p>
            <p className="text-sm text-gray-600 mt-0.5">+91 00000 00000</p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        We typically respond within a day.
      </p>

      {/* Business promo / banner inquiries */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 sm:p-8 mt-8">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Want to Promote Your Business?</h2>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              Get featured in our homepage banner carousel — seen by every resident browsing
              Palava Market. Great for local shops, service providers, and businesses looking to
              reach the township directly.
            </p>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              Reach out to us at the contact details above with your business name and what
              you&apos;d like to promote, and we&apos;ll get you featured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
