"use client"

import FlightStats from "@/components/admin/FlightStats"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { addFlightClose, addFlightOpen } from "@/store/slices/global.slice"
import { Button } from "@base-ui/react/button"
import { PlusCircle } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import {aircraftConfigs, serviceType} from "@/services/json/aircraftConfiguration"
import {flightFormSchema, FlightFormValues } from "@/services/validation/flight.addValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod"
import { routeConfig } from "@/services/json/airCraft.routeConfiguration"
import { useFlightAdd } from "@/hooks/useFlight"
import ActiveFlights from "@/components/admin/ActiveFlights"
import EditMode from "@/components/admin/EditMode"
import FlightDetailsModal from "@/components/admin/FlightDetails"




function Flights() {

  const dispatch = useAppDispatch();
  const {addFlightDilog,isUpdateMode,viewFlightData} = useAppSelector((state) => state.global);
  const {mutate:flightFunc, isPending} = useFlightAdd();

  const {register,reset,control,formState:{errors},handleSubmit,watch,setValue} = useForm<z.input<typeof flightFormSchema>>({
    resolver: zodResolver(flightFormSchema),
    defaultValues:{
      flight_number: "",
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

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const departureValue = e.target.value; 
  
  if (!departureValue) return;
  const depDate = new Date(departureValue);
  
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

      setValue("schedule.arrival_time", arrDate.toISOString(), { shouldValidate: true });
    }
  }
};

  const onSubmit = (data:z.input<typeof flightFormSchema>) => {
    flightFunc(data as FlightFormValues,{
      onSuccess: () => {
        dispatch(addFlightClose());
        reset();
      },
      onError: (error) => {
        console.log("Flight add error",error.message)
      }
    })
  }


  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="w-full h-30 flex flex-wrap justify-between items-end">
        <div className="flex flex-col gap-3">
          <h2 className="text-black text-6xl font-bold tracking-tight">Flight Management</h2>
          <p className="text-gray-600 text-[28px]">Real-time oversight of global fleet operations and capacity</p>
        </div>
        <div className="">
          <Button onClick={() => dispatch(addFlightOpen())} className="bg-red-700 text-white text-xl font-semibold flex items-center gap-4 p-5 px-8 rounded-xl hover:bg-red-800"><PlusCircle/> + Add New Flight</Button>
        </div>
      </div>

      <div>
        <FlightStats/>
      </div>

      <div className="w-full h-[65%] overflow-y-scroll noBar">
        <ActiveFlights/>
      </div>

      {isUpdateMode? (
        <EditMode/>
      ): viewFlightData? (
        <FlightDetailsModal/>
      ):(
        <Dialog open={addFlightDilog} onOpenChange={() => dispatch(addFlightClose())}>
        <DialogContent className={`sm:max-w-5xl h-[80vh] bg-white/20 backdrop-blur-md px-10 overflow-hidden`}>

        <div className="py-6 border-b bg-transparent border-gray-100">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
               <span className="inline-block w-2 h-2 rounded-full bg-red-700" />
               <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">
                 Schedule New Flight
               </DialogTitle>
             </div>
             <DialogDescription className="text-sm text-gray-600">
               Enter route configurations, aircraft assignment, and base fare pricing to deploy a flight to the global schedule.
             </DialogDescription>
           </DialogHeader>
        </div>

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
  

  <div className="w-full flex flex-col gap-2">
    <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Flight Number</label>
    <input 
      className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" 
      type="text" 
      {...register("flight_number")}
    />
    {errors.flight_number && (
      <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
        {errors.flight_number.message as string}
      </span>
    )}
  </div>

  <div className="w-full flex flex-col gap-2">
    <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Service Type</label>
    <Controller
      name="service_type"
      control={control}
      render={({field}) => (
        <select className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" {...field}>
          <option value="" disabled>Choose service type</option>
          {serviceType.map((item: string) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      )}
    />
    {errors.service_type && (
      <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
        {errors.service_type.message as string}
      </span>
    )}
  </div>

  <div className="w-full flex flex-col gap-2">
    <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Aircraft Model</label>
    <Controller
      name="aircraft_model"
      control={control}
      render={({field}) => (
        <select 
          className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" 
          value={field.value?.model || ""}
          onChange={(e) => {
            const selectedObject = aircraftConfigs.find((plane) => plane.model === e.target.value);
            field.onChange(selectedObject);
          }}
        >
          <option value="" disabled>Choose aircraft model</option>
          {aircraftConfigs.map((item,index) => (
            <option key={`${item.tail_number}-${index}`} value={item.model}>{item.model} - ( {item.active_route.origin} - {item.active_route.destination} )</option>
          ))}
        </select>
      )}
    />
    {errors.aircraft_model && (
      <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
        Aircraft model is required
      </span>
    )}
  </div>

  <div className="w-full flex flex-col gap-2">
    <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Departure Time</label>
    <input 
      className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" 
      type="datetime-local" 
      onChange={handleDepartureChange}
    />

    {errors.schedule?.departure_time && (
      <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
        {errors.schedule.departure_time.message as string}
      </span>
    )}
  </div>

  <div className="w-full flex flex-col gap-2">
    <label className="text-[16px] font-bold tracking-widest uppercase text-gray-700">Base Price</label>
    <input 
      className="w-full bg-white border border-gray-400 text-xl p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" 
      type="number" 
      {...register("base_price")}
    />
    {errors.base_price && (
      <span className="text-red-600 font-semibold text-sm capitalize tracking-wider">
        {errors.base_price.message as string}
      </span>
    )}
  </div>

  <div className="w-full pt-4">
    <Button type="submit" className="w-full text-white text-xl font-semibold uppercase p-6 rounded-xl bg-red-700 hover:bg-red-800 transition-colors">
      Add Flight
    </Button>
  </div>
  
</form>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}

export default Flights