'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, Clock, Search, ArrowRight, Loader2 } from 'lucide-react';
import { BlogPost } from '../../types';
import api from '../../lib/api';

function BlogsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const categories = [
    'All',
    'Trail Guides',
    'Camping Tips',
    'Adventure Stories',
    'Gear & Packing',
    'Fitness & Prep',
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const data = await api.getBlogs({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchTerm.trim() || undefined,
        });
        setBlogs(data);
      } catch (err) {
        console.error('Failed to load blog articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  const filteredBlogs = blogs;
  const featuredPost = blogs.length > 0 ? blogs[0] : null;

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 sm:pt-32 md:pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#15803D] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kibali Adventure Journal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1D36]">
            Trail Guides & Wilderness Stories
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-2 max-w-2xl">
            Expert trail breakdowns, packing checklists, high-altitude preparation blueprints, and campfire tales from across Kenya.
          </p>
        </div>

        {/* Featured Hero Story (if not searching/filtering) */}
        {!searchTerm && selectedCategory === 'All' && featuredPost && (
          <div className="mb-12">
            <Link
              href={`/blogs/${featuredPost.slug}`}
              className="bento-card group relative bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-7 relative h-72 lg:h-[400px] overflow-hidden bg-slate-900">
                <img
                  src={featuredPost.cover_image_url}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#0F1D36]/90 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30">
                  Featured Story
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-emerald-50 text-[#15803D] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                      {featuredPost.category}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{featuredPost.read_time_minutes} min read</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F1D36] group-hover:text-[#15803D] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {featuredPost.author_avatar ? (
                      <img
                        src={featuredPost.author_avatar}
                        alt={featuredPost.author_name}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center font-bold text-xs">
                        {featuredPost.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#0F1D36]">{featuredPost.author_name}</p>
                      <p className="text-[10px] text-slate-400">Lead Expedition Guide</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#15803D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, gear, trails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D] font-medium"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#15803D] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading trail articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-[#15803D] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#0F1D36] font-bold">No articles found in this category</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Try searching with another keyword or explore other guide categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="bento-card group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-[#0F1D36]/90 backdrop-blur-md text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{post.read_time_minutes} min read</span>
                      <span>&bull;</span>
                      <span className="truncate">{post.author_name}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#0F1D36] group-hover:text-[#15803D] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-sans line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#15803D]">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9]">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
        </div>
      }
    >
      <BlogsContent />
    </Suspense>
  );
}
