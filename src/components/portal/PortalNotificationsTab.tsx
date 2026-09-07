'use client';

import React from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { PortalNotification } from '../../app/portal/page';

export interface PortalNotificationsTabProps {
  notifications: PortalNotification[];
  notifFilter: 'all' | 'unread' | 'payment' | 'chat';
  setNotifFilter: (filter: 'all' | 'unread' | 'payment' | 'chat') => void;
  readNotifIds: string[];
  handleMarkAllRead: () => void;
  handleClearAll: () => void;
  handleNotificationAction: (notif: PortalNotification) => void;
  handleMarkAsRead: (id: string, e?: React.MouseEvent) => void;
  handleDeleteNotification: (id: string, e: React.MouseEvent) => void;
}

export default function PortalNotificationsTab({
  notifications,
  notifFilter,
  setNotifFilter,
  readNotifIds,
  handleMarkAllRead,
  handleClearAll,
  handleNotificationAction,
  handleMarkAsRead,
  handleDeleteNotification,
}: PortalNotificationsTabProps) {
  const filteredNotifs = notifications.filter((n) => {
    const isRead = n.is_read || readNotifIds.includes(n.id);
    if (notifFilter === 'unread') return !isRead;
    if (notifFilter === 'payment') return n.type === 'payment';
    if (notifFilter === 'chat') return n.type === 'chat';
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F1D36] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#15803D]" />
            <span>Dispatches & Booking Notifications</span>
          </h3>
          <p className="text-xs text-slate-500">Live payment receipts, squad broadcasts, and gate check-in alerts</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No notifications found matching your filter.</div>
        ) : (
          filteredNotifs.map((notif) => {
            const isRead = notif.is_read || readNotifIds.includes(notif.id);
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationAction(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isRead ? 'bg-white border-slate-200/80 text-slate-600' : 'bg-emerald-50/60 border-emerald-200 text-[#0F1D36] shadow-sm'
                }`}
              >
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm">{notif.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.action_label && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationAction(notif);
                      }}
                      className="px-3 py-1 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold"
                    >
                      {notif.action_label}
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
