'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Star, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Trip } from '../../types';

export interface FeaturedTripsSectionProps {
  trips: Trip[];
  isLoading: boolean;
  selectedCategory: string;
  categorizeTrip: (trip: Trip) => 'Hikes' | 'Campings' | 'Fun Activities';
}

export default function FeaturedTripsSection({
  trips,
  isLoading,
  selectedCategory,
  categorizeTrip,
}: FeaturedTripsSectionProps) {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full" id="events-section">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#15803D] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming Group Departures</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F1D36]">
            {selectedCategory === 'All' ? 'Curated Kenyan Expeditions' : `Featured ${selectedCategory}`}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
            Fully organized weekend escapes with round-trip transport from Nairobi, certified guide marshals, paramedic kits & photographer coverage.
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:text-[#166534] group"
        >
          <span>View All {trips.length} Events</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Trips Grid */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Discovering active departures...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-sm font-serif font-bold text-[#0F1D36]">No upcoming expeditions found</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting another adventure category or clearing your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => {
            const cat = categorizeTrip(trip);
            const remainingSeats = Math.max(0, (trip.total_seats || 25) - (trip.booked_seats || 0));
            const isAlmostFull = remainingSeats > 0 && remainingSeats <= 5;

            return (
              <div
                key={trip.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                    <img
                      src={trip.featured_image_url}
                      alt={trip.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#0F1D36] shadow-sm">
                        {cat}
                      </span>
                    </div>

                    {/* Remaining Seats */}
                    <div className="absolute top-4 right-4 z-10">
                      {trip.status === 'sold_out' || remainingSeats === 0 ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white shadow-sm">
                          Sold Out
                        </span>
                      ) : isAlmostFull ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm animate-pulse">
                          Only {remainingSeats} spots left
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                          {remainingSeats} spots left
                        </span>
                      )}
                    </div>

                    {/* Title & Duration Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                      <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-bold mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>{trip.destination}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-200 transition-colors line-clamp-1">
                        {trip.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {trip.tagline || trip.overview}
                    </p>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>{trip.departure_date ? new Date(trip.departure_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Upcoming'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>{trip.total_days} Day{trip.total_days > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#15803D]" />
                        <span>Group ({trip.total_seats || 25} max)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#D97706] fill-amber-500" />
                        <span className="font-bold text-[#0F1D36]">4.9 (50+ reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                      From / Citizen
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-xl font-extrabold text-[#0F1D36]">
                        KES {trip.base_price_kes.toLocaleString()}
                      </span>
                    </div>
                    {trip.deposit_required_kes > 0 && (
                      <span className="text-[10px] text-[#15803D] font-bold block">
                        Deposit: KES {trip.deposit_required_kes.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/trips/${trip.slug}`}
                    className="px-5 py-2.5 rounded-full bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md glow-green"
                  >
                    View & Book
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
