'use client';

import React from 'react';
import { Plus, Search, Upload, Trash2 } from 'lucide-react';
import { TripGallery, Trip } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminGalleryTabProps {
  gallery: TripGallery[];
  trips: Trip[];
  searchGallery: string;
  setSearchGallery: (val: string) => void;
  galleryVisibilityFilter: 'all' | 'public' | 'vault';
  setGalleryVisibilityFilter: (val: 'all' | 'public' | 'vault') => void;
  galleryPage: number;
  galleryTotalPages: number;
  galleryTotal: number;
  setGalleryPage: (page: number) => void;
  setIsPhotoModalOpen: (open: boolean) => void;
  setPhotoUploadMode: (mode: 'single' | 'batch') => void;
  setPhotoForm: (form: any) => void;
  setBatchPhotoUrls: (urls: string) => void;
  handleDeletePhoto: (id: number) => void;
}

export default function AdminGalleryTab({
  gallery,
  trips,
  searchGallery,
  setSearchGallery,
  galleryVisibilityFilter,
  setGalleryVisibilityFilter,
  galleryPage,
  galleryTotalPages,
  galleryTotal,
  setGalleryPage,
  setIsPhotoModalOpen,
  setPhotoUploadMode,
  setPhotoForm,
  setBatchPhotoUrls,
  handleDeletePhoto,
}: AdminGalleryTabProps) {
  const filteredGallery = gallery.filter((g) => {
    const matchesSearch =
      (g.caption && g.caption.toLowerCase().includes(searchGallery.toLowerCase())) ||
      (g.tags && g.tags.toLowerCase().includes(searchGallery.toLowerCase()));

    if (galleryVisibilityFilter === 'public') return matchesSearch && g.is_public;
    if (galleryVisibilityFilter === 'vault') return matchesSearch && !g.is_public;
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search captures by caption or tags..."
            value={searchGallery}
            onChange={(e) => setSearchGallery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F1D36]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={galleryVisibilityFilter}
            onChange={(e) => setGalleryVisibilityFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
          >
            <option value="all">All Media</option>
            <option value="public">Public Gallery Only</option>
            <option value="vault">Private Vault Only</option>
          </select>

          <button
            onClick={() => {
              setPhotoUploadMode('single');
              setPhotoForm({
                trip_id: trips[0]?.id || 1,
                media_url: '',
                caption: '',
                tags: '',
                is_public: true,
              });
              setIsPhotoModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => {
              setPhotoUploadMode('batch');
              setBatchPhotoUrls('');
              setPhotoForm({
                trip_id: trips[0]?.id || 1,
                media_url: '',
                caption: '',
                tags: '',
                is_public: true,
              });
              setIsPhotoModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Batch URLs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredGallery.map((photo) => (
          <div key={photo.id} className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-square border border-slate-200">
            <img src={photo.media_url} alt={photo.caption || 'Safari photo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white text-xs">
              <span className="font-bold line-clamp-1">{photo.caption || 'Safari Capture'}</span>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-300">{photo.is_public ? 'Public' : 'Vault'}</span>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="p-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminPaginationBar
        currentPage={galleryPage}
        totalPages={galleryTotalPages}
        totalItems={galleryTotal}
        onPageChange={setGalleryPage}
        itemsLabel="photos"
      />
    </div>
  );
}
