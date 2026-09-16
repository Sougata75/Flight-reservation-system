"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowRight, 
  Search, 
  Clock, 
  Briefcase, 
  Smartphone, 
  Loader2 
} from "lucide-react";
import { useCheckIn } from "@/hooks/useBookings";
import { CheckInForm, CheckInSchema } from "@/services/validation/passenger.validation";


export default function CheckInPage() {
  const router = useRouter();
  const checkInMutation = useCheckIn();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckInForm>({
    resolver: zodResolver(CheckInSchema),
  });

  const onSubmit = (data: CheckInForm) => {
    checkInMutation.mutate(data, {
      onSuccess: (bookingId) => {
        router.push(`/check-in/${bookingId}`);
      }
    });
  };

  return (
    <div className="relative w-full min-h-screen font-sans flex flex-col justify-between bg-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=2500&auto=format&fit=crop" 
          alt="Flight Sky Background" 
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent lg:to-white/10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent h-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 lg:pt-36 pb-16 grow flex flex-col justify-between">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 mb-20 lg:mb-32">
        
          <div className="flex flex-col justify-center max-w-xl">
            <div className="w-max bg-amber-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-6 shadow-sm">
              Seamless Departure
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-gray-900 mb-6">
              Begin Your<br />
              <span className="text-[#d9232d]">Journey Here.</span>
            </h1>
            
            <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-md">
              Check-in online to save time at the airport and select your preferred seat in our award-winning cabin.
            </p>
          </div>

          <div className="flex lg:justify-end items-center">
            <div className="w-full max-w-110 bg-white/80 backdrop-blur-2xl p-8 lg:p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white/60 relative overflow-hidden">
              
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-red-50 p-2.5 rounded-xl text-[#d9232d]">
                    <Search className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Retrieve Booking</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                      Booking Reference (PNR)
                    </label>
                    <input 
                      {...register("pnr")}
                      type="text" 
                      placeholder="e.g. 123EV" 
                      className="w-full p-4 bg-white/70 border border-gray-200 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none font-bold uppercase placeholder:normal-case placeholder:font-medium placeholder:text-gray-400" 
                    />
                    {errors.pnr && <p className="text-red-500 text-xs font-semibold pl-1">{errors.pnr.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                      Last Name
                    </label>
                    <input 
                      {...register("lastName")}
                      type="text" 
                      placeholder="As shown on passport" 
                      className="w-full p-4 bg-white/70 border border-gray-200 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all outline-none font-semibold text-gray-900 placeholder:font-medium placeholder:text-gray-400" 
                    />
                    {errors.lastName && <p className="text-red-500 text-xs font-semibold pl-1">{errors.lastName.message}</p>}
                  </div>

                  {checkInMutation.isError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl">
                      {checkInMutation.error.message}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={checkInMutation.isPending}
                    className="w-full mt-2 py-4 bg-[#d9232d] text-white font-bold text-lg rounded-2xl hover:bg-red-800 shadow-[0_10px_20px_rgba(217,35,45,0.25)] hover:shadow-[0_10px_25px_rgba(217,35,45,0.4)] transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none flex justify-center items-center gap-3 active:scale-[0.98]"
                  >
                    {checkInMutation.isPending ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Locating Flight...
                      </>
                    ) : (
                      <>
                        Find My Flight
                        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-500 text-center mt-2 font-medium leading-relaxed px-2">
                    Online check-in is available between 48 hours and 90 minutes before departure for most flights.
                  </p>
                </form>
              </div>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-200/60">

          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <Clock className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base mb-2">Check-in Deadlines</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-3 pr-4">
                Ensure you arrive at the airport at least 3 hours before international departures. Online check-in closes 1 hour before takeoff.
              </p>
              <button className="text-xs font-bold text-gray-800 hover:text-[#d9232d] flex items-center gap-1 group transition-colors">
                View all deadlines 
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <Briefcase className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base mb-2">Baggage Policy</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-3 pr-4">
                Check your allowance or purchase extra weight at a 20% discount when you check in online today.
              </p>
              <button className="text-xs font-bold text-gray-800 hover:text-[#d9232d] flex items-center gap-1 group transition-colors">
                Calculate allowance 
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <Smartphone className="w-5 h-5 stroke-2" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base mb-2">Digital Documents</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-3 pr-4">
                Keep your boarding pass and e-visa ready on your mobile device for a contactless journey through the terminal.
              </p>
              <button className="text-xs font-bold text-gray-800 hover:text-[#d9232d] flex items-center gap-1 group transition-colors">
                Requirement checker 
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}