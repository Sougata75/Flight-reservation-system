import { supabase } from "@/lib/supabaseClient"
import { FlightUpdateValues } from "@/services/validation/flight.addValidation";
import { FlightSearchType } from "@/services/validation/flightSearch.validation";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFlightFetch = (currentPage:number,limitPerPage:number) => {
    return useQuery({
        queryKey: ["flight-data-fetch",currentPage,limitPerPage],
        queryFn: async () => {

            const from = (currentPage - 1) * limitPerPage;
            const to = from + limitPerPage - 1

            const {data:flightData, error} = await supabase.from("flights").select("*", {count: "exact"}).order("created_at", {ascending: false}).range(from,to);

            if(error){
                throw new Error("Failed to fetch flight data from 'flights' table");
            }

            return flightData;
        },
        
    })
};

export const useUpdateFlights = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["flight-update"],
        mutationFn: async ({id,data}:{id:string,data:FlightUpdateValues}) => {

            const updatePayload = {
                service_type: data.service_type,
                origin: data.aircraft_model.active_route.origin,
                destination: data.aircraft_model.active_route.destination,
                aircraft_model: data.aircraft_model.model,
                status: data.status,
                eco_capacity: data.aircraft_model.classes.economy?.seat_count,
                biz_capacity: data.aircraft_model.classes.business?.seat_count,
                pre_eco_capacity: data.aircraft_model.classes.premium_economy?.seat_count,
                first_class_capacity: data.aircraft_model.classes.first?.seat_count,
                base_price: data.base_price,
                schedule: data.schedule
            };

            const {data:updateFlightData, error} = await supabase.from("flights").update(updatePayload).eq("id",id).select().single()

            if(error){
                throw new Error("Flight update failed at hook",error);
            }

            return updateFlightData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["flight-data-fetch"]});
        } 
    })
} ;


export const useSearchFlight = (
  searchParams: any, 
  isReturnFlight: boolean = false
) => {
  return useQuery({
    queryKey: ["flight-search", searchParams, isReturnFlight],
    
    enabled: !!searchParams && !!searchParams.origin?.value,

    queryFn: async () => {
      let query = supabase.from("flights").select("*");

      const targetOrigin = isReturnFlight ? searchParams.destination.value : searchParams.origin.value;
      const targetDest = isReturnFlight ? searchParams.origin.value : searchParams.destination.value;

      if (targetOrigin) {
        query = query.eq("origin", targetOrigin);
      }
      
      if (targetDest) {
        query = query.eq("destination", targetDest);
      }

      const { data: flightData, error } = await query;

      if (error) {
        throw new Error("Failed to fetch flight data from 'flights' table");
      }

      const targetDate = isReturnFlight ? searchParams.date?.return : searchParams.date?.depart;

      if (targetDate && flightData) {
        return flightData.filter((flight: any) => 
          flight.schedule?.departure_time?.startsWith(targetDate)
        );
      }

      return flightData;
    }
  });
};