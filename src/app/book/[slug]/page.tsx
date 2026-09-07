'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { Trip, Booking } from '../../../types';
import api from '../../../lib/api';

import BookingGuestStep, { LeadGuestData, AddOnsData } from '../../../components/booking/BookingGuestStep';
import BookingPaymentStep from '../../../components/booking/BookingPaymentStep';
import BookingSummaryCard from '../../../components/booking/BookingSummaryCard';
import BookingSuccessStep from '../../../components/booking/BookingSuccessStep';

function BookingFunnelContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const initialGuests = parseInt(searchParams.get('guests') || '1', 10);

  const { showToast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);

  // 3-Step Journey: 1. Adventurer Details -> 2. Payment & Gateways -> 3. Confirmed Boarding Pass
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Travelers & Guest Details
  const [guestCount, setGuestCount] = useState(initialGuests || 1);
  const [leadGuest, setLeadGuest] = useState<LeadGuestData>({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    dietary: 'Standard Meal',
    emergencyContact: '',
    specialRequirements: '',
  });

  // Add-ons (Optional gear / photography packages)
  const [addOns, setAddOns] = useState<AddOnsData>({
    tentUpgrade: false,
    droneVideo: false,
  });

  // Step 2: Payment Plan (deposit, custom, full)
  const [paymentPlan, setPaymentPlan] = useState<'deposit' | 'custom' | 'full'>('deposit');
  const [customAmount, setCustomAmount] = useState<number>(0);

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Gateways
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'pesapal'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState(user?.phone_number || '');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [stkPromptSent, setStkPromptSent] = useState(false);
  const [stkCountdown, setStkCountdown] = useState(10);

  // Output Booking
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTrip = async () => {
      if (!slug) {
        if (isMounted) setIsLoadingTrip(false);
        return;
      }
      try {
        const decodedSlug = decodeURIComponent(slug);
        const data = await api.getTripBySlug(decodedSlug);
        if (data && isMounted) {
          setTrip(data);
          const minDep = (data.deposit_required_kes || 2000) * (initialGuests || 1);
          setCustomAmount(minDep);
        }
      } catch (err) {
        console.error('[BookingFunnel] Failed to load trip for booking:', err);
      } finally {
        if (isMounted) {
          setIsLoadingTrip(false);
        }
      }
    };

    setIsLoadingTrip(true);
    fetchTrip();

    // Safety timeout to prevent any infinite spinner
    const timer = setTimeout(() => {
      if (isMounted) setIsLoadingTrip(false);
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [slug, initialGuests]);

  useEffect(() => {
    if (user) {
      setLeadGuest((prev) => ({
        ...prev,
        fullName: prev.fullName || user.full_name,
        email: prev.email || user.email,
        phoneNumber: prev.phoneNumber || user.phone_number,
      }));
      if (!mpesaPhone && user.phone_number) {
        setMpesaPhone(user.phone_number);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading && !user && slug) {
      router.replace(`/auth/login?redirect=/book/${encodeURIComponent(slug)}`);
    }
  }, [isAuthLoading, user, slug, router]);

  // If user is not authenticated, show sign-in prompt immediately without blocking on trip loading
  if (!isAuthLoading && !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#FCFBF9]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 bg-emerald-50 text-[#15803D] rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <LogIn className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0F1D36]">Sign In to Continue</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Please sign in to secure your reservation, access the expedition group chat, and generate your digital QR boarding pass.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <Link
              href={`/auth/login?redirect=/book/${encodeURIComponent(slug)}`}
              className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green block text-center transition-all"
            >
              Sign In to Continue Booking
            </Link>
            <Link
              href={`/auth/register?redirect=/book/${encodeURIComponent(slug)}`}
              className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-[#0F1D36] border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider block text-center transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthLoading || isLoadingTrip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#FCFBF9]">
        <Loader2 className="w-10 h-10 text-[#15803D] animate-spin" />
        <p className="text-sm font-semibold text-[#0F1D36]">Securing expedition reservation...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-[#0F1D36] font-bold">Expedition Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The event or hike you requested could not be located.</p>
        <Link
          href="/events"
          className="mt-4 inline-block bg-[#15803D] text-white text-xs uppercase font-bold px-6 py-2.5 rounded-full"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  // Price Computations
  const baseRate = trip.base_price_kes * guestCount;
  const depositRate = trip.deposit_required_kes * guestCount;

  let addOnTotal = 0;
  if (addOns.tentUpgrade) addOnTotal += 2000 * guestCount;
  if (addOns.droneVideo) addOnTotal += 3500;

  const grossTotal = baseRate + addOnTotal;
  const netTotal = Math.max(0, grossTotal - promoDiscount);

  let amountDueNow = netTotal;
  if (paymentPlan === 'deposit') {
    amountDueNow = Math.min(depositRate, netTotal);
  } else if (paymentPlan === 'custom') {
    const validCustom = Math.max(depositRate, Math.min(customAmount || depositRate, netTotal));
    amountDueNow = validCustom;
  }

  // Validate Step 1 before continuing
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadGuest.fullName.trim()) {
      showToast('error', 'Required Field', 'Please enter the lead adventurer full name.');
      return;
    }
    if (!leadGuest.email.trim()) {
      showToast('error', 'Required Field', 'Please provide a contact email address.');
      return;
    }
    if (!leadGuest.phoneNumber.trim()) {
      showToast('error', 'Required Field', 'Please provide a valid phone number.');
      return;
    }

    if (!mpesaPhone && leadGuest.phoneNumber) {
      setMpesaPhone(leadGuest.phoneNumber);
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Promo Validation
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsValidatingPromo(true);
    try {
      const res = await api.validatePromotion(promoCode.trim(), grossTotal);
      if (res.valid && res.discount > 0) {
        setPromoDiscount(res.discount);
        setPromoApplied(true);
        showToast('success', 'Promotion Applied!', `Saved KES ${res.discount.toLocaleString()} on your expedition.`);
      } else {
        showToast('error', 'Invalid Code', res.message || 'Promo code could not be applied');
      }
    } catch (err: any) {
      showToast('error', 'Promo Error', err.message || 'Invalid promotion code');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // Execute Payment
  const handleExecutePayment = async () => {
    if (paymentMethod === 'mpesa' && !mpesaPhone.trim()) {
      showToast('error', 'M-Pesa Phone Required', 'Please enter your Safaricom phone number for the STK prompt.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const bookingPayload = {
        trip_id: trip.id,
        number_of_guests: guestCount,
        currency: 'KES',
        guest_details: [leadGuest],
        special_requests: `${leadGuest.specialRequirements || ''} ${leadGuest.emergencyContact ? `| Emergency: ${leadGuest.emergencyContact}` : ''}`.trim(),
        payment_choice: paymentPlan,
        custom_amount: paymentPlan === 'custom' ? customAmount : undefined,
        payment_method: paymentMethod,
        phone_number: mpesaPhone.trim() || leadGuest.phoneNumber.trim(),
        email: leadGuest.email.trim(),
        first_name: leadGuest.fullName.split(' ')[0] || 'Adventurer',
        last_name: leadGuest.fullName.split(' ').slice(1).join(' ') || 'Explorer',
        promo_code: promoApplied ? promoCode : undefined,
      };

      const res = await api.createBooking(bookingPayload);
      const createdBooking = res.booking;

      if (paymentMethod === 'pesapal' && res.payment?.redirect_url) {
        window.location.href = res.payment.redirect_url;
        return;
      }

      if (paymentMethod === 'mpesa') {
        setStkPromptSent(true);
        setStkCountdown(30);

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.host.includes(':3000') ? 'localhost:8080' : window.location.host;
        const token = typeof window !== 'undefined' ? localStorage.getItem('kibali_access_token') : '';
        const wsUrl = `${wsProtocol}//${wsHost}/api/v1/chat/trips/${trip.id}/ws?token=${token || ''}`;

        let ws: WebSocket | null = null;
        let isResolved = false;

        const finalizeSuccess = async (ref: string) => {
          if (isResolved) return;
          isResolved = true;
          clearInterval(pollInterval);
          try {
            ws?.close();
          } catch {}

          try {
            const latest = await api.getBookingByRef(ref);
            setConfirmedBooking(latest || createdBooking);
          } catch {
            setConfirmedBooking(createdBooking);
          }
          setIsProcessingPayment(false);
          setStkPromptSent(false);
          setCurrentStep(3);
          showToast('success', 'M-Pesa Payment Received!', 'Your payment was processed and verified.');
        };

        try {
          ws = new WebSocket(wsUrl);
          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'PAYMENT_SUCCESS' || data.event === 'PAYMENT_SUCCESS') {
                finalizeSuccess(createdBooking.booking_reference);
              }
            } catch {}
          };
        } catch {}

        let pollCount = 0;
        const pollInterval = setInterval(async () => {
          pollCount++;
          setStkCountdown(Math.max(0, 30 - pollCount));

          if (pollCount % 3 === 0 && !isResolved) {
            try {
              const latest = await api.getBookingByRef(createdBooking.booking_reference);
              if (latest && (latest.booking_status === 'fully_paid' || latest.booking_status === 'deposit_paid')) {
                finalizeSuccess(createdBooking.booking_reference);
                return;
              }
            } catch {}
          }

          if (pollCount >= 30 && !isResolved) {
            clearInterval(pollInterval);
            try {
              ws?.close();
            } catch {}
            setConfirmedBooking(createdBooking);
            setIsProcessingPayment(false);
            setStkPromptSent(false);
            setCurrentStep(3);
            showToast('info', 'Booking Logged', 'Please check your phone to complete your M-Pesa PIN prompt.');
          }
        }, 1000);
      } else {
        setConfirmedBooking(createdBooking);
        setIsProcessingPayment(false);
        setCurrentStep(3);
      }
    } catch (err: any) {
      console.error('[BookingFunnel] Payment / Booking flow error:', err);
      setIsProcessingPayment(false);
      setStkPromptSent(false);
      showToast('error', 'Booking Error', err.message || 'Unable to process booking at this time.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] text-[#0F172A] py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <Link
            href={`/trips/${trip.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#15803D] hover:underline mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Event Details</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97706] block">
                Secure Booking Checkout
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F1D36]">{trip.title}</h1>
            </div>

            {/* 2-Step Progress Indicator */}
            {currentStep < 3 && (
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 1 ? 'bg-[#15803D] text-white' : 'bg-emerald-100 text-[#15803D]'
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`text-xs font-bold ${currentStep === 1 ? 'text-[#0F1D36]' : 'text-slate-400'}`}
                  >
                    Adventurer Details
                  </span>
                </div>

                <div className="w-6 h-0.5 bg-slate-200" />

                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 2 ? 'bg-[#15803D] text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-xs font-bold ${currentStep === 2 ? 'text-[#0F1D36]' : 'text-slate-400'}`}
                  >
                    Payment & Confirm
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 1: ADVENTURER DETAILS & GROUP SIZE */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <BookingGuestStep
                trip={trip}
                guestCount={guestCount}
                setGuestCount={setGuestCount}
                leadGuest={leadGuest}
                setLeadGuest={setLeadGuest}
                addOns={addOns}
                setAddOns={setAddOns}
                pricePerGuestKES={trip.base_price_kes}
                totalBeforePromoKES={grossTotal}
                onContinue={() => {
                  if (!leadGuest.fullName.trim() || !leadGuest.email.trim() || !leadGuest.phoneNumber.trim()) {
                    showToast('error', 'Required Fields', 'Please complete adventurer full name, email and phone.');
                    return;
                  }
                  if (!mpesaPhone && leadGuest.phoneNumber) {
                    setMpesaPhone(leadGuest.phoneNumber);
                  }
                  setCurrentStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            <div className="lg:col-span-4">
              <BookingSummaryCard
                trip={trip}
                guestCount={guestCount}
                pricePerGuestKES={trip.base_price_kes}
                addOns={addOns}
                promoApplied={promoApplied}
                promoCode={promoCode}
                promoDiscount={promoDiscount}
                paymentPlan={paymentPlan}
                currentStep={currentStep}
                dueTodayKES={amountDueNow}
                totalPayableKES={netTotal}
              />
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT & GATEWAY SELECTION */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <BookingPaymentStep
                trip={trip}
                paymentPlan={paymentPlan}
                setPaymentPlan={setPaymentPlan}
                depositTotalKES={depositRate}
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                totalPayableKES={netTotal}
                minDepositAllowedKES={depositRate}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoDiscount={promoDiscount}
                promoApplied={promoApplied}
                isValidatingPromo={isValidatingPromo}
                handleApplyPromo={handleApplyPromo}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                mpesaPhone={mpesaPhone}
                setMpesaPhone={setMpesaPhone}
                isProcessingPayment={isProcessingPayment}
                stkPromptSent={stkPromptSent}
                stkCountdown={stkCountdown}
                handleInitiatePayment={async (e) => {
                  e.preventDefault();
                  await handleExecutePayment();
                }}
                onBack={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            <div className="lg:col-span-4">
              <BookingSummaryCard
                trip={trip}
                guestCount={guestCount}
                pricePerGuestKES={trip.base_price_kes}
                addOns={addOns}
                promoApplied={promoApplied}
                promoCode={promoCode}
                promoDiscount={promoDiscount}
                paymentPlan={paymentPlan}
                currentStep={currentStep}
                dueTodayKES={amountDueNow}
                totalPayableKES={netTotal}
              />
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & BOARDING PASS */}
        {currentStep === 3 && confirmedBooking && (
          <BookingSuccessStep
            confirmedBooking={confirmedBooking}
            trip={trip}
          />
        )}
      </div>
    </div>
  );
}

export default function BookingFunnelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCFBF9]">
          <Loader2 className="w-10 h-10 text-[#15803D] animate-spin" />
        </div>
      }
    >
      <BookingFunnelContent />
    </Suspense>
  );
}
