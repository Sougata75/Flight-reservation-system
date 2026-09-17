"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { resetSelection } from "@/store/slices/global.slice";
import { supabase } from "@/lib/supabaseClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/components/user/book/StripeCheckOutForm";
import { useCreateBooking, useCreatePaymentIntent } from "@/hooks/useBookings";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY!);

export default function PaymentPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [clientSecret, setClientSecret] = useState("");

  const { 
    isLoggedIn, 
    isAuthLoading, 
    selectedOutboundFlight, 
    selectedReturnFlight, 
    passengerData, 
    selectedSeats,
    selectedCabinClass 
  } = useAppSelector((state: any) => state.global);

  const paymentIntentMutation = useCreatePaymentIntent();
  const createBookingMutation = useCreateBooking();

  const numPassengers = passengerData?.passengers?.length || 1;
  
  const savedCabinClass = (
    selectedCabinClass || 
    selectedOutboundFlight?.fareClass || 
    passengerData?.cabinClass || 
    ""
  ).toLowerCase();

  const firstSeatRow = selectedSeats && selectedSeats[0] ? parseInt(selectedSeats[0]) : 99;

  let cabinName = "Economy";
  let priceMultiplier = 1;

  if (savedCabinClass.includes("first") || (!savedCabinClass && firstSeatRow <= 2)) {
    cabinName = "First Class";
    priceMultiplier = 5.5;
  } else if (savedCabinClass.includes("business") || savedCabinClass.includes("biz") || (!savedCabinClass && firstSeatRow <= 5)) {
    cabinName = "Business";
    priceMultiplier = 3.5;
  } else if (savedCabinClass.includes("premium") || savedCabinClass.includes("pre_eco") || (!savedCabinClass && firstSeatRow <= 9)) {
    cabinName = "Premium Economy";
    priceMultiplier = 1.3;
  } else {
    cabinName = "Economy";
    priceMultiplier = 1;
  }

  const outboundPrice = (selectedOutboundFlight?.base_price || 0) * numPassengers * priceMultiplier;
  const returnPrice = selectedReturnFlight ? (selectedReturnFlight.base_price * numPassengers * priceMultiplier) : 0;
  const taxes = (outboundPrice + returnPrice) * 0.18;
  const totalAmount = outboundPrice + returnPrice + taxes;

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) router.push("/authentication");
    if (!selectedOutboundFlight || !passengerData) router.push("/");
  }, [isLoggedIn, isAuthLoading, selectedOutboundFlight, passengerData, router]);

  useEffect(() => {
    if (totalAmount > 0 && !clientSecret) {
      paymentIntentMutation.mutate(totalAmount, {
        onSuccess: (secret) => setClientSecret(secret),
        onError: (err) => console.error("Failed to fetch Stripe secret:", err)
      });
    }
  }, [totalAmount, clientSecret]);

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("You must be logged in.");

      const passengersWithSeats = passengerData.passengers.map((p: any, index: number) => ({
        ...p,
        seat: selectedSeats[index] || "Unassigned",
        cabin: cabinName
      }));

      createBookingMutation.mutate({
        userId: user.id,
        outboundFlightId: selectedOutboundFlight.id,
        returnFlightId: selectedReturnFlight?.id || null,
        contactEmail: passengerData.contactEmail,
        contactPhone: passengerData.contactPhone,
        passengers: passengersWithSeats,
        totalPrice: totalAmount,
        paymentId: paymentId,
        cabinName: cabinName,
      }, {
        onSuccess: () => {
          dispatch(resetSelection());
          router.push("/booking/success");
        },
        onError: (err: any) => {
          console.error("Database save failed after payment:", err);
          alert("Payment succeeded, but saving booking failed. Please contact support.");
        }
      });

    } catch (err: any) {
      console.error("Unexpected error during booking generation:", err);
      alert("An unexpected error occurred. Please contact support.");
    }
  };

  if (isAuthLoading || !isLoggedIn || !selectedOutboundFlight || !passengerData) return null;

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] py-10 px-5 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-gray-800">Payment Details</h2>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-red-700 border-b pb-2 mb-4">Credit / Debit Card</h3>
            
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm amount={totalAmount} onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-500 font-bold">Initializing Secure Checkout...</span>
              </div>
            )}
            
            <p className="text-xs text-center text-gray-400 mt-4">
              🔒 Payments are secure and encrypted via Stripe.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-10">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h3>
            
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-1">
                 <p className="text-xs font-bold text-red-600 uppercase">Outbound Flight</p>
                 <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-600 uppercase tracking-widest">{cabinName}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="font-bold text-lg">{selectedOutboundFlight.origin}</div>
                <div className="text-gray-400 text-sm">➔</div>
                <div className="font-bold text-lg">{selectedOutboundFlight.destination}</div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Flight {selectedOutboundFlight.flight_number}</p>
            </div>

            {selectedReturnFlight && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-1">
                   <p className="text-xs font-bold text-red-600 uppercase">Return Flight</p>
                   <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-600 uppercase tracking-widest">{cabinName}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="font-bold text-lg">{selectedReturnFlight.origin}</div>
                  <div className="text-gray-400 text-sm">➔</div>
                  <div className="font-bold text-lg">{selectedReturnFlight.destination}</div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Flight {selectedReturnFlight.destination}</p>
              </div>
            )}

            <div className="mb-6 pb-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Passengers</p>
              {passengerData.passengers.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-gray-700 capitalize">{p.firstName} {p.lastName}</span>
                  <span className="font-bold text-red-600">Seat {selectedSeats[idx] || "TBA"}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Base Fare ({numPassengers}x)</span>
                <span>INR {Math.round(outboundPrice + returnPrice).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees (18%)</span>
                <span>INR {Math.round(taxes).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-bold text-lg text-gray-800">Total Amount</span>
              <span className="font-black text-2xl text-red-600">
                INR {Math.round(totalAmount).toLocaleString('en-IN')}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}