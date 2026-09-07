'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  ctaText: string;
  ctaCategory: 'Hikes' | 'Campings' | 'Fun Activities';
}

export interface HeroSectionProps {
  heroSlides: HeroSlide[];
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  setIsPaused: (paused: boolean) => void;
  onSelectCategory: (cat: 'Hikes' | 'Campings' | 'Fun Activities') => void;
}

export default function HeroSection({
  heroSlides,
  currentSlide,
  setCurrentSlide,
  setIsPaused,
  onSelectCategory,
}: HeroSectionProps) {
  return (
    <section
      className="relative h-[85vh] min-h-[580px] max-h-[820px] w-full bg-[#0F1D36] text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
          }`}
          style={{ transition: 'opacity 1s ease-in-out, transform 6s ease-out' }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 animate-subtle-zoom"
          />
        </div>
      ))}

      {/* Multi-layered cinematic gradient */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0F1D36] via-[#0F1D36]/60 to-black/30 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0F1D36]/90 via-[#0F1D36]/40 to-transparent pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-30 max-w-7xl mx-auto h-full flex flex-col justify-end pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span>{heroSlides[currentSlide].tag}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-700">
            {heroSlides[currentSlide].title}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {heroSlides[currentSlide].subtitle}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <a
              href="#events-section"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(heroSlides[currentSlide].ctaCategory);
                document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-[#15803D] hover:bg-[#166534] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl glow-green flex items-center gap-2 group cursor-pointer"
            >
              <span>{heroSlides[currentSlide].ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              href="/events"
              className="px-7 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Browse All Trips</span>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators & Controls */}
        <div className="absolute bottom-6 right-4 sm:right-8 z-30 flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-[#15803D]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
