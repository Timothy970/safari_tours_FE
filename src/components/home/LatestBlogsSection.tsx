'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';

export interface LatestBlogsSectionProps {
  blogs: BlogPost[];
}

export default function LatestBlogsSection({ blogs }: LatestBlogsSectionProps) {
  if (blogs.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#15803D] mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Wilderness Guides & Insights</span>
            </div>
            <h2 className="font-serif text-3xl font-extrabold text-[#0F1D36]">
              Trail Advice & Dispatch Chronicles
            </h2>
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:underline"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={blog.cover_image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#0F1D36] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {blog.category}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{new Date(blog.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#0F1D36] group-hover:text-[#15803D] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
