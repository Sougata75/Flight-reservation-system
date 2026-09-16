"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileData } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { 
  Mail, 
  Phone, 
  Ticket, 
  PlaneTakeoff, 
  CalendarDays, 
  ArrowRight,
  Loader2,
  MapPin
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/authentication");
      } else {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const { data, isLoading, isError } = useProfileData();

  if (isAuthChecking || isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f4f5f7]">
        <Loader2 className="w-10 h-10 animate-spin text-[#d9232d] mb-4" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f4f5f7]">
        <p className="text-gray-500 font-bold">Failed to load profile data.</p>
      </div>
    );
  }

  const { profile, bookings } = data;
  const totalBookings = bookings.length;

  const getInitials = (name: string) => {
    if (!name || name === "User") return profile.email ? profile.email.charAt(0).toUpperCase() : "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] py-12 px-6 lg:px-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        <div className="w-full lg:w-100 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-200 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-[#111827]"></div>
            
            <div className="relative z-10 w-28 h-28 bg-white rounded-full p-2 mt-8 mb-4">
              <div className="w-full h-full bg-red-50 text-[#d9232d] rounded-full flex items-center justify-center text-4xl font-black tracking-wider shadow-inner">
                {getInitials(profile.name)}
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 capitalize">{profile.name}</h2>
            <p className="text-xs font-bold text-[#d9232d] uppercase tracking-widest mt-1 mb-6">NextFly Voyager</p>

            <div className="w-full flex flex-col gap-4 text-left border-t border-gray-100 pt-6">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                  <span className="font-semibold text-sm truncate">{profile.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                  <span className="font-semibold text-sm">{profile.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <Ticket className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Journeys</h3>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-black">{totalBookings}</span>
                <span className="text-lg font-bold text-gray-500 mb-2">Bookings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Flights</h2>
              <p className="text-gray-500 font-medium mt-1">Manage and view your upcoming and past itineraries.</p>
            </div>
          </div>

          {totalBookings === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <PlaneTakeoff className="w-12 h-12 text-[#d9232d]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-500 font-medium mb-8 max-w-sm">
                You haven't booked any flights with NextFly yet. Your next great adventure awaits!
              </p>
              <button 
                onClick={() => router.push("/")}
                className="bg-[#d9232d] text-white px-8 py-4 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-lg"
              >
                Book a Flight
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {bookings.map((booking: any) => {
                const flight = booking.outbound_flight;
                const date = flight?.schedule?.departure_time || booking.created_at;
                
                return (
                  <div key={booking.id} className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-md transition-shadow group">
                    
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          {booking.status}
                        </span>
                        <span className="text-sm font-bold text-gray-400">ID: #{booking.id.toString().slice(-6)}</span>
                      </div>

                      <div className="flex items-center gap-4 lg:gap-8 w-full">
                        <div className="flex flex-col">
                          <span className="text-4xl font-black text-gray-900">{flight?.origin || "---"}</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center relative px-4">
                          <div className="w-full border-t-2 border-dashed border-gray-200 absolute top-1/2 -translate-y-1/2"></div>
                          <PlaneTakeoff className="w-6 h-6 text-gray-300 relative z-10 bg-white px-1" />
                        </div>

                        <div className="flex flex-col text-right">
                          <span className="text-4xl font-black text-gray-900">{flight?.destination || "---"}</span>
                        </div>
                      </div>

                      <div className="flex gap-6 mt-6 border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-bold text-gray-600">{formatDate(date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-bold text-gray-600">Flight {flight?.flight_number || "TBA"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-3 lg:border-l lg:border-gray-100 lg:pl-8">
                      <div className="flex flex-col items-center lg:items-end mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                        <span className="text-xl font-black text-[#d9232d]">
                          ₹{booking.total_price?.toLocaleString('en-IN') || "0"}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/ticket/${booking.id}`)}
                        className="w-full lg:w-max bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#d9232d] transition-colors flex items-center justify-center gap-2"
                      >
                        View Ticket <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}