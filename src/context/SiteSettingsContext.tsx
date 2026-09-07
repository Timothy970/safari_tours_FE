'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettings } from '../types';
import api from '../lib/api';

const INITIAL_SETTINGS: SiteSettings = {
  id: 1,
  company_name: 'Kibali Africa',
  tagline: '',
  sub_tagline: '',
  hero_title: '',
  hero_subtitle: '',
  hero_banner_url: '',
  hero_cta_text: 'Explore Expeditions',
  hero_cta_link: '/events',
  primary_phone: '+254700000000',
  secondary_phone: '',
  contact_email: 'info@kibaliafrica.com',
  support_email: 'support@kibaliafrica.com',
  whatsapp_number: '+254700000000',
  office_address: 'Nairobi, Kenya',
  office_hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
  live_ticker_text: '',
  trees_planted_count: 0,
  local_guides_employed: 0,
  acres_protected: 0,
  happy_travelers_count: 0,
  social_instagram: '',
  social_facebook: '',
  social_twitter: '',
  social_youtube: '',
  social_linkedin: '',
  announcement_banner_text: '',
  announcement_banner_active: false,
  about_us_title: '',
  about_us_story: '',
  about_us_mission: '',
  about_us_vision: '',
  about_us_values: '',
  terms_and_conditions: '',
  privacy_policy: '',
  cancellation_policy: '',
  trail_safety_policy: '',
  sustainability_policy: '',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: SiteSettings) => Promise<{ success: boolean; error?: string }>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: INITIAL_SETTINGS,
  isLoading: true,
  refreshSettings: async () => {},
  updateSettings: async () => ({ success: false }),
});

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSiteSettings();
      if (data && data.company_name) {
        setSettings(data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kibali_site_settings', JSON.stringify(data));
        }
      }
    } catch {
      // If network fails, attempt cached settings from localStorage
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('kibali_site_settings');
        if (cached) {
          try {
            setSettings(JSON.parse(cached));
          } catch {
            // fallback
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check cached settings first for instantaneous initial render
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('kibali_site_settings');
      if (cached) {
        try {
          setSettings(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    }
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: SiteSettings): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await api.updateSiteSettings(newSettings);
      const updated = res.settings || newSettings;
      setSettings(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kibali_site_settings', JSON.stringify(updated));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update settings' };
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
export default SiteSettingsContext;
