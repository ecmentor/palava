import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SubmitInquiryPayload } from '@/types';
import { isValidPhone, normalizePhone } from '@/lib/validatePhone';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// POST /api/inquiries — a buyer expresses interest in a listing (public).
// The seller's phone number is never exposed; admin relays the lead manually.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { success, retryAfterSeconds } = rateLimit(`inquiries:${ip}`, 10, 15 * 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const body: SubmitInquiryPayload = await request.json();

  if (!body.listing_id || !body.buyer_name?.trim() || !body.buyer_phone?.trim()) {
    return NextResponse.json(
      { error: 'Name, phone number and listing are required' },
      { status: 400 }
    );
  }

  if (!isValidPhone(body.buyer_phone)) {
    return NextResponse.json(
      { error: 'Please enter a valid 10-digit mobile number' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from('inquiries').insert({
    listing_id: body.listing_id,
    buyer_name: body.buyer_name.trim(),
    buyer_phone: normalizePhone(body.buyer_phone),
    message: body.message?.trim() || null,
    status: 'new',
  });

  // No .select() here either — public role has insert-only access to
  // inquiries (no SELECT policy), so requesting representation would fail.
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true }, { status: 201 });
}
