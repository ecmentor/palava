import { createClient } from '@/lib/supabase/server';
import HomeContent from '@/components/HomeContent';
import Hero from '@/components/Hero';
import { Listing, Banner, isServiceCategory } from '@/types';
import { MOCK_LISTINGS, MOCK_BANNERS, isSupabaseConfigured } from '@/lib/mockData';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let listings: Listing[] = [];
  let banners: Banner[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    listings = data ?? [];

    const { data: bannerData } = await supabase
      .from('banners')
      .select('*, listing:listings(id, title, status)')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    // Only show slides whose linked listing is still publicly approved
    banners = (bannerData ?? []).filter((b) => b.listing?.status === 'approved') as Banner[];
  } else {
    // No Supabase project connected yet — show mock data for UI preview
    listings = MOCK_LISTINGS;
    banners = MOCK_BANNERS;
  }

  const items = listings.filter((l) => !isServiceCategory(l.category));
  const services = listings.filter((l) => isServiceCategory(l.category));
  const categoryCount = new Set(listings.map((l) => l.category)).size;

  return (
    <div>
      <Hero
        listingCount={listings.length}
        serviceCount={services.length}
        categoryCount={categoryCount}
      />
      <HomeContent items={items} services={services} banners={banners} />
    </div>
  );
}
