'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { QrCode, MessageSquare, Camera, Loader2, Upload, Download, Lock, AlertCircle, Phone, CreditCard, Bell } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Booking, TripGallery, TripGroupChat, TripChatMessage, TripChatMember } from '../../types';
import BoardingPassCard from '../../components/ui/BoardingPassCard';
import PortalBookingsTab from '../../components/portal/PortalBookingsTab';
import PortalChatTab from '../../components/portal/PortalChatTab';
import PortalVaultTab from '../../components/portal/PortalVaultTab';
import PortalImpactTab from '../../components/portal/PortalImpactTab';
import PortalNotificationsTab from '../../components/portal/PortalNotificationsTab';
import PortalReviewModal from '../../components/portal/PortalReviewModal';
import PortalPhotoUploadModal from '../../components/portal/PortalPhotoUploadModal';
import PortalSTKPaymentModal from '../../components/portal/PortalSTKPaymentModal';

import api from '../../lib/api';


const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <div className="w-[320px] h-[360px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
      <Loader2 className="w-6 h-6 animate-spin text-[#15803D]" />
    </div>
  ),
});

export interface PortalNotification {
  id: string;
  type: 'payment' | 'booking' | 'chat' | 'points' | 'vault';
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  action_label?: string;
  action_tab?: 'upcoming' | 'chats' | 'vault' | 'notifications' | 'impact';
  booking?: Booking;
  trip_id?: number;
}

function TravelerPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'upcoming';

  const { user, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'chats' | 'vault' | 'notifications' | 'impact'>(
    ['upcoming', 'chats', 'vault', 'notifications', 'impact'].includes(initialTab) ? initialTab : 'upcoming'
  );

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [vaultPhotos, setVaultPhotos] = useState<TripGallery[]>([]);
  const [userChats, setUserChats] = useState<TripGroupChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<TripGroupChat | null>(null);
  const [chatMessages, setChatMessages] = useState<TripChatMessage[]>([]);
  const [chatMembers, setChatMembers] = useState<TripChatMember[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<TripChatMessage | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // In-App Notifications State
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'payment' | 'chat'>('all');
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);

  // Event Photos Vault State (Event-specific photo downloads)
  const [selectedTripForVault, setSelectedTripForVault] = useState<number | null>(null);
  const [vaultPhotosForTrip, setVaultPhotosForTrip] = useState<TripGallery[]>([]);
  const [isVaultLoading, setIsVaultLoading] = useState(false);
  const [vaultLightboxIndex, setVaultLightboxIndex] = useState<number | null>(null);

  // M-Pesa STK Settle Balance Modal State
  const [isSTKModalOpen, setIsSTKModalOpen] = useState(false);
  const [stkTargetBooking, setStkTargetBooking] = useState<Booking | null>(null);
  const [stkPhoneNumber, setStkPhoneNumber] = useState('');
  const [stkAmount, setStkAmount] = useState<number>(0);
  const [isTriggeringSTK, setIsTriggeringSTK] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Photo Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadTags, setUploadTags] = useState('');

  // Authentication Guard: Redirect unauthorized users to login, and admin users to /admin
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/auth/login?redirect=/portal');
      } else if (user.role === 'admin' || user.role === 'super_admin') {
        router.replace('/admin');
      }
    }
  }, [isAuthLoading, user, router]);

  // Load Bookings, Chats & Photos
  const loadPortalData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const [bookingsData, chatsData] = await Promise.all([
        api.getMyBookings().catch(() => []),
        api.getUserChats().catch(() => []),
      ]);
      setBookings(bookingsData);
      setUserChats(chatsData);

      if (bookingsData.length > 0) {
        if (!selectedBookingForPass) {
          setSelectedBookingForPass(bookingsData[0]);
        }
        const initialTripId = bookingsData[0].trip_id;
        setSelectedTripForVault((prev) => prev || initialTripId);

        // Fetch vault photos across user's booked events
        const tripIds = Array.from(new Set(bookingsData.map((b) => b.trip_id).filter(Boolean)));
        const allVaultPhotos = await Promise.all(
          tripIds.map((id) => api.getTripVault(id).catch(() => []))
        );
        const flatVaultPhotos = allVaultPhotos.flat();
        setVaultPhotos(flatVaultPhotos);

        // Initial selected trip photos
        const currentTripPhotos = flatVaultPhotos.filter((p) => p.trip_id === initialTripId);
        setVaultPhotosForTrip(currentTripPhotos.length > 0 ? currentTripPhotos : await api.getTripVault(initialTripId).catch(() => []));
      } else {
        setVaultPhotos([]);
        setVaultPhotosForTrip([]);
      }

      if (chatsData.length > 0 && !selectedChat) {
        setSelectedChat(chatsData[0]);
        loadChatMessages(chatsData[0].trip_id);
      }
    } catch (err) {
      console.error('Failed to load traveler portal data:', err);
      setVaultPhotos([]);
      setVaultPhotosForTrip([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTripVaultPhotos = async (tripId: number) => {
    setIsVaultLoading(true);
    try {
      const photos = await api.getTripVault(tripId);
      setVaultPhotosForTrip(photos);
    } catch (err) {
      console.error('Failed to load event photos vault:', err);
      setVaultPhotosForTrip([]);
    } finally {
      setIsVaultLoading(false);
    }
  };

  const handleSelectTripForVault = (tripId: number) => {
    setSelectedTripForVault(tripId);
    loadTripVaultPhotos(tripId);
  };

  const handleDownloadPhoto = async (photoUrl: string, caption?: string) => {
    try {
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const cleanName = (caption || 'kibali-event-photo')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      link.download = `${cleanName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast('success', 'Download Started', 'High-res event photo is downloading.');
    } catch {
      window.open(photoUrl, '_blank');
    }
  };

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

  const loadChatMessages = async (tripId: number, initial: boolean = true) => {
    try {
      const [chatDetails, members] = await Promise.all([
        api.getTripChat(tripId, 30, 0),
        api.getChatMembers(tripId),
      ]);
      if (chatDetails?.messages) {
        setChatMessages(chatDetails.messages);
        setHasMoreMessages(chatDetails.messages.length >= 30);
      }
      if (members) {
        setChatMembers(members);
      }
      if (initial) {
        setTimeout(() => scrollChatToBottom('auto'), 50);
      }
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      loadPortalData();
    } else if (!isAuthLoading && !user) {
      setIsLoading(false);
    }
  }, [isAuthLoading, user]);

  const handleSelectChat = (chat: TripGroupChat) => {
    setSelectedChat(chat);
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowMentionMenu(false);

    // Clear unread count for this chat
    setUnreadCounts((prev) => ({ ...prev, [chat.id]: 0 }));
    if (typeof window !== 'undefined') {
      localStorage.setItem(`kibali_chat_read_${chat.id}`, new Date().toISOString());
    }

    loadChatMessages(chat.trip_id, true);
  };

  const handleChatScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop < 40 && hasMoreMessages && !isLoadingOlder && selectedChat) {
      loadOlderMessages();
    }
  };

  const loadOlderMessages = async () => {
    if (!hasMoreMessages || isLoadingOlder || !selectedChat) return;
    setIsLoadingOlder(true);
    const prevScrollHeight = chatContainerRef.current?.scrollHeight || 0;
    try {
      const older = await api.getTripMessages(selectedChat.trip_id, 30, chatMessages.length);
      if (older && older.length > 0) {
        setChatMessages((prev) => {
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

  // Live polling for group chat dispatches & unread badge counters
  useEffect(() => {
    if (activeTab !== 'chats') return;
    const pollInterval = setInterval(async () => {
      try {
        if (selectedChat?.trip_id) {
          const chatDetails = await api.getTripChat(selectedChat.trip_id, 30, 0);
          if (chatDetails?.messages) {
            setChatMessages((prev) => {
              if (chatDetails.messages.length !== prev.length) {
                setTimeout(() => scrollChatToBottom('smooth'), 50);
              }
              return chatDetails.messages;
            });
          }
        }

        // Poll chat list to detect new messages in other groups
        const updatedChats = await api.getUserChats();
        if (updatedChats) {
          setUserChats(updatedChats);
          const newUnreads: Record<number, number> = {};
          updatedChats.forEach((c) => {
            if (selectedChat && selectedChat.id === c.id) {
              newUnreads[c.id] = 0;
              return;
            }
            const lastRead = typeof window !== 'undefined' ? localStorage.getItem(`kibali_chat_read_${c.id}`) : null;
            if (lastRead && c.created_at && new Date(c.created_at) > new Date(lastRead)) {
              newUnreads[c.id] = (unreadCounts[c.id] || 0) + 1;
            }
          });
          if (Object.keys(newUnreads).length > 0) {
            setUnreadCounts((prev) => ({ ...prev, ...newUnreads }));
          }
        }
      } catch {
        // silent
      }
    }, 4000);
    return () => clearInterval(pollInterval);
  }, [activeTab, selectedChat?.trip_id, selectedChat?.id]);

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewMessageText(val);

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
    const updated = newMessageText.replace(/@([a-zA-Z0-9_]*)$/, `@${name} `);
    setNewMessageText(updated);
    setShowMentionMenu(false);
    messageInputRef.current?.focus();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedChat) return;

    const body = newMessageText.trim();
    const currentReply = replyingTo;
    setNewMessageText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowMentionMenu(false);
    setIsSendingMessage(true);

    const tempId = Date.now();
    const optimisticMsg: TripChatMessage = {
      id: tempId,
      chat_id: selectedChat.id,
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

    setChatMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollChatToBottom('smooth'), 30);

    try {
      const sentMsg = await api.sendChatMessage(selectedChat.trip_id, body, {
        reply_to_id: currentReply ? currentReply.id : undefined,
        reply_body: currentReply ? currentReply.message_body : undefined,
        reply_sender: currentReply ? (currentReply.sender_name || 'Traveler') : undefined,
      });
      if (sentMsg && (sentMsg.id || sentMsg.message_body)) {
        setChatMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...sentMsg, sender_name: sentMsg.sender_name || user?.full_name || 'You' } : m))
        );
      }
      showToast('success', 'Message Sent', 'Your dispatch was posted to the squad chat.');
    } catch (err: any) {
      setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
      showToast('error', 'Chat Error', err.message || 'Failed to send message.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Open M-Pesa STK Settle Balance Modal
  const openPayBalanceModal = (booking: Booking) => {
    setStkTargetBooking(booking);
    setStkPhoneNumber(user?.phone_number || '');
    const bal = Number(
      booking.outstanding_balance !== undefined && booking.outstanding_balance !== null
        ? booking.outstanding_balance
        : (booking.total_amount - (booking.amount_paid || 0))
    );
    setStkAmount(bal > 0 ? bal : Number(booking.total_amount || 0));
    setIsSTKModalOpen(true);
  };

  // Trigger Real M-Pesa STK Push
  const handleTriggerSTKPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stkTargetBooking || !stkPhoneNumber.trim()) {
      showToast('error', 'Phone Required', 'Please enter your Safaricom M-Pesa phone number.');
      return;
    }
    if (stkAmount <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setIsTriggeringSTK(true);
    try {
      const res = await api.initiateMpesaSTK({
        booking_id: stkTargetBooking.id,
        booking_reference: stkTargetBooking.booking_reference,
        phone_number: stkPhoneNumber.trim(),
        amount: stkAmount,
        payment_type: stkAmount >= (stkTargetBooking.outstanding_balance || 0) ? 'full_balance' : 'installment',
      });
      showToast('success', 'M-Pesa STK Push Prompt Sent!', res.customer_message || 'Please check your phone screen and enter your M-Pesa PIN.');
      setIsSTKModalOpen(false);
      // Refresh portal after a short delay
      setTimeout(() => {
        loadPortalData();
      }, 5000);
    } catch (err: any) {
      showToast('error', 'Payment Initiation Failed', err.message || 'Could not send M-Pesa STK push.');
    } finally {
      setIsTriggeringSTK(false);
    }
  };

  // Open Review Modal for a Booking
  const openReviewModal = (booking: Booking) => {
    setReviewBooking(booking);
    setReviewRating(5);
    setReviewHeadline('');
    setReviewText('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !reviewHeadline.trim() || !reviewText.trim()) {
      showToast('error', 'Required Fields', 'Please enter a headline and your review message.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await api.submitReview({
        booking_id: reviewBooking.id,
        trip_id: reviewBooking.trip_id,
        rating: reviewRating,
        headline: reviewHeadline.trim(),
        review_text: reviewText.trim(),
      });
      showToast(
        'success',
        'Review Submitted!',
        'Thank you for your feedback! Once approved by admin, it will appear on testimonials.'
      );
      setIsReviewModalOpen(false);
    } catch (err: any) {
      showToast('error', 'Review Error', err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Submit Photo to Vault
  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim() || !uploadCaption.trim()) {
      showToast('error', 'Missing Data', 'Please provide an image URL and caption.');
      return;
    }

    try {
      const newPhoto = await api.uploadToVault(bookings[0]?.trip_id || 1, {
        media_url: uploadUrl.trim(),
        caption: uploadCaption.trim(),
        tags: uploadTags.trim() || 'Hike, Peak, Community',
        is_public: true,
      });
      setVaultPhotos([newPhoto, ...vaultPhotos]);
      setIsUploadModalOpen(false);
      setUploadUrl('');
      setUploadCaption('');
      setUploadTags('');
      showToast('success', 'Photo Added to Vault', 'Your capture is now shared with your expedition group.');
    } catch (err: any) {
      showToast('error', 'Upload Error', err.message || 'Failed to upload photo');
    }
  };

  // Load read notifications from localStorage
  useEffect(() => {
    if (!user) return;
    try {
      const stored = localStorage.getItem(`kibali_read_notifications_${user.id}`);
      if (stored) {
        setReadNotifIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Compute and populate in-app notifications
  useEffect(() => {
    if (!user) return;
    const list: PortalNotification[] = [];
    const readSet = new Set(readNotifIds);

    // 1. Pending Balance Reminders
    bookings
      .filter(
        (b) =>
          b.booking_status !== 'fully_paid' &&
          (b.outstanding_balance ?? (b.total_amount - (b.amount_paid || 0))) > 0
      )
      .forEach((b) => {
        const id = `notif-pay-${b.id}`;
        list.push({
          id,
          type: 'payment',
          title: `Action Required: Settle Balance for ${b.trip_title || 'Expedition'}`,
          message: `Your reservation #${b.booking_reference} has an outstanding balance of KES ${(
            b.outstanding_balance ?? (b.total_amount - (b.amount_paid || 0))
          ).toLocaleString()}. Complete payment to activate your official QR Boarding Pass.`,
          created_at: b.created_at || new Date().toISOString(),
          is_read: readSet.has(id),
          action_label: 'Pay Full Balance',
          action_tab: 'upcoming',
          booking: b,
        });
      });

    // 2. Verified Boarding Pass Ready
    bookings
      .filter(
        (b) =>
          b.booking_status === 'fully_paid' ||
          (b.amount_paid && b.amount_paid >= b.total_amount)
      )
      .forEach((b) => {
        const id = `notif-pass-${b.id}`;
        list.push({
          id,
          type: 'booking',
          title: `Digital Boarding Pass Active: ${b.trip_title || 'Expedition'}`,
          message: `Your booking #${b.booking_reference} is cleared! Your verified QR pass is ready for departure gate check-in.`,
          created_at: b.created_at || new Date().toISOString(),
          is_read: readSet.has(id),
          action_label: 'View Digital Pass',
          action_tab: 'upcoming',
          booking: b,
        });
      });

    // 3. Welcome Eco Points
    const welcomeId = `notif-welcome-${user.id}`;
    list.push({
      id: welcomeId,
      type: 'points',
      title: '100 Eco Reward Points Credited',
      message: `Welcome to Kibali Africa! 100 Reward Points have been credited to your adventurer profile for joining the community.`,
      created_at: user.created_at || new Date().toISOString(),
      is_read: readSet.has(welcomeId),
      action_label: 'View Eco Impact',
      action_tab: 'impact',
    });

    // 4. Group Chat Dispatches
    userChats.forEach((chat) => {
      const id = `notif-chat-${chat.id}`;
      list.push({
        id,
        type: 'chat',
        title: `Dispatch Channel Active: ${chat.trip_title || chat.name}`,
        message: `Your squad group chat for ${chat.trip_title || chat.name} is open. Connect with your expedition guide and squad mates.`,
        created_at: chat.created_at || new Date().toISOString(),
        is_read: readSet.has(id),
        action_label: 'Open Chat Room',
        action_tab: 'chats',
        trip_id: chat.trip_id,
      });
    });

    // 5. Photos Vault Captures
    const userBookedTrips = Array.from(new Set(bookings.map((b) => b.trip_id).filter(Boolean)));
    userBookedTrips.forEach((tripId) => {
      const relatedBooking = bookings.find((b) => b.trip_id === tripId);
      const id = `notif-vault-${tripId}`;
      list.push({
        id,
        type: 'vault',
        title: `Expedition Photos Vault: ${relatedBooking?.trip_title || 'Expedition'}`,
        message: `High-resolution expedition memories and photos are available for download in your private vault.`,
        created_at: relatedBooking?.created_at || new Date().toISOString(),
        is_read: readSet.has(id),
        action_label: 'Open Photo Vault',
        action_tab: 'vault',
        trip_id: tripId,
      });
    });

    setNotifications(list);
  }, [user, bookings, userChats, readNotifIds]);

  const markAllNotificationsAsRead = () => {
    if (!user) return;
    const allIds = notifications.map((n) => n.id);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem(`kibali_read_notifications_${user.id}`, JSON.stringify(allIds));
    } catch {
      // ignore
    }
  };

  const markNotificationAsRead = (id: string) => {
    if (!user) return;
    if (readNotifIds.includes(id)) return;
    const updated = [...readNotifIds, id];
    setReadNotifIds(updated);
    try {
      localStorage.setItem(`kibali_read_notifications_${user.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleNotificationAction = (notif: PortalNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.booking && notif.type === 'payment') {
      openPayBalanceModal(notif.booking);
    } else if (notif.booking && notif.type === 'booking') {
      setSelectedBookingForPass(notif.booking);
      setActiveTab('upcoming');
    } else if (notif.action_tab === 'vault' && notif.trip_id) {
      setSelectedTripForVault(notif.trip_id);
      setActiveTab('vault');
    } else if (notif.action_tab) {
      setActiveTab(notif.action_tab);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;
  const totalTreesPlanted = bookings.filter((b) => b.booking_status === 'fully_paid' || (b.amount_paid && b.amount_paid > 0)).length * 2;

  if (isAuthLoading || (isLoading && user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FCFBF9]">
        <Loader2 className="w-10 h-10 text-[#15803D] animate-spin" />
        <p className="text-sm font-semibold text-[#0F1D36]">Loading explorer credentials & chat rooms...</p>
      </div>
    );
  }

  // If user is unauthenticated, show secure sign-in barrier
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FCFBF9]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 bg-emerald-50 text-[#15803D] rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0F1D36]">Traveler Portal Protected</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Please sign in with your explorer account to view your booked expeditions, download digital QR boarding passes, and access group chats.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <Link
              href="/auth/login?redirect=/portal"
              className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green block text-center transition-all"
            >
              Sign In to Continue
            </Link>
            <Link
              href="/auth/register?redirect=/portal"
              className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-[#0F1D36] border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider block text-center transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] pt-28 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-[#051F12] via-[#0B3B22] to-[#15803D] text-white rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-500/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white p-1 flex items-center justify-center border-2 border-[#15803D]">
              <img
                src={user?.avatar_url || '/images/logo.png'}
                alt={user?.full_name || 'Adventurer'}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#15803D] font-extrabold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {user?.role === 'admin' ? 'Super Admin' : user?.role === 'trip_leader' ? 'Trip Leader' : 'Verified Adventurer'}
                </span>
                <span className="text-[10px] text-slate-400">ID: {user?.uuid?.slice(0, 8)}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">
                {user?.full_name || 'Kibali Explorer'}
              </h1>
              <p className="text-xs text-slate-300">
                {user?.email} &bull; Member of the Outdoor Tribe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block">
                Eco Reward Points
              </span>
              <span className="font-mono text-xl font-bold text-amber-300">
                {user?.reward_points || 350} pts
              </span>
            </div>
            <Link
              href="/events"
              className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-colors glow-green"
            >
              Book Next Event
            </Link>
          </div>
        </div>

        {/* Persistent In-App Payment Reminder Alert */}
        {(() => {
          const pendingBookings = bookings.filter(
            (b) => b.booking_status !== 'fully_paid' && (b.outstanding_balance ?? (b.total_amount - b.amount_paid)) > 0
          );

          if (pendingBookings.length === 0) return null;

          return (
            <div className="mb-8 bg-amber-500/10 border border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#0F1D36]">
                    Action Required: Complete Payment to Unlock Digital Boarding Pass
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    You have <strong>{pendingBookings.length}</strong> booked expedition{pendingBookings.length > 1 ? 's' : ''} with an outstanding balance. Digital QR passes are issued strictly upon full settlement.
                  </p>
                </div>
              </div>
              <button
                onClick={() => openPayBalanceModal(pendingBookings[0])}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Finish Paying Balance</span>
              </button>
            </div>
          );
        })()}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'text-[#15803D] border-b-2 border-[#15803D]'
                : 'text-slate-500 hover:text-[#0F1D36]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>My Events & Tickets ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chats')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'chats'
                ? 'text-[#15803D] border-b-2 border-[#15803D]'
                : 'text-slate-500 hover:text-[#0F1D36]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Event Group Chats</span>
            {(() => {
              const totalUnreads = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
              return totalUnreads > 0 ? (
                <span className="bg-[#15803D] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                  {totalUnreads}
                </span>
              ) : (
                <span className="text-slate-400 text-xs">({userChats.length})</span>
              );
            })()}
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'vault'
                ? 'text-[#15803D] border-b-2 border-[#15803D]'
                : 'text-slate-500 hover:text-[#0F1D36]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Event Photos Vault ({vaultPhotos.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              markAllNotificationsAsRead();
            }}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'text-[#15803D] border-b-2 border-[#15803D]'
                : 'text-slate-500 hover:text-[#0F1D36]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="bg-[#15803D] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

        </div>

        {/* TAB 1: MY EVENTS & QR TICKETS */}
        {activeTab === 'upcoming' && (
          <PortalBookingsTab
            bookings={bookings}
            selectedBookingForPass={selectedBookingForPass}
            setSelectedBookingForPass={setSelectedBookingForPass}
            openPayBalanceModal={openPayBalanceModal}
            openReviewModal={openReviewModal}
          />
        )}

        {/* TAB 2: EVENT GROUP CHATS */}
        {activeTab === 'chats' && (
          <PortalChatTab
            userChats={userChats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            chatMessages={chatMessages}
            chatMembers={chatMembers}
            newMessageText={newMessageText}
            setNewMessageText={setNewMessageText}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            isSendingMessage={isSendingMessage}
            handleSendMessage={handleSendMessage}
            user={user}
            chatContainerRef={chatContainerRef}
            emojiPickerRef={emojiPickerRef}
            emojiButtonRef={emojiButtonRef}
            messageInputRef={messageInputRef}
            unreadCounts={unreadCounts}
            hasMoreMessages={hasMoreMessages}
            isLoadingOlder={isLoadingOlder}
            loadOlderMessages={loadOlderMessages}
            showMentionMenu={showMentionMenu}
            setShowMentionMenu={setShowMentionMenu}
            mentionQuery={mentionQuery}
            setMentionQuery={setMentionQuery}
            onSelectChat={(chat) => {
              setSelectedChat(chat);
              loadChatMessages(chat.trip_id);
            }}
          />
        )}

        {/* TAB 3: EVENT PHOTOS VAULT */}
        {activeTab === 'vault' && (
          <PortalVaultTab
            bookings={bookings}
            selectedTripForVault={selectedTripForVault}
            vaultPhotosForTrip={vaultPhotosForTrip}
            isVaultLoading={isVaultLoading}
            vaultLightboxIndex={vaultLightboxIndex}
            setVaultLightboxIndex={setVaultLightboxIndex}
            handleSelectTripForVault={handleSelectTripForVault}
            handleDownloadPhoto={handleDownloadPhoto}
            setIsUploadModalOpen={setIsUploadModalOpen}
          />
        )}

        {/* TAB 4: SUMMIT BADGES & IMPACT */}
        {activeTab === 'impact' && (
          <PortalImpactTab
            bookings={bookings}
            totalTreesPlanted={totalTreesPlanted}
          />
        )}

        {/* TAB 5: NOTIFICATIONS & DISPATCHES */}
        {activeTab === 'notifications' && (
          <PortalNotificationsTab
            notifications={notifications}
            notifFilter={notifFilter}
            setNotifFilter={setNotifFilter}
            readNotifIds={readNotifIds}
            handleMarkAllRead={markAllNotificationsAsRead}
            handleClearAll={() => setNotifications([])}
            handleNotificationAction={handleNotificationAction}
            handleMarkAsRead={(id) => markNotificationAsRead(id)}
            handleDeleteNotification={(id, e) => {
              e.stopPropagation();
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }}
          />
        )}

        {/* MODAL 1: REVIEW MODAL */}
        <PortalReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          reviewBooking={reviewBooking}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewHeadline={reviewHeadline}
          setReviewHeadline={setReviewHeadline}
          reviewText={reviewText}
          setReviewText={setReviewText}
          isSubmittingReview={isSubmittingReview}
          handleSubmitReview={handleSubmitReview}
        />

        {/* MODAL 2: UPLOAD PHOTO MODAL */}
        <PortalPhotoUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          bookings={bookings}
          uploadUrl={uploadUrl}
          setUploadUrl={setUploadUrl}
          uploadCaption={uploadCaption}
          setUploadCaption={setUploadCaption}
          uploadTags={uploadTags}
          setUploadTags={setUploadTags}
          handleUploadPhoto={handleUploadPhoto}
        />

        {/* MODAL 3: STK BALANCE PAYMENT MODAL */}
        <PortalSTKPaymentModal
          isOpen={isSTKModalOpen}
          onClose={() => setIsSTKModalOpen(false)}
          stkTargetBooking={stkTargetBooking}
          stkPhoneNumber={stkPhoneNumber}
          setStkPhoneNumber={setStkPhoneNumber}
          stkAmount={stkAmount}
          setStkAmount={setStkAmount}
          isTriggeringSTK={isTriggeringSTK}
          handleTriggerSTKPayment={handleTriggerSTKPayment}
        />
      </div>
    </div>
  );
}

export default function TravelerPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9]">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin" />
        </div>
      }
    >
      <TravelerPortalContent />
    </Suspense>
  );
}
