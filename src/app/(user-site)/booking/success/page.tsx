"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import { CheckCircle2, Printer, Plane, Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { useLatestBooking } from "@/hooks/useBookings";

export default function SuccessPage() {
  const router = useRouter();
  
  const { isLoggedIn, isAuthLoading } = useAppSelector((state: any) => state.global);
  const { data: booking, isLoading, isError } = useLatestBooking();

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/authentication");
    }
  }, [isLoggedIn, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Generating your E-Ticket...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7] px-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ticket Found</h2>
        <p className="text-gray-500">We couldn't locate your recent booking.</p>
        <button onClick={() => router.push("/")} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold">
          Go Home
        </button>
      </div>
    );
  }

  const flight = booking.outbound_flight;
  const primaryPassenger = booking.passengers[0]; 
  const pnr = booking.id.toString().substring(0, 6).toUpperCase() + "EV";

  const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "--/--/----";
    return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] py-16 px-5 flex flex-col items-center font-sans">
      
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
          Booking Confirmed
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Your tickets have been issued. Have a great journey!
        </p>
      </div>

      <div className="relative max-w-4xl w-full bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">

        <div className="flex-1 p-8 md:p-10">
          <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
            <h2 className="text-2xl font-black text-[#d9232d] tracking-widest uppercase">The NextFly</h2>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Ref (PNR)</p>
              <p className="text-2xl font-black text-gray-900">{pnr}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
              <span className="text-5xl font-black text-gray-900">{flight?.origin}</span>
              <span className="text-sm font-semibold text-gray-500 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3"/> Origin</span>
            </div>
            
            <div className="flex flex-col items-center flex-1 px-8">
              <Plane className="w-8 h-8 text-gray-300 mb-2" />
              <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                 <div className="absolute left-1/2 -top-3 bg-white px-2 text-xs font-bold text-gray-400 -translate-x-1/2">
                   Flight {flight?.flight_number}
                 </div>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-5xl font-black text-gray-900">{flight?.destination}</span>
              <span className="text-sm font-semibold text-gray-500 mt-2 flex items-center justify-end gap-1"><MapPin className="w-3 h-3"/> Destination</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Passenger</p>
              <p className="font-bold text-gray-900 capitalize">{primaryPassenger?.firstName} {primaryPassenger?.lastName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
              <p className="font-bold text-gray-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#d9232d]"/> {formatDate(flight?.schedule?.departure_time)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Departure</p>
              <p className="font-bold text-gray-900 flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#d9232d]"/> {formatTime(flight?.schedule?.departure_time)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class</p>
              <p className="font-bold text-[#d9232d] uppercase">{primaryPassenger?.cabin || "Economy"}</p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center justify-between relative w-0 border-l-2 border-dashed border-gray-200">
           <div className="w-6 h-6 bg-[#f4f5f7] rounded-full absolute -top-3 -left-3.25"></div>
           <div className="w-6 h-6 bg-[#f4f5f7] rounded-full absolute -bottom-3 -left-3.25"></div>
        </div>

        <div className="md:w-[30%] bg-[#1c1c1e] p-8 md:p-10 flex flex-col justify-between text-white border-t-2 md:border-t-0 border-dashed border-gray-600 md:border-none relative">
          <div className="md:hidden w-6 h-6 bg-[#f4f5f7] rounded-full absolute -top-3 -left-3"></div>
          <div className="md:hidden w-6 h-6 bg-[#f4f5f7] rounded-full absolute -top-3 -right-3"></div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seat</p>
            <p className="text-5xl font-black text-[#d9232d] mb-8">{primaryPassenger?.seat || "TBA"}</p>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gate</p>
            <p className="text-2xl font-bold text-white mb-8">TBA</p>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Aircraft</p>
            <p className="text-sm font-semibold text-gray-300">{flight?.aircraft_model || "Boeing 787"}</p>
          </div>

          <div className="mt-8 flex gap-1 h-12 w-full opacity-80 mix-blend-screen">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="bg-white h-full" style={{ width: `${Math.random() * 4 + 1}px` }}></div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-12 flex gap-4">
        <button 
          onClick={() => window.print()}
          className="bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Printer className="w-5 h-5" /> Print Ticket
        </button>
        <button 
          onClick={() => router.push("/")}
          className="bg-[#d9232d] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
        >
          Return Home
        </button>
      </div>

    </div>
  );
}