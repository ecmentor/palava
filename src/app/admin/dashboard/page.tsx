import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Listing, Inquiry, Banner } from '@/types';
import AdminDashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: inquiryData } = await supabase
    .from('inquiries')
    .select('*, listing:listings(title, contact_name, contact_number)')
    .order('created_at', { ascending: false });

  const { data: bannerData } = await supabase
    .from('banners')
    .select('*, listing:listings(id, title, status)')
    .order('display_order', { ascending: true });

  return (
    <AdminDashboardClient
      listings={(data ?? []) as Listing[]}
      inquiries={(inquiryData ?? []) as Inquiry[]}
      banners={(bannerData ?? []) as Banner[]}
    />
  );
}
