'use client';

import React, { useState, useRef } from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Minus, Eye, Edit3, HelpCircle, X, Check } from 'lucide-react';
import RichContentRenderer from './RichContentRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  helperText?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or style your editorial content here...',
  minHeight = '240px',
  label,
  helperText,
  rows = 8,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to apply formatting around selection or at cursor position
  const applyFormat = (prefix: string, suffix: string = '', defaultPlaceholder: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    let selected = currentText.substring(start, end);
    let isBlock = prefix.startsWith('#') || prefix.startsWith('- ') || prefix.startsWith('1. ') || prefix.startsWith('> ');

    let newText = '';
    let newCursorPos = 0;

    if (selected.length > 0) {
      if (isBlock) {
        // Apply prefix to each selected line
        const lines = selected.split('\n');
        const formatted = lines.map((l) => `${prefix}${l}`).join('\n');
        newText = currentText.substring(0, start) + formatted + currentText.substring(end);
        newCursorPos = start + formatted.length;
      } else {
        newText = currentText.substring(0, start) + prefix + selected + suffix + currentText.substring(end);
        newCursorPos = start + prefix.length + selected.length + suffix.length;
      }
    } else {
      // Nothing selected: insert default placeholder with formatting
      const insertion = prefix + defaultPlaceholder + suffix;
      newText = currentText.substring(0, start) + insertion + currentText.substring(end);
      newCursorPos = start + prefix.length + defaultPlaceholder.length;
    }

    onChange(newText);

    // Restore focus and cursor position after React rerender
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    const label = linkText.trim() || 'link';
    const linkMarkdown = `[${label}](${linkUrl.trim()})`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;
      const newText = currentText.substring(0, start) + linkMarkdown + currentText.substring(end);
      onChange(newText);
    } else {
      onChange((value || '') + '\n' + linkMarkdown);
    }

    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const caption = imageCaption.trim() || 'Expedition capture';
    const imageMarkdown = `\n![${caption}](${imageUrl.trim()})\n`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;
      const newText = currentText.substring(0, start) + imageMarkdown + currentText.substring(end);
      onChange(newText);
    } else {
      onChange((value || '') + imageMarkdown);
    }

    setIsImageModalOpen(false);
    setImageUrl('');
    setImageCaption('');
  };

  return (
    <div className="space-y-1.5 font-sans">
      {/* Header with Label and Preview Toggle */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F1D36]">
            {label}
          </label>
        )}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 ml-auto">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-white text-[#15803D] shadow-sm'
                : 'text-slate-600 hover:text-[#0F1D36]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0F1D36]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm focus-within:border-[#15803D] transition-all">
        {/* Visual Formatting Toolbar (Only in Edit Mode) */}
        {activeTab === 'edit' && (
          <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1 text-slate-700">
            {/* Text Styling */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
              <button
                type="button"
                title="Bold (Highlight text and click)"
                onClick={() => applyFormat('**', '**', 'bold text')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <Bold className="w-4 h-4 font-bold" />
              </button>
              <button
                type="button"
                title="Italic"
                onClick={() => applyFormat('*', '*', 'italic text')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Strikethrough"
                onClick={() => applyFormat('~~', '~~', 'strikethrough text')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
              <button
                type="button"
                title="Main Heading (H1)"
                onClick={() => applyFormat('# ', '', 'Section Title')}
                className="px-2 py-1 rounded-lg hover:bg-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#0F1D36] flex items-center gap-0.5 transition-colors"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Sub Heading (H2)"
                onClick={() => applyFormat('## ', '', 'Sub-heading')}
                className="px-2 py-1 rounded-lg hover:bg-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#0F1D36] flex items-center gap-0.5 transition-colors"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Small Heading (H3)"
                onClick={() => applyFormat('### ', '', 'Topic Heading')}
                className="px-2 py-1 rounded-lg hover:bg-slate-200/80 text-xs font-bold text-slate-700 hover:text-[#0F1D36] flex items-center gap-0.5 transition-colors"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            {/* Lists & Quotes */}
            <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
              <button
                type="button"
                title="Bullet List"
                onClick={() => applyFormat('- ', '', 'List item')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Numbered List"
                onClick={() => applyFormat('1. ', '', 'Step item')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Quote / Callout Box"
                onClick={() => applyFormat('> ', '', 'Important note or quote')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* Media & Links */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                title="Insert Web Link"
                onClick={() => {
                  const textarea = textareaRef.current;
                  if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
                    setLinkText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd));
                  }
                  setIsLinkModalOpen(true);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <LinkIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Link</span>
              </button>

              <button
                type="button"
                title="Insert Image"
                onClick={() => setIsImageModalOpen(true)}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image</span>
              </button>

              <button
                type="button"
                title="Insert Divider"
                onClick={() => applyFormat('\n---\n')}
                className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-700 hover:text-[#0F1D36] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Body: Editor Textarea or Live Preview */}
        {activeTab === 'edit' ? (
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={rows}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              style={{ minHeight }}
              className="w-full p-4 text-xs sm:text-sm text-[#0F1D36] font-sans leading-relaxed focus:outline-none resize-y placeholder:text-slate-400 bg-transparent"
            />
            {/* Quick Word & Char Counter Footer */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
              <span>
                {(value || '').trim() ? (value || '').trim().split(/\s+/).length : 0} words &bull; {(value || '').length} characters
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{ minHeight }}
            className="p-6 sm:p-8 bg-[#FCFBF9] overflow-y-auto max-h-[500px]"
          >
            {value && value.trim() ? (
              <RichContentRenderer content={value} />
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs italic">
                No content entered yet. Switch back to Editor tab to add and style your text.
              </div>
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500 font-sans flex items-center gap-1 pt-0.5">
          <HelpCircle className="w-3 h-3 text-[#15803D]" />
          <span>{helperText}</span>
        </p>
      )}

      {/* Insert Link Mini Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0F1D36] font-serif font-bold text-lg">
                <LinkIcon className="w-5 h-5 text-[#15803D]" />
                <span>Insert Web Link</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F1D36] mb-1">
                  Link Text / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. View Mount Longonot Expedition"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F1D36] mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://... or /events"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Insert Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Insert Image Mini Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-[#0F1D36] font-serif font-bold text-lg">
                <ImageIcon className="w-5 h-5 text-[#15803D]" />
                <span>Insert Photo / Media</span>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F1D36] mb-1">
                  Image URL (High-Res Unsplash or Media Link)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F1D36] mb-1">
                  Photo Caption / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dawn sunrise over Mount Kenya Point Lenana"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Insert Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
