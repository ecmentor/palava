import {
  Smartphone,
  Sofa,
  Car,
  BookOpen,
  Plug,
  Baby,
  Shirt,
  Wrench,
  Package,
  GraduationCap,
  Hammer,
  Dumbbell,
  Scissors,
  SprayCan,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export type ListingCategory =
  | 'electronics'
  | 'furniture'
  | 'vehicles'
  | 'books'
  | 'appliances'
  | 'kids'
  | 'clothing'
  | 'other'
  // Service sub-categories — anything in this list is treated as a
  // "service" for the Services/Buy & Sell homepage split (see
  // SERVICE_CATEGORIES below). 'services' is kept as the general/
  // catch-all bucket so existing listings stay valid.
  | 'services'
  | 'tutoring'
  | 'home_repair'
  | 'fitness_wellness'
  | 'beauty_grooming'
  | 'cleaning'
  | 'food_tiffin';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number | null;
  is_free: boolean;
  category: ListingCategory;
  contact_name: string;
  contact_number: string;
  images: string[];
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface SubmitListingPayload {
  title: string;
  description: string;
  price: number | null;
  is_free: boolean;
  category: ListingCategory;
  contact_name: string;
  contact_number: string;
  images: string[];
}

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface Inquiry {
  id: string;
  listing_id: string;
  buyer_name: string;
  buyer_phone: string;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
  // Joined from listings table when fetched by admin
  listing?: Pick<Listing, 'title' | 'contact_name' | 'contact_number'>;
}

export interface SubmitInquiryPayload {
  listing_id: string;
  buyer_name: string;
  buyer_phone: string;
  message?: string;
}

export interface Banner {
  id: string;
  listing_id: string;
  image_url: string;
  title: string;
  subtitle: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  // Joined from listings table when fetched
  listing?: Pick<Listing, 'id' | 'title' | 'status'>;
}

export interface SubmitBannerPayload {
  listing_id: string;
  image_url: string;
  title: string;
  subtitle?: string;
}

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  electronics: 'Electronics',
  furniture: 'Furniture',
  vehicles: 'Vehicles',
  books: 'Books & Stationery',
  appliances: 'Home Appliances',
  kids: 'Kids & Baby',
  clothing: 'Clothing',
  other: 'Other',
  services: 'Other Services',
  tutoring: 'Tutoring',
  home_repair: 'Home Repair',
  fitness_wellness: 'Fitness & Wellness',
  beauty_grooming: 'Beauty & Grooming',
  cleaning: 'Cleaning',
  food_tiffin: 'Homemade Food',
};

export const CATEGORY_ICONS: Record<ListingCategory, LucideIcon> = {
  electronics: Smartphone,
  furniture: Sofa,
  vehicles: Car,
  books: BookOpen,
  appliances: Plug,
  kids: Baby,
  clothing: Shirt,
  other: Package,
  services: Wrench,
  tutoring: GraduationCap,
  home_repair: Hammer,
  fitness_wellness: Dumbbell,
  beauty_grooming: Scissors,
  cleaning: SprayCan,
  food_tiffin: UtensilsCrossed,
};

// Categories that belong to the "Services" tab (vs "Buy & Sell").
// Used instead of a separate DB column so existing listings/queries
// keep working — just check membership in this list.
export const SERVICE_CATEGORIES: ListingCategory[] = [
  'services',
  'tutoring',
  'home_repair',
  'fitness_wellness',
  'beauty_grooming',
  'cleaning',
  'food_tiffin',
];

export function isServiceCategory(category: ListingCategory): boolean {
  return SERVICE_CATEGORIES.includes(category);
}
