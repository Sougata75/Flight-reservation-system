import { useFlightAdd } from "@/hooks/useFlight";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { routeConfig } from "@/services/json/airCraft.routeConfiguration";
import { flightUpdateSchema, FlightUpdateValues } from "@/services/validation/flight.addValidation";
import { addFlightClose } from "@/store/slices/global.slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { aircraftConfigs, serviceType } from "@/services/json/aircraftConfiguration";
import { Button } from "../ui/button";
import { z } from "zod";
import { useEffect } from "react";
import { flightSchedules } from "@/services/json/flights.table";
import { useUpdateFlights } from "@/hooks/useFlightData";

function EditMode() {
  const dispatch = useAppDispatch();
  const { addFlightDilog, selectedFlight } = useAppSelector((state) => state.global);
  const { mutate: updateFlight, isPending } = useUpdateFlights();

  const { register, reset, control, formState: { errors }, handleSubmit, watch, setValue } = useForm<z.input<typeof flightUpdateSchema>>({
    resolver: zodResolver(flightUpdateSchema),
    defaultValues: {
      flight_number: "",
      status: "",
      service_type: "",
      base_price: 0,
      aircraft_model: undefined as any,
      schedule: {
        departure_time: "",
        arrival_time: ""
      }
    }
  });

  const selectedAircraft = watch("aircraft_model");
  const currentDepartureTime = watch("schedule.departure_time");

  // Helper to format ISO string to HTML datetime-local format (YYYY-MM-DDThh:mm)
  const formatForDateTimeInput = (isoString: string) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  // 1. Fix the date handler to ALWAYS append the "Z" so Zod's .datetime() is happy
const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const departureValue = e.target.value;

  if (!departureValue) return;
  const depDate = new Date(departureValue);

  // Force strict ISO string with 'Z' for Zod validation
  setValue("schedule.departure_time", depDate.toISOString(), { shouldValidate: true });

  if (selectedAircraft && selectedAircraft.active_route) {
    const route = routeConfig.find(
      (r) => r.origin === selectedAircraft.active_route.origin &&
             r.destination === selectedAircraft.active_route.destination
    );

    if (route) {
      const hoursMatch = route.duration.match(/(\d+)h/);
      const minsMatch = route.duration.match(/(\d+)m/);

      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;

      const arrDate = new Date(depDate.getTime());
      arrDate.setHours(arrDate.getHours() + hours);
      arrDate.setMinutes(arrDate.getMinutes() + mins);

      // Force strict ISO string with 'Z' for Zod validation
      setValue("schedule.arrival_time", arrDate.toISOString(), { shouldValidate: true });
    }
  }
};

// 2. Fix the reset function so aircraft_model maps correctly
useEffect(() => {
  if (selectedFlight) {
    
    // Ensure we handle the aircraft model correctly whether it's a string from the DB or already an object
    const flightAircraftModelString = typeof selectedFlight.aircraft_model === 'string' 
      ? selectedFlight.aircraft_model 
      : selectedFlight.aircraft_model?.model;

    const matchedAircraft = aircraftConfigs.find(plane => plane.model === flightAircraftModelString);

    // Format existing dates to ensure they have the 'Z' for Zod
    const formatExistingDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toISOString();
      } catch {
        return "";
      }
    };

    reset({
      flight_number: selectedFlight.flight_number || "",
      status: selectedFlight.service_type || "",
      service_type: selectedFlight.service_type || "",
      base_price: Number(selectedFlight.base_price) || 0,
      aircraft_model: matchedAircraft as any, 
      schedule: {
        departure_time: formatExistingDate(selectedFlight.schedule?.departure_time),
        arrival_time: formatExistingDate(selectedFlight.schedule?.arrival_time)
      }
    });
  }
}, [selectedFlight, reset]);

// 3. (Optional but helpful) Add this inside your component to debug future Zod errors
useEffect(() => {
  if (Object.keys(errors).length > 0) {
    console.log("Zod Validation Errors Blocking Submit:", errors);
  }
}, [errors]);

  const onSubmit = (data: z.input<typeof flightUpdateSchema>) => {
    if (!selectedFlight?.id) return;

    updateFlight({
      id: selectedFlight.id,
      data: data as FlightUpdateValues,
    }, {
      onSuccess: () => {
        dispatch(addFlightClose());
      },
      onError: (error) => {
        console.error("Flight update error on onSubmit", error.message);
      }
    });
  };

  return (
    <Dialog open={addFlightDilog} onOpenChange={() => dispatch(addFlightClose())}>
      <DialogContent className={`sm:max-w-5xl h-[80vh] bg-white/95 backdrop-blur-md overflow-hidden flex flex-col`}>

        <div className="py-6 border-b bg-transparent border-gray-100 shrink-0">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
              <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">
                Update Flight Operations
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-gray-600">
              Modify flight status, adjust departure schedules for delays, or swap aircraft models. Route and flight number are locked.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="w-full flex flex-col gap-6 overflow-y-auto no-scrollbar pb-6 pt-4" onSubmit={handleSubmit(onSubmit)}>

          {/* Flight Number (READ-ONLY) */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Flight Number</label>
            <input
              readOnly
              className="w-full bg-gray-100 border border-gray-300 text-gray-500 text-xl p-3 rounded-lg cursor-not-allowed outline-none"
              type="text"
              {...register("flight_number")}
            />
            {errors.flight_number && (
              <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
                {errors.flight_number.message as string}
              </span>
            )}
          </div>

          {/* Flight Status */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Flight Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" {...field}>
                  {flightSchedules.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Service Type */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Service Type</label>
            <Controller
              name="service_type"
              control={control}
              render={({ field }) => (
                <select className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" {...field}>
                  <option value="" disabled>Choose service type</option>
                  {serviceType.map((item: string) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Aircraft Model */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Aircraft Model</label>
            <Controller
              name="aircraft_model"
              control={control}
              render={({ field }) => (
                <select
                  className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  value={field.value?.model || ""}
                  onChange={(e) => {
                    const selectedObject = aircraftConfigs.find((plane) => plane.model === e.target.value);
                    field.onChange(selectedObject);
                  }}
                >
                  <option value="" disabled>Choose aircraft model</option>
                  {aircraftConfigs.map((item, index) => (
                    <option key={`${item.model}-${index}`} value={item.model}>
                      {item.model} - ( {item.active_route.origin} - {item.active_route.destination} )
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Departure Time */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Departure Time</label>
            <input
              className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              type="datetime-local"
              value={formatForDateTimeInput(currentDepartureTime)}
              onChange={handleDepartureChange}
            />
            {errors.schedule?.departure_time && (
              <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
                {errors.schedule.departure_time.message as string}
              </span>
            )}
          </div>

          {/* Base Price */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Base Price</label>
            <input
              className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              type="number"
              {...register("base_price", { valueAsNumber: true })}
            />
            {errors.base_price && (
              <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
                {errors.base_price.message as string}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="w-full pt-4 shrink-0 pb-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full text-white text-xl font-semibold uppercase p-6 rounded-xl bg-orange-600 hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMode;