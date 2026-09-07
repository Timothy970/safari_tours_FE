'use client';

import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { TripReview } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminReviewsTabProps {
  reviews: TripReview[];
  searchReviews: string;
  setSearchReviews: (val: string) => void;
  reviewsPage: number;
  reviewsTotalPages: number;
  reviewsTotal: number;
  setReviewsPage: (page: number) => void;
  handleToggleReviewApproval: (id: number, current: boolean) => Promise<void>;
  handleToggleReviewFeatured: (id: number, current: boolean) => Promise<void>;
  handleDeleteReview: (id: number) => void;
}

export default function AdminReviewsTab({
  reviews,
  searchReviews,
  setSearchReviews,
  reviewsPage,
  reviewsTotalPages,
  reviewsTotal,
  setReviewsPage,
  handleToggleReviewApproval,
  handleToggleReviewFeatured,
  handleDeleteReview,
}: AdminReviewsTabProps) {
  const filteredReviews = reviews.filter((r) =>
    (r.reviewer_name && r.reviewer_name.toLowerCase().includes(searchReviews.toLowerCase())) ||
    (r.review_text && r.review_text.toLowerCase().includes(searchReviews.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Traveler Testimonials & Moderation</h3>
      </div>

      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#0F1D36]">{rev.reviewer_name || 'Traveler'}</span>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{rev.review_text}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleReviewApproval(rev.id, rev.is_approved)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  rev.is_approved ? 'bg-emerald-100 text-[#15803D]' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {rev.is_approved ? 'Approved' : 'Pending'}
              </button>
              <button
                onClick={() => handleDeleteReview(rev.id)}
                className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminPaginationBar
        currentPage={reviewsPage}
        totalPages={reviewsTotalPages}
        totalItems={reviewsTotal}
        onPageChange={setReviewsPage}
        itemsLabel="reviews"
      />
    </div>
  );
}
