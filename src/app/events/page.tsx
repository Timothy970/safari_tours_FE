'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Compass, MapPin, Clock, Filter, ArrowRight, Search, CheckCircle2, Calendar, Trees, Loader2, Mountain, Tent, Waves, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Trip } from '../../types';
import api from '../../lib/api';

function EventsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const initialTab = searchParams.get('tab') === 'past' ? 'past' : 'upcoming';

  const { isAuthenticated } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>(initialTab);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc'>('date');

  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  const [pastCount, setPastCount] = useState<number>(0);

  const categorizeTrip = (trip: Trip): 'Hikes' | 'Campings' | 'Fun Activities' => {
    const titleLower = trip.title.toLowerCase();
    const destLower = trip.destination.toLowerCase();
    const tagLower = (trip.tagline || '').toLowerCase();

    if (titleLower.includes('camp') || destLower.includes('camp') || tagLower.includes('camp') || trip.total_nights > 0) {
      return 'Campings';
    }
    if (
      titleLower.includes('rafting') ||
      titleLower.includes('cycling') ||
      titleLower.includes('spa') ||
      titleLower.includes('gorge') ||
      titleLower.includes('fun') ||
      titleLower.includes('safari')
    ) {
      return 'Fun Activities';
    }
    return 'Hikes';
  };

  const categories = ['All', 'Hikes', 'Campings', 'Fun Activities'];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [up, past] = await Promise.all([
          api.getTrips({ status: 'upcoming' }),
          api.getTrips({ status: 'completed' }),
        ]);
        setUpcomingCount(up.length);
        setPastCount(past.length);
      } catch (err) {
        // silent
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const sortParam =
          sortBy === 'price_asc'
            ? 'price_asc'
            : sortBy === 'price_desc'
            ? 'price_desc'
            : activeTab === 'upcoming'
            ? 'date_asc'
            : 'date_desc';

        const data = await api.getTrips({
          status: activeTab === 'upcoming' ? 'upcoming' : 'completed',
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          difficulty: selectedDifficulty === 'All' ? undefined : selectedDifficulty,
          search: searchTerm.trim() || undefined,
          sort_by: sortParam,
        });
        setTrips(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTrips();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeTab, selectedCategory, selectedDifficulty, searchTerm, sortBy]);

  const filteredEvents = trips;

  const handleBookClick = (tripSlug: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/book/${tripSlug}`);
    } else {
      router.push(`/book/${tripSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Compass className="w-3.5 h-3.5" />
            <span>Kibali Adventure Dispatch</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1D36]">
            Hikes, Campings & Fun Activities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-2 max-w-2xl">
            Explore our curated calendar of mountain summits, scenic lakeside campings, and thrilling day excursions across Kenya.
          </p>
        </div>

        {/* Dual Tab Switcher: Upcoming Events vs Past Events */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-[#15803D] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Expeditions ({upcomingCount || trips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'past'
                ? 'bg-[#15803D] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conquered & Past Events ({pastCount})</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search trails, hills, lakes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D] font-medium"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'All' ? 'All Activities' : cat}
                </button>
              ))}
            </div>

            {/* Difficulty & Sorting */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#15803D]"
              >
                <option value="All">All Difficulties</option>
                <option value="easy">Easy / Beginner</option>
                <option value="moderate">Moderate Trail</option>
                <option value="challenging">Challenging / Peak</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#15803D]"
              >
                <option value="date">Sort by Date</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading events calendar...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Mountain className="w-12 h-12 text-[#15803D] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#0F1D36] font-bold">No events found matching your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try adjusting your category or difficulty filters, or search for a different destination.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((trip) => {
              const remaining = trip.total_seats - trip.booked_seats;
              const cat = categorizeTrip(trip);
              const isPast = trip.status === 'completed';

              return (
                <div
                  key={trip.id}
                  className="bento-card group flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                    <img
                      src={trip.featured_image_url}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3 bg-[#0F1D36]/90 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1 shadow-sm">
                      {cat === 'Hikes' && <Mountain className="w-3 h-3 text-[#15803D]" />}
                      {cat === 'Campings' && <Tent className="w-3 h-3 text-amber-400" />}
                      {cat === 'Fun Activities' && <Waves className="w-3 h-3 text-cyan-400" />}
                      <span>{cat}</span>
                    </div>

                    {/* Status / Remaining Seats Badge */}
                    <div className="absolute top-3 right-3">
                      {isPast ? (
                        <span className="bg-slate-800/90 text-slate-200 border border-slate-600 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Conquered</span>
                        </span>
                      ) : remaining > 5 ? (
                        <span className="bg-[#15803D] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          {remaining} Spots Left
                        </span>
                      ) : remaining > 0 ? (
                        <span className="bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-pulse">
                          {remaining} Spots Left
                        </span>
                      ) : (
                        <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Title & Duration Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                        <Calendar className="w-3 h-3" />
                        <span>{trip.departure_date}</span>
                        <span>&bull;</span>
                        <span>{trip.total_days > 1 ? `${trip.total_days}D / ${trip.total_nights}N` : 'Day Trip'}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold leading-snug drop-shadow-sm text-white mt-0.5">
                        {trip.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <p className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">
                      {trip.overview}
                    </p>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                        <span className="truncate">{trip.destination.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{trip.trees_planted_per_booking || 3} Trees</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                        <span className="capitalize">{trip.difficulty}</span>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                          Per Person
                        </span>
                        <div className="text-base font-serif font-black text-[#0F1D36]">
                          KES {trip.base_price_kes?.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/trips/${trip.slug}`}
                          className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#15803D] hover:bg-emerald-50 rounded-full transition-colors"
                        >
                          Details
                        </Link>
                        {isPast ? (
                          <Link
                            href="/gallery"
                            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Vault</span>
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleBookClick(trip.slug)}
                            className="inline-flex items-center gap-1.5 bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all group-hover:gap-2"
                          >
                            <span>Book</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9]">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
        </div>
      }
    >
      <EventsCatalogContent />
    </Suspense>
  );
}
