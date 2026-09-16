"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setUpgradeSeat } from "@/store/slices/global.slice";

import { 
  Wifi, 
  Utensils, 
  ArrowRight, 
  PlaneTakeoff,
  Loader2,
  Armchair,
  CalendarDays,
  ChevronLeft,
  XCircle
} from "lucide-react";
import { useManageBookings } from "@/hooks/useBookingData";


const OCCUPIED_SEATS = ["1A", "2C", "4F", "5A", "7D", "10A", "10C", "10B"];
const UPGRADE_FEE = 0; 
const TOTAL_ROWS = 10;

export default function ManageBookingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const { isLoggedIn, isAuthLoading, upgradeSeat } = useAppSelector((state: any) => state.global);
  const { bookings, isLoading, isError, upgradeMutation } = useManageBookings(isLoggedIn, isAuthLoading);

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) router.push("/authentication");
  }, [isLoggedIn, isAuthLoading, router]);

  useEffect(() => {
    if (bookings && bookings.length === 1 && !selectedBookingId) {
      setSelectedBookingId(bookings[0].id);
    }
  }, [bookings, selectedBookingId]);

  const booking = bookings?.find((b: any) => b.id === selectedBookingId) || bookings?.[0];
  const isCancelled = booking?.status?.toLowerCase() === "cancelled";

  const handleSeatClick = (seatId: string, currentSeat: string) => {
    if (isCancelled || OCCUPIED_SEATS.includes(seatId) || seatId === currentSeat) return;
    dispatch(setUpgradeSeat(seatId === upgradeSeat ? null : seatId));
  };

  const handleConfirmUpgrade = (booking: any) => {
    if (!upgradeSeat || !booking || isCancelled) return;
    upgradeMutation.mutate(
      { bookingId: booking.id, newSeat: upgradeSeat, passengers: booking.passengers },
      {
        onSuccess: () => {
          alert("Seat successfully changed!");
          dispatch(setUpgradeSeat(null));
        }
      }
    );
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="w-10 h-10 animate-spin text-[#d9232d] mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Retrieving your itineraries...</p>
      </div>
    );
  }

  if (isError || !bookings || bookings.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#f4f5f7] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <PlaneTakeoff className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">No Active Journeys</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            You don't have any upcoming flights to manage right now.
          </p>
          <button onClick={() => router.push("/")} className="w-full py-4 bg-[#d9232d] text-white font-bold rounded-xl hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20">
            Book a Flight
          </button>
        </div>
      </div>
    );
  }

  if (!selectedBookingId && bookings.length > 1) {
    return (
      <div className="w-full min-h-screen bg-[#f4f5f7] py-12 px-6 lg:px-12 font-sans">
        <div className="max-w-5xl mx-auto flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Select a Flight
          </h1>
          <p className="text-gray-500 font-medium mb-10 text-lg">
            Choose which upcoming journey you'd like to manage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((b: any) => {
              const flight = b.outbound_flight;
              const isFlightCancelled = b.status?.toLowerCase() === "cancelled";
              
              return (
                <div 
                  key={b.id} 
                  onClick={() => setSelectedBookingId(b.id)}
                  className={`bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer group flex flex-col gap-6 ${isFlightCancelled ? 'opacity-75 grayscale' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                      Flight {flight?.flight_number || "TBA"}
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest transition-colors ${
                      isFlightCancelled 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-red-50 text-[#d9232d] group-hover:bg-[#d9232d] group-hover:text-white'
                    }`}>
                      {isFlightCancelled ? 'Cancelled' : 'Manage'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-4xl font-black ${isFlightCancelled ? 'text-gray-500 line-through decoration-red-500 decoration-2' : 'text-gray-900'}`}>{flight?.origin}</span>
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                    <span className={`text-4xl font-black ${isFlightCancelled ? 'text-gray-500 line-through decoration-red-500 decoration-2' : 'text-gray-900'}`}>{flight?.destination}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-600">
                      {new Date(flight?.schedule?.departure_time || b.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const primaryPassenger = booking.passengers[0];
  const currentSeat = primaryPassenger.seat || "Unassigned";
  const flight = booking.outbound_flight;

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] py-12 px-4 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">

        <div className="flex-1 flex flex-col items-center lg:items-start">
          
          {bookings.length > 1 && (
            <button 
              onClick={() => {
                setSelectedBookingId(null);
                dispatch(setUpgradeSeat(null));
              }}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Flights
            </button>
          )}

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-2">Change your seat</h1>
            <p className="text-gray-500 font-semibold tracking-wide">Flight {flight?.flight_number}</p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8 text-[11px] font-bold text-gray-500 tracking-widest uppercase">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#9ba9cc] rounded"></div> Occupied</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#dce4f0] rounded"></div> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Current Seat</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-[#d49a36] rounded"></div> Selected</div>
          </div>

          <div className={`bg-white p-8 rounded-[3rem] shadow-sm border border-gray-200 relative w-full max-w-md mx-auto lg:mx-0 ${isCancelled ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
            
            {isCancelled && (
              <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] bg-white/30 rounded-[3rem]">
                <div className="bg-red-50 text-red-600 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm border border-red-100">
                  <XCircle className="w-5 h-5" /> Seat Selection Disabled
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 relative z-10">
              {Array.from({ length: TOTAL_ROWS }, (_, i) => i + 1).map((row) => (
                <div key={row} className="flex justify-between items-center w-full">

                  <div className="flex gap-2">
                    {["A", "B", "C"].map(letter => {
                      const seatId = `${row}${letter}`;
                      return (
                        <SeatButton 
                          key={seatId} 
                          id={seatId} 
                          currentSeat={currentSeat}
                          isOccupied={OCCUPIED_SEATS.includes(seatId)} 
                          selected={upgradeSeat} 
                          onClick={() => handleSeatClick(seatId, currentSeat)} 
                        />
                      );
                    })}
                  </div>

                  <span className="text-gray-300 font-black text-xs w-8 text-center">{row}</span>
                  <div className="flex gap-2">
                    {["D", "E", "F"].map(letter => {
                      const seatId = `${row}${letter}`;
                      return (
                        <SeatButton 
                          key={seatId} 
                          id={seatId} 
                          currentSeat={currentSeat}
                          isOccupied={OCCUPIED_SEATS.includes(seatId)} 
                          selected={upgradeSeat} 
                          onClick={() => handleSeatClick(seatId, currentSeat)} 
                        />
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-112.5 flex flex-col gap-6 pt-6">

          <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Trip Details</p>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest">{flight?.flight_number}</p>
            </div>
            
            <div className="flex justify-between items-center mb-10">
              <h2 className={`text-4xl font-black ${isCancelled ? 'text-gray-500 line-through decoration-[#d9232d] decoration-2' : 'text-gray-900'}`}>{flight?.origin}</h2>
              <ArrowRight className="w-5 h-5 text-gray-300" />
              <h2 className={`text-4xl font-black text-right ${isCancelled ? 'text-gray-500 line-through decoration-[#d9232d] decoration-2' : 'text-gray-900'}`}>{flight?.destination}</h2>
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-semibold">Passenger</span>
                <span className="font-bold text-gray-900 capitalize">{primaryPassenger.firstName} {primaryPassenger.lastName}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Seat</span>
                  <span className={`font-black text-xl ${isCancelled ? 'text-gray-400' : 'text-gray-800'}`}>{currentSeat}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Seat</span>
                  <span className={`font-black text-xl ${upgradeSeat && !isCancelled ? "text-[#d49a36]" : "text-gray-300"}`}>
                    {isCancelled ? "---" : (upgradeSeat || "---")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors ${isCancelled ? 'bg-red-900' : 'bg-[#1a2b4c]'}`}>
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Armchair className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10">
              {isCancelled ? (
                <>
                  <p className="text-[10px] font-bold text-red-200 tracking-widest uppercase mb-1">Status</p>
                  <h2 className="text-3xl font-black text-white mb-8">
                    Cancelled
                  </h2>
                  <button 
                    disabled
                    className="w-full py-4 bg-white/20 text-white font-black rounded-xl cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    Booking Inactive
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold text-blue-200 tracking-widest uppercase mb-1">Change Fee</p>
                  <h2 className="text-4xl font-black text-white mb-8">
                    ₹{upgradeSeat ? UPGRADE_FEE.toLocaleString('en-IN') : "0"}
                  </h2>
                  <button 
                    onClick={() => handleConfirmUpgrade(booking)}
                    disabled={!upgradeSeat || upgradeMutation.isPending}
                    className="w-full py-4 bg-white text-[#1a2b4c] font-black rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg"
                  >
                    {upgradeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm New Seat"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={`flex justify-between px-4 mt-2 ${isCancelled ? 'opacity-50' : ''}`}>
            <div className="flex flex-col gap-2">
              <Utensils className="w-5 h-5 text-gray-400" />
              <p className="text-[9px] font-black tracking-widest uppercase text-gray-500">Signature Dining</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Wifi className="w-5 h-5 text-gray-400" />
              <p className="text-[9px] font-black tracking-widest uppercase text-gray-500">High Speed Web</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SeatButton({ id, isOccupied, selected, currentSeat, onClick }: any) {
  const isSelected = selected === id;
  const isCurrent = currentSeat === id;

  const baseStyle = "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-xs md:text-sm rounded-[10px] md:rounded-xl transition-all duration-200 cursor-pointer select-none";
  let colorStyle = "bg-[#dce4f0] text-[#5b7397] hover:bg-[#c2d0e6]";
  
  if (isOccupied) {
    colorStyle = "bg-[#9ba9cc] text-white opacity-80 cursor-not-allowed";
  } else if (isCurrent) {
    colorStyle = "bg-green-500 text-white shadow-md ring-2 ring-green-300 ring-offset-2";
  } else if (isSelected) {
    colorStyle = "bg-[#d49a36] text-white shadow-lg transform scale-105 ring-2 ring-[#d49a36] ring-offset-1";
  }

  return (
    <div onClick={onClick} className={`${baseStyle} ${colorStyle}`}>
      {id}
    </div>
  );
}