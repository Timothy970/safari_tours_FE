'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import { TripGallery } from '../../types';

export interface GalleryPreviewSectionProps {
  gallery: TripGallery[];
}

export default function GalleryPreviewSection({ gallery }: GalleryPreviewSectionProps) {
  const defaultGallery = [
    { media_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1000&q=80', caption: 'Mount Kenya Alpine Peaks', tags: 'Mount Kenya' },
    { media_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80', caption: 'Maasai Mara Sunrise Safari', tags: 'Maasai Mara' },
    { media_url: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1000&q=80', caption: 'Sagana River Whitewater Rafting', tags: 'Sagana River' },
    { media_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=80', caption: 'Crescent Island Night Stargazing', tags: 'Lake Naivasha' },
    { media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80', caption: 'Mount Longonot Crater Edge', tags: 'Rift Valley' },
    { media_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80', caption: 'Highland Forest Bamboo Trek', tags: 'Aberdare Ranges' },
  ];

  const photos = gallery.length > 0 ? gallery : defaultGallery;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#15803D] mb-1">
            <Camera className="w-4 h-4" />
            <span>Captured Memories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#0F1D36]">
            Raw Wilderness Frames
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            All our group adventures include professional high-resolution photography. Check out recent captures.
          </p>
        </div>

        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15803D] hover:underline"
        >
          <span>Open Full Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {photos.slice(0, 6).map((item, idx) => (
          <div
            key={idx}
            className="group relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm"
          >
            <img
              src={item.media_url}
              alt={item.caption || 'Kibali Africa'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold text-emerald-300 block truncate">{item.caption || 'Kibali Memory'}</span>
              <span className="text-[9px] text-slate-300 block">{item.tags || (item as any).location || 'Kenya'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
