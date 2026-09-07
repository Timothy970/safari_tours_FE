'use client';

import React from 'react';

export interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsLabel?: string;
}

export default function AdminPaginationBar({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsLabel = 'items',
}: PaginationBarProps) {
  if (totalPages <= 1 && totalItems <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-200 mt-6 text-xs text-slate-500">
      <div className="font-medium">
        Page <span className="font-bold text-[#0F1D36]">{currentPage}</span> of{' '}
        <span className="font-bold text-[#0F1D36]">{Math.max(totalPages, 1)}</span> ({totalItems} total {itemsLabel})
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors shadow-sm"
        >
          &larr; Previous
        </button>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#15803D] font-mono font-bold">
          {currentPage} / {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 transition-colors shadow-sm"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
