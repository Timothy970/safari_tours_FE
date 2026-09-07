'use client';

import React from 'react';
import { X } from 'lucide-react';
import { BlogPost } from '../../types';
import RichTextEditor from '../RichTextEditor';

export interface AdminBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogForm: Partial<BlogPost>;
  setBlogForm: React.Dispatch<React.SetStateAction<Partial<BlogPost>>>;
  editingBlogId: number | null;
  onSave: (e: React.FormEvent) => void;
}

export default function AdminBlogModal({
  isOpen,
  onClose,
  blogForm,
  setBlogForm,
  editingBlogId,
  onSave,
}: AdminBlogModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-serif text-xl font-bold text-[#0F1D36]">
            {editingBlogId ? 'Edit Trail Guide Article' : 'Create New Trail Guide Article'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Article Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Conquering Mount Longonot: The Ultimate Trail Guide"
              value={blogForm.title || ''}
              onChange={(e) => {
                const title = e.target.value;
                const slug = title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');
                setBlogForm({ ...blogForm, title, slug });
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0F1D36]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Slug
              </label>
              <input
                type="text"
                required
                value={blogForm.slug || ''}
                onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-[#0F1D36]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Category
              </label>
              <select
                value={blogForm.category || 'Trail Guides'}
                onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F1D36]"
              >
                <option value="Trail Guides">Trail Guides</option>
                <option value="Camping Tips">Camping Tips</option>
                <option value="Adventure Stories">Adventure Stories</option>
                <option value="Gear & Packing">Gear & Packing</option>
                <option value="Fitness & Prep">Fitness & Prep</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              required
              value={blogForm.cover_image_url || ''}
              onChange={(e) => setBlogForm({ ...blogForm, cover_image_url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Author Name
              </label>
              <input
                type="text"
                required
                value={blogForm.author_name || ''}
                onChange={(e) => setBlogForm({ ...blogForm, author_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Read Time (Mins)
              </label>
              <input
                type="number"
                min={1}
                value={blogForm.read_time_minutes || 5}
                onChange={(e) => setBlogForm({ ...blogForm, read_time_minutes: parseInt(e.target.value) || 5 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Publish Status
              </label>
              <select
                value={blogForm.is_published ? 'published' : 'draft'}
                onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.value === 'published' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                <option value="published">Published Live</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Article Excerpt / Summary
            </label>
            <textarea
              rows={2}
              required
              placeholder="Short engaging teaser..."
              value={blogForm.excerpt || ''}
              onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0F1D36]"
            />
          </div>

          <RichTextEditor
            label="Article Content & Story"
            placeholder="Write your trail guide story here. Use the visual toolbar to bold words, add headings, lists, quotes, and photos..."
            value={blogForm.content || ''}
            onChange={(content) => setBlogForm({ ...blogForm, content })}
            rows={10}
            minHeight="280px"
            helperText="Switch to 'Live Preview' tab at any time to see how the article renders."
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
              Save Guide Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
