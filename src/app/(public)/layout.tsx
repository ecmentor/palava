import Navbar from '@/components/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Palava Market · Society Marketplace
      </footer>
    </>
  );
}
