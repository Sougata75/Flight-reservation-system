"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setSeats } from "@/store/slices/global.slice";


const OCCUPIED_SEATS = ["1A", "1B", "2C", "4E", "4F", "5A", "7C", "7D", "8F", "10B"];
const ROWS = 10;
const COLS_LEFT = ["A", "B", "C"];
const COLS_RIGHT = ["D", "E", "F"];

export default function SeatSelection() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { passengerData, isLoggedIn, isAuthLoading } = useAppSelector((state: any) => state.global);

  const [assignedSeats, setAssignedSeats] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/authentication");
    }
  }, [isLoggedIn, isAuthLoading, router]);

  if (isAuthLoading || !isLoggedIn) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Loading seating chart...</div>
      </div>
    );
  }

  const passengers = passengerData?.passengers || [];
  if (passengers.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600">No passengers found.</p>
        <button onClick={() => router.push("/booking/passenger-info")} className="text-red-600 font-bold hover:underline">
          Go back to Passenger Info
        </button>
      </div>
    );
  }

  const allSeated = Object.keys(assignedSeats).length === passengers.length;
  const nextUnassignedIndex = passengers.findIndex((_: any, idx: number) => !assignedSeats[idx]);

  const handleSeatClick = (seatId: string) => {
    if (OCCUPIED_SEATS.includes(seatId)) return;

    const existingPassengerIndex = Object.keys(assignedSeats).find(
      (key) => assignedSeats[Number(key)] === seatId
    );

    if (existingPassengerIndex !== undefined) {
      const newAssignments = { ...assignedSeats };
      delete newAssignments[Number(existingPassengerIndex)];
      setAssignedSeats(newAssignments);
      return;
    }


    if (nextUnassignedIndex !== -1) {
      setAssignedSeats({
        ...assignedSeats,
        [nextUnassignedIndex]: seatId,
      });
    }
  };

  const onSubmit = () => {
    if (!allSeated) return;
    dispatch(setSeats(assignedSeats));
    router.push("/booking/payments");
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] py-10 px-5 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Select Seats</h2>
            <p className="text-gray-500 mt-2">
              Please select a seat for all {passengers.length} passenger{passengers.length > 1 ? "s" : ""}.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
            {passengers.map((p: any, idx: number) => {
              const seat = assignedSeats[idx];
              const isCurrent = nextUnassignedIndex === idx;
              
              return (
                <div 
                  key={idx} 
                  className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all ${
                    seat ? "border-green-500 bg-green-50" : isCurrent ? "border-red-500 bg-red-50 shadow-md" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-800 capitalize">{p.firstName} {p.lastName}</p>
                    <p className={`text-xs font-semibold ${seat ? "text-green-600" : "text-gray-500"}`}>
                      {seat ? "Seat Assigned" : isCurrent ? "Select seat now" : "Waiting for seat"}
                    </p>
                  </div>
                  <div className={`text-2xl font-black ${seat ? "text-green-600" : "text-gray-300"}`}>
                    {seat || "--"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-sm font-bold text-gray-500 px-2 mt-4">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded"></div> Selected</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-300 rounded"></div> Occupied</div>
          </div>

          <button 
            onClick={onSubmit}
            disabled={!allSeated}
            className={`w-full py-4 text-white font-bold text-xl rounded-xl shadow-md transition-all mt-6 ${
              allSeated ? "bg-red-600 hover:bg-red-700" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {allSeated ? "Continue to Payment" : "Select all seats to continue"}
          </button>
        </div>

        <div className="lg:col-span-7 flex justify-center">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border-8 border-gray-200 w-max max-w-full overflow-x-auto relative pb-20">
            
            <div className="w-full flex justify-center mb-10">
              <div className="w-20 h-20 border-t-8 border-l-8 border-r-8 border-gray-200 rounded-t-full bg-gray-50"></div>
            </div>

            <div className="flex flex-col gap-4">
              {Array.from({ length: ROWS }).map((_, rowIndex) => {
                const rowNum = rowIndex + 1;
                return (
                  <div key={rowNum} className="flex items-center gap-8">
                    
                    <div className="flex gap-2">
                      {COLS_LEFT.map((col) => {
                        const seatId = `${rowNum}${col}`;
                        const isOccupied = OCCUPIED_SEATS.includes(seatId);
                        const isSelected = Object.values(assignedSeats).includes(seatId);
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId)}
                            className={`w-12 h-12 flex items-center justify-center font-bold text-sm rounded-t-xl rounded-b-md transition-all ${
                              isOccupied ? "bg-gray-300 text-gray-500 cursor-not-allowed" : 
                              isSelected ? "bg-red-600 text-white shadow-md transform scale-110" : 
                              "bg-white border-2 border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-500"
                            }`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>

                    <div className="w-8 text-center text-gray-300 font-bold text-xs">{rowNum}</div>

                    <div className="flex gap-2">
                      {COLS_RIGHT.map((col) => {
                        const seatId = `${rowNum}${col}`;
                        const isOccupied = OCCUPIED_SEATS.includes(seatId);
                        const isSelected = Object.values(assignedSeats).includes(seatId);
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isOccupied}
                            onClick={() => handleSeatClick(seatId)}
                            className={`w-12 h-12 flex items-center justify-center font-bold text-sm rounded-t-xl rounded-b-md transition-all ${
                              isOccupied ? "bg-gray-300 text-gray-500 cursor-not-allowed" : 
                              isSelected ? "bg-red-600 text-white shadow-md transform scale-110" : 
                              "bg-white border-2 border-gray-300 text-gray-400 hover:border-red-400 hover:text-red-500"
                            }`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}