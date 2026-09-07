'use client';

import React from 'react';
import { MessageSquare, Users, Send, Smile, X, Loader2, CornerUpLeft, ChevronLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';
import { TripGroupChat, TripChatMessage, TripChatMember } from '../../types';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[360px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
      <Loader2 className="w-6 h-6 animate-spin text-[#15803D]" />
    </div>
  ),
});

export interface PortalChatTabProps {
  userChats: TripGroupChat[];
  selectedChat: TripGroupChat | null;
  setSelectedChat: (chat: TripGroupChat | null) => void;
  chatMessages: TripChatMessage[];
  chatMembers: TripChatMember[];
  newMessageText: string;
  setNewMessageText: (val: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  replyingTo: TripChatMessage | null;
  setReplyingTo: (msg: TripChatMessage | null) => void;
  isSendingMessage: boolean;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  user: any;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  emojiPickerRef: React.RefObject<HTMLDivElement | null>;
  emojiButtonRef: React.RefObject<HTMLButtonElement | null>;
  messageInputRef: React.RefObject<HTMLInputElement | null>;
  unreadCounts: Record<number, number>;
  hasMoreMessages: boolean;
  isLoadingOlder: boolean;
  loadOlderMessages: () => void;
  showMentionMenu: boolean;
  setShowMentionMenu: (val: boolean) => void;
  mentionQuery: string;
  setMentionQuery: (val: string) => void;
  onSelectChat: (chat: TripGroupChat) => void;
}

export default function PortalChatTab({
  userChats,
  selectedChat,
  setSelectedChat,
  chatMessages,
  chatMembers,
  newMessageText,
  setNewMessageText,
  showEmojiPicker,
  setShowEmojiPicker,
  replyingTo,
  setReplyingTo,
  isSendingMessage,
  handleSendMessage,
  user,
  chatContainerRef,
  emojiPickerRef,
  emojiButtonRef,
  messageInputRef,
  unreadCounts,
  hasMoreMessages,
  isLoadingOlder,
  loadOlderMessages,
  showMentionMenu,
  setShowMentionMenu,
  mentionQuery,
  setMentionQuery,
  onSelectChat,
}: PortalChatTabProps) {
  const isTripLeader = selectedChat && chatMembers.some(
    (m) => m.user_id === user?.id && (m.role === 'leader' || m.role === 'admin')
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] max-h-[85vh] animate-in fade-in duration-200">
      {/* Chats List Sidebar */}
      <div
        className={`${
          selectedChat ? 'hidden md:flex' : 'flex'
        } md:col-span-4 border-r border-slate-200 bg-slate-50/70 p-4 flex-col space-y-3 h-full overflow-y-auto`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Expedition Squads</h3>
            <p className="text-xs text-slate-500">Live chat with fellow adventurers & rangers</p>
          </div>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {userChats.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">
                You haven't joined any expedition squads yet. Book an adventure to get automated group chat access!
              </p>
            </div>
          ) : (
            userChats.map((chat) => {
              const isSelected = selectedChat?.id === chat.id;
              const unread = unreadCounts[chat.trip_id] || 0;

              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-[#15803D] shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 overflow-hidden relative">
                    <img
                      src={
                        chat.trip_image ||
                        'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={chat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-serif font-bold text-xs text-[#0F1D36] truncate">{chat.trip_title || chat.name}</h4>
                      {chat.departure_date && (
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(chat.departure_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {chat.last_message || 'Join the expedition conversation...'}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#15803D]" />
                        <span>{chat.member_count || 1} adventurers</span>
                      </span>
                    </div>
                  </div>
                  {unread > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] shrink-0 absolute top-3 right-3 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Live Chat Message Area */}
      <div
        className={`${
          !selectedChat ? 'hidden md:flex' : 'flex'
        } md:col-span-8 flex-col justify-between h-full bg-white relative`}
      >
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0F1D36] flex items-center gap-2">
                    <span>{selectedChat.trip_title || selectedChat.name}</span>
                    {selectedChat.announcement_only && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Broadcast Only
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {chatMembers.length} Members • Certified Rangers Active
                  </p>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px]">
              {hasMoreMessages && (
                <div className="text-center pt-1">
                  <button
                    onClick={loadOlderMessages}
                    disabled={isLoadingOlder}
                    className="text-xs text-[#15803D] font-bold hover:underline"
                  >
                    {isLoadingOlder ? 'Loading older messages...' : 'Load previous messages'}
                  </button>
                </div>
              )}

              {chatMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  <p>No messages in this expedition squad yet.</p>
                  <p className="mt-1">Say hello to your fellow travelers!</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isMe = msg.sender_id === user?.id || msg.user_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span className="font-bold text-[#0F1D36]">{isMe ? 'You' : msg.sender_name || 'Traveler'}</span>
                        {msg.sender_role === 'leader' || msg.sender_role === 'admin' ? (
                          <span className="bg-emerald-100 text-[#15803D] font-bold px-1.5 py-0.2 rounded text-[9px] uppercase">
                            Ranger
                          </span>
                        ) : null}
                        <span>•</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {msg.reply_to_id && msg.reply_body && (
                        <div className="bg-slate-100 border-l-2 border-[#15803D] px-2.5 py-1 rounded text-[10px] text-slate-600 mb-1 max-w-sm line-clamp-1">
                          <strong>{msg.reply_sender || 'Traveler'}:</strong> {msg.reply_body}
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#15803D] text-white rounded-br-none shadow-sm'
                            : msg.is_pinned
                            ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-none'
                            : 'bg-slate-100 text-[#0F1D36] rounded-bl-none'
                        }`}
                      >
                        {msg.message_body || msg.message_text}
                        {msg.media_url && (
                          <img src={msg.media_url} alt="Attachment" className="mt-2 rounded-xl max-h-48 w-full object-cover" />
                        )}
                      </div>

                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400 hover:text-[#15803D] mt-0.5 flex items-center gap-1"
                      >
                        <CornerUpLeft className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Composer */}
            <div className="p-3.5 border-t border-slate-100 bg-white">
              {replyingTo && (
                <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl text-xs text-slate-600 mb-2 border border-slate-200">
                  <div className="flex items-center gap-1.5 truncate">
                    <CornerUpLeft className="w-3.5 h-3.5 text-[#15803D]" />
                    <span className="font-bold">{replyingTo.sender_name || 'Traveler'}:</span>
                    <span className="truncate">{replyingTo.message_body || replyingTo.message_text}</span>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  ref={emojiButtonRef}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  ref={messageInputRef}
                  type="text"
                  placeholder={
                    selectedChat.announcement_only && !isTripLeader
                      ? 'Only expedition guides can post announcements.'
                      : 'Type message or sighting alert...'
                  }
                  disabled={selectedChat.announcement_only && !isTripLeader}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
                />

                <button
                  type="submit"
                  disabled={isSendingMessage || !newMessageText.trim() || (selectedChat.announcement_only && !isTripLeader)}
                  className="p-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white shadow-sm transition-all"
                >
                  {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-50 shadow-2xl">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setNewMessageText(newMessageText + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    theme={Theme.LIGHT}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 p-8 space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-200" />
            <p className="font-bold text-sm text-slate-600">Select an expedition squad</p>
            <p className="text-xs text-slate-400">Join real-time chat with your certified rangers and trip members.</p>
          </div>
        )}
      </div>
    </div>
  );
}
