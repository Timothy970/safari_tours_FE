'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Clock, ArrowLeft, Share2, Check, Tag, Eye, Mountain, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { BlogPost, Trip } from '../../../types';
import api from '../../../lib/api';
import RichContentRenderer from '../../../components/RichContentRenderer';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { showToast } = useToast();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedTrips, setRelatedTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) return;
      try {
        const [blogData, tripsData] = await Promise.all([
          api.getBlogBySlug(slug),
          api.getTrips(),
        ]);
        setBlog(blogData);
        setRelatedTrips(tripsData.filter((t) => t.status !== 'completed').slice(0, 2));
      } catch (err) {
        console.error('Failed to load blog article:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogData();
  }, [slug]);

  const handleShareCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('success', 'Link Copied!', 'Article link copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Check out this adventure guide on Kibali Africa: "${blog?.title}"`);
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FCFBF9]">
        <Loader2 className="w-10 h-10 text-[#15803D] animate-spin" />
        <p className="text-sm font-semibold text-[#0F1D36]">Loading adventure journal...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FCFBF9] px-4 text-center">
        <BookOpen className="w-12 h-12 text-[#15803D] opacity-60" />
        <h1 className="font-serif text-2xl font-bold text-[#0F1D36]">Article Not Found</h1>
        <p className="text-xs text-slate-500 max-w-md">
          The guide you are looking for might have been moved or unpublished.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#15803D] text-white text-xs uppercase font-bold rounded-full shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 sm:pt-32 md:pt-36 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#15803D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Trail Guides</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-50 text-[#15803D] font-bold text-xs px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{blog.read_time_minutes} min read</span>
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{blog.views_count} views</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F1D36] leading-[1.18] tracking-tight">
            {blog.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed font-normal">
            {blog.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              {blog.author_avatar ? (
                <img
                  src={blog.author_avatar}
                  alt={blog.author_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#15803D]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#15803D] flex items-center justify-center font-bold text-sm border border-emerald-200">
                  {blog.author_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-[#0F1D36]">{blog.author_name}</p>
                <p className="text-[11px] text-slate-500">Lead Naturalist & Mountain Marshal</p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>

              <button
                onClick={handleShareCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative h-80 sm:h-[440px] w-full rounded-3xl overflow-hidden shadow-xl mb-10 bg-slate-900">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formatted Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <RichContentRenderer content={blog.content} />
        </div>

        {/* Tags */}
        {blog.tags && (
          <div className="flex flex-wrap items-center gap-2 pt-8 mt-8 border-t border-slate-200">
            <Tag className="w-4 h-4 text-slate-400" />
            {blog.tags.split(',').map((tag, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Related Upcoming Events Callout Widget */}
        {relatedTrips.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-[#0F1D36] to-[#14532D] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Experience This Live</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
              Join Our Upcoming Expeditions
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 font-light max-w-xl">
              Inspired by this guide? Book your spot on our next guided group hike or camping weekend with certified trail marshals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">{trip.departure_date}</p>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-white truncate">{trip.title}</h4>
                    <p className="text-[11px] text-slate-300">{trip.destination.split(',')[0]}</p>
                  </div>

                  <Link
                    href={`/trips/${trip.slug}`}
                    className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shrink-0 shadow transition-all"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
