import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SubmitBannerPayload } from '@/types';

// GET /api/banners — public: active banners, ordered for the carousel.
// Admin (?all=1) gets every banner regardless of is_active, for management.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from('banners')
    .select('*, listing:listings(id, title, status)')
    .order('display_order', { ascending: true });

  if (!(all && user)) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Only show slides whose linked listing is still publicly approved
  // (unless this is an authenticated admin management request).
  const banners = (all && user)
    ? data
    : (data ?? []).filter((b) => b.listing?.status === 'approved');

  return NextResponse.json({ banners });
}

// POST /api/banners — admin only: add a new carousel slide
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: SubmitBannerPayload = await request.json();

  if (!body.listing_id || !body.image_url || !body.title?.trim()) {
    return NextResponse.json(
      { error: 'Listing, image, and title are required' },
      { status: 400 }
    );
  }

  // New slide goes to the end of the order
  const { count } = await supabase
    .from('banners')
    .select('*', { count: 'exact', head: true });

  const { data, error } = await supabase
    .from('banners')
    .insert({
      listing_id: body.listing_id,
      image_url: body.image_url,
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || null,
      display_order: count ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ banner: data }, { status: 201 });
}
