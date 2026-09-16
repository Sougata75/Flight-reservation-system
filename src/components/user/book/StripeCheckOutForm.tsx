"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

interface Props {
  amount: number;
  onSuccess: (paymentId: string) => Promise<void>;
}

export default function StripeCheckoutForm({ amount, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        await onSuccess(paymentIntent.id);
      } else {
        setErrorMessage("Payment was not completed successfully.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <PaymentElement />

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-[#d9232d] text-white font-bold text-lg rounded-xl hover:bg-red-800 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-red-900/20"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay INR ${Math.round(amount).toLocaleString('en-IN')}`
        )}
      </button>
    </form>
  );
}