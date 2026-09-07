'use client';

import React from 'react';
import { X, Users } from 'lucide-react';
import { TripChatMember } from '../../types';

export interface AdminChatMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChatTrip: { trip_title?: string; title?: string } | null;
  activeChatMembers: TripChatMember[];
}

export default function AdminChatMembersModal({
  isOpen,
  onClose,
  selectedChatTrip,
  activeChatMembers,
}: AdminChatMembersModalProps) {
  if (!isOpen || !selectedChatTrip) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#15803D]" />
            <div>
              <h3 className="font-serif text-base font-bold text-[#0F1D36]">Enrolled Squad Members</h3>
              <span className="text-[10px] text-slate-400 font-bold">
                {selectedChatTrip.trip_title || selectedChatTrip.title}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1">
          {activeChatMembers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No travelers enrolled in this squad yet. Customers join automatically when booking this trip.
            </div>
          ) : (
            activeChatMembers.map((m) => (
              <div key={m.id || m.user_id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#15803D] flex items-center justify-center font-bold text-xs uppercase">
                    {m.full_name ? m.full_name.charAt(0) : 'T'}
                  </div>
                  <div>
                    <span className="font-bold text-[#0F1D36] block">{m.full_name || 'Safari Traveler'}</span>
                    <span className="text-[10px] text-slate-400">{m.email || 'Verified Booking'}</span>
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {m.role || 'Member'}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
