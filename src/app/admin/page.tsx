'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Luggage, QrCode, AlertTriangle, Plus, Search, ShieldCheck, Tag, RefreshCw, Upload, BarChart3, Settings, Star, Camera, X, Loader2, Compass, BookOpen, Lock, Menu, Globe, Filter, Send, MessagesSquare, FileText, Mountain, Scale, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Trip, Booking, Promotion, FinancialSummary, PaymentBreakdown, OccupancyItem, TripGallery, TripReview, User, SiteSettings, BlogPost, SitePolicy, TripGroupChat, TripChatMessage, TripChatMember } from '../../types';
import api from '../../lib/api';
import RichTextEditor from '../../components/RichTextEditor';
import RichContentRenderer from '../../components/RichContentRenderer';
import AdminOverviewTab from '../../components/admin/AdminOverviewTab';
import AdminSettingsTab from '../../components/admin/AdminSettingsTab';
import AdminTripsTab from '../../components/admin/AdminTripsTab';
import AdminBookingsTab from '../../components/admin/AdminBookingsTab';
import AdminChatsTab from '../../components/admin/AdminChatsTab';
import AdminScannerTab from '../../components/admin/AdminScannerTab';
import AdminPromotionsTab from '../../components/admin/AdminPromotionsTab';
import AdminGalleryTab from '../../components/admin/AdminGalleryTab';
import AdminReviewsTab from '../../components/admin/AdminReviewsTab';
import AdminBlogsTab from '../../components/admin/AdminBlogsTab';
import AdminUsersTab from '../../components/admin/AdminUsersTab';
import AdminTripModal from '../../components/admin/AdminTripModal';
import AdminBlogModal from '../../components/admin/AdminBlogModal';
import AdminPhotoModal from '../../components/admin/AdminPhotoModal';
import AdminPolicyModal from '../../components/admin/AdminPolicyModal';
import AdminManualPaymentModal from '../../components/admin/AdminManualPaymentModal';
import AdminChatMembersModal from '../../components/admin/AdminChatMembersModal';
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog';


type AdminTab =
  | 'overview'
  | 'settings'
  | 'trips'
  | 'bookings'
  | 'chats'
  | 'scanner'
  | 'promotions'
  | 'gallery'
  | 'reviews'
  | 'blogs'
  | 'users';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => Promise<void> | void;
}

// Reusable Server-Side Pagination Bar Component
function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsLabel = 'items',
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsLabel?: string;
}) {
  if (totalPages <= 1 && totalItems <= 0) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-200 mt-6 text-xs text-slate-500">
      <div className="font-medium">
        Page <span className="font-bold text-[#0F1D36]">{currentPage}</span> of{' '}
        <span className="font-bold text-[#0F1D36]">{Math.max(totalPages, 1)}</span> ({totalItems} total {itemsLabel})
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors shadow-sm"
        >
          &larr; Previous
        </button>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#15803D] font-mono font-bold">
          {currentPage} / {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors shadow-sm"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

function getPolicyIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case 'alerttriangle':
    case 'alert':
    case 'warning':
      return AlertTriangle;
    case 'mountain':
    case 'hiking':
    case 'trail':
      return Mountain;
    case 'shieldcheck':
    case 'privacy':
    case 'security':
      return ShieldCheck;
    case 'globe':
    case 'earth':
    case 'eco':
      return Globe;
    case 'heartpulse':
    case 'medical':
    case 'health':
      return HeartPulse;
    case 'scale':
    case 'legal':
      return Scale;
    default:
      return FileText;
  }
}

export default function AdminSuitePage() {
  const router = useRouter();
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const { settings: globalSettings, refreshSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search states for all listings
  const [searchTrips, setSearchTrips] = useState('');
  const [searchBookings, setSearchBookings] = useState('');
  const [searchBlogs, setSearchBlogs] = useState('');
  const [searchPromotions, setSearchPromotions] = useState('');
  const [searchGallery, setSearchGallery] = useState('');
  const [searchReviews, setSearchReviews] = useState('');
  const [searchUsers, setSearchUsers] = useState('');

  // User Role Filter
  const [selectedUserRole, setSelectedUserRole] = useState<string>('all');

  // Time Horizon Filter for Overview Analytics
  const [timeHorizon, setTimeHorizon] = useState<'7d' | '30d' | 'quarter' | 'ytd' | 'all'>('30d');

  // Pagination & Count States
  const [tripsPage, setTripsPage] = useState(1);
  const [tripsTotalPages, setTripsTotalPages] = useState(1);
  const [tripsTotal, setTripsTotal] = useState(0);

  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);

  const [galleryPage, setGalleryPage] = useState(1);
  const [galleryTotalPages, setGalleryTotalPages] = useState(1);
  const [galleryTotal, setGalleryTotal] = useState(0);

  const [promosPage, setPromosPage] = useState(1);
  const [promosTotalPages, setPromosTotalPages] = useState(1);
  const [promosTotal, setPromosTotal] = useState(0);

  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
  const [reviewsTotal, setReviewsTotal] = useState(0);

  const [blogsPage, setBlogsPage] = useState(1);
  const [blogsTotalPages, setBlogsTotalPages] = useState(1);
  const [blogsTotal, setBlogsTotal] = useState(0);

  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);

  // Booking Manifest Filters & Grouping
  const [manifestTripFilter, setManifestTripFilter] = useState<string>('all');
  const [manifestStatusFilter, setManifestStatusFilter] = useState<string>('all');
  const [manifestViewMode, setManifestViewMode] = useState<'flat' | 'grouped'>('flat');

  // Expeditions Status Filter (Default Upcoming)
  const [tripStatusFilter, setTripStatusFilter] = useState<string>('upcoming');

  // Gallery Public vs Vault Filter
  const [galleryVisibilityFilter, setGalleryVisibilityFilter] = useState<'all' | 'public' | 'vault'>('all');

  // CMS Content Tabs & Live Preview Mode
  const [cmsSectionTab, setCmsSectionTab] = useState<'brand' | 'about' | 'policies'>('brand');
  const [policyCategoryFilter, setPolicyCategoryFilter] = useState<string>('all');
  const [cmsPreviewMode, setCmsPreviewMode] = useState<'edit' | 'preview'>('edit');

  // Dynamic Site Policies State
  const [policiesList, setPoliciesList] = useState<SitePolicy[]>([]);
  const [selectedPreviewPolicyId, setSelectedPreviewPolicyId] = useState<number | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
  const [policyForm, setPolicyForm] = useState<Partial<SitePolicy>>({
    title: '',
    slug: '',
    tagline: '',
    category: 'Legal',
    icon_name: 'FileText',
    sort_order: 1,
    is_active: true,
    content: '',
  });

  // Confirmation Modal State (Forgiving Admin UI)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [isConfirmActionLoading, setIsConfirmActionLoading] = useState(false);

  // Administrator Access Guard
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/admin');
      } else if (!isAdmin) {
        router.replace('/portal');
      }
    }
  }, [isAuthLoading, user, isAdmin, router]);

  // Live Data States
  const [summary, setSummary] = useState<FinancialSummary>({
    total_revenue_collected: 0,
    total_booking_volume: 0,
    total_outstanding_balance: 0,
    total_bookings_count: 0,
  });
  const [paymentBreakdowns, setPaymentBreakdowns] = useState<PaymentBreakdown[]>([]);
  const [occupancyReport, setOccupancyReport] = useState<OccupancyItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [gallery, setGallery] = useState<TripGallery[]>([]);
  const [reviews, setReviews] = useState<TripReview[]>([]);
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Group Chats State
  const [chatsList, setChatsList] = useState<TripGroupChat[]>([]);
  const [searchChats, setSearchChats] = useState('');
  const [selectedChatTrip, setSelectedChatTrip] = useState<TripGroupChat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<TripChatMessage[]>([]);
  const [activeChatMembers, setActiveChatMembers] = useState<TripChatMember[]>([]);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [chatMediaUrlInput, setChatMediaUrlInput] = useState('');
  const [chatPinMessage, setChatPinMessage] = useState(false);
  const [isChatSending, setIsChatSending] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatMembersModalOpen, setIsChatMembersModalOpen] = useState(false);

  // Manual Payment Recording State
  const [paymentModalBooking, setPaymentModalBooking] = useState<Booking | null>(null);
  const [manualPaymentForm, setManualPaymentForm] = useState({
    amount: 0,
    payment_method: 'cash',
    transaction_reference: '',
    payment_type: 'installment',
    notes: '',
  });
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  // Site Settings Form with rich defaults
  const defaultPolicyCopy: Partial<SiteSettings> = {
    company_name: 'Kibali Africa Travel',
    tagline: 'Scenic Hikes, Mountain Treks & Outdoor Community in Kenya',
    hero_title: 'Unforgettable African Treks & Wilderness Expeditions',
    hero_subtitle: 'Discover scenic mountains, crater trails, savannah safaris, and authentic camping adventures with Kenya’s most trusted outdoor community.',
    announcement_banner_active: true,
    announcement_banner_text: '🌿 October Season Promo: Enjoy 15% OFF all Crater & Mountain treks with code KIBALITRIBE',
    primary_phone: '+254 700 123 456',
    contact_email: 'info@kibaliafrica.com',
    whatsapp_number: '+254 700 123 456',
    office_address: 'The Promenade, 4th Floor, General Mathenge Drive, Westlands, Nairobi, Kenya',
    about_us_title: 'Hikes, Campings & Outdoor Camaraderie.',
    about_us_story: 'Founded in Nairobi, Kibali Africa was born from a passion to connect adventurers with Kenya’s scenic peaks, tranquil campsites, and outdoor team expeditions with certified mountain safety and high community spirit.',
    about_us_mission: 'We uphold strict Leave No Trace principles on every mountain and campsite. Our expeditions are staffed with certified mountain guides, first aiders, and sweep marshals to ensure everyone summits and returns safely.',
    about_us_vision: 'Authentic travel respects the host. We partner directly with local communities to ensure sustainable tourism livelihoods, local guide jobs, and cultural heritage preservation.',
    about_us_values: 'Camaraderie, Mountain Stewardship, Safety First, Transparent Pricing, and Leave No Trace.',
  };

  const [siteForm, setSiteForm] = useState<SiteSettings>({
    ...defaultPolicyCopy,
    ...globalSettings,
    about_us_title: globalSettings?.about_us_title || defaultPolicyCopy.about_us_title || '',
    about_us_story: globalSettings?.about_us_story || defaultPolicyCopy.about_us_story || '',
    about_us_mission: globalSettings?.about_us_mission || defaultPolicyCopy.about_us_mission || '',
    about_us_vision: globalSettings?.about_us_vision || defaultPolicyCopy.about_us_vision || '',
    about_us_values: globalSettings?.about_us_values || defaultPolicyCopy.about_us_values || '',
  } as SiteSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (globalSettings) {
      setSiteForm((prev) => ({
        ...defaultPolicyCopy,
        ...prev,
        ...globalSettings,
        about_us_title: globalSettings.about_us_title || prev.about_us_title || defaultPolicyCopy.about_us_title || '',
        about_us_story: globalSettings.about_us_story || prev.about_us_story || defaultPolicyCopy.about_us_story || '',
        about_us_mission: globalSettings.about_us_mission || prev.about_us_mission || defaultPolicyCopy.about_us_mission || '',
        about_us_vision: globalSettings.about_us_vision || prev.about_us_vision || defaultPolicyCopy.about_us_vision || '',
        about_us_values: globalSettings.about_us_values || prev.about_us_values || defaultPolicyCopy.about_us_values || '',
      }));
    }
  }, [globalSettings]);

  // Blog Management State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    category: 'Trail Guides',
    excerpt: '',
    content: '',
    cover_image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    tags: 'Hiking, Prep, Kenya',
    author_name: 'Evans Kiprop',
    read_time_minutes: 5,
    is_published: true,
  });

  // Scanner Simulator
  const [qrTokenInput, setQrTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Trip Modal / Form
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [tripForm, setTripForm] = useState<Partial<Trip>>({
    title: '',
    slug: '',
    destination: 'Amboseli',
    country: 'Kenya',
    tagline: 'Wildlife Safari & Kilimanjaro Views',
    overview: '',
    total_days: 3,
    total_nights: 2,
    difficulty: 'moderate',
    base_price_kes: 45000,
    base_price_usd: 350,
    deposit_required_kes: 15000,
    deposit_required_usd: 120,
    total_seats: 14,
    booked_seats: 0,
    departure_date: '2026-10-15',
    return_date: '2026-10-17',
    featured_image_url:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85',
    banner_image_url:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
    booking_open: true,
    trees_planted_per_booking: 5,
    status: 'published',
  });

  // New Promo Form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState<number>(10);
  const [newPromoMin, setNewPromoMin] = useState<number>(20000);
  const [newPromoDays, setNewPromoDays] = useState<number>(30);

  // Photo / Event Vault Upload Modal State
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoUploadMode, setPhotoUploadMode] = useState<'single' | 'batch'>('single');
  const [batchPhotoUrls, setBatchPhotoUrls] = useState('');
  const [photoForm, setPhotoForm] = useState({
    media_url: '',
    caption: '',
    tags: 'Hikes, Summit, Wildlife',
    trip_id: 1,
    is_public: true,
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Load all admin data from live Go backend API
  const loadAdminData = async () => {
    if (!user || !isAdmin) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [
        summaryRes,
        tripsData,
        bookingsData,
        promosData,
        galleryData,
        reviewsData,
        blogsData,
        usersData,
        chatsData,
        policiesData,
      ] = await Promise.all([
        api.getAdminSummary().catch(() => ({
          summary: {
            total_revenue_collected: 0,
            total_booking_volume: 0,
            total_outstanding_balance: 0,
            total_bookings_count: 0,
          },
          payment_methods: [],
          occupancy: [],
        })),
        api.getAllTripsAdmin({ search: searchTrips, status: tripStatusFilter, page: tripsPage, limit: 12 }).catch(() => ({ trips: [], total: 0, page: 1, limit: 12, total_pages: 1 })),
        api.getAllBookingsAdmin({ search: searchBookings, trip_id: manifestTripFilter, status: manifestStatusFilter, page: bookingsPage, limit: 15 }).catch(() => ({ bookings: [], total: 0, page: 1, limit: 15, total_pages: 1 })),
        api.getAllPromotionsAdmin({ search: searchPromotions, page: promosPage, limit: 15 }).catch(() => ({ promotions: [], total: 0, page: 1, limit: 15, total_pages: 1 })),
        api.getAllGalleryAdmin({ search: searchGallery, visibility: galleryVisibilityFilter, page: galleryPage, limit: 16 }).catch(() => ({ gallery: [], total: 0, page: 1, limit: 16, total_pages: 1 })),
        api.getAllReviewsAdmin({ search: searchReviews, page: reviewsPage, limit: 15 }).catch(() => ({ reviews: [], total: 0, page: 1, limit: 15, total_pages: 1 })),
        api.getAllBlogsAdmin({ search: searchBlogs, page: blogsPage, limit: 10 }).catch(() => ({ blogs: [], total: 0, page: 1, limit: 10, total_pages: 1 })),
        api.getAllUsersAdmin({ search: searchUsers, role: selectedUserRole, page: usersPage, limit: 15 }).catch(() => ({ users: [], total: 0, page: 1, limit: 15, total_pages: 1 })),
        api.getAllTripChatsAdmin().catch(() => []),
        api.getAllPoliciesAdmin().catch(() => []),
      ]);

      if (summaryRes.summary) {
        setSummary(summaryRes.summary);
        setPaymentBreakdowns(summaryRes.payment_methods || []);
        setOccupancyReport(summaryRes.occupancy || []);
      } else {
        setSummary(summaryRes as any);
      }

      setTrips(tripsData.trips || []);
      setTripsTotal(tripsData.total || 0);
      setTripsTotalPages(tripsData.total_pages || 1);

      setBookings(bookingsData.bookings || []);
      setBookingsTotal(bookingsData.total || 0);
      setBookingsTotalPages(bookingsData.total_pages || 1);

      setPromotions(promosData.promotions || []);
      setPromosTotal(promosData.total || 0);
      setPromosTotalPages(promosData.total_pages || 1);

      setGallery(galleryData.gallery || []);
      setGalleryTotal(galleryData.total || 0);
      setGalleryTotalPages(galleryData.total_pages || 1);

      setReviews(reviewsData.reviews || []);
      setReviewsTotal(reviewsData.total || 0);
      setReviewsTotalPages(reviewsData.total_pages || 1);

      setBlogsList(blogsData.blogs || []);
      setBlogsTotal(blogsData.total || 0);
      setBlogsTotalPages(blogsData.total_pages || 1);

      setUsersList(usersData.users || []);
      setUsersTotal(usersData.total || 0);
      setUsersTotalPages(usersData.total_pages || 1);

      setChatsList(chatsData);
      setPoliciesList(policiesData || []);
      if (policiesData && policiesData.length > 0 && selectedPreviewPolicyId === null) {
        setSelectedPreviewPolicyId(policiesData[0].id);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user && isAdmin) {
      loadAdminData();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [isAuthLoading, user, isAdmin]);

  // Reactive search & filter effects with server-side API querying
  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllTripsAdmin({ search: searchTrips, status: tripStatusFilter, page: tripsPage, limit: 12 })
        .then((res) => {
          setTrips(res.trips);
          setTripsTotal(res.total);
          setTripsTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTrips, tripStatusFilter, tripsPage, user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllBookingsAdmin({ search: searchBookings, trip_id: manifestTripFilter, status: manifestStatusFilter, page: bookingsPage, limit: 15 })
        .then((res) => {
          setBookings(res.bookings);
          setBookingsTotal(res.total);
          setBookingsTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchBookings, manifestTripFilter, manifestStatusFilter, bookingsPage, user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllGalleryAdmin({ search: searchGallery, visibility: galleryVisibilityFilter, page: galleryPage, limit: 16 })
        .then((res) => {
          setGallery(res.gallery);
          setGalleryTotal(res.total);
          setGalleryTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchGallery, galleryVisibilityFilter, galleryPage, user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllPromotionsAdmin({ search: searchPromotions, page: promosPage, limit: 15 })
        .then((res) => {
          setPromotions(res.promotions);
          setPromosTotal(res.total);
          setPromosTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchPromotions, promosPage, user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllReviewsAdmin({ search: searchReviews, page: reviewsPage, limit: 15 })
        .then((res) => {
          setReviews(res.reviews);
          setReviewsTotal(res.total);
          setReviewsTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchReviews, reviewsPage, user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllBlogsAdmin({ search: searchBlogs, page: blogsPage, limit: 10 })
        .then((res) => {
          setBlogsList(res.blogs);
          setBlogsTotal(res.total);
          setBlogsTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchBlogs, blogsPage, user, isAdmin]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const timer = setTimeout(() => {
      api.getAllUsersAdmin({ search: searchUsers, role: selectedUserRole, page: usersPage, limit: 15 })
        .then((res) => {
          setUsersList(res.users);
          setUsersTotal(res.total);
          setUsersTotalPages(res.total_pages);
        })
        .catch(console.error);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchUsers, selectedUserRole, usersPage, user, isAdmin]);

  // Save Dynamic Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSiteSettings(siteForm);
      await refreshSettings();
      showToast('success', 'Site Settings Updated', 'Changes are now live across all public pages.');
    } catch (err: any) {
      showToast('error', 'Update Failed', err.message || 'Failed to update site settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Dynamic Policy Handlers
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPolicyId) {
        await api.updatePolicy(editingPolicyId, policyForm);
        showToast('success', 'Policy Updated', `"${policyForm.title}" policy saved successfully.`);
      } else {
        await api.createPolicy(policyForm);
        showToast('success', 'Policy Added', `New policy "${policyForm.title}" published.`);
      }
      setIsPolicyModalOpen(false);
      setEditingPolicyId(null);
      await loadAdminData();
    } catch (err: any) {
      showToast('error', 'Policy Error', err.message || 'Failed to save policy');
    }
  };

  const handleDeletePolicy = (id: number, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Policy from List',
      message: `Are you sure you want to permanently delete "${title}"? Travelers will no longer see this policy in the policies navigation menu.`,
      confirmText: 'Yes, Delete Policy',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.deletePolicy(id);
          showToast('success', 'Policy Deleted', 'Policy removed from public listing.');
          await loadAdminData();
        } catch (err: any) {
          showToast('error', 'Delete Failed', err.message || 'Failed to delete policy');
        }
      },
    });
  };

  const handleTogglePolicyActive = async (id: number, current: boolean, title: string) => {
    try {
      await api.togglePolicyActive(id, !current);
      showToast('success', 'Status Updated', `"${title}" is now ${!current ? 'Visible on Website' : 'Hidden / Draft'}`);
      await loadAdminData();
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to toggle policy visibility');
    }
  };

  // Trip Actions
  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTripId) {
        await api.updateTrip(editingTripId, tripForm);
        showToast('success', 'Trip Updated', 'Expedition & seats allocation saved.');
      } else {
        await api.createTrip(tripForm);
        showToast('success', 'Trip Created', 'New safari published with allocated seat quota.');
      }
      setIsTripModalOpen(false);
      setEditingTripId(null);
      await loadAdminData();
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to save trip');
    }
  };

  const handleDeleteTrip = (id: number, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Safari Expedition',
      message: `Are you sure you want to permanently delete "${title}"? This will remove the trip from public bookings and event schedules.`,
      confirmText: 'Yes, Delete Expedition',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteTrip(id);
          showToast('success', 'Trip Deleted', 'Trip removed from catalog.');
          await loadAdminData();
        } catch (err: any) {
          showToast('error', 'Error', err.message || 'Failed to delete trip');
        }
      },
    });
  };

  const handleToggleTripBooking = (id: number, current: boolean, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: current ? 'Close Trip Reservations' : 'Open Trip Reservations',
      message: `Are you sure you want to ${current ? 'CLOSE' : 'OPEN'} bookings for "${title}"?`,
      confirmText: current ? 'Close Bookings' : 'Open Bookings',
      confirmVariant: current ? 'warning' : 'primary',
      onConfirm: async () => {
        try {
          await api.toggleTripBooking(id, !current);
          showToast('success', 'Status Updated', `Booking is now ${!current ? 'Open' : 'Closed'}`);
          await loadAdminData();
        } catch (err: any) {
          showToast('error', 'Error', err.message || 'Failed to toggle booking');
        }
      },
    });
  };

  // Promo Actions
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    try {
      await api.createPromotion({
        code: newPromoCode.trim().toUpperCase(),
        discount_type: newPromoType,
        discount_value: newPromoValue,
        min_booking_amount: newPromoMin,
        valid_days: newPromoDays,
      });
      setNewPromoCode('');
      showToast('success', 'Promotion Code Created', 'New discount code is active.');
      await loadAdminData();
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to create promo code');
    }
  };

  const handleTogglePromo = async (id: number, current: boolean) => {
    try {
      await api.togglePromotion(id, !current);
      await loadAdminData();
      showToast('success', 'Promo Updated', `Code ${!current ? 'Activated' : 'Deactivated'}`);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to toggle promo code');
    }
  };

  const handleDeletePromo = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Promo Code',
      message: 'Are you sure you want to delete this promotional coupon code?',
      confirmText: 'Delete Code',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.deletePromotion(id);
          await loadAdminData();
          showToast('success', 'Promo Deleted', 'Coupon removed.');
        } catch (err: any) {
          showToast('error', 'Error', err.message || 'Failed to delete promo');
        }
      },
    });
  };

  // Photo / Gallery Vault Handlers
  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingPhoto(true);
    try {
      if (photoUploadMode === 'batch') {
        const urls = batchPhotoUrls
          .split('\n')
          .map((u) => u.trim())
          .filter((u) => u.length > 0);
        if (urls.length === 0) {
          showToast('error', 'No URLs Found', 'Please enter at least one valid image URL.');
          setIsUploadingPhoto(false);
          return;
        }
        await api.batchUploadTripPhotos(photoForm.trip_id, {
          image_urls: urls,
          caption_prefix: photoForm.caption || 'Expedition Capture',
          tags: photoForm.tags || 'Safari, Hikes',
          is_public: photoForm.is_public,
        });
        showToast(
          'success',
          'Batch Upload Started',
          `${urls.length} images are being processed in the background and queued for upload.`
        );
      } else {
        if (!photoForm.media_url.trim()) {
          showToast('error', 'Missing URL', 'Please enter a valid image URL.');
          setIsUploadingPhoto(false);
          return;
        }
        await api.uploadTripPhoto({
          trip_id: photoForm.trip_id,
          media_url: photoForm.media_url.trim(),
          caption: photoForm.caption.trim(),
          tags: photoForm.tags.trim(),
          is_public: photoForm.is_public,
        });
        showToast('success', 'Photo Uploaded', 'New capture added to the media vault.');
      }
      setIsPhotoModalOpen(false);
      setBatchPhotoUrls('');
      setPhotoForm({ media_url: '', caption: '', tags: 'Hikes, Summit, Wildlife', trip_id: trips[0]?.id || 1, is_public: true });
      await loadAdminData();
    } catch (err: any) {
      showToast('error', 'Upload Failed', err.message || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Vault Media',
      message: 'Are you sure you want to delete this media item from the vault?',
      confirmText: 'Delete Media',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteGalleryPhoto(id);
          await loadAdminData();
          showToast('success', 'Media Deleted', 'Photo removed.');
        } catch (err: any) {
          showToast('error', 'Error', err.message || 'Failed to delete photo');
        }
      },
    });
  };

  const [isPopulatingCuratedMedia, setIsPopulatingCuratedMedia] = useState(false);

  const handlePopulateCuratedMedia = async () => {
    setIsPopulatingCuratedMedia(true);
    try {
      const defaultTripId = trips[0]?.id || 1;
      const curatedPhotos = [
        {
          trip_id: trips.find((t) => t.slug?.includes('longonot'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
          caption: 'Conquering Mount Longonot volcanic crater rim at sunrise',
          tags: 'Hikes, Summit, Longonot, Sunrise',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('longonot'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
          caption: 'Great Rift Valley panorama & indigenous crater forest',
          tags: 'Rift Valley, Day Trips, Scenery, Longonot',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('naivasha'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=85',
          caption: 'Lakeside wild camping & bonfire stargazing in Naivasha',
          tags: 'Campings, Bonfire, Naivasha, Stargazing',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('naivasha'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
          caption: 'Walking safari among wild giraffes on Crescent Island',
          tags: 'Wildlife, Giraffes, Sanctuary, Day Trips',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('naivasha'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1600&q=85',
          caption: 'Golden sunset boat cruise alongside hippo pods on Lake Naivasha',
          tags: 'Water Sports, Sunset, Hippos, Campings',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('sagana'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1600&q=85',
          caption: 'Powering through Class IV Captains Fall rapids on Tana River',
          tags: 'Water Sports, Sagana, Adrenaline, Rafting',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('sagana'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
          caption: 'Ziplining and cliff jumping into cool natural river pools',
          tags: 'Water Sports, Ziplining, Day Trips, Adrenaline',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('kenya'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1600&q=85',
          caption: 'Giant alpine lobelias in Sirimon Mackinders Valley on Mt Kenya',
          tags: 'Hikes, Mt Kenya, Moorlands, Summit',
          is_public: true,
        },
        {
          trip_id: trips.find((t) => t.slug?.includes('kenya'))?.id || defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
          caption: 'Sunrise over Point Lenana peak (4,985m) above the clouds',
          tags: 'Summit, Mt Kenya, Sunrise, Peak',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85',
          caption: 'Elephant families marching beneath Mount Kilimanjaro in Amboseli',
          tags: 'Wildlife, Amboseli, Safari, Big Five',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
          caption: 'Cycling and trekking through Hell’s Gate volcanic gorge',
          tags: 'Hikes, Day Trips, Canyon, Cycling',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85',
          caption: 'Sunset flamingo flock reflections on Lake Elementaita',
          tags: 'Campings, Scenery, Birds, Elementaita',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85',
          caption: 'Traversing the scenic 7 knuckles ridge on Ngong Hills',
          tags: 'Hikes, Day Trips, Ridge, Sunset',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?auto=format&fit=crop&w=1600&q=85',
          caption: 'Acoustic campfire storytelling under the Rift Valley night sky',
          tags: 'Campings, Bonfire, Camaraderie, Stargazing',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=1600&q=85',
          caption: 'High mountain glacier summit panorama',
          tags: 'Summit, Kilimanjaro, Trekking, Snow',
          is_public: true,
        },
        {
          trip_id: defaultTripId,
          media_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=85',
          caption: 'Karuru Waterfalls tumbling through Aberdare cloud forests',
          tags: 'Hikes, Waterfalls, Aberdares, Scenery',
          is_public: true,
        },
      ];

      // Group by trip_id and batch upload
      const byTrip: { [key: number]: typeof curatedPhotos } = {};
      curatedPhotos.forEach((p) => {
        if (!byTrip[p.trip_id]) byTrip[p.trip_id] = [];
        byTrip[p.trip_id].push(p);
      });

      for (const tIdStr of Object.keys(byTrip)) {
        const tId = parseInt(tIdStr);
        const photos = byTrip[tId];
        await api.batchUploadToVault(tId, photos);
      }

      await loadAdminData();
      showToast('success', 'Curated Media Loaded', '16+ high-resolution safari & hiking photos added to vault and public gallery!');
    } catch (err: any) {
      showToast('error', 'Seeding Failed', err.message || 'Failed to populate curated photos');
    } finally {
      setIsPopulatingCuratedMedia(false);
    }
  };

  // Reviews Moderation Handlers
  const handleToggleReviewApproval = async (id: number, current: boolean) => {
    try {
      await api.toggleReviewApproval(id, !current);
      await loadAdminData();
      showToast('success', 'Review Status Updated', `Review ${!current ? 'Approved & Visible' : 'Hidden'}`);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to update review status');
    }
  };

  const handleToggleReviewFeatured = async (id: number, current: boolean) => {
    try {
      await api.toggleReviewFeatured(id, !current);
      await loadAdminData();
      showToast('success', 'Review Updated', `Review ${!current ? 'Featured on Homepage' : 'Unfeatured'}`);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Traveler Review',
      message: 'Are you sure you want to delete this traveler review?',
      confirmText: 'Delete Review',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteReview(id);
          await loadAdminData();
          showToast('success', 'Review Deleted', 'Review removed.');
        } catch (err: any) {
          showToast('error', 'Error', err.message || 'Failed to delete review');
        }
      },
    });
  };

  // Blog CMS Handlers
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlogId) {
        await api.updateBlog(editingBlogId, blogForm);
        showToast('success', 'Article Updated', 'Blog guide saved successfully.');
      } else {
        await api.createBlog(blogForm);
        showToast('success', 'Article Published', 'New blog guide created.');
      }
      setIsBlogModalOpen(false);
      setEditingBlogId(null);
      await loadAdminData();
    } catch (err: any) {
      showToast('error', 'Blog Error', err.message || 'Failed to save blog post');
    }
  };

  const handleToggleBlogPublish = async (id: number, current: boolean) => {
    try {
      await api.toggleBlogPublish(id, !current);
      await loadAdminData();
      showToast('success', 'Blog Updated', `Article is now ${!current ? 'Published' : 'Draft'}`);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to update publish state');
    }
  };

  const handleDeleteBlog = (id: number, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Safari Blog Post',
      message: `Are you sure you want to permanently delete "${title}"?`,
      confirmText: 'Delete Article',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await api.deleteBlog(id);
          await loadAdminData();
          showToast('success', 'Article Deleted', 'Blog post was removed.');
        } catch (err: any) {
          showToast('error', 'Error', err.message || 'Failed to delete blog post');
        }
      },
    });
  };

  // QR Scanner Execution
  const handleVerifyQR = async () => {
    if (!qrTokenInput.trim()) return;
    setIsScanning(true);
    try {
      const res = await api.verifyQRScanner(qrTokenInput.trim());
      setScanResult(res);
      if (res.valid) {
        showToast('success', 'Boarding Pass Verified!', `${res.passenger_name || 'Passenger'} checked in.`);
      } else {
        showToast('error', 'Invalid Boarding Pass', res.message);
      }
    } catch (err: any) {
      showToast('error', 'Verification Failed', err.message || 'Invalid or expired QR code.');
    } finally {
      setIsScanning(false);
    }
  };

  // Filtered alias references
  const filteredTrips = trips;
  const filteredBookings = bookings;
  const filteredBlogs = blogsList;
  const filteredPromotions = promotions;
  const filteredGallery = gallery;
  const filteredReviews = reviews;
  const filteredUsers = usersList;

  // Grouped Bookings by Expedition
  const groupedBookings = useMemo(() => {
    const groups: Record<number, { trip: Trip | undefined; bookings: Booking[]; totalRevenue: number; totalGuests: number }> = {};
    bookings.forEach((b) => {
      if (!groups[b.trip_id]) {
        const tripObj = trips.find((t) => t.id === b.trip_id);
        groups[b.trip_id] = {
          trip: tripObj,
          bookings: [],
          totalRevenue: 0,
          totalGuests: 0,
        };
      }
      groups[b.trip_id].bookings.push(b);
      groups[b.trip_id].totalRevenue += b.amount_paid || 0;
      groups[b.trip_id].totalGuests += b.number_of_guests || 1;
    });
    return groups;
  }, [bookings, trips]);

  const filteredChats = useMemo(() => {
    if (!searchChats.trim()) return chatsList;
    const q = searchChats.toLowerCase();
    return chatsList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.trip_title?.toLowerCase().includes(q)
    );
  }, [chatsList, searchChats]);

  // Group Chat Details & Live Actions
  const loadChatDetails = async (chat: TripGroupChat) => {
    setSelectedChatTrip(chat);
    setIsChatLoading(true);
    try {
      const [msgRes, membersRes] = await Promise.all([
        api.getTripChatMessages(chat.trip_id).catch(() => ({ chat, messages: [], announcement_only: false })),
        api.getTripChatMembers(chat.trip_id).catch(() => []),
      ]);
      setActiveChatMessages(msgRes.messages || []);
      setActiveChatMembers(membersRes || []);
    } catch (err) {
      console.error('Failed to load chat details', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatTrip || !chatMessageInput.trim()) return;
    setIsChatSending(true);
    try {
      const newMsg = await api.postTripChatMessage(selectedChatTrip.trip_id, {
        message_body: chatMessageInput.trim(),
        media_url: chatMediaUrlInput.trim() || undefined,
        is_pinned: chatPinMessage,
      });
      setActiveChatMessages((prev) => [...prev, newMsg]);
      setChatMessageInput('');
      setChatMediaUrlInput('');
      setChatPinMessage(false);
      showToast('success', 'Message Broadcast', 'Your message was posted to the expedition squad.');
    } catch (err: any) {
      showToast('error', 'Failed to Send', err.message || 'Could not post message.');
    } finally {
      setIsChatSending(false);
    }
  };

  const handleToggleAnnouncementMode = async () => {
    if (!selectedChatTrip) return;
    const nextMode = !selectedChatTrip.announcement_only;
    try {
      await api.toggleTripChatAnnouncement(selectedChatTrip.trip_id, nextMode);
      setSelectedChatTrip({ ...selectedChatTrip, announcement_only: nextMode });
      setChatsList((prev) =>
        prev.map((c) => (c.trip_id === selectedChatTrip.trip_id ? { ...c, announcement_only: nextMode } : c))
      );
      showToast(
        'success',
        'Chat Mode Updated',
        nextMode ? 'Chat locked to Announcement Only (staff posts only).' : 'Chat unlocked for all booked travelers.'
      );
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to update chat mode');
    }
  };

  // Manual Payment Handlers
  const handleOpenRecordPaymentModal = (booking: Booking) => {
    const due = booking.outstanding_balance ?? (booking.total_amount - booking.amount_paid);
    setPaymentModalBooking(booking);
    setManualPaymentForm({
      amount: due > 0 ? due : 0,
      payment_method: 'cash',
      transaction_reference: '',
      payment_type: due > 0 ? 'full_balance' : 'installment',
      notes: '',
    });
  };

  const handleSubmitManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBooking) return;
    if (manualPaymentForm.amount <= 0) {
      showToast('error', 'Invalid Amount', 'Payment amount must be greater than 0.');
      return;
    }
    setIsRecordingPayment(true);
    try {
      const res = await api.recordManualPayment(paymentModalBooking.id, manualPaymentForm);
      showToast('success', 'Payment Recorded', `Manual payment of KES ${manualPaymentForm.amount.toLocaleString()} was logged.`);
      if (res.booking) {
        setBookings((prev) => prev.map((b) => (b.id === res.booking.id ? { ...b, ...res.booking } : b)));
      }
      loadAdminData();
      setPaymentModalBooking(null);
    } catch (err: any) {
      showToast('error', 'Payment Failed', err.message || 'Could not record manual payment.');
    } finally {
      setIsRecordingPayment(false);
    }
  };

  if (isAuthLoading || (isLoading && user && isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FCFBF9]">
        <Loader2 className="w-10 h-10 text-[#15803D] animate-spin" />
        <p className="text-sm font-semibold text-[#0F1D36]">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FCFBF9]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0F1D36]">Administrator Access Required</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This operational suite is strictly reserved for Kibali Africa staff and administrators. Please sign in with an authorized administrator account.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <Link
              href="/auth/login?redirect=/admin"
              className="w-full py-3.5 bg-[#0F1D36] hover:bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md block text-center transition-all"
            >
              Sign In to Admin Portal
            </Link>
            <Link
              href="/"
              className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-[#0F1D36] border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider block text-center transition-all"
            >
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Navigation sections for sidebar
  const navSections = [
    {
      title: 'CORE & ANALYTICS',
      items: [
        { key: 'overview' as AdminTab, label: 'Reports & Analytics', icon: BarChart3, count: null },
        { key: 'settings' as AdminTab, label: 'Dynamic Site CMS', icon: Settings, count: null },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { key: 'trips' as AdminTab, label: 'Expeditions & Trips', icon: Compass, count: tripsTotal },
        { key: 'bookings' as AdminTab, label: 'Bookings Manifest', icon: Luggage, count: bookingsTotal },
        { key: 'chats' as AdminTab, label: 'Expedition Squad Chats', icon: MessagesSquare, count: chatsList.length },
        { key: 'scanner' as AdminTab, label: 'QR Boarding Scanner', icon: QrCode, count: null },
      ],
    },
    {
      title: 'CONTENT & COMMUNITY',
      items: [
        { key: 'blogs' as AdminTab, label: 'Safari Blogs & CMS', icon: BookOpen, count: blogsTotal },
        { key: 'gallery' as AdminTab, label: 'Gallery Media Vault', icon: Camera, count: galleryTotal },
        { key: 'reviews' as AdminTab, label: 'Traveler Reviews', icon: Star, count: reviewsTotal },
        { key: 'promotions' as AdminTab, label: 'Promotions & Codes', icon: Tag, count: promosTotal },
        { key: 'users' as AdminTab, label: 'User Accounts', icon: Users, count: usersTotal },
      ],
    },
  ];

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Financials & Performance Analytics',
      subtitle: 'Real-time revenue, gross volume, payment breakdowns, and expedition seat occupancy',
    },
    settings: {
      title: 'Dynamic Site Content & Brand CMS',
      subtitle: 'Manage brand story, contacts, and dynamic policy list with live customer preview',
    },
    trips: {
      title: 'Expeditions & Safari Catalog',
      subtitle: 'Manage upcoming itineraries, difficulty tiers, pricing, and seat quotas',
    },
    blogs: {
      title: 'Safari Journal & Guides CMS',
      subtitle: 'Publish, edit, and curate hiking prep advice and conservation stories',
    },
    bookings: {
      title: 'Reservations & Passenger Manifest',
      subtitle: 'Inspect traveler tickets, M-Pesa payment records, and dietary requests',
    },
    chats: {
      title: 'Expedition Squad Chats & Live Broadcasts',
      subtitle: 'Real-time group messaging, traveler announcements, and expedition community moderation',
    },
    scanner: {
      title: 'QR Boarding Pass Verification',
      subtitle: 'Instant check-in validator for expedition departures and rendezvous points',
    },
    promotions: {
      title: 'Promotions & Discount Vouchers',
      subtitle: 'Create seasonal promotional codes and percentage discounts',
    },
    gallery: {
      title: 'Expedition Media Vault',
      subtitle: 'Moderate traveler photo uploads and publish verified expedition captures',
    },
    reviews: {
      title: 'Traveler Reviews & Testimonials',
      subtitle: 'Approve authentic reviews and feature glowing feedback on the homepage',
    },
    users: {
      title: 'Registered Users & Accounts',
      subtitle: 'Inspect explorer profiles, contact numbers, roles, and eco reward points balances',
    },
  };

  const previewPolicy = policiesList.find((p) => p.id === selectedPreviewPolicyId) || policiesList[0];
  const PreviewIconComponent = getPolicyIcon(previewPolicy?.icon_name || 'FileText');

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 md:pt-32 pb-16">
      {/* Mobile Top App Bar with Hamburger */}
      <div className="lg:hidden sticky top-20 md:top-24 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open Admin Menu"
            className="p-2 -ml-1 text-slate-700 hover:text-[#0F1D36] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-sm flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse flex-shrink-0" />
            <h2 className="font-serif font-bold text-sm text-[#0F1D36] truncate">
              {tabTitles[activeTab]?.title || 'Admin Suite'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={loadAdminData}
            title="Refresh Live Data"
            className="p-2 text-slate-600 hover:text-[#15803D] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingTripId(null);
              setTripForm({
                title: '',
                slug: '',
                destination: 'Amboseli',
                country: 'Kenya',
                tagline: 'Wildlife Safari & Kilimanjaro Views',
                overview: '',
                total_days: 3,
                total_nights: 2,
                difficulty: 'moderate',
                base_price_kes: 45000,
                base_price_usd: 350,
                deposit_required_kes: 15000,
                deposit_required_usd: 120,
                total_seats: 14,
                booked_seats: 0,
                departure_date: '2026-10-15',
                return_date: '2026-10-17',
                featured_image_url:
                  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=85',
                banner_image_url:
                  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
                booking_open: true,
                trees_planted_per_booking: 5,
                status: 'published',
              });
              setIsTripModalOpen(true);
            }}
            title="New Expedition"
            className="p-2 bg-[#15803D] text-white rounded-xl hover:bg-[#166534] shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Off-Canvas Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#0F1D36] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center border-2 border-[#15803D]">
              <Compass className="w-5 h-5 text-[#15803D]" />
            </div>
            <div>
              <span className="font-serif font-bold text-base block text-white">Kibali Africa</span>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest block">
                Ops Control Suite
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close menu"
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 block mb-1">
                {sec.title}
              </span>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveTab(item.key);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#15803D] text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Desktop Left Navigation Sidebar */}
          <aside className="hidden lg:block w-72 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm space-y-6 flex-shrink-0 sticky top-28">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803D] shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#0F1D36]">Kibali Ops Suite</h3>
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">
                  Live Operations & CMS
                </p>
              </div>
            </div>

            <nav className="space-y-6">
              {navSections.map((sec) => (
                <div key={sec.title} className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 block mb-1">
                    {sec.title}
                  </span>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#15803D] text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F1D36]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== null && item.count !== undefined && item.count > 0 && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Admin User Card in Sidebar Bottom */}
            <div className="pt-5 mt-6 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-[#0F1D36] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user?.full_name?.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0F1D36] truncate">{user?.full_name}</p>
                  <p className="text-[10px] text-slate-500 truncate capitalize">{user?.role || 'Administrator'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold">
                <Link
                  href="/portal"
                  className="py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  My Portal
                </Link>
                <Link
                  href="/"
                  className="py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Live Site
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#15803D] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Admin Suite
                  </span>
                  <span className="text-xs text-slate-400">&bull; {tabTitles[activeTab]?.title}</span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0F1D36] mt-1">
                  {tabTitles[activeTab]?.title}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {tabTitles[activeTab]?.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={loadAdminData}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-[#0F1D36] hover:bg-slate-100 transition-colors shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={() => {
                    setEditingTripId(null);
                    setTripForm({
                      title: '',
                      destination: '',
                      country: 'Kenya',
                      tagline: '',
                      difficulty: 'moderate',
                      total_seats: 14,
                      booked_seats: 0,
                      status: 'published',
                      booking_open: true,
                      total_days: 1,
                      total_nights: 0,
                      departure_date: new Date().toISOString().substring(0, 10),
                      return_date: new Date().toISOString().substring(0, 10),
                      base_price_kes: 4500,
                      deposit_required_kes: 1500,
                      base_price_usd: 45,
                      deposit_required_usd: 15,
                      overview: '',
                      featured_image_url: '',
                    });
                    setIsTripModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold shadow-md shadow-emerald-900/20 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Expedition</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'overview' && (
              <AdminOverviewTab
                timeHorizon={timeHorizon}
                setTimeHorizon={setTimeHorizon}
                summary={summary}
                paymentBreakdowns={paymentBreakdowns}
                occupancyReport={occupancyReport}
                trips={trips}
                bookings={bookings}
                setActiveTab={setActiveTab}
                setIsTripModalOpen={setIsTripModalOpen}
                setEditingTripId={setEditingTripId}
                setTripForm={setTripForm}
                loadAdminData={loadAdminData}
                isPopulatingCuratedMedia={isPopulatingCuratedMedia}
                handlePopulateCuratedMedia={handlePopulateCuratedMedia}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab
                cmsSectionTab={cmsSectionTab}
                setCmsSectionTab={setCmsSectionTab}
                cmsPreviewMode={cmsPreviewMode}
                setCmsPreviewMode={setCmsPreviewMode}
                siteForm={siteForm}
                setSiteForm={setSiteForm}
                isSavingSettings={isSavingSettings}
                handleSaveSettings={handleSaveSettings}
                policiesList={policiesList}
                policyCategoryFilter={policyCategoryFilter}
                setPolicyCategoryFilter={setPolicyCategoryFilter}
                setIsPolicyModalOpen={setIsPolicyModalOpen}
                setEditingPolicyId={setEditingPolicyId}
                setPolicyForm={setPolicyForm}
                handleDeletePolicy={handleDeletePolicy}
                handleTogglePolicyActive={handleTogglePolicyActive}
                selectedPreviewPolicyId={selectedPreviewPolicyId}
                setSelectedPreviewPolicyId={setSelectedPreviewPolicyId}
                getPolicyIcon={getPolicyIcon}
              />
            )}

            {activeTab === 'trips' && (
              <AdminTripsTab
                trips={trips}
                searchTrips={searchTrips}
                setSearchTrips={setSearchTrips}
                tripStatusFilter={tripStatusFilter}
                setTripStatusFilter={setTripStatusFilter}
                tripsPage={tripsPage}
                tripsTotalPages={tripsTotalPages}
                tripsTotal={tripsTotal}
                setTripsPage={setTripsPage}
                setIsTripModalOpen={setIsTripModalOpen}
                setEditingTripId={setEditingTripId}
                setTripForm={setTripForm}
                handleDeleteTrip={handleDeleteTrip}
                handleToggleTripBooking={handleToggleTripBooking}
              />
            )}

            {activeTab === 'bookings' && (
              <AdminBookingsTab
                bookings={bookings}
                trips={trips}
                searchBookings={searchBookings}
                setSearchBookings={setSearchBookings}
                manifestTripFilter={manifestTripFilter}
                setManifestTripFilter={setManifestTripFilter}
                manifestStatusFilter={manifestStatusFilter}
                setManifestStatusFilter={setManifestStatusFilter}
                bookingsPage={bookingsPage}
                bookingsTotalPages={bookingsTotalPages}
                bookingsTotal={bookingsTotal}
                setBookingsPage={setBookingsPage}
                handleOpenRecordPaymentModal={handleOpenRecordPaymentModal}
              />
            )}

            {activeTab === 'chats' && (
              <AdminChatsTab
                chatsList={chatsList}
                searchChats={searchChats}
                setSearchChats={setSearchChats}
                selectedChatTrip={selectedChatTrip}
                loadChatDetails={loadChatDetails}
                activeChatMessages={activeChatMessages}
                activeChatMembers={activeChatMembers}
                chatMessageInput={chatMessageInput}
                setChatMessageInput={setChatMessageInput}
                chatMediaUrlInput={chatMediaUrlInput}
                setChatMediaUrlInput={setChatMediaUrlInput}
                chatPinMessage={chatPinMessage}
                setChatPinMessage={setChatPinMessage}
                isChatSending={isChatSending}
                isChatLoading={isChatLoading}
                handleSendChatMessage={handleSendChatMessage}
                handleToggleAnnouncementMode={handleToggleAnnouncementMode}
                setIsChatMembersModalOpen={setIsChatMembersModalOpen}
              />
            )}

            {activeTab === 'scanner' && (
              <AdminScannerTab
                qrTokenInput={qrTokenInput}
                setQrTokenInput={setQrTokenInput}
                scanResult={scanResult}
                isScanning={isScanning}
                handleVerifyQR={handleVerifyQR}
              />
            )}

            {activeTab === 'promotions' && (
              <AdminPromotionsTab
                promotions={promotions}
                searchPromotions={searchPromotions}
                setSearchPromotions={setSearchPromotions}
                promosPage={promosPage}
                promosTotalPages={promosTotalPages}
                promosTotal={promosTotal}
                setPromosPage={setPromosPage}
                newPromoCode={newPromoCode}
                setNewPromoCode={setNewPromoCode}
                newPromoType={newPromoType}
                setNewPromoType={setNewPromoType}
                newPromoValue={newPromoValue}
                setNewPromoValue={setNewPromoValue}
                newPromoMin={newPromoMin}
                setNewPromoMin={setNewPromoMin}
                newPromoDays={newPromoDays}
                setNewPromoDays={setNewPromoDays}
                handleCreatePromo={handleCreatePromo}
                handleTogglePromo={handleTogglePromo}
                handleDeletePromo={handleDeletePromo}
              />
            )}

            {activeTab === 'gallery' && (
              <AdminGalleryTab
                gallery={gallery}
                trips={trips}
                searchGallery={searchGallery}
                setSearchGallery={setSearchGallery}
                galleryVisibilityFilter={galleryVisibilityFilter}
                setGalleryVisibilityFilter={setGalleryVisibilityFilter}
                galleryPage={galleryPage}
                galleryTotalPages={galleryTotalPages}
                galleryTotal={galleryTotal}
                setGalleryPage={setGalleryPage}
                setIsPhotoModalOpen={setIsPhotoModalOpen}
                setPhotoUploadMode={setPhotoUploadMode}
                setPhotoForm={setPhotoForm}
                setBatchPhotoUrls={setBatchPhotoUrls}
                handleDeletePhoto={handleDeletePhoto}
              />
            )}

            {activeTab === 'reviews' && (
              <AdminReviewsTab
                reviews={reviews}
                searchReviews={searchReviews}
                setSearchReviews={setSearchReviews}
                reviewsPage={reviewsPage}
                reviewsTotalPages={reviewsTotalPages}
                reviewsTotal={reviewsTotal}
                setReviewsPage={setReviewsPage}
                handleToggleReviewApproval={handleToggleReviewApproval}
                handleToggleReviewFeatured={handleToggleReviewFeatured}
                handleDeleteReview={handleDeleteReview}
              />
            )}

            {activeTab === 'blogs' && (
              <AdminBlogsTab
                blogsList={blogsList}
                searchBlogs={searchBlogs}
                setSearchBlogs={setSearchBlogs}
                blogsPage={blogsPage}
                blogsTotalPages={blogsTotalPages}
                blogsTotal={blogsTotal}
                setBlogsPage={setBlogsPage}
                setIsBlogModalOpen={setIsBlogModalOpen}
                setEditingBlogId={setEditingBlogId}
                setBlogForm={setBlogForm}
                handleDeleteBlog={handleDeleteBlog}
                handleToggleBlogPublish={handleToggleBlogPublish}
              />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab
                usersList={usersList}
                searchUsers={searchUsers}
                setSearchUsers={setSearchUsers}
                selectedUserRole={selectedUserRole}
                setSelectedUserRole={setSelectedUserRole}
                usersPage={usersPage}
                usersTotalPages={usersTotalPages}
                usersTotal={usersTotal}
                setUsersPage={setUsersPage}
              />
            )}
          </main>
        </div>
      </div>

      {/* MODALS */}
      <AdminPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        policyForm={policyForm}
        setPolicyForm={setPolicyForm}
        editingPolicyId={editingPolicyId}
        onSave={handleSavePolicy}
      />

      <AdminTripModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        tripForm={tripForm}
        setTripForm={setTripForm}
        editingTripId={editingTripId}
        onSave={handleSaveTrip}
      />

      <AdminBlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        blogForm={blogForm}
        setBlogForm={setBlogForm}
        editingBlogId={editingBlogId}
        onSave={handleSaveBlog}
      />

      <AdminPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photoUploadMode={photoUploadMode}
        photoForm={photoForm}
        setPhotoForm={setPhotoForm}
        batchPhotoUrls={batchPhotoUrls}
        setBatchPhotoUrls={setBatchPhotoUrls}
        trips={trips}
        isUploadingPhoto={isUploadingPhoto}
        onUpload={handleUploadPhoto}
      />

      <AdminConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
      />

      <AdminManualPaymentModal
        booking={paymentModalBooking}
        onClose={() => setPaymentModalBooking(null)}
        manualPaymentForm={manualPaymentForm}
        setManualPaymentForm={setManualPaymentForm}
        isRecordingPayment={isRecordingPayment}
        onSubmit={handleSubmitManualPayment}
      />

      <AdminChatMembersModal
        isOpen={isChatMembersModalOpen}
        onClose={() => setIsChatMembersModalOpen(false)}
        selectedChatTrip={selectedChatTrip}
        activeChatMembers={activeChatMembers}
      />
    </div>
  );
}
