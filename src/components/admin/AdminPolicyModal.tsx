'use client';

import React from 'react';
import { X } from 'lucide-react';
import { SitePolicy } from '../../types';
import RichTextEditor from '../RichTextEditor';

export interface AdminPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyForm: Partial<SitePolicy>;
  setPolicyForm: React.Dispatch<React.SetStateAction<Partial<SitePolicy>>>;
  editingPolicyId: number | null;
  onSave: (e: React.FormEvent) => void;
}

export default function AdminPolicyModal({
  isOpen,
  onClose,
  policyForm,
  setPolicyForm,
  editingPolicyId,
  onSave,
}: AdminPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0F1D36]">
              {editingPolicyId ? 'Edit Website Policy & Rules' : 'Create New Website Policy'}
            </h3>
            <p className="text-xs text-slate-500">Configure public title, customer copy, and icon for the /policies page.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Policy Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mountain Evacuation & Medical Policy"
              value={policyForm.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                const slug = title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');
                setPolicyForm({ ...policyForm, title, slug: policyForm.slug ? policyForm.slug : slug });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Slug (URL identifier) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. medical-evacuation"
                value={policyForm.slug || ''}
                onChange={(e) => setPolicyForm({ ...policyForm, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-[#0F1D36]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Category Tier
              </label>
              <select
                value={policyForm.category || 'General'}
                onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                <option value="Legal">Legal & Terms</option>
                <option value="Financial">Financial & Refunds</option>
                <option value="Safety">Safety & Mountain Ops</option>
                <option value="Community">Community & Chats</option>
                <option value="Conservation">Conservation & Eco</option>
                <option value="General">General Policy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Tagline / Short Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Emergency response protocols, AMREF air evacuation, and mountain first aid"
              value={policyForm.tagline || ''}
              onChange={(e) => setPolicyForm({ ...policyForm, tagline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Icon Style
              </label>
              <select
                value={policyForm.icon_name || 'FileText'}
                onChange={(e) => setPolicyForm({ ...policyForm, icon_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F1D36]"
              >
                <option value="FileText">Document (FileText)</option>
                <option value="AlertTriangle">Warning / Alert</option>
                <option value="Mountain">Mountain / Trails</option>
                <option value="ShieldCheck">Shield / Security</option>
                <option value="Globe">Globe / Eco</option>
                <option value="HeartPulse">Heart / Medical</option>
                <option value="Scale">Scale / Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Sort Order
              </label>
              <input
                type="number"
                min={1}
                value={policyForm.sort_order || 1}
                onChange={(e) => setPolicyForm({ ...policyForm, sort_order: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-[#0F1D36]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Public Status
              </label>
              <select
                value={policyForm.is_active ? 'active' : 'draft'}
                onChange={(e) => setPolicyForm({ ...policyForm, is_active: e.target.value === 'active' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                <option value="active">Active & Visible</option>
                <option value="draft">Draft / Hidden</option>
              </select>
            </div>
          </div>

          <RichTextEditor
            label="Full Customer-Facing Policy Copy *"
            placeholder="1. Clause One: Details of the policy...&#10;2. Clause Two: Further guidelines and commitments...&#10;3. Emergency Protocols..."
            value={policyForm.content || ''}
            onChange={(content) => setPolicyForm({ ...policyForm, content })}
            rows={9}
            minHeight="240px"
            helperText="Use the toolbar buttons to format bold headings, bullet lists, or callouts."
          />

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green"
            >
              Save Policy to List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
