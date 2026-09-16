"use client";

import { useRouter } from "next/navigation";
import { useSearchFlight } from "@/hooks/useFlightData";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { setOutboundFlight, setReturnFlight } from "@/store/slices/global.slice";

export default function SearchFlightResult() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { flightSearchData, selectionPhase, trip, selectedOutboundFlight } = useAppSelector((state: any) => state.global);

  const isReturnFlight = selectionPhase === "return";
  const { data: flightData, isLoading, isError } = useSearchFlight(flightSearchData, isReturnFlight);

  const currentOrigin = isReturnFlight ? flightSearchData?.destination?.value : flightSearchData?.origin?.value;
  const currentDest = isReturnFlight ? flightSearchData?.origin?.value : flightSearchData?.destination?.value;
  const currentDate = isReturnFlight ? flightSearchData?.date?.return : flightSearchData?.date?.depart;

  const handleFlightSelect = (flight: any, fareClass: string) => {

    const flightSelection = { ...flight, fareClass: fareClass };

    if (selectionPhase === "outbound") {
      dispatch(setOutboundFlight(flightSelection));
      
      if (trip === "one-way") {
        dispatch(setReturnFlight(null));
        router.push("/booking/passenger-info");
      }
    } else if(trip === "round-trip"){
      dispatch(setReturnFlight(flightSelection));
      router.push("/booking/passenger-info"); 
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDuration = (start?: string, end?: string) => {
    if (!start || !end) return "--h --m";
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  };

  const ClassPriceCell = ({ capacity, booked, basePrice, multiplier, fareClass, flight }: any) => {
    const isAvailable = capacity !== null && capacity > 0 && capacity > booked;
    const seatsLeft = capacity - booked;
    const isLowSeats = seatsLeft > 0 && seatsLeft <= 5; 
    const price = Math.round(basePrice * multiplier).toLocaleString('en-IN');

    if (!isAvailable) {
      return (
        <div className="col-span-2 p-4 border-r border-gray-200 flex items-center justify-center bg-gray-50">
          <p className="text-[11px] text-gray-400 font-medium">Currently Unavailable</p>
        </div>
      );
    }

    return (
      <div 
        onClick={() => handleFlightSelect(flight, fareClass)}
        className="col-span-2 p-4 border-r border-gray-200 flex flex-col justify-between hover:bg-red-50 cursor-pointer transition-colors group"
      >
        <p className={`text-[10px] font-semibold text-center h-4 ${isLowSeats ? 'text-orange-500' : 'text-transparent group-hover:text-gray-400'}`}>
          {isLowSeats ? `${seatsLeft} seats left` : 'Select'}
        </p>
        <div className="text-center mt-auto pb-2">
          <p className="text-xs text-gray-500 mb-1">From</p>
          <p className="text-lg font-bold text-gray-800">INR {price}</p>
        </div>
      </div>
    );
  };

  if (!flightSearchData) return <div className="p-10 text-center text-gray-500">Please search for a flight.</div>;
  if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-2xl mt-10">Searching flights...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error fetching flights.</div>;

  return (
    <div className="w-full px-8 py-10 min-h-screen">
      
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-800">
          {isReturnFlight ? "Select your return flight" : "Select your departure flight"}
        </h2>
        <p className="text-gray-500 font-medium">
          {currentOrigin} to {currentDest} • {currentDate}
        </p>

        {isReturnFlight && selectedOutboundFlight && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg w-max flex items-center gap-3">
            <span className="text-green-600 font-bold">✓ Outbound Selected:</span>
            <span className="text-gray-700 font-semibold">{selectedOutboundFlight.flight_number}</span>
          </div>
        )}
      </div>

      <div className="hidden lg:grid grid-cols-12 gap-0 mb-3 text-[11px] font-bold text-gray-500 tracking-widest text-center uppercase">
        <div className="col-span-4 text-left pl-2">{flightData?.length || 0} flights found</div>
        <div className="col-span-2">Economy</div>
        <div className="col-span-2">Premium Economy</div>
        <div className="col-span-2">Business</div>
        <div className="col-span-2">First Class</div>
      </div>

      <div className="flex flex-col gap-4">
        {flightData?.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-500">No flights available for this date.</div>
        ) : (
          flightData?.map((flight: any) => (
            <div key={flight.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:grid lg:grid-cols-12 hover:shadow-md transition-shadow">
              
              <div className="col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-gray-600">
                  <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                  {flight.flight_number}
                </div>

                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{formatTime(flight.schedule?.departure_time)}</p>
                    <p className="text-gray-500 font-medium text-sm">{flight.origin}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 px-4">
                    <p className="text-[11px] text-gray-500 font-semibold mb-2">
                      {getDuration(flight.schedule?.departure_time, flight.schedule?.arrival_time)}
                    </p>
                    <div className="w-full h-0.5 bg-gray-200 relative">
                      <div className="absolute left-1/2 -top-1 w-2.5 h-2.5 bg-gray-400 rounded-full -translate-x-1/2"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatTime(flight.schedule?.arrival_time)}</p>
                    <p className="text-gray-500 font-medium text-sm">{flight.destination}</p>
                  </div>
                </div>
              </div>

              
              <ClassPriceCell capacity={flight.eco_capacity} booked={flight.eco_booked} basePrice={flight.base_price} multiplier={1} fareClass="Economy" flight={flight} />
              <ClassPriceCell capacity={flight.pre_eco_capacity} booked={flight.pre_eco_booked} basePrice={flight.base_price} multiplier={1.3} fareClass="Premium Economy" flight={flight} />
              <ClassPriceCell capacity={flight.biz_capacity} booked={flight.biz_booked} basePrice={flight.base_price} multiplier={3.5} fareClass="Business" flight={flight} />
              <ClassPriceCell capacity={flight.first_class_capacity} booked={flight.first_class_booked} basePrice={flight.base_price} multiplier={5.5} fareClass="First Class" flight={flight} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}