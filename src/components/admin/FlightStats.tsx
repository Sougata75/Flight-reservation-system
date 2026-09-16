"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useFlightFetch } from "@/hooks/useFlightData";
import { useAppSelector } from "@/hooks/useRedux";
import { TrendingUp, TrendingDown, IndianRupee, Activity, PlaneTakeoff } from "lucide-react";
import { useMemo } from "react";

export default function FlightStats() {
  const { pagination } = useAppSelector((state) => state.global);
  const { data: flightData, isLoading: isFlightsLoading } = useFlightFetch(pagination.currentPage, pagination.limitPerPage);

  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["statsBookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("total_price, status");
      if (error) throw error;
      return data || [];
    }
  });

  const stats = useMemo(() => {
    if (!flightData) return { active: 0, activeGrowth: 0, loadAvg: "0.0", revenueForecast: 0 };

    let totalCapacity = 0;
    let totalBooked = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthFlights = 0;
    let lastMonthFlights = 0;

    flightData.forEach((flight: any) => {
      const cap = (flight.eco_capacity || 0) + (flight.pre_eco_capacity || 0) + (flight.biz_capacity || 0) + (flight.first_class_capacity || 0);
      const booked = (flight.eco_booked || 0) + (flight.pre_eco_booked || 0) + (flight.biz_booked || 0) + (flight.first_class_booked || 0);

      totalCapacity += cap;
      totalBooked += booked;

      const flightDateStr = flight.schedule?.departure_time || flight.created_at;
      if (flightDateStr) {
        const d = new Date(flightDateStr);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) currentMonthFlights++;
        if (d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear) lastMonthFlights++;
      }
    });

    const revenueForecast = bookingsData?.reduce((sum, b) => {
      if (b.status?.toLowerCase() === 'cancelled') return sum;
      return sum + (Number(b.total_price) || 0);
    }, 0) || 0;

    const loadAvg = totalCapacity === 0 ? "0.0" : ((totalBooked / totalCapacity) * 100).toFixed(1);

    let activeGrowth = 0;
    if (lastMonthFlights === 0 && currentMonthFlights > 0) {
      activeGrowth = 100;
    } else if (lastMonthFlights > 0) {
      activeGrowth = ((currentMonthFlights - lastMonthFlights) / lastMonthFlights) * 100;
    }

    return {
      active: flightData.length,
      activeGrowth: Number(activeGrowth.toFixed(1)),
      loadAvg,
      revenueForecast
    };
  }, [flightData, bookingsData]);

  const isLoading = isFlightsLoading || isBookingsLoading;
  const isGrowthPositive = stats.activeGrowth >= 0;

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-8'>

      <div className='bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40'>
        <div className="flex justify-between items-start">
          <h3 className='text-gray-400 text-xs uppercase font-bold tracking-widest'>Active Flights</h3>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <PlaneTakeoff className="w-4 h-4 text-[#d9232d]" />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <h2 className="text-5xl text-gray-900 font-black tracking-tight">
            {isLoading ? "-" : stats.active}
          </h2>
          {!isLoading && (
            <div className={`flex items-center gap-1 text-sm font-bold ${isGrowthPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isGrowthPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isGrowthPositive ? "+" : ""}{stats.activeGrowth}%</span>
            </div>
          )}
        </div>
      </div>

      <div className='bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40'>
        <div className="flex justify-between items-start">
          <h3 className='text-gray-400 text-xs uppercase font-bold tracking-widest'>System Load Avg</h3>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <h2 className="text-5xl text-gray-900 font-black tracking-tight">
            {isLoading ? "-" : `${stats.loadAvg}%`}
          </h2>
          <p className="text-xs font-bold text-gray-400 mb-1">Capacity utilized</p>
        </div>
      </div>

      <div className='bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40'>
        <div className="flex justify-between items-start">
          <h3 className='text-gray-400 text-xs uppercase font-bold tracking-widest'>Revenue Forecast</h3>
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div className="flex justify-between items-end w-full">
          <h2 className="text-4xl text-gray-900 font-black tracking-tight truncate max-w-[70%]">
            {isLoading ? "-" : `₹${stats.revenueForecast.toLocaleString('en-IN')}`}
          </h2>
          <p className="text-xs font-bold text-gray-400 mb-1 shrink-0">Total Bookings</p>
        </div>
      </div>

    </div>
  );
}