"use client";

import { useState } from "react";
import { useAdminBookings } from "@/hooks/useAdminHooks";
import { 
  Loader2, 
  Search, 
  Filter, 
  MoreVertical, 
  PlaneTakeoff,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  User,
  CalendarDays,
  Plane,
  AlertTriangle
} from "lucide-react";

export default function AdminBookingsPage() {
  const { bookings, isLoading, isError, updateStatusMutation } = useAdminBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "confirmed" || s === "completed") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest border border-green-100">
          <CheckCircle2 className="w-3 h-3" /> Confirmed
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-widest border border-red-100">
          <XCircle className="w-3 h-3" /> Cancelled
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-widest border border-yellow-100">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    
    updateStatusMutation.mutate(
      { id: bookingToCancel.id, status: 'Cancelled' },
      {
        onSuccess: () => {
          setBookingToCancel(null);
        }
      }
    );
  };

  const filteredBookings = bookings?.filter((b: any) => {
    const searchLower = searchTerm.toLowerCase();
    const pnr = b.id.toString().slice(0, 6).toLowerCase();
    const flightNumber = b.outbound_flight?.flight_number?.toLowerCase() || "";
    const primaryPassenger = b.passengers?.[0];
    const passengerName = `${primaryPassenger?.firstName || ""} ${primaryPassenger?.lastName || ""}`.toLowerCase();
    
    return pnr.includes(searchLower) || flightNumber.includes(searchLower) || passengerName.includes(searchLower);
  });

  return (
    <div className="w-full h-full p-8 font-sans relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bookings Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Manage, view, and update all system reservations.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search PNR, Name, Flight..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#d9232d] transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Booking Ref</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Primary Passenger</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Flight Details</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Date / Time</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#d9232d] mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">Loading bookings data...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-sm font-bold text-red-500">Failed to load bookings. Please try again.</p>
                  </td>
                </tr>
              ) : filteredBookings?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PlaneTakeoff className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-base font-bold text-gray-900 mb-1">No bookings found</p>
                    <p className="text-sm font-medium text-gray-500">Adjust your search or wait for new reservations.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings?.map((booking: any) => {
                  const pnr = booking.id.toString().slice(0, 6).toUpperCase();
                  const flight = booking.outbound_flight;
                  const primaryPassenger = booking.passengers?.[0];
                  const seatCount = booking.passengers?.length || 1;

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-black text-gray-900">{pnr}</span>
                      </td>
                      
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 capitalize">
                            {primaryPassenger?.firstName || "Unknown"} {primaryPassenger?.lastName || ""}
                          </span>
                          <span className="text-xs font-medium text-gray-500 mt-0.5">
                            +{seatCount - 1} other{seatCount - 1 !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{flight?.origin || "---"}</span>
                          </div>
                          <PlaneTakeoff className="w-4 h-4 text-gray-300" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{flight?.destination || "---"}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-1 block">
                          {flight?.flight_number || "TBA"}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-600">
                          {formatDate(booking.created_at)}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-black text-[#d9232d]">
                          ₹{booking.total_price?.toLocaleString('en-IN') || "0"}
                        </span>
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>

                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {booking.status !== 'Cancelled' && (
                            <button 
                              onClick={() => setBookingToCancel(booking)}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-red-600 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          <button 
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {bookingToCancel && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !updateStatusMutation.isPending && setBookingToCancel(null)}
          ></div>
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-[#d9232d]" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Cancel Booking?</h2>
            <p className="text-gray-500 font-medium mb-8">
              Are you sure you want to cancel the booking for PNR <span className="font-bold text-gray-900">{bookingToCancel.id.toString().slice(0, 6).toUpperCase()}</span>? This action cannot be undone and seats will be released.
            </p>

            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setBookingToCancel(null)}
                disabled={updateStatusMutation.isPending}
                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button 
                onClick={handleConfirmCancel}
                disabled={updateStatusMutation.isPending}
                className="flex-1 py-3.5 bg-[#d9232d] text-white font-bold rounded-xl hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center justify-center"
              >
                {updateStatusMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedBooking(null)}
          ></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Details</span>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  PNR: {selectedBooking.id.toString().slice(0, 6).toUpperCase()}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-[#111827] text-white p-6 rounded-2xl">
                <div className="flex items-center gap-6 w-full">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black">{selectedBooking.outbound_flight?.origin || "---"}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Origin</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center relative px-2">
                    <div className="w-full border-t border-dashed border-gray-600 absolute top-1/2 -translate-y-1/2"></div>
                    <Plane className="w-5 h-5 text-gray-400 relative z-10 bg-[#111827] px-1" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                      {selectedBooking.outbound_flight?.flight_number || "TBA"}
                    </span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-3xl font-black">{selectedBooking.outbound_flight?.destination || "---"}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Destination</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#d9232d]" /> Passengers ({selectedBooking.passengers?.length || 0})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBooking.passengers?.map((passenger: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-gray-900 capitalize text-lg">
                          {passenger.firstName} {passenger.lastName}
                        </span>
                        {passenger.seat && (
                          <span className="bg-red-50 text-[#d9232d] text-xs font-bold px-2 py-1 rounded-md">
                            Seat {passenger.seat}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-1">
                        <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {passenger.dob || "N/A"}</span>
                        <span>•</span>
                        <span>{passenger.gender || "N/A"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black text-[#d9232d]">
                      ₹{selectedBooking.total_price?.toLocaleString('en-IN') || "0"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Status</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}