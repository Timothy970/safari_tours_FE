# 🌿 Kibali Africa Tours — Frontend Application

> **"Quiet Luxury Safari & Expedition Platform"**  
> Modern, accessible, and high-performance client web portal built with **Next.js 15 (App Router)**, **React 19**, **TypeScript 5.7**, and **Tailwind CSS**.

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 🧭 Overview & Core Capabilities

The frontend application provides a complete digital experience for Kenyan luxury hiking, wilderness camping, and adventure travelers:

1. **Cinematic Hero & Discovery Engine (`/`)**: Dynamic 3-slide auto-advancing carousel, adventure category quick-filtering (*Hikes*, *Campings*, *Fun Activities*), live search, Hall of Fame conquers recap, infinite testimonial marquee, and bento memory gallery.
2. **Consultative Booking Funnel (`/book/[slug]`)**: 3-step checkout with real-time seat quota verification, add-on equipment upgrades (private luxury tents, 4K summit drone reels), flexible deposit commitment, promo code discounts, and dual gateway selection (Safaricom Lipa Na M-Pesa & Pesapal).
3. **Traveler Portal (`/portal`)**: Secure client dashboard featuring active bookings, digital QR boarding pass rendering, live M-Pesa balance settlement, expedition squad group chats with ranger dispatches, high-resolution media vault, and Eden Reforestation tree impact badges.
4. **Comprehensive Admin Operations Suite (`/admin`)**: 11 dedicated management workspaces including financial revenue analytics, trip/safari catalog manager, booking manifest exporter, real-time WebSocket chat moderation, QR boarding pass gate scanner, promotion codes, review moderation, photo vault curator, user role administration, and dynamic site CMS settings & policies.
5. **Interactive WYSIWYG Rich Text Editor (`RichTextEditor`)**: Custom toolbar with Heading tiers (H1, H2, H3), bold, italic, blockquotes, lists, dynamic image URL insertion with live thumbnail preview, and formatted HTML output used across blog authors and site CMS policies.

---

## 📁 Architecture & Directory Layout

The frontend codebase is fully modularized with strict separation of concerns, keeping file sizes maintainable and type-safe.

```
frontend/
├── src/
│   ├── app/                                # Next.js 15 App Router
│   │   ├── page.tsx                        # Streamlined landing page orchestrator
│   │   ├── layout.tsx                      # Global root layout with providers & fonts
│   │   ├── globals.css                     # Custom design tokens, animations & glassmorphism
│   │   ├── about/                          # Brand story, impact mission & team
│   │   ├── admin/                          # Executive administrative suite
│   │   ├── auth/                           # Login and Registration flows with demo role switchers
│   │   ├── blogs/                          # Safari journal & hiking prep guides
│   │   │   └── [slug]/                     # Blog post details with rich HTML reader
│   │   ├── book/                           # Multi-step checkout funnel
│   │   │   └── [slug]/                     # Modular booking orchestrator
│   │   ├── events/                         # Full catalog filter and search
│   │   ├── gallery/                        # Public community media vault
│   │   ├── policies/                       # Dynamic site policies and legal guarantees
│   │   ├── portal/                         # Traveler dashboard
│   │   └── trips/                          # Trip detail showcase with packing list & weather
│   │       └── [slug]/
│   │
│   ├── components/                         # Modular Subcomponents
│   │   ├── admin/                          # Admin Suite Tabs & Modals
│   │   │   ├── AdminOverviewTab.tsx        # Revenue KPIs, charts & occupancy stats
│   │   │   ├── AdminSettingsTab.tsx        # Brand story CMS & dynamic policies
│   │   │   ├── AdminTripsTab.tsx           # Safari catalog & seat controls
│   │   │   ├── AdminTripModal.tsx          # Create/edit trip modal
│   │   │   ├── AdminBookingsTab.tsx        # Passenger manifest & payment status
│   │   │   ├── AdminManualPaymentModal.tsx # Record offline cash/bank deposits
│   │   │   ├── AdminChatsTab.tsx           # Group chat monitor & broadcasts
│   │   │   ├── AdminChatMembersModal.tsx   # Squad member roster inspector
│   │   │   ├── AdminScannerTab.tsx         # Real-time QR gate check-in scanner
│   │   │   ├── AdminPromotionsTab.tsx      # Voucher & discount code manager
│   │   │   ├── AdminGalleryTab.tsx         # Media vault photo curation
│   │   │   ├── AdminPhotoModal.tsx         # Single & batch photo upload
│   │   │   ├── AdminReviewsTab.tsx         # Testimonial approval & feature toggles
│   │   │   ├── AdminBlogsTab.tsx           # Blog publishing table
│   │   │   ├── AdminBlogModal.tsx          # Rich text blog authoring modal
│   │   │   ├── AdminUsersTab.tsx           # Explorer profiles & Eco points
│   │   │   ├── AdminPolicyModal.tsx        # Dynamic policy creator modal
│   │   │   ├── AdminConfirmDialog.tsx      # Reusable confirmation modal
│   │   │   └── AdminPaginationBar.tsx      # Standard table pagination
│   │   │
│   │   ├── booking/                        # Booking Funnel Subcomponents
│   │   │   ├── BookingGuestStep.tsx        # Step 1: Group size, lead guest & add-ons
│   │   │   ├── BookingPaymentStep.tsx      # Step 2: Deposit options, promos & STK push
│   │   │   ├── BookingSummaryCard.tsx      # Sticky real-time price & deposit breakdown
│   │   │   └── BookingSuccessStep.tsx      # Step 3: Confirmation & QR Boarding pass
│   │   │
│   │   ├── home/                           # Landing Page Modular Sections
│   │   │   ├── HeroSection.tsx             # 3-slide auto carousel
│   │   │   ├── CategoryFilterSection.tsx   # Category pills & quick search
│   │   │   ├── FeaturedTripsSection.tsx    # Upcoming group departures grid
│   │   │   ├── PastExpeditionsSection.tsx  # Conquered Hall of Fame recap
│   │   │   ├── ReviewsMarqueeSection.tsx   # Infinite moving review cards
│   │   │   ├── GalleryPreviewSection.tsx   # Bento grid media preview
│   │   │   ├── LatestBlogsSection.tsx      # Curated advice articles
│   │   │   └── SafetyPerksBanner.tsx       # Safety guarantees & CTA banner
│   │   │
│   │   ├── portal/                         # Traveler Portal Subcomponents
│   │   │   ├── PortalBookingsTab.tsx       # Booked trips, QR pass & balance CTA
│   │   │   ├── PortalChatTab.tsx           # Live squad chat with emoji picker & mentions
│   │   │   ├── PortalVaultTab.tsx          # High-res photo download vault
│   │   │   ├── PortalImpactTab.tsx         # Eden Reforestation tree counters
│   │   │   ├── PortalNotificationsTab.tsx  # In-app dispatches & payment alerts
│   │   │   ├── PortalReviewModal.tsx       # Trip feedback rating modal
│   │   │   ├── PortalPhotoUploadModal.tsx  # Traveler photo share modal
│   │   │   └── PortalSTKPaymentModal.tsx   # M-Pesa STK balance settlement modal
│   │   │
│   │   ├── layout/                         # Navigation & Global Layout
│   │   │   ├── Navbar.tsx                  # Responsive header with role switcher
│   │   │   ├── Footer.tsx                  # Global footer with brand links
│   │   │   └── BottomNavBar.tsx            # Mobile bottom app navigation
│   │   │
│   │   ├── ui/                             # Specialized UI Widgets
│   │   │   ├── BoardingPassCard.tsx        # Perforated airline-grade digital pass
│   │   │   └── SightingsRadar.tsx          # Real-time wildlife sightings map
│   │   │
│   │   ├── RichTextEditor.tsx              # Interactive WYSIWYG text editor
│   │   └── RichContentRenderer.tsx         # Formatted HTML renderer with auto-previews
│   │
│   ├── context/                            # React Context Providers
│   │   ├── AuthContext.tsx                 # User session, JWT tokens & demo switchers
│   │   ├── SiteSettingsContext.tsx         # Dynamic brand settings & policy cache
│   │   └── ToastContext.tsx                # Animated notification dispatches
│   │
│   ├── lib/                                # API Client & Utilities
│   │   ├── api.ts                          # Unified typed Axios/Fetch API client
│   │   └── utils.ts                        # Currency formatters & date helpers
│   │
│   └── types/                              # Shared TypeScript Types & Interfaces
│       └── index.ts                        # Trip, Booking, Review, Gallery, Blog, Policy
│
├── .env.example                            # Environment template
├── package.json                            # Scripts & dependencies
├── tsconfig.json                           # Strict TypeScript configuration
└── tailwind.config.ts                      # Custom color themes & animations
```

---

## 🛠️ Environment Configuration

Create a `.env.local` file in the `frontend` root:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# WebSocket Endpoint (Auto-configured based on window.location if empty)
NEXT_PUBLIC_WS_URL=ws://localhost:8080/api/v1
```

---

## 🚀 Running the Frontend

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verify Type Safety (No-Emit Check)
```bash
node ./node_modules/typescript/bin/tsc --noEmit
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Demo Role Switcher

You can test all user journeys immediately via the Demo Role Switcher on the login page (`/auth/login`):
- **Explorer / Traveler**: `traveler@kibaliafrica.com` / `Safari2026!`
- **Lead Naturalist Ranger**: `guide.joseph@kibaliafricatours.com` / `Safari2026!`
- **Safari Director / Admin**: `admin@kibaliafricatours.com` / `AdminKibali2026!`
