import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plane, Users, Banknote, Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addFlightClose } from "@/store/slices/global.slice";

export default function FlightDetailsModal() {
  const dispatch = useAppDispatch();
  const { viewFlightData, selectedFlight } = useAppSelector((state) => state.global);

  if (!selectedFlight) return null;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Not Scheduled";
    return new Date(dateString).toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    });
  };

  return (
    <Dialog open={viewFlightData} onOpenChange={() => dispatch(addFlightClose())}>
      <DialogContent className="sm:max-w-5xl h-[80vh] bg-white/20 backdrop-blur-md px-10 overflow-hidden flex flex-col">

        <div className="py-6 border-b border-gray-200 shrink-0 flex justify-between items-start">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
                {selectedFlight.flight_number} Overview
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              Comprehensive flight manifesto, schedule details, and capacity metrics.
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 font-bold text-gray-700 tracking-wider uppercase text-sm">
            {selectedFlight.status || "Scheduled"}
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto no-scrollbar py-6 space-y-8 pr-2">
          
          <div className="grid grid-cols-2 gap-6">
            
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl flex items-center justify-between">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-widest">Origin</span>
                <span className="text-4xl font-bold text-gray-900">{selectedFlight.aircraft_model.active_route.destination}</span>
              </div>
              <div className="flex flex-col items-center px-4">
                <Plane className="text-gray-400 mb-2" size={24} />
                <span className="text-xs text-gray-400 uppercase font-semibold">Direct</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-widest">Destination</span>
                <span className="text-4xl font-bold text-gray-900">{selectedFlight.aircraft_model.active_route.destination}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Plane size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Aircraft</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{selectedFlight.aircraft_model.model}</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Banknote size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Base Price</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">₹{selectedFlight.base_price}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
              <Clock size={16} /> Flight Schedule
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 p-5 rounded-xl">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Departure Time</span>
                <span className="text-lg font-semibold text-gray-900">{formatTime(selectedFlight.schedule?.departure_time)}</span>
              </div>
              <div className="bg-white border border-gray-200 p-5 rounded-xl">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Arrival Time</span>
                <span className="text-lg font-semibold text-gray-900">{formatTime(selectedFlight.schedule?.arrival_time)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
              <Users size={16} /> Passenger Load Breakdown
            </h3>
            <div className="grid grid-cols-4 gap-4">

              <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Economy</span>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-2xl font-bold text-gray-900">{selectedFlight.eco_booked || 0}</span>
                  <span className="text-sm font-semibold text-gray-400 mb-1">/ {selectedFlight.eco_capacity || 0}</span>
                </div>
              </div>
              

              <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Premium Eco</span>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-2xl font-bold text-gray-900">{selectedFlight.pre_eco_booked || 0}</span>
                  <span className="text-sm font-semibold text-gray-400 mb-1">/ {selectedFlight.pre_eco_capacity || 0}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Business</span>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-2xl font-bold text-gray-900">{selectedFlight.biz_booked || 0}</span>
                  <span className="text-sm font-semibold text-gray-400 mb-1">/ {selectedFlight.biz_capacity || 0}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">First Class</span>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-2xl font-bold text-gray-900">{selectedFlight.first_class_booked || 0}</span>
                  <span className="text-sm font-semibold text-gray-400 mb-1">/ {selectedFlight.first_class_capacity || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div className="pt-4 border-t border-gray-200 shrink-0 pb-4">
          <Button onClick={() => dispatch(addFlightClose())} className="w-full text-gray-700 text-lg font-semibold uppercase p-6 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            Close Details
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}