'use client';

import React from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';
import { TripGroupChat, TripChatMessage, TripChatMember } from '../../types';

export interface AdminChatsTabProps {
  chatsList: TripGroupChat[];
  searchChats: string;
  setSearchChats: (val: string) => void;
  selectedChatTrip: TripGroupChat | null;
  loadChatDetails: (chat: TripGroupChat) => Promise<void>;
  activeChatMessages: TripChatMessage[];
  activeChatMembers: TripChatMember[];
  chatMessageInput: string;
  setChatMessageInput: (val: string) => void;
  chatMediaUrlInput: string;
  setChatMediaUrlInput: (val: string) => void;
  chatPinMessage: boolean;
  setChatPinMessage: (val: boolean) => void;
  isChatSending: boolean;
  isChatLoading: boolean;
  handleSendChatMessage: (e: React.FormEvent) => Promise<void>;
  handleToggleAnnouncementMode: () => Promise<void>;
  setIsChatMembersModalOpen: (open: boolean) => void;
}

export default function AdminChatsTab({
  chatsList,
  searchChats,
  setSearchChats,
  selectedChatTrip,
  loadChatDetails,
  activeChatMessages,
  activeChatMembers,
  chatMessageInput,
  setChatMessageInput,
  isChatSending,
  handleSendChatMessage,
  handleToggleAnnouncementMode,
  setIsChatMembersModalOpen,
}: AdminChatsTabProps) {
  const filteredChats = chatsList.filter((c) => {
    return (
      (c.trip_title && c.trip_title.toLowerCase().includes(searchChats.toLowerCase())) ||
      (c.name && c.name.toLowerCase().includes(searchChats.toLowerCase()))
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Left Column: Chat Rooms Roster */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-serif text-lg font-bold text-[#0F1D36] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#15803D]" />
            <span>Expedition Group Chats</span>
          </h3>
          <p className="text-xs text-slate-400">Live communication channels with booked travelers</p>
        </div>

        <input
          type="text"
          placeholder="Filter group chats..."
          value={searchChats}
          onChange={(e) => setSearchChats(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F1D36]"
        />

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">No active chats found.</div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = selectedChatTrip?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => loadChatDetails(chat)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-300 text-[#0F1D36] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs line-clamp-1">{chat.trip_title || chat.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      {chat.member_count || 0} members
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {chat.last_message || 'No messages yet in this channel.'}
                  </p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat Room Messages & Broadcaster */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[550px]">
        {selectedChatTrip ? (
          <>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-base text-[#0F1D36]">{selectedChatTrip.trip_title || selectedChatTrip.name}</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {activeChatMembers.length} Enrolled Adventurers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatMembersModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roster</span>
                </button>
                <button
                  onClick={handleToggleAnnouncementMode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedChatTrip.announcement_only
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedChatTrip.announcement_only ? 'Broadcast Only' : 'Open Chat'}
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[360px]">
              {activeChatMessages.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No messages recorded in this expedition channel yet.
                </div>
              ) : (
                activeChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl max-w-lg text-xs ${
                      msg.is_pinned
                        ? 'bg-amber-50 border border-amber-200 ml-auto'
                        : msg.sender_role === 'ranger' || msg.sender_role === 'admin'
                        ? 'bg-emerald-50 border border-emerald-200 ml-auto'
                        : 'bg-slate-50 border border-slate-100 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[10px] font-bold">
                      <span className="text-[#0F1D36]">{msg.sender_name || 'Safari Guide'}</span>
                      <span className="text-slate-400 font-normal">
                        {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{msg.message_body || msg.message_text}</p>
                    {msg.media_url && (
                      <img
                        src={msg.media_url}
                        alt="Chat Attachment"
                        className="mt-2 rounded-xl max-h-40 w-full object-cover"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Broadcast Sender Form */}
            <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Send an official ranger dispatch or client message..."
                  value={chatMessageInput}
                  onChange={(e) => setChatMessageInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
                />
                <button
                  type="submit"
                  disabled={isChatSending || !chatMessageInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-400 p-8 space-y-2">
            <MessageSquare className="w-12 h-12 text-slate-200" />
            <p className="font-bold text-sm text-slate-600">Select an expedition chat on the left</p>
            <p className="text-xs text-slate-400">View live messages, post ranger announcements, and oversee member rosters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
