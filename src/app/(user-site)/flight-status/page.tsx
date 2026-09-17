"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Search, 
  Plane, 
  MapPin, 
  ArrowRight, 
  Info,
  Calendar,
  Loader2
} from "lucide-react";
import { FlightStatusForm, FlightStatusSchema } from "@/services/validation/passenger.validation";
import { useFlightStatus } from "@/hooks/useBookings";




export default function FlightStatusPage() {
  const [searchType, setSearchType] = useState<"number" | "route">("number");
  
  const flightStatusMutation = useFlightStatus();

  const { register, handleSubmit, formState: { errors } } = useForm<FlightStatusForm>({
    resolver: zodResolver(FlightStatusSchema),
  });

  const onSubmit = (data: FlightStatusForm) => {
    flightStatusMutation.mutate(data);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const result = flightStatusMutation.data;

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] font-sans pb-20">
      <div className="relative w-full h-112.5 overflow-hidden flex justify-center items-center px-5">
        <img 
          src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2500&auto=format&fit=crop" 
          alt="Aircraft wing in flight" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gray-900/40"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#f4f5f7] to-transparent h-full"></div>

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center mt-10">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 text-center shadow-sm">
            Live Flight Tracker
          </h1>
          <p className="text-lg text-white/90 font-medium mb-10 text-center max-w-2xl">
            Get real-time status updates, gate information, and arrival times for all Elevated Voyager flights.
          </p>

          <div className="w-full bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl">
            <div className="flex gap-6 mb-6 border-b border-gray-200 pb-4 px-2">
              <button 
                type="button"
                onClick={() => setSearchType("number")}
                className={`font-bold text-sm transition-colors ${searchType === "number" ? "text-[#d9232d]" : "text-gray-400 hover:text-gray-700"}`}
              >
                Flight Number
              </button>
              <button 
                type="button"
                onClick={() => setSearchType("route")}
                className={`font-bold text-sm transition-colors ${searchType === "route" ? "text-[#d9232d]" : "text-gray-400 hover:text-gray-700"}`}
              >
                Route
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {searchType === "number" ? (
                  <div className="md:col-span-5 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Plane className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      {...register("flightNumber")}
                      type="text" 
                      placeholder="e.g. AI-101" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#d9232d] focus:ring-2 focus:ring-red-500/20 outline-none font-bold uppercase"
                    />
                  </div>
                ) : (
                  <>
                    <div className="md:col-span-3 relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="text" placeholder="Origin" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#d9232d] outline-none font-bold uppercase" />
                    </div>
                    <div className="md:col-span-3 relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="text" placeholder="Destination" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#d9232d] outline-none font-bold uppercase" />
                    </div>
                  </>
                )}

                <div className={`${searchType === "number" ? "md:col-span-4" : "md:col-span-4"} relative`}>
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input 
                    {...register("date")}
                    type="date" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#d9232d] outline-none font-semibold text-gray-700" 
                  />
                </div>

                <div className={`${searchType === "number" ? "md:col-span-3" : "md:col-span-2"}`}>
                  <button 
                    type="submit"
                    disabled={flightStatusMutation.isPending}
                    className="w-full py-4 px-6 bg-[#d9232d] text-white font-bold rounded-2xl hover:bg-red-800 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-md"
                  >
                    {flightStatusMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Search</>}
                  </button>
                </div>
              </div>

              {(errors.flightNumber || errors.date) && (
                <p className="text-red-500 text-xs font-semibold pl-2">
                  {errors.flightNumber?.message || errors.date?.message}
                </p>
              )}

              {flightStatusMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">
                  {flightStatusMutation.error.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl mx-auto px-5 mt-8 relative z-20 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Flight</p>
                <h2 className="text-3xl font-black text-gray-900">{result.flight_number}</h2>
                <p className="text-sm font-semibold text-gray-500 mt-1">{result.aircraft}</p>
              </div>
              
              <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-blue-700 uppercase tracking-wide text-sm">{result.status}</span>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-5xl font-black text-gray-900">{result.origin.code}</h3>
                  <p className="font-bold text-gray-500">{result.origin.city}</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center px-4 md:px-12 relative">
                   <div className="w-full h-1 bg-gray-200 rounded-full absolute bottom-4"></div>
                   <div className="w-full h-1 absolute bottom-4 left-0 px-4 md:px-12">
                     <div 
                        className="h-full bg-[#d9232d] rounded-full relative transition-all duration-1000 ease-out"
                        style={{ width: `${result.progress}%` }}
                     >
                        <Plane className="w-6 h-6 text-[#d9232d] absolute -right-3 -top-2.5 transform rotate-45 bg-gray-50 rounded-full" />
                     </div>
                   </div>
                   <p className="text-xs font-bold text-gray-400 mb-8">On Schedule</p>
                </div>

                <div className="text-right">
                  <h3 className="text-5xl font-black text-gray-900">{result?.destination.code}</h3>
                  <p className="font-bold text-gray-500">{result?.destination.city}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-bold text-gray-900 text-lg">{formatTime(result?.schedule.departure_time)}</p>
                  <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Scheduled Departure</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">
                    {formatTime(result?.schedule.estimated_arrival)}
                  </p>
                  <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Estimated Arrival</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-gray-100 divide-x divide-y md:divide-y-0 divide-gray-100">
              <div className="p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3"/> Dep Terminal
                </p>
                <p className="text-2xl font-black text-gray-900">{result?.origin.terminal}</p>
              </div>
              
              <div className="p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3"/> Dep Gate
                </p>
                <p className="text-2xl font-black text-gray-900">{result?.origin.gate}</p>
              </div>

              <div className="p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3"/> Arr Terminal
                </p>
                <p className="text-2xl font-black text-gray-900">{result?.destination.terminal}</p>
              </div>

              <div className="p-6 bg-orange-50/50">
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Info className="w-3 h-3"/> Baggage
                </p>
                <p className="text-2xl font-black text-gray-900">{result?.destination.baggage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}