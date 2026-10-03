import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SubmitListingPayload } from '@/types';
import { isValidPhone, normalizePhone } from '@/lib/validatePhone';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// GET /api/listings — fetch approved listings (public) or all (admin)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const all = searchParams.get('all'); // admin: fetch all statuses

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (all && user) {
    // Admin: optionally filter by status
    const status = searchParams.get('status');
    if (status) query = query.eq('status', status);
  } else {
    query = query.eq('status', 'approved');
  }

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ listings: data });
}

// POST /api/listings — submit a new listing (public)
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, retryAfterSeconds } = rateLimit(`listings:${ip}`, 5, 15 * 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const supabase = await createClient();
  const body: SubmitListingPayload = await request.json();

  // Validate image count
  if (body.images && body.images.length > 3) {
    return NextResponse.json(
      { error: 'Maximum 3 images allowed' },
      { status: 400 }
    );
  }

  if (!isValidPhone(body.contact_number || '')) {
    return NextResponse.json(
      { error: 'Please enter a valid 10-digit mobile number' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('listings')
    .insert({ ...body, contact_number: normalizePhone(body.contact_number), status: 'pending' });

  // Note: we intentionally don't chain .select() here — PostgREST would try to
  // read back the inserted row for the response, but our RLS SELECT policy only
  // allows reading 'approved' listings. A freshly-submitted row is 'pending',
  // so requesting representation would fail with a misleading RLS error.
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true }, { status: 201 });
}
