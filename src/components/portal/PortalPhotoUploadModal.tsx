'use client';

import React from 'react';
import { X, Upload } from 'lucide-react';
import { Booking } from '../../types';

export interface PortalPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  uploadUrl: string;
  setUploadUrl: (url: string) => void;
  uploadCaption: string;
  setUploadCaption: (cap: string) => void;
  uploadTags: string;
  setUploadTags: (tags: string) => void;
  handleUploadPhoto: (e: React.FormEvent) => Promise<void>;
}

export default function PortalPhotoUploadModal({
  isOpen,
  onClose,
  uploadUrl,
  setUploadUrl,
  uploadCaption,
  setUploadCaption,
  uploadTags,
  setUploadTags,
  handleUploadPhoto,
}: PortalPhotoUploadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Upload Safari Capture</h3>
            <p className="text-xs text-slate-500">Share memories with your group members</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUploadPhoto} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Direct Image URL *</label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Caption / Title</label>
            <input
              type="text"
              placeholder="e.g. Lioness on dawn patrol"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="Wildlife, Big5, Sunrise"
              value={uploadTags}
              onChange={(e) => setUploadTags(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
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
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow"
            >
              Upload Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
