'use client';

import React from 'react';
import Link from 'next/link';
import { Quote, ExternalLink } from 'lucide-react';

interface RichContentRendererProps {
  content: string;
  className?: string;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Split content into major blocks (paragraphs, headers, lists, blockquotes)
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentQuote: string[] = [];

  const flushList = (key: string) => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={key} className="space-y-2.5 my-4 pl-1">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] mt-2 shrink-0" />
                <span className="flex-1">{parseInline(item)}</span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key} className="space-y-2.5 my-4 pl-1 list-none counter-reset">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                <span className="font-mono text-xs font-bold bg-emerald-50 text-[#15803D] border border-emerald-200 rounded-lg px-2 py-0.5 mt-0.5 shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1">{parseInline(item)}</span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushQuote = (key: string) => {
    if (currentQuote.length > 0) {
      const quoteText = currentQuote.join('\n');
      elements.push(
        <blockquote
          key={key}
          className="my-5 p-5 bg-gradient-to-r from-emerald-50/80 to-slate-50 border-l-4 border-[#15803D] rounded-r-2xl text-slate-800 italic relative"
        >
          <Quote className="w-5 h-5 text-emerald-600/30 absolute top-3 right-3" />
          <div className="space-y-1 text-sm sm:text-base leading-relaxed">
            {currentQuote.map((qLine, qIdx) => (
              <p key={qIdx}>{parseInline(qLine)}</p>
            ))}
          </div>
        </blockquote>
      );
      currentQuote = [];
    }
  };

  // Helper to parse inline markdown (bold, italic, links, code, strikethrough)
  function parseInline(text: string): React.ReactNode {
    if (!text) return null;

    // Replace markdown patterns with React elements
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // 1. Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-[#0F1D36]">
            {boldMatch[2]}
          </strong>
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // 2. Italic: *text* or _text_
      const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
      if (italicMatch && !remaining.startsWith('**') && !remaining.startsWith('__')) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-700">
            {italicMatch[2]}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // 3. Strikethrough: ~~text~~
      const strikeMatch = remaining.match(/^~~(.*?)~~/);
      if (strikeMatch) {
        parts.push(
          <span key={keyIdx++} className="line-through text-slate-400">
            {strikeMatch[1]}
          </span>
        );
        remaining = remaining.slice(strikeMatch[0].length);
        continue;
      }

      // 4. Inline Link: [text](url)
      const linkMatch = remaining.match(/^\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const isExternal = linkMatch[2].startsWith('http');
        parts.push(
          <a
            key={keyIdx++}
            href={linkMatch[2]}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[#15803D] hover:text-[#166534] font-semibold underline underline-offset-2 inline-flex items-center gap-0.5"
          >
            <span>{linkMatch[1]}</span>
            {isExternal && <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // 5. Inline Code: `code`
      const codeMatch = remaining.match(/^`(.*?)`/);
      if (codeMatch) {
        parts.push(
          <code
            key={keyIdx++}
            className="font-mono text-xs bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded border border-slate-200"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // 6. Regular text until next special token
      const nextSpecial = remaining.search(/[\*_~\[`]/);
      if (nextSpecial === -1) {
        parts.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        // Unmatched character, consume 1 char
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        parts.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return <>{parts}</>;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      continue;
    }

    // Divider: --- or *** or ___
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      elements.push(<hr key={`hr-${i}`} className="my-8 border-slate-200" />);
      continue;
    }

    // Header 1: # Header
    if (line.startsWith('# ')) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      elements.push(
        <h2
          key={`h1-${i}`}
          className="font-serif text-2xl sm:text-3xl font-bold text-[#0F1D36] tracking-tight mt-8 mb-4 border-b border-slate-100 pb-2"
        >
          {parseInline(line.replace('# ', ''))}
        </h2>
      );
      continue;
    }

    // Header 2: ## Header
    if (line.startsWith('## ')) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      elements.push(
        <h3
          key={`h2-${i}`}
          className="font-serif text-xl sm:text-2xl font-bold text-[#0F1D36] tracking-tight mt-6 mb-3"
        >
          {parseInline(line.replace('## ', ''))}
        </h3>
      );
      continue;
    }

    // Header 3: ### Header
    if (line.startsWith('### ')) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      elements.push(
        <h4
          key={`h3-${i}`}
          className="font-serif text-lg sm:text-xl font-bold text-[#0F1D36] tracking-tight mt-5 mb-2"
        >
          {parseInline(line.replace('### ', ''))}
        </h4>
      );
      continue;
    }

    // Blockquote: > text
    if (line.startsWith('> ')) {
      flushList(`list-${i}`);
      currentQuote.push(line.replace('> ', ''));
      continue;
    }

    // Unordered list: - item or * item
    if (/^(\-|\*)\s+/.test(trimmed)) {
      flushQuote(`quote-${i}`);
      const itemContent = trimmed.replace(/^(\-|\*)\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList(`list-prev-${i}`);
        currentList = { type: 'ul', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      continue;
    }

    // Ordered list: 1. item or 2. item
    if (/^\d+\.\s+/.test(trimmed)) {
      flushQuote(`quote-${i}`);
      const itemContent = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList(`list-prev-${i}`);
        currentList = { type: 'ol', items: [itemContent] };
      } else {
        currentList.items.push(itemContent);
      }
      continue;
    }

    // Standalone Image: ![alt](url)
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      flushList(`list-${i}`);
      flushQuote(`quote-${i}`);
      elements.push(
        <figure key={`img-${i}`} className="my-6 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full max-h-[500px] object-cover" />
          {imgMatch[1] && (
            <figcaption className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-100 font-sans italic">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // Normal Paragraph
    flushList(`list-${i}`);
    flushQuote(`quote-${i}`);
    elements.push(
      <p key={`p-${i}`} className="text-slate-700 leading-relaxed font-sans text-sm sm:text-base my-3 font-normal">
        {parseInline(line)}
      </p>
    );
  }

  // Final flush
  flushList('list-final');
  flushQuote('quote-final');

  return <div className={`rich-content-container font-sans text-slate-800 ${className}`}>{elements}</div>;
};

export default RichContentRenderer;
