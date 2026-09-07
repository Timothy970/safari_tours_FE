'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Upload, Download, X, Loader2 } from 'lucide-react';
import { TripGallery, Booking } from '../../types';

export interface PortalVaultTabProps {
  bookings: Booking[];
  selectedTripForVault: number | null;
  vaultPhotosForTrip: TripGallery[];
  isVaultLoading: boolean;
  vaultLightboxIndex: number | null;
  setVaultLightboxIndex: (idx: number | null) => void;
  handleSelectTripForVault: (tripId: number) => void;
  handleDownloadPhoto: (url: string, filename: string) => void;
  setIsUploadModalOpen: (open: boolean) => void;
}

export default function PortalVaultTab({
  bookings,
  selectedTripForVault,
  vaultPhotosForTrip,
  isVaultLoading,
  vaultLightboxIndex,
  setVaultLightboxIndex,
  handleSelectTripForVault,
  handleDownloadPhoto,
  setIsUploadModalOpen,
}: PortalVaultTabProps) {
  const userBookedTrips = Array.from(
    new Map(
      bookings
        .filter((b) => b.trip_id && b.trip_title)
        .map((b) => [b.trip_id, { id: b.trip_id, title: b.trip_title, date: b.trip_departure || b.created_at }])
    ).values()
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {userBookedTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Camera className="w-12 h-12 text-[#15803D] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl text-[#0F1D36] font-bold">No event albums unlocked yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your event photo vault unlocks automatically when you reserve an expedition.
          </p>
          <Link
            href="/events"
            className="mt-4 inline-block bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow"
          >
            Explore Upcoming Events
          </Link>
        </div>
      ) : (
        <>
          {/* Trip Selector Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#15803D]" />
                <span>Shared Expedition Media Vault</span>
              </h3>
              <p className="text-xs text-slate-500">High-resolution wildlife and summit captures curated by guides & guests</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedTripForVault || ''}
                onChange={(e) => handleSelectTripForVault(parseInt(e.target.value, 10))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                {userBookedTrips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          {isVaultLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 text-[#15803D] animate-spin mx-auto" />
            </div>
          ) : vaultPhotosForTrip.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <p className="text-xs text-slate-500">No photos uploaded to this expedition album yet.</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-3 text-xs text-[#15803D] font-bold hover:underline"
              >
                Be the first to upload photos!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {vaultPhotosForTrip.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => setVaultLightboxIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 cursor-pointer shadow-sm border border-slate-200"
                >
                  <img src={photo.media_url} alt={photo.caption || 'Photo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white text-xs">
                    <span className="font-bold line-clamp-1">{photo.caption || 'Safari Capture'}</span>
                    <span className="text-[10px] text-slate-300">By {photo.photographer_name || 'Adventurer'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lightbox Modal */}
          {vaultLightboxIndex !== null && vaultPhotosForTrip[vaultLightboxIndex] && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <button
                onClick={() => setVaultLightboxIndex(null)}
                className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 rounded-full bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center">
                <img
                  src={vaultPhotosForTrip[vaultLightboxIndex].media_url}
                  alt="Full View"
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
                <div className="flex items-center justify-between w-full mt-4 text-white text-xs px-2">
                  <span>{vaultPhotosForTrip[vaultLightboxIndex].caption || 'Expedition Photo'}</span>
                  <button
                    onClick={() =>
                      handleDownloadPhoto(
                        vaultPhotosForTrip[vaultLightboxIndex].media_url,
                        `safari-${vaultPhotosForTrip[vaultLightboxIndex].id}.jpg`
                      )
                    }
                    className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-full font-bold text-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Resolution</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
