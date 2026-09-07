'use client';

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../types';

export interface PastExpeditionsSectionProps {
  pastTrips: Trip[];
}

export default function PastExpeditionsSection({ pastTrips }: PastExpeditionsSectionProps) {
  if (pastTrips.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#15803D]">
            <Award className="w-4 h-4" />
            <span>Trail Hall of Fame</span>
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-[#0F1D36]">Conquered Expeditions</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A look back at recent summits, highland hikes, and wilderness camps conquered by our explorer community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastTrips.slice(0, 4).map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={trip.featured_image_url}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Conquered</span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {trip.destination}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#0F1D36] truncate">{trip.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>{trip.booked_seats || 22} Adventurers</span>
                  <Link
                    href={`/trips/${trip.slug}`}
                    className="text-[#15803D] font-bold hover:underline"
                  >
                    View Recap &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
