"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  Plane, 
  Printer, 
  QrCode, 
  Loader2, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { useBoardingPass } from "@/hooks/useBookings";



export default function BoardingPassPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data: booking, isLoading, isError } = useBoardingPass(bookingId);
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Generating Boarding Pass...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] px-5 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pass Unavailable</h2>
        <p className="text-gray-500">We couldn't load this boarding pass.</p>
        <button onClick={() => router.push("/")} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold">Return Home</button>
      </div>
    );
  }

  if (booking.status !== "checked_in") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] px-5 text-center">
        <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-in Required</h2>
        <p className="text-gray-500 max-w-md">You must complete check-in and accept the security terms before your boarding pass is issued.</p>
        <button onClick={() => router.push(`/check-in/${bookingId}`)} className="mt-6 px-6 py-3 bg-[#d9232d] text-white rounded-xl font-bold">Go to Check-in</button>
      </div>
    );
  }

  const flight = booking.outbound_flight;
  const pnr = booking.id.toString().substring(0, 6).toUpperCase() + "EV";
  const passengers = booking.passengers;

  const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBoardingTime = (departureIso?: string) => {
    if (!departureIso) return "--:--";
    const depDate = new Date(departureIso);
    depDate.setMinutes(depDate.getMinutes() - 45); 
    return depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full min-h-screen bg-[#eaeaed] py-12 px-5 font-sans print:bg-white print:py-0">
      
      <div className="max-w-2xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-600 font-bold hover:text-red-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-6 py-2 rounded-xl font-bold hover:bg-gray-50 shadow-sm">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-12">
        {passengers.map((passenger: any, index: number) => (
          <div key={index} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-200 print:shadow-none print:border-gray-400">

            <div className="bg-[#d9232d] text-white p-8 flex justify-between items-end relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Plane className="w-32 h-32 transform rotate-45" /></div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-200 mb-1">Boarding Pass</p>
                <h2 className="text-2xl font-black uppercase tracking-wide">The Elevated Voyager</h2>
              </div>
              <div className="relative z-10 text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-200 mb-1">Flight</p>
                <h2 className="text-3xl font-black">{flight.flight_number}</h2>
              </div>
            </div>

            <div className="p-8 pb-4">
              <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">From</p>
                  <p className="text-5xl font-black text-gray-900">{flight.origin}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                   <Plane className="w-6 h-6 text-gray-300 mb-2" />
                   <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">To</p>
                  <p className="text-5xl font-black text-gray-900">{flight.destination}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Passenger</p>
                  <p className="font-bold text-gray-900 capitalize">{passenger.firstName} {passenger.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Boarding Time</p>
                  <p className="font-bold text-[#d9232d]">{getBoardingTime(flight.schedule?.departure_time)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departure</p>
                  <p className="font-bold text-gray-900">{formatTime(flight.schedule?.departure_time)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class</p>
                  <p className="font-bold text-gray-900 uppercase">{passenger.cabin || "Economy"}</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-900 text-white flex justify-between items-center relative border-t-4 border-dashed border-white">
              <div className="w-8 h-8 bg-[#eaeaed] print:bg-white rounded-full absolute -top-4 -left-4"></div>
              <div className="w-8 h-8 bg-[#eaeaed] print:bg-white rounded-full absolute -top-4 -right-4"></div>

              <div className="flex gap-10">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gate</p>
                  <p className="text-3xl font-black">A12</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seat</p>
                  <p className="text-3xl font-black text-[#d9232d]">{passenger.seat || "TBA"}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PNR</p>
                  <p className="text-xl font-bold">{pnr}</p>
                </div>
              </div>
              
              <div className="bg-white p-2 rounded-lg">
                <QrCode className="w-12 h-12 text-gray-900" />
              </div>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}