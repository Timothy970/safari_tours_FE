'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, MapPin, Clock, Loader2 } from 'lucide-react';
import { Trip } from '../../types';
import api from '../../lib/api';

export default function BookIndexPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.getTrips();
        setTrips(data);
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Compass className="w-3.5 h-3.5" />
            <span>Consultative Reservation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F1D36]">
            Start Designing Your Safari
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-sans">
            Choose an upcoming departure to begin your multi-step reservation with flexible deposit options and instant confirmation.
          </p>
        </div>

        {/* List of Expeditions */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
            <p className="text-xs text-slate-500">Loading expedition inventory...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={trip.featured_image_url}
                    alt={trip.title}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#0F1D36]">{trip.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#15803D]" />
                        <span>{trip.destination}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#15803D]" />
                        <span>{trip.total_days} Days</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase text-slate-400 block font-bold">
                      Deposit From
                    </span>
                    <span className="font-serif font-bold text-base text-[#0F1D36]">
                      KES {trip.deposit_required_kes?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href={`/book/${trip.slug}`}
                    className="bg-[#15803D] hover:bg-[#166534] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md glow-green transition-all"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
