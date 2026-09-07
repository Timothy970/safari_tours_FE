'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, Mountain, Phone, Mail, ChevronRight, AlertTriangle, Compass, Globe, HeartPulse, Scale } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SitePolicy } from '../../types';
import api from '../../lib/api';
import RichContentRenderer from '../../components/RichContentRenderer';

const DEFAULT_FALLBACK_POLICIES: SitePolicy[] = [
  {
    id: 1,
    slug: 'terms',
    title: 'Terms & Conditions',
    tagline: 'Booking confirmation rules, payment deadlines, and liability agreements',
    category: 'Legal',
    icon_name: 'FileText',
    sort_order: 1,
    is_active: true,
    content: `1. Booking & Seat Confirmation: All bookings require a commitment deposit or full balance to secure transportation and park permits. Your seat is confirmed once payment is verified.
2. Participant Conduct: Respect towards fellow travelers, mountain guides, and local hosts is strictly required. Kibali Africa maintains zero tolerance for harassment or discrimination.
3. Physical Readiness: Participants must disclose any pre-existing medical conditions or dietary requirements prior to departure.
4. Gear Compliance: Hikers must wear sturdy ankle-support footwear and appropriate weather layers as specified in each expedition briefing.
5. Park Regulations: All KWS, county conservancy, and forest station regulations must be strictly respected.`,
  },
  {
    id: 2,
    slug: 'cancellation',
    title: 'Cancellation & Refunds',
    tagline: 'Refund windows, deposit commitment conditions, and slot transfer guidelines',
    category: 'Financial',
    icon_name: 'AlertTriangle',
    sort_order: 2,
    is_active: true,
    content: `1. Cancellations > 14 Days Before Departure: 80% refund of the total booking amount minus park permit reservation fees.
2. Cancellations 7 - 14 Days Before Departure: 50% refund or full slot transfer to a future scheduled expedition within 90 days.
3. Cancellations < 7 Days: Non-refundable due to committed logistics, transport bookings, and meal allocations.
4. Slot Transfers: You may freely transfer your confirmed booking to a friend with 48 hours notice prior to departure.`,
  },
  {
    id: 3,
    slug: 'safety',
    title: 'Trail & Camping Safety',
    tagline: 'First-aid protocols, mountain guide ratios, evacuation procedures, and required gear',
    category: 'Safety',
    icon_name: 'Mountain',
    sort_order: 3,
    is_active: true,
    content: `1. Guide-to-Hiker Ratio: We maintain a 1:8 certified mountain guide ratio with front lead, middle pacer, and sweep marshal.
2. First-Aid & Emergency Response: Every expedition carries comprehensive medical kits, pulse oximeters, and emergency satellite contact.
3. Mandatory Gear: Sturdy ankle-high hiking boots, waterproof layer, 2-3 liters of water, personal energy snacks, and headlamp for summits.
4. Altitude Acclimatization: Strict pace control and altitude monitoring to ensure safe ascents on high altitude hikes.`,
  },
  {
    id: 4,
    slug: 'privacy',
    title: 'Privacy & Group Chat Rules',
    tagline: 'Traveler data privacy, photograph release, and community squad chat conduct',
    category: 'Community',
    icon_name: 'ShieldCheck',
    sort_order: 4,
    is_active: true,
    content: `1. Traveler Data Privacy: Personal data collected for park permits and medical clearances is held securely and never sold.
2. Media Release: Official event captures may be featured on our vault. Hikers may request photo exclusion anytime.
3. Squad Chat Rules: Community groups are strictly for expedition briefings and camaraderie. Spam, unsolicited promotions, or disrespect will lead to immediate removal.`,
  },
  {
    id: 5,
    slug: 'sustainability',
    title: 'Leave No Trace & Eco Impact',
    tagline: 'Plastic-free protocols, tree planting commitments, and community porter welfare standards',
    category: 'Conservation',
    icon_name: 'Globe',
    sort_order: 5,
    is_active: true,
    content: `1. Leave No Trace: Zero single-use plastic disposal on trails. Every group conducts a summit cleanup.
2. Reforestation Pledge: Kibali Africa plants 5 indigenous trees for every confirmed booking.
3. Fair Porter & Guide Wages: 100% of campsite porters, chefs, and community guides are hired locally with fair compensation.`,
  },
];

function getPolicyIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case 'alerttriangle':
    case 'alert':
    case 'warning':
      return AlertTriangle;
    case 'mountain':
    case 'hiking':
    case 'trail':
      return Mountain;
    case 'shieldcheck':
    case 'privacy':
    case 'security':
      return ShieldCheck;
    case 'globe':
    case 'earth':
    case 'eco':
      return Globe;
    case 'heartpulse':
    case 'medical':
    case 'health':
      return HeartPulse;
    case 'scale':
    case 'legal':
      return Scale;
    default:
      return FileText;
  }
}

export default function PoliciesPage() {
  const { settings } = useSiteSettings();
  const [policies, setPolicies] = useState<SitePolicy[]>(DEFAULT_FALLBACK_POLICIES);
  const [activeSlug, setActiveSlug] = useState<string>('terms');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getPublicPolicies()
      .then((res) => {
        if (res && res.length > 0) {
          setPolicies(res);
          setActiveSlug(res[0].slug);
        }
      })
      .catch((err) => {
        console.error('Failed to load dynamic policies:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const activePolicy = policies.find((p) => p.slug === activeSlug) || policies[0] || DEFAULT_FALLBACK_POLICIES[0];
  const IconComponent = getPolicyIcon(activePolicy?.icon_name || 'FileText');

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Community & Trail Standards</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1D36]">
            Policies & Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-2 max-w-2xl">
            Important details regarding our event booking terms, cancellation & refund policies, trail safety standards, and environmental Leave No Trace commitments.
          </p>
        </div>

        {/* Policy Layout: Dynamic Sidebar Tabs & Dynamic Content View */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
          {/* Dynamic Navigation Sidebar */}
          <aside className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <nav className="sticky top-28 flex flex-col gap-2.5">
              {policies.map((policy) => {
                const isActive = activePolicy?.slug === policy.slug;
                return (
                  <button
                    key={policy.id || policy.slug}
                    onClick={() => setActiveSlug(policy.slug)}
                    className={`text-left py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex justify-between items-center group w-full shadow-sm ${
                      isActive
                        ? 'bg-[#15803D] text-white shadow-md'
                        : 'bg-white text-[#0F1D36] border border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-2">{policy.title}</span>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'translate-x-0.5 text-white' : 'opacity-60 text-slate-400 group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Dynamic Policy Content Area */}
          <article className="w-full md:w-2/3 lg:w-3/4 bento-card bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-sm min-h-[500px] flex flex-col justify-between">
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Policy Header Badge & Title */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center justify-center shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#15803D] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {activePolicy?.category || 'Policy'}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#0F1D36] font-bold mt-1">
                      {activePolicy?.title}
                    </h2>
                  </div>
                </div>
              </div>

              {activePolicy?.tagline && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium italic">
                  {activePolicy.tagline}
                </p>
              )}

              {/* Policy Text Content */}
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 font-sans">
                <RichContentRenderer content={activePolicy?.content || ''} />
              </div>
            </div>

            {/* Direct Inquiries & Contact Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#15803D]" />
                <span>Need clarification on any trip policy?</span>
              </div>
              <div className="flex items-center gap-4 font-bold text-[#0F1D36]">
                <a href={`tel:${settings.primary_phone || '+254700123456'}`} className="hover:text-[#15803D] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{settings.primary_phone || '+254 700 123 456'}</span>
                </a>
                <a href={`mailto:${settings.contact_email || 'info@kibaliafrica.com'}`} className="hover:text-[#15803D] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{settings.contact_email || 'info@kibaliafrica.com'}</span>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
