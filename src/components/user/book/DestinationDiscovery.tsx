export default function DestinationDiscovery() {
  return (
    <section className="w-full bg-red-100 py-20 px-6 md:px-12 lg:px-20 font-sans">
      <div className="w-full  mx-auto flex flex-col">
        
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
          <div>
            <span className="text-[10px] font-bold text-[#d9232d] tracking-[0.2em] uppercase bg-red-50 px-3 py-1.5 rounded-full mb-4 inline-block">
              Destination Discovery
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mt-2">
              Uncharted Territories<br />Await.
            </h2>
          </div>
          
          <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-[#d9232d] transition-colors shadow-md w-max">
            Explore All
          </button>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          <div className="lg:col-span-8 h-112.5 lg:h-150 rounded-[2.5rem] overflow-hidden relative shadow-lg group bg-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600&auto=format&fit=crop" 
              alt="Taj Mahal" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-leaner-to-t from-black/70 via-black/10 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">Featured Destination</span>
              <h3 className="text-2xl font-black mt-1">Agra: Timeless Heritage</h3>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 h-112.5 lg:h-150">
            <div className="h-1/2 rounded-[2.5rem] overflow-hidden relative shadow-lg group bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=800&auto=format&fit=crop" 
                alt="Maldives" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-leaner-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Islands</span>
                <p className="font-bold text-sm tracking-wide mt-0.5">Malé: Azure Escapes</p>
              </div>
            </div>

            <div className="h-1/2 rounded-[2.5rem] overflow-hidden relative shadow-lg group bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" 
                alt="Dubai" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-leaner-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Metropolis</span>
                <p className="font-bold text-sm tracking-wide mt-0.5">Dubai: Modern Luxury</p>
              </div>
            </div>
          </div>

        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 bg-white p-10 lg:p-14 rounded-[2.5rem] shadow-sm border border-gray-200">
            <span className="text-[10px] font-bold text-[#d9232d] tracking-[0.2em] uppercase bg-red-50 px-3 py-1.5 rounded-full mb-4 inline-block">
              The NextFly Way
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-snug mb-10">
              Heritage Meets<br />Next-Gen Hospitality.
            </h2>

            <div className="flex flex-col gap-8">
              <div className="flex gap-5 items-start">
                <div className="text-[#d9232d] bg-red-50 p-3.5 rounded-2xl shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Curated Gastronomy</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Michelin-starred menus blending traditional Asian spices with global culinary techniques.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="text-[#d9232d] bg-red-50 p-3.5 rounded-2xl shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4m16 0a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v4a2 2 0 002 2m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Zero-Gravity Comfort</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Ergonomic aircraft seats with flat-bed tech and ultra-high definition cinematic screens.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 items-start">
                <div className="text-[#d9232d] bg-red-50 p-3.5 rounded-2xl shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-1">Digital Concierge</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Real-time arrival assistance, luggage tracking, and luxury transfer bookings at your fingertips.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <div className="bg-[#111827] rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden h-full min-h-95">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d9232d] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-20 border-2 border-red-500 rounded-xl flex items-center justify-center mb-6 bg-red-500/10 backdrop-blur-md">
                  <span className="text-red-400 font-black text-[9px] uppercase tracking-wider leading-tight">NextFly<br/>Elite</span>
                </div>
                
                <h3 className="font-bold tracking-[0.2em] text-xs text-red-400 uppercase">
                  Passenger Safety
                </h3>
                <p className="text-[10px] text-gray-400 mt-1 tracking-widest uppercase">Verified Excellence</p>
                
                <h2 className="text-6xl lg:text-7xl font-black text-white mt-6 tracking-tight">98%</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-3">
                  High Satisfaction Rating
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}