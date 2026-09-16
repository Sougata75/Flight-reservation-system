"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f5f7] pt-12 pb-16 px-6 lg:px-12 flex justify-center font-sans border-t border-gray-200">
      <div className="w-full  flex flex-col gap-12">
        
        <div className="bg-[#1c1c1e] w-full rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 shadow-xl text-white">
          <div className="max-w-xl flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Difference</h2>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Join our exclusive loyalty program to earn miles on every journey, enjoy 
              lounge access, and receive priority boarding worldwide.
            </p>
            <div className="flex gap-4 pt-2">
              <button className="bg-[#d9232d] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
                Join Now
              </button>
              <button className="bg-[#2c2c2e] text-gray-200 px-7 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors border border-gray-600">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-[#242426] rounded-2xl p-6 w-full md:w-auto min-w-70 border border-[#333336]">
            <h3 className="text-[#d9232d] text-[10px] font-black uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm font-semibold">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-3" /><path d="M9 9v.01" /><path d="M9 13v.01" /><path d="M9 17v.01" />
                  </svg>
                  Hotel Partnerships
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm font-semibold">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a2 2 0 00-1.6-.8H9.3a2 2 0 00-1.6.8L5 11l-5.16.86a1 1 0 00-.84.99V16h3m10 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0m-6 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0" />
                  </svg>
                  Car Rentals
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm font-semibold">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 2v10a4 4 0 01-4 4H9a4 4 0 01-4-4V2" /><path d="M5 16v4" /><path d="M19 16v4" /><path d="M5 12h14" /><path d="M9 2v4" /><path d="M15 2v4" />
                  </svg>
                  Seat Upgrades
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full flex flex-col pt-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-gray-300 pt-8 pb-12">
            <div className="col-span-2 flex flex-col gap-4 pr-6">
              <span className="font-bold text-gray-900 text-base">NextFly</span>
              <p className="text-gray-600 text-xs font-medium leading-relaxed">
                © 2026 The Elevated Voyager. Heritage in Every Journey. Redefining global travel with cultural elegance and precision.
              </p>
              <div className="flex gap-4 text-gray-600 pt-2">
                <a href="#" className="hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.58 6.5a2.76 2.76 0 00-1.95-1.95C17.9 4.1 12 4.1 12 4.1s-5.9 0-7.63.45A2.76 2.76 0 002.42 6.5C1.97 8.23 1.97 12 1.97 12s0 3.77.45 5.5a2.76 2.76 0 001.95 1.95c1.73.45 7.63.45 7.63.45s5.9 0 7.63-.45a2.76 2.76 0 001.95-1.95c.45-1.73.45-5.5.45-5.5s0-3.77-.45-5.5zM9.99 15.46V8.54l6.47 3.46-6.47 3.46z"/></svg>
                </a>
                <a href="#" className="hover:text-red-600 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.5c0-1.25-1.5-1.25-1.5 0V17h-2v-6h2v1.5c1.25-2 4.5-1.5 4.5 2V17z"/></svg>
                </a>
                <a href="#" className="hover:text-red-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#d9232d] text-xs font-bold uppercase tracking-widest mb-1">Legal</h4>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-xs font-semibold transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-xs font-semibold transition-colors">Terms of Carriage</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#d9232d] text-xs font-bold uppercase tracking-widest mb-1">Support</h4>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-xs font-semibold transition-colors">Accessibility</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-xs font-semibold transition-colors">Sitemap</a>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-[#d9232d] text-xs font-bold uppercase tracking-widest mb-1">Preferences</h4>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-xs font-semibold transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}