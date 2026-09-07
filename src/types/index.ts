export interface User {
  id: number;
  uuid: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: 'customer' | 'trip_leader' | 'admin' | 'super_admin';
  avatar_url?: string;
  is_verified: boolean;
  reward_points: number;
  created_at: string;
}

export interface TripItinerary {
  id?: number;
  day_number: number;
  title: string;
  description: string;
  accommodation: string;
  meals_included: string;
  sighting_highlights: string;
}

export interface TripInclusion {
  id?: number;
  item_type: 'included' | 'excluded';
  description: string;
}

export interface TripWildlifeSighting {
  id?: number;
  animal_name: string;
  sighting_probability: number;
  best_time_of_day: string;
  notes: string;
}

export interface TripPackingItem {
  id?: number;
  category: 'clothing' | 'gear' | 'documents' | 'health' | 'electronics';
  item_name: string;
  is_essential: boolean;
  description: string;
}

export interface Trip {
  id: number;
  slug: string;
  title: string;
  destination: string;
  country: string;
  tagline: string;
  overview: string;
  total_days: number;
  total_nights: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  featured_image_url: string;
  banner_image_url?: string;
  base_price_kes: number;
  base_price_usd: number;
  deposit_required_kes: number;
  deposit_required_usd: number;
  total_seats: number;
  booked_seats: number;
  departure_date: string;
  return_date: string;
  booking_open: boolean;
  trees_planted_per_booking: number;
  status: 'draft' | 'published' | 'sold_out' | 'completed' | 'cancelled';
  itineraries?: TripItinerary[];
  inclusions?: TripInclusion[];
  sightings?: TripWildlifeSighting[];
  packing?: TripPackingItem[];
}

export interface ParkWeather {
  destination: string;
  temperature_c: number;
  condition: string;
  humidity: number;
  precipitation: string;
  sunrise: string;
  sunset: string;
  game_drive_tip: string;
}

export interface Booking {
  id: number;
  booking_reference: string;
  user_id: number;
  trip_id: number;
  number_of_guests: number;
  guest_details?: any;
  currency: string;
  total_amount: number;
  amount_paid: number;
  outstanding_balance: number;
  deposit_amount: number;
  discount_amount: number;
  booking_status: 'pending' | 'deposit_paid' | 'fully_paid' | 'cancelled' | 'refunded';
  qr_token?: string;
  qr_image_url?: string;
  checked_in: boolean;
  checked_in_at?: string;
  special_requests?: string;
  created_at: string;
  trip_title?: string;
  trip_slug?: string;
  trip_destination?: string;
  trip_image_url?: string;
  trip_departure?: string;
  trip_return?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  payment_type: 'deposit' | 'installment' | 'full_balance';
  gateway: 'mpesa_stk' | 'pesapal' | 'manual_cash';
  transaction_reference: string;
  amount: number;
  currency: string;
  phone_number?: string;
  payment_status: 'initiated' | 'completed' | 'failed';
  created_at: string;
}

export interface TripGroupChat {
  id: number;
  trip_id: number;
  name: string;
  announcement_only: boolean;
  is_active: boolean;
  created_at: string;
  trip_title?: string;
  trip_image?: string;
  departure_date?: string;
  return_date?: string;
  member_count?: number;
  last_message?: string;
}

export interface TripChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  user_id?: number;
  message_type: 'text' | 'image' | 'document' | 'system_announcement';
  message_body: string;
  message_text?: string;
  media_url?: string;
  is_pinned: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
  sender_role?: string;
  reply_to_id?: number;
  reply_body?: string;
  reply_sender?: string;
}

export interface TripChatMember {
  id: number;
  chat_id: number;
  user_id: number;
  role: 'member' | 'admin' | 'leader';
  can_post: boolean;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface TripGallery {
  id: number;
  trip_id: number;
  user_id: number;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  tags?: string;
  is_public: boolean;
  is_approved: boolean;
  created_at: string;
  photographer_name?: string;
  photographer_avatar?: string;
  trip_title?: string;
}

export interface Promotion {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_booking_amount: number;
  max_discount_amount?: number;
  times_used: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface CustomInquiry {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  destinations: string[];
  travel_dates_est: string;
  number_of_guests: number;
  accommodation_style: string;
  budget_range: string;
  special_interests?: string[];
  notes?: string;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'closed';
  created_at: string;
}

export interface TripReview {
  id: number;
  booking_id: number;
  trip_id: number;
  user_id: number;
  rating: number;
  headline: string;
  review_text: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  trip_title?: string;
}

export interface FinancialSummary {
  total_revenue_collected: number;
  total_booking_volume: number;
  total_outstanding_balance: number;
  total_bookings_count: number;
}

export interface PaymentBreakdown {
  gateway: string;
  transaction_count: number;
  total_amount: number;
}

export interface OccupancyItem {
  trip_id: number;
  title: string;
  destination: string;
  total_seats: number;
  booked_seats: number;
  remaining_seats: number;
  occupancy_rate: number;
  status: string;
  departure_date: string;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  tagline: string;
  sub_tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_banner_url: string;
  hero_cta_text: string;
  hero_cta_link: string;
  primary_phone: string;
  secondary_phone: string;
  contact_email: string;
  support_email: string;
  whatsapp_number: string;
  office_address: string;
  office_hours: string;
  live_ticker_text: string;
  trees_planted_count: number;
  local_guides_employed: number;
  acres_protected: number;
  happy_travelers_count: number;
  social_instagram: string;
  social_facebook: string;
  social_twitter: string;
  social_youtube: string;
  social_linkedin: string;
  announcement_banner_text: string;
  announcement_banner_active: boolean;
  about_us_title?: string;
  about_us_story?: string;
  about_us_mission?: string;
  about_us_vision?: string;
  about_us_values?: string;
  terms_and_conditions?: string;
  privacy_policy?: string;
  cancellation_policy?: string;
  trail_safety_policy?: string;
  sustainability_policy?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string; // 'Trail Guides' | 'Camping Tips' | 'Gear & Packing' | 'Adventure Stories' | 'Fitness & Prep'
  tags: string;
  author_name: string;
  author_avatar?: string;
  read_time_minutes: number;
  is_published: boolean;
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SitePolicy {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  content: string;
  icon_name: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
