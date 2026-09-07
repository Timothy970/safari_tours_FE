'use client';

import React from 'react';
import { Tag, Trash2 } from 'lucide-react';
import { Promotion } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminPromotionsTabProps {
  promotions: Promotion[];
  searchPromotions: string;
  setSearchPromotions: (val: string) => void;
  promosPage: number;
  promosTotalPages: number;
  promosTotal: number;
  setPromosPage: (page: number) => void;
  newPromoCode: string;
  setNewPromoCode: (val: string) => void;
  newPromoType: 'percentage' | 'fixed_amount';
  setNewPromoType: (val: 'percentage' | 'fixed_amount') => void;
  newPromoValue: number;
  setNewPromoValue: (val: number) => void;
  newPromoMin: number;
  setNewPromoMin: (val: number) => void;
  newPromoDays: number;
  setNewPromoDays: (val: number) => void;
  handleCreatePromo: (e: React.FormEvent) => Promise<void>;
  handleTogglePromo: (id: number, current: boolean) => Promise<void>;
  handleDeletePromo: (id: number) => void;
}

export default function AdminPromotionsTab({
  promotions,
  searchPromotions,
  setSearchPromotions,
  promosPage,
  promosTotalPages,
  promosTotal,
  setPromosPage,
  newPromoCode,
  setNewPromoCode,
  newPromoType,
  setNewPromoType,
  newPromoValue,
  setNewPromoValue,
  newPromoMin,
  setNewPromoMin,
  newPromoDays,
  setNewPromoDays,
  handleCreatePromo,
  handleTogglePromo,
  handleDeletePromo,
}: AdminPromotionsTabProps) {
  const filteredPromos = promotions.filter((p) =>
    p.code.toLowerCase().includes(searchPromotions.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Create Promo Box */}
      <form onSubmit={handleCreatePromo} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Tag className="w-5 h-5 text-[#15803D]" />
          <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Create New Promo Code & Voucher</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Code</label>
            <input
              type="text"
              required
              placeholder="e.g. KIBALI10"
              value={newPromoCode}
              onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F1D36]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Discount Type</label>
            <select
              value={newPromoType}
              onChange={(e) => setNewPromoType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-[#0F1D36]"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed_amount">Fixed Amount (KES)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Discount Value</label>
            <input
              type="number"
              required
              min={1}
              value={newPromoValue}
              onChange={(e) => setNewPromoValue(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#0F1D36]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Min Spend (KES)</label>
            <input
              type="number"
              value={newPromoMin}
              onChange={(e) => setNewPromoMin(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#0F1D36]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Create Code
            </button>
          </div>
        </div>
      </form>

      {/* Promos List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3">Code</th>
                <th className="py-3">Discount</th>
                <th className="py-3">Min Spend</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#0F1D36]">{p.code}</td>
                  <td className="py-3.5 font-bold text-[#15803D]">
                    {p.discount_type === 'percentage' ? `${p.discount_value}%` : `KES ${p.discount_value?.toLocaleString()}`}
                  </td>
                  <td className="py-3.5 font-mono">KES {p.min_booking_amount?.toLocaleString() || 0}</td>
                  <td className="py-3.5">
                    <button
                      onClick={() => handleTogglePromo(p.id, p.is_active)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        p.is_active ? 'bg-emerald-50 text-[#15803D]' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600"
                      title="Delete Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
