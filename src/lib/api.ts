import { Trip, ParkWeather, Booking, Payment, TripGroupChat, TripChatMessage, TripChatMember, TripGallery, Promotion, CustomInquiry, TripReview, FinancialSummary, PaymentBreakdown, OccupancyItem, User, SiteSettings, BlogPost, SitePolicy } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiService {
  private refreshPromise: Promise<string | null> | null = null;

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('kibali_access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('kibali_refresh_token');
  }

  public async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearAuth();
        return null;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          this.clearAuth();
          return null;
        }

        const data = await response.json();
        if (data.access_token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('kibali_access_token', data.access_token);
            if (data.refresh_token) {
              localStorage.setItem('kibali_refresh_token', data.refresh_token);
            }
            if (data.user) {
              localStorage.setItem('kibali_user', JSON.stringify(data.user));
            }
            window.dispatchEvent(
              new CustomEvent('kibali_token_refreshed', {
                detail: { token: data.access_token, user: data.user },
              })
            );
          }
          return data.access_token;
        }

        this.clearAuth();
        return null;
      } catch {
        this.clearAuth();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kibali_access_token');
      localStorage.removeItem('kibali_refresh_token');
      localStorage.removeItem('kibali_user');
      window.dispatchEvent(new Event('kibali_auth_logout'));
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const startTime = Date.now();
    const method = options.method || 'GET';
    let token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    console.log(`[API ${method} Request] ${API_BASE_URL}${endpoint}`, {
      hasAuth: Boolean(token),
      headers,
    });

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const duration = Date.now() - startTime;
    console.log(`[API ${method} Response ${response.status}] ${endpoint} (${duration}ms)`);

    // Check for 401 Unauthorized or Token Expiry
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh')) {
      console.warn(`[API 401] Token expired or unauthorized for ${endpoint}. Attempting refresh...`);
      const errorData = await response.json().catch(() => ({}));
      const errMsg = errorData.error || '';

      // Attempt automatic token refresh
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        console.log(`[API 401 Recovered] Refresh succeeded. Retrying ${endpoint}...`);
        // Retry the original request with the new access token
        const retryHeaders: HeadersInit = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders,
        });
      } else {
        console.error(`[API 401 Refresh Failed] Session expired on ${endpoint}`);
        throw new Error(errMsg || 'Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[API Error ${response.status}] ${endpoint}:`, errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API Data Parsed] ${endpoint}:`, data);
    return data;
  }

  // --- SITE SETTINGS CMS ---
  async getSiteSettings(): Promise<SiteSettings> {
    const res = await this.request<{ settings: SiteSettings }>('/settings');
    return res.settings;
  }

  async updateSiteSettings(settings: SiteSettings): Promise<{ message: string; settings: SiteSettings }> {
    return await this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // --- DYNAMIC SITE POLICIES ---
  async getPublicPolicies(): Promise<SitePolicy[]> {
    const res = await this.request<{ policies: SitePolicy[] }>('/policies');
    return res.policies || [];
  }

  async getAllPoliciesAdmin(): Promise<SitePolicy[]> {
    const res = await this.request<{ policies: SitePolicy[] }>('/admin/policies');
    return res.policies || [];
  }

  async createPolicy(policyData: Partial<SitePolicy>): Promise<{ message: string; policy: SitePolicy }> {
    return await this.request('/admin/policies', {
      method: 'POST',
      body: JSON.stringify(policyData),
    });
  }

  async updatePolicy(id: number, policyData: Partial<SitePolicy>): Promise<{ message: string; policy: SitePolicy }> {
    return await this.request(`/admin/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(policyData),
    });
  }

  async deletePolicy(id: number): Promise<{ message: string }> {
    return await this.request(`/admin/policies/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePolicyActive(id: number, isActive: boolean): Promise<{ message: string; is_active: boolean }> {
    return await this.request(`/admin/policies/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  }

  // --- TRIPS CATALOG & DETAILS ---
  async getTrips(params?: {
    destination?: string;
    difficulty?: string;
    category?: string;
    search?: string;
    status?: string;
    sort_by?: string;
    currency?: string;
    limit?: number;
    offset?: number;
  }): Promise<Trip[]> {
    const query = new URLSearchParams();
    if (params?.destination && params.destination !== 'All') query.append('destination', params.destination);
    if (params?.difficulty && params.difficulty !== 'All') query.append('difficulty', params.difficulty);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.currency) query.append('currency', params.currency);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ trips: Trip[] }>(`/trips${qs}`);
    return res.trips || [];
  }

  async getTripBySlug(slug: string): Promise<Trip> {
    const res = await this.request<any>(`/trips/${slug}`);
    return res?.trip || res;
  }

  async getWeather(destination: string): Promise<ParkWeather> {
    return await this.request<ParkWeather>(`/weather?destination=${encodeURIComponent(destination)}`);
  }

  async getCurrencyRates(): Promise<Record<string, number>> {
    return await this.request<Record<string, number>>('/currency/rates');
  }

  // --- ADMIN TRIPS CRUD ---
  async getAllTripsAdmin(params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ trips: Trip[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ trips: Trip[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/trips${qs}`);
    return {
      trips: res.trips || [],
      total: res.total ?? (res.trips ? res.trips.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  async createTrip(tripData: Partial<Trip>): Promise<Trip> {
    return await this.request<Trip>('/admin/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async updateTrip(id: number, tripData: Partial<Trip>): Promise<{ message: string; trip: Trip }> {
    return await this.request(`/admin/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(id: number): Promise<{ message: string }> {
    return await this.request(`/admin/trips/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTripBooking(id: number, bookingOpen: boolean): Promise<{ message: string; booking_open: boolean }> {
    return await this.request(`/admin/trips/${id}/toggle-booking`, {
      method: 'PATCH',
      body: JSON.stringify({ booking_open: bookingOpen }),
    });
  }

  // --- BOOKINGS ---
  async createBooking(bookingData: {
    trip_id: number;
    number_of_guests: number;
    currency: string;
    guest_details?: any;
    special_requests?: string;
    payment_choice?: string;
    custom_amount?: number;
    payment_method?: string;
    phone_number?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    promo_code?: string;
  }): Promise<{
    booking: Booking;
    payment?: {
      method: string;
      initial_payment_due: number;
      status: string;
      checkout_request_id?: string;
      merchant_request_id?: string;
      customer_message?: string;
      order_tracking_id?: string;
      redirect_url?: string;
      error?: string;
    };
    initial_payment_due: number;
    min_deposit_required: number;
    currency: string;
    trip: Trip;
  }> {
    return await this.request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings(): Promise<Booking[]> {
    const res = await this.request<{ bookings: Booking[] }>('/bookings/my-travels');
    return res.bookings || [];
  }

  async getBookingByRef(ref: string): Promise<Booking> {
    const res = await this.request<{ booking: Booking }>(`/bookings/ref/${ref}`);
    return res.booking;
  }

  async getBoardingPass(bookingId: number): Promise<Booking> {
    const res = await this.request<{ booking: Booking }>(`/bookings/${bookingId}/boarding-pass`);
    return res.booking;
  }

  async getAllBookingsAdmin(params?: { search?: string; trip_id?: number | string; status?: string; page?: number; limit?: number }): Promise<{ bookings: Booking[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.trip_id && params.trip_id !== 'all') query.append('trip_id', params.trip_id.toString());
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ bookings: Booking[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/bookings${qs}`);
    return {
      bookings: res.bookings || [],
      total: res.total ?? (res.bookings ? res.bookings.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  // --- PAYMENTS & M-PESA ---
  async initiateMpesaSTK(payload: {
    booking_id?: number;
    booking_reference?: string;
    phone_number: string;
    amount: number;
    payment_type?: string;
  }): Promise<{ checkout_request_id: string; customer_message: string; status: string }> {
    return await this.request('/payments/mpesa/stkpush', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async submitPesapalOrder(payload: {
    booking_id?: number;
    booking_reference?: string;
    amount: number;
    currency?: string;
    description?: string;
    callback_url?: string;
    email?: string;
    phone_number?: string;
    first_name?: string;
    last_name?: string;
    payment_type?: string;
  }): Promise<{ order_tracking_id: string; redirect_url: string }> {
    return await this.request('/payments/pesapal/submit-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // --- CHAT & REALTIME HUB ---
  // --- CHAT & REALTIME HUB ---
  async getTripMessages(tripId: number, limit: number = 50, offset: number = 0): Promise<TripChatMessage[]> {
    const res = await this.request<any>(`/chat/trips/${tripId}/messages?limit=${limit}&offset=${offset}`);
    if (Array.isArray(res)) return res.filter(Boolean);
    if (res && Array.isArray(res.messages)) return res.messages.filter(Boolean);
    return [];
  }

  async getTripChat(tripId: number, limit: number = 50, offset: number = 0): Promise<{ messages: TripChatMessage[] }> {
    const messages = await this.getTripMessages(tripId, limit, offset);
    return { messages };
  }

  async postChatMessage(
    tripId: number,
    message_body: string,
    extra?: {
      message_type?: string;
      media_url?: string;
      reply_to_id?: number;
      reply_body?: string;
      reply_sender?: string;
    }
  ): Promise<TripChatMessage> {
    const payload = {
      message_body,
      message_type: extra?.message_type || 'text',
      media_url: extra?.media_url || '',
      reply_to_id: extra?.reply_to_id,
      reply_body: extra?.reply_body,
      reply_sender: extra?.reply_sender,
    };
    const res = await this.request<any>(`/chat/trips/${tripId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res?.message || res;
  }

  async sendChatMessage(
    tripId: number,
    message_body: string,
    extra?: {
      message_type?: string;
      media_url?: string;
      reply_to_id?: number;
      reply_body?: string;
      reply_sender?: string;
    }
  ): Promise<TripChatMessage> {
    return await this.postChatMessage(tripId, message_body, extra);
  }

  async getChatMembers(tripId: number): Promise<TripChatMember[]> {
    const res = await this.request<{ members: TripChatMember[] }>(`/chat/trips/${tripId}/members`);
    return res.members || [];
  }

  async getUserChats(): Promise<TripGroupChat[]> {
    const res = await this.request<{ chats: TripGroupChat[] }>('/chat/my-chats');
    return res.chats || [];
  }

  // --- PHOTO GALLERY & VAULT ---
  async getPublicGallery(params?: { tag?: string; search?: string; limit?: number; offset?: number }): Promise<TripGallery[]> {
    const query = new URLSearchParams();
    if (params?.tag && params.tag !== 'All') query.append('tag', params.tag);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ gallery: TripGallery[] }>(`/gallery${qs}`);
    return res.gallery || [];
  }

  async getAllGalleryAdmin(params?: { search?: string; visibility?: string; page?: number; limit?: number }): Promise<{ gallery: TripGallery[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.visibility && params.visibility !== 'all') query.append('visibility', params.visibility);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ gallery: TripGallery[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/gallery${qs}`);
    return {
      gallery: res.gallery || [],
      total: res.total ?? (res.gallery ? res.gallery.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  async getTripVault(tripId: number): Promise<TripGallery[]> {
    const res = await this.request<{ vault: TripGallery[] }>(`/vault/trips/${tripId}`);
    return res.vault || [];
  }

  async uploadToVault(tripId: number, data: { media_url: string; caption?: string; tags?: string; is_public?: boolean }): Promise<TripGallery> {
    return await this.request<TripGallery>(`/vault/trips/${tripId}/upload`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadTripPhoto(data: { trip_id: number; media_url: string; caption?: string; tags?: string; is_public?: boolean }): Promise<TripGallery> {
    return this.uploadToVault(data.trip_id, {
      media_url: data.media_url,
      caption: data.caption,
      tags: data.tags,
      is_public: data.is_public,
    });
  }

  async batchUploadToVault(
    tripId: number,
    photos: Array<{ media_url: string; caption?: string; tags?: string; is_public?: boolean }>
  ): Promise<{ message: string; count: number; trip_id: number }> {
    return await this.request(`/vault/trips/${tripId}/batch-upload`, {
      method: 'POST',
      body: JSON.stringify({ photos }),
    });
  }

  async batchUploadTripPhotos(
    tripId: number,
    data: { image_urls: string[]; caption_prefix?: string; tags?: string; is_public?: boolean }
  ): Promise<{ message: string; count: number; trip_id: number }> {
    const photos = data.image_urls.map((url) => ({
      media_url: url,
      caption: data.caption_prefix,
      tags: data.tags,
      is_public: data.is_public ?? true,
    }));
    return this.batchUploadToVault(tripId, photos);
  }

  async toggleGalleryApproval(id: number, approved: boolean): Promise<{ message: string }> {
    return await this.request(`/admin/gallery/${id}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ is_approved: approved }),
    });
  }

  async toggleGalleryVisibility(id: number, isPublic: boolean): Promise<{ message: string }> {
    return await this.request(`/admin/gallery/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ is_public: isPublic }),
    });
  }

  async deleteGalleryPhoto(id: number): Promise<{ message: string }> {
    return await this.request(`/admin/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // --- PROMOTIONS ---
  async getActivePromotions(): Promise<Promotion[]> {
    const res = await this.request<{ promotions: Promotion[] }>('/promotions/active');
    return res.promotions || [];
  }

  async getAllPromotionsAdmin(params?: { search?: string; page?: number; limit?: number }): Promise<{ promotions: Promotion[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ promotions: Promotion[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/promotions${qs}`);
    return {
      promotions: res.promotions || [],
      total: res.total ?? (res.promotions ? res.promotions.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  async createPromotion(data: Partial<Promotion> & { valid_days?: number }): Promise<Promotion> {
    return await this.request<Promotion>('/admin/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async togglePromotion(id: number, active: boolean): Promise<{ message: string }> {
    return await this.request(`/admin/promotions/${id}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: active }),
    });
  }

  async deletePromotion(id: number): Promise<{ message: string }> {
    return await this.request(`/admin/promotions/${id}`, {
      method: 'DELETE',
    });
  }

  async validatePromotion(code: string, amount: number): Promise<{ valid: boolean; discount: number; promo?: Promotion; message?: string }> {
    return await this.request(`/promotions/validate?code=${encodeURIComponent(code)}&amount=${amount}`);
  }

  // --- REVIEWS & TESTIMONIALS ---
  async getFeaturedReviews(): Promise<TripReview[]> {
    const res = await this.request<{ reviews: TripReview[] }>('/reviews/featured');
    return res.reviews || [];
  }

  async getReviewsByTrip(tripId: number): Promise<TripReview[]> {
    const res = await this.request<{ reviews: TripReview[] }>(`/reviews/trip/${tripId}`);
    return res.reviews || [];
  }

  async submitReview(data: { booking_id: number; trip_id: number; rating: number; headline: string; review_text: string }): Promise<{ message: string; review: TripReview }> {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllReviewsAdmin(params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ reviews: TripReview[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ reviews: TripReview[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/reviews${qs}`);
    return {
      reviews: res.reviews || [],
      total: res.total ?? (res.reviews ? res.reviews.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  async toggleReviewApproval(id: number, approved: boolean): Promise<{ message: string }> {
    return await this.request(`/admin/reviews/${id}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ is_approved: approved }),
    });
  }

  async toggleReviewFeatured(id: number, featured: boolean): Promise<{ message: string }> {
    return await this.request(`/admin/reviews/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ is_featured: featured }),
    });
  }

  async deleteReview(id: number): Promise<{ message: string }> {
    return await this.request(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // --- CUSTOM INQUIRIES ---
  async submitCustomInquiry(inquiry: Omit<CustomInquiry, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; message: string; inquiry_id: number }> {
    return await this.request('/inquiries/custom-safari', {
      method: 'POST',
      body: JSON.stringify(inquiry),
    });
  }

  async getAllInquiriesAdmin(params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<{ inquiries: CustomInquiry[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ inquiries: CustomInquiry[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/inquiries${qs}`);
    return {
      inquiries: res.inquiries || [],
      total: res.total ?? (res.inquiries ? res.inquiries.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  async updateInquiryStatus(id: number, status: string): Promise<{ message: string }> {
    return await this.request(`/admin/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // --- BLOGS ---
  async getBlogs(params?: { category?: string; tag?: string; search?: string; limit?: number; offset?: number }): Promise<BlogPost[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ blogs: BlogPost[] }>(`/blogs${qs}`);
    return res.blogs || [];
  }

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    const res = await this.request<{ blog: BlogPost }>(`/blogs/${slug}`);
    return res.blog;
  }

  async getAllBlogsAdmin(params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<{ blogs: BlogPost[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ blogs: BlogPost[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/blogs${qs}`);
    return {
      blogs: res.blogs || [],
      total: res.total ?? (res.blogs ? res.blogs.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  async createBlog(blogData: Partial<BlogPost>): Promise<{ message: string; blog: BlogPost }> {
    return await this.request('/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  }

  async updateBlog(id: number, blogData: Partial<BlogPost>): Promise<{ message: string; blog: BlogPost }> {
    return await this.request(`/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  }

  async toggleBlogPublish(id: number, isPublished: boolean): Promise<{ message: string; is_published: boolean }> {
    return await this.request(`/admin/blogs/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ is_published: isPublished }),
    });
  }

  async deleteBlog(id: number): Promise<{ message: string }> {
    return await this.request(`/admin/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  // --- USERS ADMIN ---
  async getAllUsersAdmin(params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: User[]; total: number; page: number; limit: number; total_pages: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.role && params.role !== 'all') query.append('role', params.role);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await this.request<{ users: User[]; total: number; page: number; limit: number; total_pages: number }>(`/admin/users${qs}`);
    return {
      users: res.users || [],
      total: res.total ?? (res.users ? res.users.length : 0),
      page: res.page ?? (params?.page || 1),
      limit: res.limit ?? (params?.limit || 20),
      total_pages: res.total_pages ?? 1,
    };
  }

  // --- ADMIN REPORTS & QR SCANNER ---
  async getAdminSummary(): Promise<{
    summary: FinancialSummary;
    payment_methods?: PaymentBreakdown[];
    occupancy?: OccupancyItem[];
  }> {
    const res = await this.request<{
      summary: FinancialSummary;
      payment_methods?: PaymentBreakdown[];
      occupancy?: OccupancyItem[];
    }>('/admin/reports/summary');
    return {
      summary: res.summary,
      payment_methods: res.payment_methods || [],
      occupancy: res.occupancy || [],
    };
  }

  async verifyQRScanner(qrToken: string): Promise<{
    valid: boolean;
    already_checked_in?: boolean;
    message: string;
    passenger_name?: string;
    trip_title?: string;
    booking_reference?: string;
    booking?: Booking;
  }> {
    return await this.request('/admin/bookings/verify-qr', {
      method: 'POST',
      body: JSON.stringify({ qr_token: qrToken }),
    });
  }

  // --- GROUP CHATS & LIVE BROADCASTS ---
  async getAllTripChatsAdmin(): Promise<TripGroupChat[]> {
    const res = await this.request<{ chats: TripGroupChat[] }>('/admin/chats');
    return res.chats || [];
  }

  async getTripChatMessages(tripId: number, limit = 50, offset = 0): Promise<{
    chat: TripGroupChat;
    messages: TripChatMessage[];
    announcement_only: boolean;
  }> {
    return await this.request(`/chat/trips/${tripId}/messages?limit=${limit}&offset=${offset}`);
  }

  async postTripChatMessage(tripId: number, messageData: {
    message_body: string;
    message_type?: string;
    media_url?: string;
    is_pinned?: boolean;
    reply_to_id?: number;
    reply_body?: string;
    reply_sender?: string;
  }): Promise<TripChatMessage> {
    return await this.request(`/chat/trips/${tripId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async toggleTripChatAnnouncement(tripId: number, announcementOnly: boolean): Promise<{ message: string; announcement_only: boolean }> {
    return await this.request(`/admin/chat/trips/${tripId}/mode`, {
      method: 'PATCH',
      body: JSON.stringify({ announcement_only: announcementOnly }),
    });
  }

  async getTripChatMembers(tripId: number): Promise<TripChatMember[]> {
    const res = await this.request<{ members: TripChatMember[] }>(`/chat/trips/${tripId}/members`);
    return res.members || [];
  }

  // --- MANUAL PAYMENT RECORDING ---
  async recordManualPayment(bookingId: number, payload: {
    amount: number;
    payment_method: string;
    transaction_reference?: string;
    payment_type?: string;
    notes?: string;
  }): Promise<{
    message: string;
    payment: Payment;
    booking: Booking;
  }> {
    return await this.request(`/admin/bookings/${bookingId}/payments/manual`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiService();
export default api;
