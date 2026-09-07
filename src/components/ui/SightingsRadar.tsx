'use client';

import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { TripWildlifeSighting } from '../../types';

interface SightingsRadarProps {
  sightings: TripWildlifeSighting[];
}

export const SightingsRadar: React.FC<SightingsRadarProps> = ({ sightings }) => {
  if (!sightings || sightings.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-lg">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C68E3D] font-bold">Ecological Sighting Index</span>
          <h3 className="font-serif text-lg font-bold text-[#33210D]">Wildlife Sighting Probabilities</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
          <Eye className="w-3.5 h-3.5 text-[#C68E3D]" />
          <span>Historical Sighting Data</span>
        </div>
      </div>

      <div className="space-y-4">
        {sightings.map((s, idx) => {
          let barColor = 'bg-[#C68E3D]';
          if (s.sighting_probability >= 90) barColor = 'bg-emerald-600';
          else if (s.sighting_probability >= 70) barColor = 'bg-[#C68E3D]';
          else barColor = 'bg-amber-600';

          return (
            <div key={idx} className="bg-[#FCF9F4] p-3.5 rounded-xl border border-stone-200/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-serif font-bold text-sm text-[#33210D]">{s.animal_name}</span>
                <span className="font-mono text-xs font-bold text-[#33210D]">{s.sighting_probability}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${s.sighting_probability}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#C68E3D]" /> {s.best_time_of_day}
                </span>
                {s.notes && (
                  <span className="text-stone-500 italic bg-white px-2 py-0.5 rounded border border-stone-200/40">
                    {s.notes}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SightingsRadar;
