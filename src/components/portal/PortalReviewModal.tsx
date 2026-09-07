'use client';

import React from 'react';
import { X, Star } from 'lucide-react';
import { Booking } from '../../types';

export interface PortalReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewBooking: Booking | null;
  reviewRating: number;
  setReviewRating: (r: number) => void;
  reviewHeadline: string;
  setReviewHeadline: (h: string) => void;
  reviewText: string;
  setReviewText: (t: string) => void;
  isSubmittingReview: boolean;
  handleSubmitReview: (e: React.FormEvent) => Promise<void>;
}

export default function PortalReviewModal({
  isOpen,
  onClose,
  reviewBooking,
  reviewRating,
  setReviewRating,
  reviewHeadline,
  setReviewHeadline,
  reviewText,
  setReviewText,
  isSubmittingReview,
  handleSubmitReview,
}: PortalReviewModalProps) {
  if (!isOpen || !reviewBooking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Share Expedition Feedback</h3>
            <p className="text-xs text-slate-500">{reviewBooking.trip_title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-400 focus:outline-none"
                >
                  <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Unforgettable Kilimanjaro Sunrise"
              value={reviewHeadline}
              onChange={(e) => setReviewHeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Your Experience Story</label>
            <textarea
              rows={4}
              required
              placeholder="Tell other adventurers about your guides, wildlife encounters, and packing tips..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0F1D36]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow"
            >
              {isSubmittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
