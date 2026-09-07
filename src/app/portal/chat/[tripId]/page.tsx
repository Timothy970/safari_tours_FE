'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MessageSquare, Send, ArrowLeft, Camera, Loader2, Smile, CheckCheck, X, CornerUpLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { TripChatMessage, TripChatMember } from '../../../../types';
import api from '../../../../lib/api';
import { Theme } from 'emoji-picker-react';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[320px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
      <Loader2 className="w-6 h-6 animate-spin text-[#15803D]" />
    </div>
  ),
});

export default function TripChatPage() {
  const params = useParams();
  const tripId = parseInt((params?.tripId as string) || '1', 10);

  const { user } = useAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<TripChatMessage[]>([]);
  const [chatMembers, setChatMembers] = useState<TripChatMember[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<TripChatMessage | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const formatChatDateSeparator = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffTime = today.getTime() - msgDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return d.toLocaleDateString(undefined, { weekday: 'long' });
    }
    return d.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderMessageBody = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(@[a-zA-Z0-9_]+(?:\s[a-zA-Z0-9_]+)?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="font-bold text-[#15803D] bg-emerald-50 px-1 py-0.5 rounded mr-0.5 inline-block">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const scrollChatToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const loadInitialData = async () => {
    try {
      const [msgs, members] = await Promise.all([
        api.getTripMessages(tripId, 30, 0),
        api.getChatMembers(tripId),
      ]);
      setMessages(msgs || []);
      setChatMembers(members || []);
      setHasMoreMessages((msgs || []).length >= 30);
      setTimeout(() => scrollChatToBottom('auto'), 50);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [tripId]);

  // Live polling for dispatches from squad and rangers
  useEffect(() => {
    if (!tripId) return;
    const interval = setInterval(async () => {
      try {
        const msgs = await api.getTripMessages(tripId, 30, 0);
        if (msgs) {
          setMessages((prev) => {
            if (msgs.length !== prev.length) {
              setTimeout(() => scrollChatToBottom('smooth'), 50);
            }
            return msgs;
          });
        }
      } catch {
        // silent
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [tripId]);

  const handleChatScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop < 40 && hasMoreMessages && !isLoadingOlder) {
      setIsLoadingOlder(true);
      const prevScrollHeight = target.scrollHeight;
      try {
        const older = await api.getTripMessages(tripId, 30, messages.length);
        if (older && older.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newUnique = older.filter((m) => !existingIds.has(m.id));
            if (newUnique.length === 0) {
              setHasMoreMessages(false);
              return prev;
            }
            return [...newUnique, ...prev];
          });
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - prevScrollHeight;
            }
          }, 10);
        } else {
          setHasMoreMessages(false);
        }
      } catch {
        // silent
      } finally {
        setIsLoadingOlder(false);
      }
    }
  };

  // Handle escape key and clicking outside to close / cancel emoji picker
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showEmojiPicker) setShowEmojiPicker(false);
        if (showMentionMenu) setShowMentionMenu(false);
        if (replyingTo) setReplyingTo(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, showMentionMenu, replyingTo]);

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    const match = val.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      setMentionQuery(match[1].toLowerCase());
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSelectMention = (member: TripChatMember) => {
    const name = member.full_name || 'Traveler';
    const updated = inputText.replace(/@([a-zA-Z0-9_]*)$/, `@${name} `);
    setInputText(updated);
    setShowMentionMenu(false);
    messageInputRef.current?.focus();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const body = inputText.trim();
    const currentReply = replyingTo;
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowMentionMenu(false);
    setIsSending(true);

    const tempId = Date.now();
    const optimisticMsg: TripChatMessage = {
      id: tempId,
      chat_id: tripId,
      sender_id: user?.id || 0,
      user_id: user?.id || 0,
      message_type: 'text',
      message_body: body,
      is_pinned: false,
      created_at: new Date().toISOString(),
      sender_name: user?.full_name || 'You',
      sender_avatar: user?.avatar_url,
      sender_role: user?.role || 'member',
      reply_to_id: currentReply ? currentReply.id : undefined,
      reply_body: currentReply ? currentReply.message_body : undefined,
      reply_sender: currentReply ? (currentReply.sender_name || 'Traveler') : undefined,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollChatToBottom('smooth'), 30);

    try {
      const newMsg = await api.sendChatMessage(tripId, body, {
        reply_to_id: currentReply ? currentReply.id : undefined,
        reply_body: currentReply ? currentReply.message_body : undefined,
        reply_sender: currentReply ? (currentReply.sender_name || 'Traveler') : undefined,
      });
      if (newMsg && (newMsg.id || newMsg.message_body)) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...newMsg, sender_name: newMsg.sender_name || user?.full_name || 'You' } : m))
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      showToast('error', 'Error', 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleBroadcastSighting = async () => {
    const sightingBody = '🚨 FIELD SIGHTING ALERT: Matriarch elephant family with twin calves spotted along the trail!';
    const tempId = Date.now();
    const optimisticMsg: TripChatMessage = {
      id: tempId,
      chat_id: tripId,
      sender_id: user?.id || 0,
      user_id: user?.id || 0,
      message_type: 'text',
      message_body: sightingBody,
      is_pinned: false,
      created_at: new Date().toISOString(),
      sender_name: user?.full_name || 'You',
      sender_avatar: user?.avatar_url,
      sender_role: user?.role || 'member',
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollChatToBottom('smooth'), 30);

    try {
      const newMsg = await api.sendChatMessage(tripId, sightingBody);
      if (newMsg && (newMsg.id || newMsg.message_body)) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...newMsg, sender_name: newMsg.sender_name || user?.full_name || 'You' } : m))
        );
      }
      showToast('success', 'Sighting Broadcasted!', 'Shared with your expedition group & ranger.');
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      showToast('error', 'Error', 'Failed to broadcast sighting.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Kibali Primary Forest Palette */}
        <div className="bg-gradient-to-r from-[#062013] via-[#092B1B] to-[#0B3B24] text-white rounded-3xl p-5 sm:p-6 shadow-xl mb-6 flex items-center justify-between border border-emerald-800/40">
          <div className="flex items-center gap-3">
            <Link
              href="/portal?tab=chats"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-extrabold">
                  Live Dispatch Squad Hub
                </span>
              </div>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                Expedition Squad Chat & Ranger Comms
              </h1>
            </div>
          </div>

          <button
            onClick={handleBroadcastSighting}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Broadcast Sighting</span>
          </button>
        </div>

        {/* Chat Stream Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-6 h-[620px] flex flex-col justify-between">
          {/* Messages Feed with Isolated Internal Scroll */}
          <div
            ref={chatContainerRef}
            onScroll={handleChatScroll}
            className="overflow-y-auto space-y-3.5 px-3 py-4 flex-1 bg-slate-50/70 rounded-2xl border border-slate-100"
          >
            {isLoadingOlder && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-slate-500 bg-white/60 rounded-full w-fit mx-auto px-4 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#15803D]" />
                <span>Loading earlier dispatches...</span>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-[#15803D]" />
              </div>
            ) : !messages || messages.filter(Boolean).length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">No messages yet</p>
                <p className="text-[11px] mt-1">Send a dispatch to your ranger and fellow travelers!</p>
              </div>
            ) : (
              (() => {
                const validMsgs = messages.filter(
                  (m): m is TripChatMessage => Boolean(m && typeof m === 'object')
                );

                return validMsgs.map((m, index) => {
                  const isMe = (m.sender_id || m.user_id) === user?.id;
                  const isSystem = m.message_type === 'system_announcement';
                  const msgText = m.message_body || m.message_text || '';
                  const timeStr = m.created_at
                    ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '';

                  // Date Divider Check
                  const currentDateStr = m.created_at ? new Date(m.created_at).toDateString() : '';
                  const prevDateStr =
                    index > 0 && validMsgs[index - 1].created_at
                      ? new Date(validMsgs[index - 1].created_at).toDateString()
                      : '';
                  const showDateDivider = currentDateStr !== prevDateStr;

                  return (
                    <React.Fragment key={m.id || index}>
                      {showDateDivider && m.created_at && (
                        <div className="flex justify-center my-3">
                          <span className="bg-white text-slate-600 font-semibold text-[10px] sm:text-[11px] px-3.5 py-1 rounded-full shadow-xs border border-slate-200/90 uppercase tracking-wider">
                            {formatChatDateSeparator(m.created_at)}
                          </span>
                        </div>
                      )}

                      {isSystem ? (
                        <div className="flex justify-center my-2">
                          <span className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-3.5 py-1.5 text-xs text-center font-bold shadow-xs">
                            📢 {msgText}
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`group flex flex-col ${
                            isMe ? 'items-end' : 'items-start'
                          } transition-all relative`}
                        >
                          {!isMe && (
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                              <span className="font-bold text-[#15803D]">
                                {m.sender_name || 'Fellow Explorer'}
                              </span>
                              {m.sender_role === 'trip_leader' && (
                                <span className="bg-[#15803D] text-white px-1.5 py-0.2 rounded text-[9px] font-bold uppercase">
                                  Guide
                                </span>
                              )}
                              {(m.sender_role === 'admin' || m.sender_role === 'super_admin') && (
                                <span className="bg-[#0F1D36] text-white px-1.5 py-0.2 rounded text-[9px] font-bold uppercase">
                                  Ranger HQ
                                </span>
                              )}
                            </div>
                          )}

                          <div className="relative max-w-[85%] sm:max-w-md">
                            {/* Quick Reply Button on Hover */}
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(m);
                                messageInputRef.current?.focus();
                              }}
                              className={`absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white hover:bg-slate-100 rounded-full shadow border border-slate-200 text-slate-500 hover:text-[#15803D] ${
                                isMe ? '-left-8' : '-right-8'
                              }`}
                              title="Reply to this message"
                            >
                              <CornerUpLeft className="w-3.5 h-3.5" />
                            </button>

                            <div
                              className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs transition-all relative ${
                                isMe
                                  ? 'bg-[#DCF8C6] text-[#111B21] border border-[#C5F3BD] rounded-tr-none'
                                  : 'bg-white text-[#111B21] border border-slate-200 rounded-tl-none'
                              }`}
                            >
                              {m.reply_body && (
                                <div className="mb-2 p-2 rounded-xl bg-black/5 border-l-4 border-[#15803D] text-[11px]">
                                  <p className="font-bold text-[#15803D] truncate">
                                    {m.reply_sender || 'Traveler'}
                                  </p>
                                  <p className="text-slate-600 line-clamp-2">{m.reply_body}</p>
                                </div>
                              )}

                              <p className="font-sans break-words whitespace-pre-wrap">{renderMessageBody(msgText)}</p>

                              <div
                                className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                  isMe ? 'text-emerald-800/70' : 'text-slate-400'
                                }`}
                              >
                                <span>{timeStr}</span>
                                {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#15803D]" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                });
              })()
            )}
          </div>

          {/* Message Composer Container */}
          <div className="relative pt-3 border-t border-slate-100 mt-2">
            {/* Quoted Reply Bar */}
            {replyingTo && (
              <div className="mb-2 p-2.5 bg-emerald-50/90 border-l-4 border-[#15803D] rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-xs font-bold text-[#15803D]">
                    Replying to {replyingTo.sender_name || 'Traveler'}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">{replyingTo.message_body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-emerald-100 transition-colors"
                  title="Cancel reply"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* @ Mention Autocomplete Popup */}
            {showMentionMenu && (
              <div className="absolute bottom-full mb-2 left-4 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 w-64 overflow-y-auto p-1.5 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                  Squad Members
                </div>
                {(() => {
                  const taggableMembers = chatMembers.filter(
                    (m) =>
                      m.user_id !== user?.id &&
                      (m.full_name || 'Adventurer').toLowerCase().includes(mentionQuery)
                  );
                  if (taggableMembers.length === 0) {
                    return (
                      <p className="px-2.5 py-2 text-[11px] text-slate-400 italic">
                        No other squad members to tag yet
                      </p>
                    );
                  }
                  return taggableMembers.map((member) => (
                    <button
                      key={member.id || member.user_id}
                      type="button"
                      onClick={() => handleSelectMention(member)}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs hover:bg-emerald-50 text-slate-700 flex items-center justify-between transition-colors"
                    >
                      <span className="font-bold text-[#0F1D36]">{member.full_name || 'Adventurer'}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{member.role}</span>
                    </button>
                  ));
                })()}
              </div>
            )}

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full mb-3 left-0 sm:left-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white animate-in fade-in zoom-in-95 w-[calc(100vw-2.5rem)] sm:w-[320px] max-w-[340px]"
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F1D36]">
                    <Smile className="w-4 h-4 text-[#15803D]" />
                    <span>Pick an Emoji</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(false)}
                    className="px-2 py-0.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Close (Esc)"
                  >
                    <span>Cancel</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Reaction Bar */}
                <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100/80 border-b border-slate-200/80 gap-1 overflow-x-auto no-scrollbar">
                  {['👍', '❤️', '🔥', '😂', '🎉', '🦁', '🏔️', '🐘', '⛺', '✨'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputText((prev) => prev + emoji);
                      }}
                      className="hover:scale-125 transition-transform p-1 text-sm active:scale-95"
                      title={`Add ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Emoji Picker Component */}
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setInputText((prev) => prev + emojiData.emoji);
                  }}
                  autoFocusSearch={false}
                  theme={Theme.LIGHT}
                  width="100%"
                  height={300}
                  lazyLoadEmojis={true}
                />
              </div>
            )}

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                ref={emojiButtonRef}
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`p-2.5 rounded-full transition-colors shrink-0 ${
                  showEmojiPicker
                    ? 'bg-emerald-100 text-[#15803D]'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Insert Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <input
                ref={messageInputRef}
                type="text"
                placeholder={
                  replyingTo
                    ? `Replying to ${replyingTo.sender_name || 'Traveler'}...`
                    : 'Type dispatch message (use @ to mention squad)...'
                }
                value={inputText}
                onChange={handleMessageInputChange}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D] font-medium"
              />

              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
