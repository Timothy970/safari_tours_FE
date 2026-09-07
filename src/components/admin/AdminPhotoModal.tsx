'use client';

import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Trip } from '../../types';

export interface AdminPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUploadMode: 'single' | 'batch';
  photoForm: any;
  setPhotoForm: any;
  batchPhotoUrls: string;
  setBatchPhotoUrls: React.Dispatch<React.SetStateAction<string>>;
  trips: Trip[];
  isUploadingPhoto: boolean;
  onUpload: (e: React.FormEvent) => void;
}

export default function AdminPhotoModal({
  isOpen,
  onClose,
  photoUploadMode,
  photoForm,
  setPhotoForm,
  batchPhotoUrls,
  setBatchPhotoUrls,
  trips,
  isUploadingPhoto,
  onUpload,
}: AdminPhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">
              {photoUploadMode === 'batch' ? 'Batch Upload Expedition Photos' : 'Upload Safari Media Capture'}
            </h3>
            <p className="text-xs text-slate-500">Add to public website gallery or private expedition albums.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onUpload} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Associated Expedition
            </label>
            <select
              value={photoForm.trip_id || (trips[0]?.id || 1)}
              onChange={(e) => setPhotoForm({ ...photoForm, trip_id: parseInt(e.target.value) || 1 })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.destination})
                </option>
              ))}
            </select>
          </div>

          {photoUploadMode === 'single' ? (
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Image Direct URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={photoForm.media_url || ''}
                onChange={(e) => setPhotoForm({ ...photoForm, media_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Image URLs (One URL per line) *
              </label>
              <textarea
                rows={5}
                required
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2...&#10;https://images.unsplash.com/photo-3..."
                value={batchPhotoUrls}
                onChange={(e) => setBatchPhotoUrls(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-[#0F1D36]"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Caption / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Sunrise over Mount Kenya Sirimon Route"
              value={photoForm.caption || ''}
              onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Tags
            </label>
            <input
              type="text"
              placeholder="Hikes, Summit, Wildlife"
              value={photoForm.tags || ''}
              onChange={(e) => setPhotoForm({ ...photoForm, tags: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="photoIsPublic"
              checked={photoForm.is_public ?? true}
              onChange={(e) => setPhotoForm({ ...photoForm, is_public: e.target.checked })}
              className="w-4 h-4 text-[#15803D] rounded border-slate-300 mt-0.5"
            />
            <div>
              <label htmlFor="photoIsPublic" className="text-xs font-bold text-[#0F1D36] block cursor-pointer">
                Publish to Public Website Gallery (/gallery)
              </label>
              <p className="text-[10px] text-slate-500">
                When checked, this capture is featured on the public website for non-logged-in visitors. When unchecked, it remains inside the private expedition vault.
              </p>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isUploadingPhoto ||
                (photoUploadMode === 'single' && !photoForm.media_url?.trim()) ||
                (photoUploadMode === 'batch' && !batchPhotoUrls.trim())
              }
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green flex items-center gap-1.5"
            >
              {isUploadingPhoto ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{photoUploadMode === 'batch' ? 'Upload Batch in Background' : 'Upload to Vault'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
