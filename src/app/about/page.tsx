'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Mountain, Award, Users, ArrowRight, ShieldCheck, Globe, Trees, Footprints } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import RichContentRenderer from '../../components/RichContentRenderer';

export default function AboutUsPage() {
  const { settings } = useSiteSettings();

  const companyName = settings.company_name || 'Kibali Africa Tours';
  const aboutHeadline = settings.about_us_title || 'Hikes, Campings & Outdoor Camaraderie.';
  const aboutStory =
    settings.about_us_story ||
    `Founded in Nairobi, ${companyName} was born from a passion to connect adventurers with Kenya’s scenic peaks, tranquil campsites, and outdoor team expeditions with certified mountain safety and high community spirit.`;

  const aboutMission =
    settings.about_us_mission ||
    'We uphold strict Leave No Trace principles on every mountain and campsite. Our expeditions are staffed with certified mountain guides, first aiders, and sweep marshals to ensure everyone summits and returns safely.';

  const aboutVision =
    settings.about_us_vision ||
    `Authentic travel respects the host. We partner directly with Maasai, Samburu, and coastal communities to ensure sustainable tourism livelihoods, ${settings.local_guides_employed || 15} certified local guide jobs, and cultural heritage preservation.`;

  const aboutValues =
    settings.about_us_values ||
    'From bespoke heavy-duty 4x4 Land Cruisers with guaranteed pop-up window seats to hand-picked boutique eco-lodges, we deliver deeply memorable safaris without sacrificing refined comfort.';

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 pb-20 md:pt-32 md:pb-28">
      {/* 1. HERO STORYTELLING HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 border border-emerald-200 shadow-sm">
          <Compass className="w-4 h-4 text-[#15803D]" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1D36] tracking-tight leading-tight mb-6">
          {aboutHeadline}
        </h1>
        <div className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed max-w-3xl mx-auto">
          <RichContentRenderer content={aboutStory} />
        </div>
      </section>

      {/* 2. THREE MISSION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {/* Mission Box 1: Trail Safety & Stewardship */}
          <div className="bento-card bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col justify-between hover:shadow-xl transition-all duration-300 shadow-sm group hover:border-emerald-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mountain className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#0F1D36] mb-3 font-bold">Trail Safety & Stewardship</h3>
              <div className="text-sm text-slate-600 font-sans leading-relaxed">
                <RichContentRenderer content={aboutMission} />
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#15803D]">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Wilderness Responders</span>
            </div>
          </div>

          {/* Mission Box 2: Community Impact */}
          <div className="bento-card bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col justify-between hover:shadow-xl transition-all duration-300 md:-translate-y-4 shadow-md group hover:border-amber-300 bg-gradient-to-b from-white to-amber-50/20">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#0F1D36] mb-3 font-bold">Community Impact</h3>
              <div className="text-sm text-slate-600 font-sans leading-relaxed">
                <RichContentRenderer content={aboutVision} />
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#D97706]">
              <Globe className="w-4 h-4" />
              <span>Direct Community Host Partnerships</span>
            </div>
          </div>

          {/* Mission Box 3: Uncompromising Quality & Values */}
          <div className="bento-card bg-white rounded-3xl p-8 border border-slate-200/90 flex flex-col justify-between hover:shadow-xl transition-all duration-300 shadow-sm group hover:border-emerald-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#0F1D36] mb-3 font-bold">Values & Quality</h3>
              <div className="text-sm text-slate-600 font-sans leading-relaxed">
                <RichContentRenderer content={aboutValues} />
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#15803D]">
              <Footprints className="w-4 h-4" />
              <span>Leave No Trace Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMPACT COUNTER NUMBERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-32">
        <div className="bg-[#0F1D36] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-400 block mb-1">
                {(settings.trees_planted_count || 4280).toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Indigenous Trees Planted</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white block mb-1">
                {(settings.happy_travelers_count || 1850).toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Happy Explorers</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-400 block mb-1">
                {(settings.local_guides_employed || 64).toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Local Guides & Porters</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-300 block mb-1">
                {(settings.acres_protected || 12500).toLocaleString()}+
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">Acres Habitat Protected</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET THE TEAM SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7 order-2 md:order-1">
            <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
              <img
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt="A diverse group of cheerful travelers posing together outdoors in Kenya."
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 mb-2 inline-block">
                    Expedition Leaders
                  </span>
                  <p className="text-white text-xs sm:text-sm font-serif italic">
                    Kibali Naturalist Rangers on field expedition &bull; Amboseli & Kilimanjaro
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 order-1 md:order-2 space-y-6">
            <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#15803D]">
              Guiding Masters
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0F1D36] font-bold leading-tight">
              Naturalist Guides Who Call The Savannah Home
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              Our guides are not just drivers; they are licensed ornithologists, botanists, and lifetime wilderness trackers with hundreds of hours studying animal movement, terrain safety, and behavioral ecology.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/trips"
                className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-[#166534] text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green transition-all"
              >
                <span>Explore Upcoming Trips</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/custom-safari"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0F1D36] border border-slate-200 px-5 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                <span>Tailored Private Safari</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
