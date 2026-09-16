"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Printer, Plane, XCircle } from "lucide-react";
import { useTicketData } from "@/hooks/useBookings";

export default function TicketPage() {
  const params = useParams();
  const router = useRouter();
  
  const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: booking, isLoading, isError } = useTicketData(bookingId || "");

  useEffect(() => {
    if (!bookingId) {
      router.push("/");
    }
  }, [bookingId, router]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#d9232d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="w-full min-h-screen bg-[#f4f5f7] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Ticket Not Found</h2>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-[#d9232d] text-white rounded-lg font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const flight = booking.outbound_flight;
  const pnr = booking.id.toString().slice(0, 6).toUpperCase();
  const isCancelled = booking.status?.toLowerCase() === "cancelled";
  
  const flightDateObj = new Date(flight?.schedule?.departure_time || booking.created_at);
  const formattedDate = flightDateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const formattedTime = flightDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const passengers = booking.passengers || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] py-16 px-6 flex flex-col items-center font-sans selection:bg-red-500 selection:text-white">
      
      <div className="flex flex-col items-center text-center mb-12">
        {isCancelled ? (
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        )}
        
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          {isCancelled ? "Booking Cancelled" : "Booking Confirmed"}
        </h1>
        <p className="text-gray-500 font-medium">
          {isCancelled 
            ? "This reservation has been cancelled and is no longer valid." 
            : "Your tickets have been issued. Have a great journey!"}
        </p>
      </div>

      <div className="flex flex-col gap-10 w-full max-w-4xl">
        {passengers.map((passenger: any, index: number) => (
          <div key={index} className="w-full flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden print:shadow-none print:border print:border-gray-300 relative group">
            
            {isCancelled && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="border-[6px] border-red-600/30 text-red-600/30 font-black text-5xl md:text-7xl tracking-[0.2em] uppercase transform rotate-[-20deg] px-8 py-4 rounded-3xl print:border-red-600/50 print:text-red-600/50">
                  CANCELLED
                </div>
              </div>
            )}

            <div className={`flex-1 p-8 lg:p-10 relative transition-colors ${isCancelled ? 'bg-red-50/50 grayscale' : 'bg-[#eef0f3]'}`}>
              <div className="flex justify-between items-start mb-12 border-b border-gray-300 pb-6">
                <span className="text-sm font-black text-[#d9232d] tracking-[0.2em] uppercase">
                  The NextFly
                </span>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Booking Ref (PNR)
                  </p>
                  <p className={`text-lg font-black tracking-wider ${isCancelled ? 'text-gray-500 line-through decoration-[#d9232d] decoration-2' : 'text-gray-900'}`}>
                    {pnr}EV
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full mb-12">
                <div className="flex flex-col">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">
                    {flight?.origin || "---"}
                  </span>
                  <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    Origin
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center relative px-6 opacity-40">
                  <div className="w-full border-t-2 border-dashed border-gray-400 absolute top-1/2 -translate-y-1/2"></div>
                  <Plane className={`w-8 h-8 relative z-10 px-1 transform right-0 ${isCancelled ? 'text-red-400 bg-red-50' : 'text-gray-500 bg-[#eef0f3]'}`} />
                  <span className="absolute -bottom-6 text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                    Flight {flight?.flight_number || "TBA"}
                  </span>
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">
                    {flight?.destination || "---"}
                  </span>
                  <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    Destination
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-300">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Passenger</span>
                  <span className="font-bold text-gray-900 text-sm leading-tight capitalize">
                    {passenger.firstName} <br/> {passenger.lastName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                  <span className="font-bold text-gray-900 text-sm leading-tight">
                    {formattedDate}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Departure</span>
                  <span className="font-bold text-gray-900 text-sm leading-tight">
                    {formattedTime}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Class</span>
                  <span className="font-bold text-[#d9232d] text-sm leading-tight uppercase">
                    {passenger.cabin || "Economy"}
                  </span>
                </div>
              </div>
              
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-0.5 border-r-2 border-dashed border-gray-300 translate-x-1px z-10"></div>
            </div>

            <div className={`w-full md:w-72 p-8 lg:p-10 flex flex-col justify-between text-white relative transition-colors ${isCancelled ? 'bg-[#2a1c1c] grayscale opacity-90' : 'bg-[#1c1c1e]'}`}>
              <div className="hidden md:block absolute -left-3 -top-3 w-6 h-6 bg-[#f4f5f7] rounded-full z-20"></div>
              <div className="hidden md:block absolute -left-3 -bottom-3 w-6 h-6 bg-[#f4f5f7] rounded-full z-20"></div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Seat</span>
                  <span className={`text-5xl font-black tracking-tighter ${isCancelled ? 'text-gray-500 line-through decoration-red-500' : 'text-[#d9232d]'}`}>
                    {passenger.seat || "TBA"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gate</span>
                  <span className="text-xl font-bold text-white tracking-wide">
                    TBA
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aircraft</span>
                  <span className="text-sm font-bold text-gray-300">
                    {flight?.aircraft_model || "Boeing 777"}
                  </span>
                </div>
              </div>

              <div className="w-full h-12 flex gap-0.75 items-end mt-12 opacity-90 filter invert">
                {[...Array(40)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-black h-full" 
                    style={{ 
                      width: `${Math.max(1, Math.random() * 4)}px`,
                      height: `${Math.max(60, Math.random() * 100)}%` 
                    }}
                  ></div>
                ))}
              </div>
            </div>

          </div>
        ))}

        <div className="flex justify-center gap-4 mt-8 print:hidden">
          <button 
            onClick={handlePrint}
            className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Ticket
          </button>
          <button 
            onClick={() => router.push("/")}
            className="px-8 py-3.5 bg-[#d9232d] text-white font-bold rounded-xl hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20"
          >
            Return Home
          </button>
        </div>
      </div>
      
    </div>
  );
}