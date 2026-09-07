'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function SafetyPerksBanner() {
  return (
    <section className="bg-gradient-to-br from-[#0F1D36] to-[#14532D] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span>Certified Wilderness Safety Standard</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Adventure With Total Peace of Mind
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every Kibali Africa trip features licensed mountain marshals, first aid response gear, sanitized transport, and transparent deposit refund policies.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
          <Link
            href="/events"
            className="px-8 py-4 bg-[#15803D] hover:bg-[#166534] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl glow-green"
          >
            Find Next Adventure
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all"
          >
            About Kibali Africa
          </Link>
        </div>
      </div>
    </section>
  );
}
