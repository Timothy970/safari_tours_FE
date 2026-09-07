'use client';

import React from 'react';
import { Sun, CloudSun, Sunrise, Sunset, Wind, Droplets } from 'lucide-react';
import { ParkWeather } from '../../types';

interface WeatherWidgetProps {
  weather?: ParkWeather;
}

const DEFAULT_WEATHER: ParkWeather = {
  destination: 'Amboseli National Park',
  temperature_c: 24,
  condition: 'Sunny & Clear Skies',
  humidity: 48,
  precipitation: '0% chance of rain',
  sunrise: '06:22 AM',
  sunset: '06:34 PM',
  game_drive_tip: 'Perfect clear morning for unobstructed Kilimanjaro photography between 06:30 and 08:30 AM.',
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather: passedWeather }) => {
  const weather = passedWeather || DEFAULT_WEATHER;

  return (
    <div className="bg-[#2D3A2D] text-white rounded-2xl p-6 border border-[#99A897]/30 shadow-xl relative overflow-hidden">
      {/* Subtle Sun Glow Backdrop */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">Live Park Conditions</span>
          <h3 className="font-serif text-lg font-bold text-[#FCF9F4]">{weather.destination}</h3>
        </div>
        <div className="flex items-center gap-2">
          <CloudSun className="w-8 h-8 text-amber-300" />
          <span className="text-3xl font-serif font-bold text-white">{weather.temperature_c}°C</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
          <p className="text-stone-300 flex items-center gap-1.5 mb-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-300" /> Sunrise
          </p>
          <p className="font-semibold text-white">{weather.sunrise}</p>
        </div>

        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
          <p className="text-stone-300 flex items-center gap-1.5 mb-1">
            <Sunset className="w-3.5 h-3.5 text-orange-400" /> Sunset
          </p>
          <p className="font-semibold text-white">{weather.sunset}</p>
        </div>

        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
          <p className="text-stone-300 flex items-center gap-1.5 mb-1">
            <Droplets className="w-3.5 h-3.5 text-sky-300" /> Humidity
          </p>
          <p className="font-semibold text-white">{weather.humidity}%</p>
        </div>

        <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
          <p className="text-stone-300 flex items-center gap-1.5 mb-1">
            <Wind className="w-3.5 h-3.5 text-emerald-300" /> Rain Index
          </p>
          <p className="font-semibold text-white">{weather.precipitation}</p>
        </div>
      </div>

      <div className="bg-[#1B271B] border border-[#99A897]/20 p-3 rounded-xl flex items-start gap-2.5 text-xs text-stone-300">
        <Sun className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-200">Ranger Game Drive Advice: </span>
          <span>{weather.game_drive_tip}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
