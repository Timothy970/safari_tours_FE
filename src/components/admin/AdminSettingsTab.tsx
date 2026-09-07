'use client';

import React from 'react';
import { Save, Plus, Trash2, Edit, Check, Mountain, FileText } from 'lucide-react';
import { SiteSettings, SitePolicy } from '../../types';
import RichTextEditor from '../RichTextEditor';
import RichContentRenderer from '../RichContentRenderer';

export interface AdminSettingsTabProps {
  cmsSectionTab: 'brand' | 'about' | 'policies';
  setCmsSectionTab: (tab: 'brand' | 'about' | 'policies') => void;
  cmsPreviewMode: 'edit' | 'preview';
  setCmsPreviewMode: (mode: 'edit' | 'preview') => void;
  siteForm: SiteSettings;
  setSiteForm: React.Dispatch<React.SetStateAction<SiteSettings>>;
  isSavingSettings: boolean;
  handleSaveSettings: (e: React.FormEvent) => void;
  policiesList: SitePolicy[];
  policiesLoading?: boolean;
  policyCategoryFilter: string;
  setPolicyCategoryFilter: (val: string) => void;
  setIsPolicyModalOpen: (open: boolean) => void;
  setEditingPolicyId: (id: number | null) => void;
  setPolicyForm: (form: Partial<SitePolicy>) => void;
  handleDeletePolicy: (id: number, title: string) => void;
  handleTogglePolicyActive: (id: number, current: boolean, title: string) => Promise<void>;
  selectedPreviewPolicyId: number | null;
  setSelectedPreviewPolicyId: (id: number | null) => void;
  getPolicyIcon: (iconName: string) => any;
}

export default function AdminSettingsTab({
  cmsSectionTab,
  setCmsSectionTab,
  cmsPreviewMode,
  setCmsPreviewMode,
  siteForm,
  setSiteForm,
  isSavingSettings,
  handleSaveSettings,
  policiesList,
  policyCategoryFilter,
  setPolicyCategoryFilter,
  setIsPolicyModalOpen,
  setEditingPolicyId,
  setPolicyForm,
  handleDeletePolicy,
  handleTogglePolicyActive,
  selectedPreviewPolicyId,
  setSelectedPreviewPolicyId,
  getPolicyIcon,
}: AdminSettingsTabProps) {
  const filteredPolicies = policiesList.filter((p) => {
    if (policyCategoryFilter === 'all') return true;
    return p.category?.toLowerCase() === policyCategoryFilter.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sub-Navigation Pill Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setCmsSectionTab('brand')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              cmsSectionTab === 'brand'
                ? 'bg-white text-[#0F1D36] shadow-sm'
                : 'text-slate-600 hover:text-[#0F1D36]'
            }`}
          >
            Brand & Identity
          </button>
          <button
            onClick={() => setCmsSectionTab('about')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              cmsSectionTab === 'about'
                ? 'bg-white text-[#0F1D36] shadow-sm'
                : 'text-slate-600 hover:text-[#0F1D36]'
            }`}
          >
            About Us CMS
          </button>
          <button
            onClick={() => setCmsSectionTab('policies')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              cmsSectionTab === 'policies'
                ? 'bg-white text-[#0F1D36] shadow-sm'
                : 'text-slate-600 hover:text-[#0F1D36]'
            }`}
          >
            Website Policies ({policiesList.length})
          </button>
        </div>

        {cmsSectionTab === 'policies' && (
          <button
            onClick={() => {
              setEditingPolicyId(null);
              setPolicyForm({
                title: '',
                slug: '',
                category: 'General',
                tagline: '',
                content: '',
                icon_name: 'FileText',
                sort_order: policiesList.length + 1,
                is_active: true,
              });
              setIsPolicyModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Site Policy</span>
          </button>
        )}
      </div>

      {/* 1. BRAND & CONTACT SETTINGS */}
      {cmsSectionTab === 'brand' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Brand Identity & Communications</h3>
              <p className="text-xs text-slate-400">Configure global website contact details and meta tags.</p>
            </div>
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Company / Brand Name</label>
              <input
                type="text"
                value={siteForm.company_name || ''}
                onChange={(e) => setSiteForm({ ...siteForm, company_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Brand Tagline</label>
              <input
                type="text"
                value={siteForm.tagline || ''}
                onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Contact Email</label>
              <input
                type="email"
                value={siteForm.contact_email || ''}
                onChange={(e) => setSiteForm({ ...siteForm, contact_email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Contact Phone</label>
              <input
                type="text"
                value={siteForm.primary_phone || ''}
                onChange={(e) => setSiteForm({ ...siteForm, primary_phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">WhatsApp Hotline</label>
              <input
                type="text"
                value={siteForm.whatsapp_number || ''}
                onChange={(e) => setSiteForm({ ...siteForm, whatsapp_number: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Physical Office Address</label>
              <input
                type="text"
                value={siteForm.office_address || ''}
                onChange={(e) => setSiteForm({ ...siteForm, office_address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
              />
            </div>
          </div>
        </form>
      )}

      {/* 2. DYNAMIC ABOUT US CMS */}
      {cmsSectionTab === 'about' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Dynamic About Us Page Builder</h3>
              <p className="text-xs text-slate-400">Design the rich editorial story displayed at /about.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setCmsPreviewMode('edit')}
                  className={`px-3 py-1.5 rounded-lg ${cmsPreviewMode === 'edit' ? 'bg-white shadow text-[#0F1D36]' : 'text-slate-500'}`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setCmsPreviewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg ${cmsPreviewMode === 'preview' ? 'bg-white shadow text-[#0F1D36]' : 'text-slate-500'}`}
                >
                  Live Preview
                </button>
              </div>
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingSettings ? 'Saving...' : 'Save About Us'}</span>
              </button>
            </div>
          </div>

          {cmsPreviewMode === 'edit' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">About Us Title</label>
                  <input
                    type="text"
                    value={siteForm.about_us_title || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, about_us_title: e.target.value })}
                    placeholder="e.g. Born From The Wilderness of East Africa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F1D36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Hero Banner Image URL</label>
                  <input
                    type="url"
                    value={siteForm.hero_banner_url || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, hero_banner_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Hero Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={siteForm.hero_subtitle || ''}
                  onChange={(e) => setSiteForm({ ...siteForm, hero_subtitle: e.target.value })}
                  placeholder="Atmospheric intro paragraph for the hero section..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0F1D36]"
                />
              </div>

              <RichTextEditor
                label="Full Editorial About Us Story"
                placeholder="Write your rich About Us story here..."
                value={siteForm.about_us_story || ''}
                onChange={(content) => setSiteForm({ ...siteForm, about_us_story: content })}
                rows={12}
                minHeight="320px"
              />
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h1 className="text-2xl font-serif font-black text-[#0F1D36] mb-2">{siteForm.about_us_title || 'About Kibali Africa'}</h1>
              <p className="text-sm text-slate-600 mb-6">{siteForm.hero_subtitle}</p>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <RichContentRenderer content={siteForm.about_us_story || ''} />
              </div>
            </div>
          )}
        </form>
      )}

      {/* 3. WEBSITE POLICIES CMS */}
      {cmsSectionTab === 'policies' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Customer Terms & Safety Policies</h3>
              <p className="text-xs text-slate-400">Manage legal, safety, refund, and mountain evacuation rules.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={policyCategoryFilter}
                onChange={(e) => setPolicyCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                <option value="all">All Categories</option>
                <option value="Legal">Legal & Terms</option>
                <option value="Financial">Financial & Refunds</option>
                <option value="Safety">Safety & Mountain Ops</option>
                <option value="Community">Community & Chats</option>
                <option value="Conservation">Conservation & Eco</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map((pol) => {
              const IconComp = getPolicyIcon(pol.icon_name || 'FileText');
              return (
                <div
                  key={pol.id}
                  className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#15803D]">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          pol.is_active ? 'bg-emerald-100 text-[#15803D]' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {pol.is_active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#0F1D36] mb-1">{pol.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{pol.tagline || 'Policy clause guidelines.'}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">/{pol.slug}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingPolicyId(pol.id);
                          setPolicyForm({
                            title: pol.title,
                            slug: pol.slug,
                            category: pol.category,
                            tagline: pol.tagline,
                            content: pol.content,
                            icon_name: pol.icon_name,
                            sort_order: pol.sort_order,
                            is_active: pol.is_active,
                          });
                          setIsPolicyModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                        title="Edit Policy"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTogglePolicyActive(pol.id, pol.is_active, pol.title)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#15803D] border border-slate-200"
                        title="Toggle Active"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(pol.id, pol.title)}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200"
                        title="Delete Policy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
