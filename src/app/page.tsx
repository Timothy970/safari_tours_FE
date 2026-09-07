'use client';

import React, { useState, useEffect } from 'react';
import { Trip, TripReview, TripGallery, BlogPost } from '../types';
import api from '../lib/api';

import HeroSection, { HeroSlide } from '../components/home/HeroSection';
import CategoryFilterSection from '../components/home/CategoryFilterSection';
import FeaturedTripsSection from '../components/home/FeaturedTripsSection';
import PastExpeditionsSection from '../components/home/PastExpeditionsSection';
import ReviewsMarqueeSection from '../components/home/ReviewsMarqueeSection';
import GalleryPreviewSection from '../components/home/GalleryPreviewSection';
import LatestBlogsSection from '../components/home/LatestBlogsSection';
import SafetyPerksBanner from '../components/home/SafetyPerksBanner';

export default function HomePage() {
  const [reviews, setReviews] = useState<TripReview[]>([]);
  const [gallery, setGallery] = useState<TripGallery[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Category & Filter States
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hikes' | 'Campings' | 'Fun Activities'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides: HeroSlide[] = [
    {
      id: 1,
      tag: '⛰️ High-Altitude Treks',
      title: 'Conquer Dramatic Peaks & Volcanic Craters',
      subtitle: 'From the volcanic rim of Mount Longonot to the misty bamboo trails of Elephant Hill and Mount Kenya. Guided group expeditions with certified mountain marshals.',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
      badge: 'Weekend Day Hikes',
      ctaText: 'Explore Upcoming Hikes',
      ctaCategory: 'Hikes',
    },
    {
      id: 2,
      tag: '⛺ Stargazing & Bonfires',
      title: 'Sleep Under the Canopy of a Thousand Stars',
      subtitle: 'Lakeside camping on Crescent Island, Aberdare highland wilderness camps, sunset Nyama Choma BBQs, and acoustic campfire nights.',
      image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=2000&q=85',
      badge: '2D1N Weekend Getaways',
      ctaText: 'Discover Campings',
      ctaCategory: 'Campings',
    },
    {
      id: 3,
      tag: '🌊 Pure Adrenaline',
      title: 'White Water Rafting & Thrill Adventures',
      subtitle: 'Tackle Class IV rapids on the Tana River in Sagana, cycle through dramatic Hell\'s Gate rock canyons, and plunge down natural river chutes.',
      image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=2000&q=85',
      badge: 'Adrenaline Days',
      ctaText: 'Join Fun Activities',
      ctaCategory: 'Fun Activities',
    },
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const [filteredUpcoming, setFilteredUpcoming] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);

  // Load backend data
  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [reviewsData, galleryData, blogsData, pastData] = await Promise.all([
          api.getFeaturedReviews().catch(() => []),
          api.getPublicGallery().catch(() => []),
          api.getBlogs({ limit: 3 }).catch(() => []),
          api.getTrips({ status: 'completed' }).catch(() => []),
        ]);
        setReviews(reviewsData);
        setGallery(galleryData);
        setBlogs(blogsData);
        setPastTrips(pastData);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Fetch upcoming trips with API-level filtering
  useEffect(() => {
    const loadFilteredTrips = async () => {
      try {
        const data = await api.getTrips({
          status: 'upcoming',
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
        });
        setFilteredUpcoming(data);
      } catch (err) {
        console.error('Failed to load upcoming trips:', err);
      }
    };

    const timer = setTimeout(() => {
      loadFilteredTrips();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const categorizeTrip = (trip: Trip): 'Hikes' | 'Campings' | 'Fun Activities' => {
    const text = `${trip.title} ${trip.overview || ''} ${trip.destination || ''}`.toLowerCase();
    if (text.includes('camp') || text.includes('star') || text.includes('night') || trip.total_days > 1) {
      return 'Campings';
    }
    if (text.includes('raft') || text.includes('cycle') || text.includes('boat') || text.includes('safari') || text.includes('water')) {
      return 'Fun Activities';
    }
    return 'Hikes';
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] flex flex-col justify-between">
      {/* 1. CINEMATIC HERO CAROUSEL */}
      <HeroSection
        heroSlides={heroSlides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setIsPaused={setIsPaused}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 2. ADVENTURE CATEGORIES QUICK SELECTOR */}
      <CategoryFilterSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 3. UPCOMING EVENTS GRID */}
      <FeaturedTripsSection
        trips={filteredUpcoming}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        categorizeTrip={categorizeTrip}
      />

      {/* 4. CONQUERED EXPEDITIONS / PREVIOUS EVENTS RECAP */}
      <PastExpeditionsSection pastTrips={pastTrips} />

      {/* 5. ANIMATED MOVING TESTIMONIALS */}
      <ReviewsMarqueeSection reviews={reviews} />

      {/* 6. ANIMATED BENTO GALLERY REEL */}
      <GalleryPreviewSection gallery={gallery} />

      {/* 7. LATEST TRAIL GUIDES & ADVENTURE BLOGS */}
      <LatestBlogsSection blogs={blogs} />

      {/* 8. COMMUNITY PERKS & SAFETY HIGHLIGHTS */}
      <SafetyPerksBanner />
    </div>
  );
}
