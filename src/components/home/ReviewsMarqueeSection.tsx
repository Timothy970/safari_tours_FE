'use client';

import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { TripReview } from '../../types';

export interface ReviewsMarqueeSectionProps {
  reviews: TripReview[];
}

export default function ReviewsMarqueeSection({ reviews }: ReviewsMarqueeSectionProps) {
  const testimonials: TripReview[] = reviews.length > 0 ? reviews : [
    {
      id: 1,
      booking_id: 1,
      trip_id: 1,
      user_id: 1,
      reviewer_name: 'Wanjiku Mwangi',
      trip_title: 'Mount Longonot Crater Hike',
      rating: 5,
      headline: 'Life-changing crater rim trail!',
      review_text: 'The guides were incredibly patient and encouraging. Transport was on time and the photography squad sent us 100+ high-res photos the same evening!',
      is_featured: true,
      is_approved: true,
      created_at: '',
    },
    {
      id: 2,
      booking_id: 2,
      trip_id: 2,
      user_id: 2,
      reviewer_name: 'David Ochieng',
      trip_title: 'Elephant Hill Bamboo Summit',
      rating: 5,
      headline: 'Tough hike made fun by amazing rangers',
      review_text: 'Elephant hill is no joke, but the ranger paces and energy kept everyone motivated all the way to the summit. 10/10 booking again!',
      is_featured: true,
      is_approved: true,
      created_at: '',
    },
    {
      id: 3,
      booking_id: 3,
      trip_id: 3,
      user_id: 3,
      reviewer_name: 'Sarah Kimani',
      trip_title: 'Crescent Island Lakeside Camping',
      rating: 5,
      headline: 'Best weekend getaway near Nairobi',
      review_text: 'Sleeping with zebras grazing right outside our tents and the bonfire BBQ under the stars was pure magic. Clean camping gear provided too.',
      is_featured: true,
      is_approved: true,
      created_at: '',
    },
    {
      id: 4,
      booking_id: 4,
      trip_id: 4,
      user_id: 4,
      reviewer_name: 'Brian Mutua',
      trip_title: 'Sagana White Water Rafting',
      rating: 5,
      headline: 'Insane adrenaline and top-notch safety',
      review_text: 'Tackled the Class IV rapids with confidence thanks to certified river marshals. The drone shots captured our raft plunging down the waterfall!',
      is_featured: true,
      is_approved: true,
      created_at: '',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#0F1D36] to-[#0A1424] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
          Verified Explorer Testimonials
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
          Loved by Over 1,500+ Adventurers
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
          Read real dispatches and reviews left by travelers who have explored peaks, wilderness trails, and rapids with Kibali Africa.
        </p>
      </div>

      {/* Infinite Marquee Track */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-marquee hover:pause-marquee w-max py-4">
          {[...testimonials, ...testimonials].map((rev, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shrink-0 space-y-4 shadow-xl hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Traveler</span>
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-sm text-white">{rev.headline}</h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed italic line-clamp-3">
                  "{rev.review_text}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-white">{rev.reviewer_name || (rev as any).user_name || 'Adventurer'}</span>
                <span className="text-emerald-400/80 truncate max-w-[150px]">{rev.trip_title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
