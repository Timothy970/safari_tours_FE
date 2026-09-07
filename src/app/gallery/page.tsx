'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, MapPin, X, Compass, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TripGallery } from '../../types';
import api from '../../lib/api';

export default function GalleryPage() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<TripGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tags = ['All', 'Hikes', 'Campings', 'Water Sports', 'Bonfire', 'Summit', 'Day Trips'];

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPublicGallery({ tag: selectedTag === 'All' ? undefined : selectedTag });
        setItems(data);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [selectedTag]);

  const filtered = items;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 sm:pt-32 md:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-10 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <Camera className="w-3.5 h-3.5" />
              <span>Official Kibali Africa Gallery</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1D36] tracking-tight">
              Curated Safari & Hiking Moments
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl">
              Photographs handpicked and published by the Kibali expedition team across Kenya's volcanoes, summits, and wilderness trails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal?tab=vault"
              className="inline-flex items-center gap-2 bg-[#0F1D36] hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Event Photos Vault</span>
            </Link>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-[#15803D] text-white shadow-md glow-green'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">No photographs found</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-72 w-full overflow-hidden bg-slate-900">
                  <img
                    src={photo.media_url}
                    alt={photo.caption || 'Kibali Adventure'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                    <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold uppercase tracking-wider mb-1">
                      <span>{photo.tags || 'Kibali Tribe'}</span>
                    </div>
                    <p className="font-serif font-bold text-sm text-white leading-snug">{photo.caption}</p>
                    {photo.trip_title && (
                      <p className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{photo.trip_title}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fullscreen Interactive Lightbox Modal (Non-downloadable) */}
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white hover:text-emerald-400 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Button */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-emerald-400 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Button */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-emerald-400 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Photo & Caption Container */}
            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center space-y-4">
              <div className="relative max-h-[70vh] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={filtered[lightboxIndex].media_url}
                  alt={filtered[lightboxIndex].caption || 'Adventure'}
                  className="max-h-[70vh] max-w-full object-contain rounded-2xl"
                />
              </div>

              <div className="text-center text-white space-y-1 max-w-xl">
                <h3 className="font-serif text-lg font-bold">
                  {filtered[lightboxIndex].caption || 'Kibali Expedition Moment'}
                </h3>
                <p className="text-xs text-slate-300">
                  {filtered[lightboxIndex].tags} &bull; Photo {lightboxIndex + 1} of {filtered.length}
                </p>
                {filtered[lightboxIndex].trip_title && (
                  <p className="text-xs text-emerald-400 font-semibold">
                    {filtered[lightboxIndex].trip_title}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
