import { Listing } from '@/types';

/**
 * Returns true if real Supabase credentials have been configured.
 * Used to fall back to mock listings so the UI can be previewed
 * before a Supabase project is connected.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes('your-project-id');
}

const now = new Date().toISOString();

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'mock-1',
    title: 'Samsung 32-inch LED TV',
    description:
      'Barely used Samsung LED TV, bought last year. Moving out of society so selling at a great price. Comes with original remote and box.',
    price: 9500,
    is_free: false,
    category: 'electronics',
    contact_name: 'Rahul Sharma',
    contact_number: '9876543210',
    images: ['/mock/tv1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-2',
    title: 'Wooden Study Table with Chair',
    description:
      'Sturdy wooden study table with a matching chair. Great condition, perfect for kids or work from home setup.',
    price: 2500,
    is_free: false,
    category: 'furniture',
    contact_name: 'Priya Desai',
    contact_number: '9876500000',
    images: ['/mock/table1.svg', '/mock/table2.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-3',
    title: 'Hero Cycle - Kids (6-9 yrs)',
    description:
      'Good condition kids cycle, used for 1 year. Slight scratches but fully functional. Free to a good home!',
    price: null,
    is_free: true,
    category: 'kids',
    contact_name: 'Anita Verma',
    contact_number: '9123456789',
    images: ['/mock/cycle1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-4',
    title: 'Home Tutor for Maths & Science (Grade 6-10)',
    description:
      'Experienced tutor offering home tuitions within the society for Maths and Science, CBSE/ICSE boards. Flexible timing.',
    price: 1500,
    is_free: false,
    category: 'services',
    contact_name: 'Vikram Nair',
    contact_number: '9988776655',
    images: ['/mock/tutor1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-9',
    title: 'AC Repair & Servicing at Your Doorstep',
    description:
      'Quick and reliable AC repair, gas refill, and annual maintenance. Society resident with 5+ years experience. Same-day visits available.',
    price: 499,
    is_free: false,
    category: 'services',
    contact_name: 'Suresh Pawar',
    contact_number: '9654321098',
    images: ['/mock/microwave1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-10',
    title: 'Yoga & Fitness Classes for Residents',
    description:
      'Morning yoga sessions in the clubhouse, open to all age groups. Certified instructor, small batch sizes for personalized attention.',
    price: 1000,
    is_free: false,
    category: 'services',
    contact_name: 'Divya Kapoor',
    contact_number: '9112233445',
    images: ['/mock/cycle1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-5',
    title: 'NCERT Books Set - Class 8',
    description:
      'Complete set of NCERT textbooks for Class 8, all subjects. Good condition, minimal highlighting.',
    price: 600,
    is_free: false,
    category: 'books',
    contact_name: 'Sneha Kulkarni',
    contact_number: '9090909090',
    images: ['/mock/books1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-6',
    title: 'Royal Enfield Classic 350 - 2021',
    description:
      'Single owner, well maintained, all papers clear. Recently serviced. Genuine buyers only please.',
    price: 145000,
    is_free: false,
    category: 'vehicles',
    contact_name: 'Arjun Mehta',
    contact_number: '9345678901',
    images: ['/mock/bike1.svg', '/mock/bike2.svg', '/mock/bike3.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-7',
    title: 'Microwave Oven - IFB 20L',
    description:
      'IFB convection microwave, 20 litre capacity. Works perfectly, selling due to upgrade.',
    price: 3200,
    is_free: false,
    category: 'appliances',
    contact_name: 'Meena Iyer',
    contact_number: '9811122233',
    images: ['/mock/microwave1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-8',
    title: "Women's Winter Jackets (Size M/L)",
    description:
      'Set of 3 winter jackets, lightly used, good quality. Selling as a bundle.',
    price: 800,
    is_free: false,
    category: 'clothing',
    contact_name: 'Kavita Rao',
    contact_number: '9700011122',
    images: ['/mock/jackets1.svg'],
    status: 'approved',
    created_at: now,
    updated_at: now,
  },
];

export function getMockListingById(id: string): Listing | undefined {
  return MOCK_LISTINGS.find((l) => l.id === id);
}

export const MOCK_BANNERS = [
  {
    id: 'mock-banner-1',
    listing_id: 'mock-4',
    image_url: '/mock/tutor1.svg',
    title: 'Home Tutor for Maths & Science',
    subtitle: 'Flexible timing, CBSE/ICSE boards — book a free trial class',
    display_order: 0,
    is_active: true,
    created_at: now,
  },
  {
    id: 'mock-banner-2',
    listing_id: 'mock-9',
    image_url: '/mock/microwave1.svg',
    title: 'AC Repair & Servicing at Your Doorstep',
    subtitle: 'Same-day visits available across Palava Phase 2',
    display_order: 1,
    is_active: true,
    created_at: now,
  },
];
