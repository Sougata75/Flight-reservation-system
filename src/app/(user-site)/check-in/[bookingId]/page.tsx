"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Armchair, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  ArrowRight
} from "lucide-react";
import { useManageCheckIn } from "@/hooks/useBookings";

export default function CheckInManagementPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { booking, isLoading, isError, confirmCheckInMutation } = useManageCheckIn(bookingId);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving your itinerary...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] px-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
        <p className="text-gray-500">We couldn't load the details for this reservation.</p>
        <button onClick={() => router.push("/check-in")} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const flight = booking.outbound_flight;
  const isAlreadyCheckedIn = booking.status === "checked_in";
  const pnr = booking.id.toString().substring(0, 6).toUpperCase() + "EV";

  const handleConfirmCheckIn = () => {
    confirmCheckInMutation.mutate();
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] py-16 px-5 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            {isAlreadyCheckedIn ? "You are Checked In!" : "Confirm Check-in"}
          </h1>
          <p className="text-gray-500 font-medium">Booking Reference (PNR): <span className="font-bold text-gray-900">{pnr}</span></p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col text-center md:text-left w-full md:w-auto">
            <span className="text-4xl font-black text-gray-900">{flight.origin}</span>
            <span className="text-sm font-semibold text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-1"><MapPin className="w-3 h-3"/> Origin</span>
          </div>
          
          <div className="flex flex-col items-center flex-1 px-4 w-full">
            <Plane className="w-8 h-8 text-gray-300 mb-2" />
            <div className="w-full border-t-2 border-dashed border-gray-300 relative">
               <div className="absolute left-1/2 -top-3 bg-white px-3 text-xs font-bold text-gray-400 -translate-x-1/2 border border-gray-200 rounded-full">
                 {flight.flight_number}
               </div>
            </div>
          </div>

          <div className="flex flex-col text-center md:text-right w-full md:w-auto">
            <span className="text-4xl font-black text-gray-900">{flight.destination}</span>
            <span className="text-sm font-semibold text-gray-500 mt-1 flex items-center justify-center md:justify-end gap-1"><MapPin className="w-3 h-3"/> Destination</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Passengers</h3>
          <div className="flex flex-col gap-4">
            {booking.passengers.map((passenger: any, index: number) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 capitalize">{passenger.firstName} {passenger.lastName}</p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{passenger.cabin || "Economy"}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seat</p>
                    <p className="text-lg font-black text-[#d9232d]">{passenger.seat || "TBA"}</p>
                  </div>
                  <Armchair className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {isAlreadyCheckedIn ? (
          <div className="bg-green-50 p-8 rounded-3xl border border-green-200 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You are ready to fly!</h3>
            <p className="text-gray-600 mb-6">Your boarding pass has been generated and is ready for use.</p>
            <button 
              onClick={() => router.push(`/boarding-pass/${bookingId}`)}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-900/20"
            >
              View Boarding Pass <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <div className="flex items-start gap-4 bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8">
              <ShieldAlert className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Hazardous Materials Acknowledgment</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Federal law forbids the carriage of hazardous materials such as aerosols, flammable liquids, explosives, and lithium batteries in checked baggage.
                </p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-gray-800 group-hover:text-black transition-colors">
                    I acknowledge that I am not carrying any restricted items.
                  </span>
                </label>
              </div>
            </div>

            <button 
              onClick={handleConfirmCheckIn}
              disabled={!acceptedTerms || confirmCheckInMutation.isPending}
              className="w-full py-5 bg-[#d9232d] text-white font-bold text-xl rounded-2xl hover:bg-red-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-3 shadow-lg shadow-red-900/20"
            >
              {confirmCheckInMutation.isPending ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
              ) : (
                "Confirm Check-In & Get Boarding Pass"
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}