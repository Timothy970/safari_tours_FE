'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Phone, Mail, MapPin, Award, ShieldCheck, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9+]/g, '');

  return (
    <footer className="bg-gradient-to-b from-[#062013] via-[#092B1B] to-[#04160D] text-white border-t border-emerald-900/40">
      {/* Top Value Banner */}
      <div className="border-b border-emerald-900/40 bg-[#04160D]/70 py-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#15803D] shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white">Certified Mountain Guides</h4>
              <p className="text-[11px] text-slate-400">KWS certified leaders & wilderness first aiders on every trail.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#D97706] shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white">Guaranteed Group Departures</h4>
              <p className="text-[11px] text-slate-400">Scheduled weekend hikes and campings with zero hidden costs.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#15803D] shrink-0">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white">100% Slot Transfer Guarantee</h4>
              <p className="text-[11px] text-slate-400">Transfer your booking to any friend if plans change unexpectedly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center border border-white/30 shadow-md">
                <img
                  src="/images/logo.png"
                  alt="Kibali Africa Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-black tracking-tight text-white">
                  KIBALI <span className="text-[#15803D]">AFRICA</span>
                </span>
                <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-300 font-bold">
                  {settings.sub_tagline || 'Hikes • Campings • Fun Activities'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-light leading-relaxed max-w-sm">
              {settings.tagline || 'We Will Show You Africa, Better Than Anyone Else.'} Curated group hikes, highland camping adventures, and outdoor team experiences across Kenya.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Certified Mountain Leaders & Outdoor First Aiders</span>
            </div>
          </div>

          {/* Col 2: Adventures & Getaways */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#D97706]">
              Adventures & Getaways
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/events" className="hover:text-emerald-400 transition-colors">
                  All Upcoming Expeditions
                </Link>
              </li>
              <li>
                <Link href="/events?category=Hikes" className="hover:text-emerald-400 transition-colors">
                  Hikes & Mountain Trails
                </Link>
              </li>
              <li>
                <Link href="/events?category=Campings" className="hover:text-emerald-400 transition-colors">
                  Highland Camping & Bonfires
                </Link>
              </li>
              <li>
                <Link href="/events?category=Fun+Activities" className="hover:text-emerald-400 transition-colors">
                  Water Rafting & Fun Days
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Experience */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#D97706]">
              Experience
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  Our Story & Team
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-emerald-400 transition-colors">
                  Photo Vault & Community
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-emerald-400 transition-colors">
                  Trail Guides & Stories
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-emerald-400 transition-colors">
                  My Bookings & Passes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Contact & Location */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-[#D97706]">
              Contact Our Team
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>{settings.office_address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#15803D] shrink-0" />
                <a href={`tel:${settings.primary_phone}`} className="hover:text-emerald-400 transition-colors">
                  {settings.primary_phone} {settings.secondary_phone ? `• ${settings.secondary_phone}` : ''}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#15803D] shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-emerald-400 transition-colors">
                  {settings.contact_email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=Hello%20Kibali%20Africa%20Tours,%20I%20would%20like%20to%20inquire%20about%20a%20safari.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md glow-green"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Ranger Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accreditations */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {settings.company_name}. All rights reserved. Travel. Relax. Enjoy.</p>
          <div className="flex items-center gap-6">
            <Link href="/policies" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/policies" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/policies" className="hover:text-emerald-400 transition-colors">
              Sustainability Report
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
