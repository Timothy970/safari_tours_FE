'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { MapPin, Car, Mountain, CheckCircle2, XCircle, Award, ArrowRight, Bed, Utensils, ShieldCheck, Eye, Loader2, Camera, X, Compass, LogIn } from 'lucide-react';
import { Trip, ParkWeather, TripGallery } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import WeatherWidget from '../../../components/ui/WeatherWidget';
import RichContentRenderer from '../../../components/RichContentRenderer';
import api from '../../../lib/api';

export default function TripDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isAuthenticated } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [weather, setWeather] = useState<ParkWeather | null>(null);
  const [vaultPhotos, setVaultPhotos] = useState<TripGallery[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<TripGallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(2);
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const loadTrip = async () => {
      if (!slug) return;
      try {
        const tripData = await api.getTripBySlug(slug);
        if (tripData && isMounted) {
          setTrip(tripData);
          const [weatherData, publicPhotos] = await Promise.all([
            api.getWeather(tripData.destination).catch(() => null),
            api.getPublicGallery({ tag: tripData.category || undefined }).catch(() => []),
          ]);

          if (isMounted) {
            setWeather(weatherData);

            let photos: TripGallery[] = [];
            // If authenticated, attempt to fetch private vault for booked travelers
            if (typeof window !== 'undefined' && localStorage.getItem('kibali_access_token')) {
              photos = await api.getTripVault(tripData.id).catch(() => []);
            }
            if (photos.length === 0 && publicPhotos.length > 0) {
              photos = publicPhotos.slice(0, 6);
            }
            setVaultPhotos(photos);
          }
        }
      } catch (err) {
        console.error('Failed to load trip detail:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTrip();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FCFBF9]">
        <Loader2 className="w-10 h-10 text-[#15803D] animate-spin" />
        <p className="text-sm font-semibold text-[#0F1D36]">Loading expedition dossier...</p>
      </div>
    );
  }

  if (!trip) {
    notFound();
  }

  const defaultWeather: ParkWeather = {
    destination: trip.destination,
    temperature_c: 24,
    condition: 'Sunny & Clear',
    humidity: 48,
    precipitation: '0% rain',
    sunrise: '06:22 AM',
    sunset: '06:34 PM',
    game_drive_tip: 'Optimal light for wildlife viewing during early morning & golden hour.',
  };

  const activeWeather = weather || defaultWeather;
  const totalPriceKes = trip.base_price_kes * guestCount;
  const depositKes = trip.deposit_required_kes * guestCount;

  const isPastExpedition =
    trip.status === 'completed' ||
    (trip.departure_date ? new Date(trip.departure_date).getTime() < Date.now() - 24 * 3600 * 1000 : false);

  const togglePackingCheck = (itemName: string) => {
    setPackedItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pb-24 md:pb-16">
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative min-h-[50vh] sm:min-h-[58vh] flex items-end pb-12 pt-32 sm:pt-36 bg-[#0F1D36] text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('${trip.banner_image_url || trip.featured_image_url}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFBF9] via-[#0F1D36]/60 to-[#0F1D36]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {isPastExpedition ? (
              <span className="bg-emerald-700 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Conquered Expedition</span>
              </span>
            ) : (
              <span className="bg-[#15803D] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {trip.total_days} Days / {trip.total_nights} Nights
              </span>
            )}
            <span className="bg-[#0F1D36]/85 backdrop-blur-md text-emerald-300 text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-400/30">
              <MapPin className="w-3 h-3 text-[#15803D]" />
              <span>{trip.destination}, {trip.country}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-sm max-w-4xl leading-tight">
            {trip.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mt-2 font-sans font-medium">
            {trip.tagline || trip.overview}
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT & BENTO DETAILS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* LEFT COLUMN: Overview, Sightings, Vertical Journey Timeline */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Card */}
            <div className="bento-card bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="font-serif text-2xl text-[#0F1D36] mb-4 font-bold">Expedition Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-6 font-light">
                {trip.overview}
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <Car className="w-5 h-5 text-[#15803D]" />
                  <div>
                    <p className="font-bold text-[#0F1D36]">4x4 Cruiser</p>
                    <p className="text-[11px] text-slate-500">Guaranteed window</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mountain className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-[#0F1D36]">Guided Ascent</p>
                    <p className="text-[11px] text-slate-500">Certified Leaders</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-[#D97706]" />
                  <div>
                    <p className="font-bold text-[#0F1D36]">KPSGA Certified</p>
                    <p className="text-[11px] text-slate-500">Silver Ranger Guide</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#0F1D36]" />
                  <div>
                    <p className="font-bold text-[#0F1D36]">Trail Sweep</p>
                    <p className="text-[11px] text-slate-500">Safety Marshals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. VERTICAL TIMELINE / ITINERARY */}
            {trip.itineraries && trip.itineraries.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#0F1D36] font-bold">Expedition Itinerary</h2>
                    <p className="text-xs text-slate-500">Day-by-day expedition schedule & highlights.</p>
                  </div>
                  <span className="text-xs font-bold text-[#15803D] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {trip.itineraries.length} Days Total
                  </span>
                </div>

                <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-600/30 space-y-8 ml-2 sm:ml-4">
                  {trip.itineraries.map((it, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Node Dot */}
                      <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#15803D] text-white flex items-center justify-center text-[10px] font-bold shadow-md ring-4 ring-white">
                        {it.day_number}
                      </div>

                      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm group-hover:border-emerald-300 transition-colors space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#0F1D36]">
                            Day {it.day_number}: {it.title}
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed font-light">
                          {it.description}
                        </p>

                        {(it.accommodation || it.meals_included) && (
                          <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                            {it.accommodation && (
                              <div className="flex items-center gap-1.5">
                                <Bed className="w-3.5 h-3.5 text-[#15803D]" />
                                <span>{it.accommodation}</span>
                              </div>
                            )}
                            {it.meals_included && (
                              <div className="flex items-center gap-1.5">
                                <Utensils className="w-3.5 h-3.5 text-[#D97706]" />
                                <span>{it.meals_included}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. REAL-TIME PARK WEATHER */}
            <WeatherWidget weather={activeWeather} />

            {/* 5. INCLUSIONS & EXCLUSIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/80 space-y-4">
                <h3 className="font-serif text-lg font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                  <span>What is Included</span>
                </h3>
                <ul className="space-y-2 text-xs text-emerald-900">
                  {trip.inclusions
                    ?.filter((inc) => inc.item_type === 'included')
                    .map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#15803D] font-bold">&bull;</span>
                        <span>{inc.description}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-rose-50/40 rounded-2xl p-6 border border-rose-200/80 space-y-4">
                <h3 className="font-serif text-lg font-bold text-rose-950 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>What is Excluded</span>
                </h3>
                <ul className="space-y-2 text-xs text-rose-900">
                  {trip.inclusions
                    ?.filter((inc) => inc.item_type === 'excluded')
                    .map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">&bull;</span>
                        <span>{inc.description}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* 7. EXPEDITION MEDIA & MEMORIES VAULT */}
            {vaultPhotos.length > 0 && (
              <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#15803D]" />
                    <h3 className="font-serif text-xl font-bold text-[#0F1D36]">
                      {isPastExpedition ? 'Conquered Memories & Highlights' : 'Expedition Photo Gallery'}
                    </h3>
                  </div>
                  <Link
                    href="/gallery"
                    className="text-xs text-[#15803D] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View All Kibali Media</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs text-slate-500">
                  {isPastExpedition
                    ? 'Authentic summit captures, wildlife sightings, and trail moments from this completed expedition.'
                    : 'Authentic moments captured on this safari route by guides and travelers.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {vaultPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={photo.thumbnail_url || photo.media_url}
                        alt={photo.caption || trip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

                {!isAuthenticated && isPastExpedition && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-[#0F1D36]">Were you on this expedition?</p>
                      <p className="text-[11px] text-slate-500">
                        Sign in to access and download your squad's private high-resolution photo vault.
                      </p>
                    </div>
                    <Link
                      href={`/auth/login?redirect=/trips/${trip.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F1D36] hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all shadow-sm"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In to Access Vault</span>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Booking or Recap Drawer */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                {isPastExpedition ? (
                  /* CONQUERED EXPEDITION RECAP CARD */
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                      <span>Conquered Expedition</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                        Trail Hall of Fame
                      </span>
                      <div className="text-2xl font-serif font-black text-[#0F1D36] mt-1">
                        Expedition Conquered
                      </div>
                    </div>

                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-emerald-950 font-bold">
                        <span>Summit Verification:</span>
                        <span className="text-[#15803D]">Completed & Archived</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Expedition bookings for this past departure are closed. Explore our upcoming scheduled expeditions to book the next departure.
                      </p>
                    </div>

                    <Link
                      href="/events"
                      className="w-full text-center block bg-[#15803D] hover:bg-[#166534] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all glow-green"
                    >
                      Explore Upcoming Expeditions &rarr;
                    </Link>

                    {isAuthenticated ? (
                      <Link
                        href="/portal?tab=vault"
                        className="w-full text-center block bg-slate-100 hover:bg-slate-200 text-[#0F1D36] py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Open My Photo Vault
                      </Link>
                    ) : (
                      <Link
                        href={`/auth/login?redirect=/trips/${trip.slug}`}
                        className="w-full text-center block bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0F1D36] py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Sign In as Past Attendee
                      </Link>
                    )}
                  </div>
                ) : (
                  /* UPCOMING EXPEDITION BOOKING CARD */
                  <>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                        Expedition Pricing
                      </span>
                      <div className="text-3xl font-serif font-black text-[#0F1D36] mt-1">
                        KES {trip.base_price_kes?.toLocaleString()}
                      </div>
                      <p className="text-[11px] text-slate-500">per person sharing / all park fees included</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-[#0F1D36] flex items-center justify-between">
                        <span>Number of Travelers</span>
                        <span className="text-[#15803D] font-mono">{guestCount} Guests</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F1D36] font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-bold text-sm bg-slate-50 py-2 rounded-xl border border-slate-200">
                          {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                        </div>
                        <button
                          onClick={() => setGuestCount(guestCount + 1)}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F1D36] font-bold text-lg flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Total Expedition Cost:</span>
                        <span className="font-bold text-[#0F1D36]">
                          KES {totalPriceKes?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#15803D] font-semibold">
                        <span>Deposit to Reserve (Flexible):</span>
                        <span className="font-bold">
                          KES {depositKes?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={
                        isAuthenticated
                          ? `/book/${trip.slug}?guests=${guestCount}&deposit=true`
                          : `/auth/login?redirect=/book/${trip.slug}?guests=${guestCount}&deposit=true`
                      }
                      className="w-full text-center block bg-[#15803D] hover:bg-[#166534] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all glow-green"
                    >
                      Reserve with Deposit &rarr;
                    </Link>

                    <p className="text-[10px] text-center text-slate-400">
                      Instant M-Pesa STK push. 100% money-back guarantee in accordance with our terms.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Photo Modal / Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-in zoom-in-95">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.media_url}
                alt={selectedPhoto.caption || trip.title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base">
                  {selectedPhoto.caption || `${trip.title} capture`}
                </h4>
                {selectedPhoto.tags && (
                  <p className="text-[11px] text-emerald-400 mt-0.5">#{selectedPhoto.tags}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors self-end sm:self-auto"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
