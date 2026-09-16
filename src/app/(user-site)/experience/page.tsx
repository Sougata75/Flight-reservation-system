"use client";

import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Utensils, 
  Wifi, 
  Armchair, 
  Crown, 
  ArrowRight, 
  ShieldCheck, 
  Compass 
} from "lucide-react";

export default function ExperiencePage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#f4f5f7] font-sans selection:bg-red-500 selection:text-white">
      
      <div className="relative w-full h-150 overflow-hidden flex items-center justify-center px-6">
        <img 
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2500&auto=format&fit=crop" 
          alt="Luxury travel experience" 
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-leaner-to-r from-black/80 via-black/50 to-transparent"></div>

        <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col items-start">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-[#d9232d]" /> The NextFly Experience
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-3xl">
            Where luxury meets the <span className="text-[#d9232d]">open sky.</span>
          </h1>
          <p className="text-gray-300 text-lg font-medium max-w-xl mb-8 leading-relaxed">
            Discover a new standard of air travel. From private suites to award-winning dining, every detail is crafted around your comfort.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="px-8 py-4 bg-[#d9232d] text-white font-bold rounded-2xl hover:bg-red-800 transition-all flex items-center gap-3 shadow-lg shadow-red-900/30"
          >
            Book Your Journey <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Designed for the Exceptional
          </h2>
          <p className="text-gray-500 font-medium text-lg">
            Explore our world-class cabins tailored to your precise travel needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#d9232d] mb-6 group-hover:bg-[#d9232d] group-hover:text-white transition-colors">
                <Armchair className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">First Class Suites</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                Enclosed private suites featuring sliding doors, ambient lighting, and fully flat handcrafted beds.
              </p>
            </div>
            <span className="text-xs font-bold text-[#d9232d] uppercase tracking-wider">Ultimate Privacy</span>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#d9232d] mb-6 group-hover:bg-[#d9232d] group-hover:text-white transition-colors">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Business Class</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                Direct aisle access, spacious lie-flat seats, and direct connectivity to keep you productive or rested.
              </p>
            </div>
            <span className="text-xs font-bold text-[#d9232d] uppercase tracking-wider">Seamless Comfort</span>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#d9232d] mb-6 group-hover:bg-[#d9232d] group-hover:text-white transition-colors">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Economy</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                Extra legroom, dedicated recline, wider seats, and upgraded dining options for elevated relaxation.
              </p>
            </div>
            <span className="text-xs font-bold text-[#d9232d] uppercase tracking-wider">Extra Space</span>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all group">
            <div>
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#d9232d] mb-6 group-hover:bg-[#d9232d] group-hover:text-white transition-colors">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Economy Class</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                Ergonomically designed seating with adjustable headrests, USB power ports, and hours of entertainment.
              </p>
            </div>
            <span className="text-xs font-bold text-[#d9232d] uppercase tracking-wider">Thoughtful Design</span>
          </div>

        </div>

        <div className="bg-gray-900 rounded-[3rem] text-white p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d9232d] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

          <div className="flex-1 flex flex-col gap-6 relative z-10">
            <div className="w-max bg-[#d9232d] text-white text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
              Exclusive Perks
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Join the Difference Loyalty Program
            </h2>
            <p className="text-gray-300 font-medium text-lg leading-relaxed max-w-xl">
              Earn miles on every journey, enjoy priority boarding, lounge access across global hubs, and receive priority baggage handling.
            </p>
            <div className="flex gap-4 pt-4">
              <button onClick={() => router.push("/authentication")} className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Join Now
              </button>
              <button onClick={() => router.push("/")} className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="w-full lg:w-112.5 relative z-10">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[2rem] flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Membership Tier</span>
                <span className="text-amber-400 font-black tracking-wider">DIAMOND ELITE</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#d9232d] rounded-xl flex items-center justify-center font-black text-xl">NV</div>
                <div>
                  <p className="font-bold text-lg">NextFly Voyager</p>
                  <p className="text-xs text-gray-400">Global Priority Access</p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-300 pt-2">
                <span>Miles Balance:</span>
                <span className="font-bold text-white">124,500 pts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white p-10 rounded-[3rem] border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-50 text-[#d9232d] rounded-2xl flex items-center justify-center mb-6">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Gourmet In-Flight Dining</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                Savor multi-course menus crafted by world-renowned chefs, paired with fine wines and artisanal coffees at 35,000 feet.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Locally Sourced Ingredients</span>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-red-50 text-[#d9232d] rounded-2xl flex items-center justify-center mb-6">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">High-Speed Connectivity</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-6">
                Stay connected with family, stream your favorite shows, or handle business seamlessly with our high-speed satellite Wi-Fi.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available on All Aircraft</span>
          </div>

        </div>

      </div>
    </div>
  );
}