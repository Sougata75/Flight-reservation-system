import { supabase } from "@/lib/supabaseClient"
import { FlightFormValues } from "@/services/validation/flight.addValidation"
import { useMutation, useQueryClient } from "@tanstack/react-query"



export const useFlightAdd = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey:["flight_add"],
        mutationFn: async (data:FlightFormValues) => {

            const inserPayload = {
                flight_number: data.flight_number,
                service_type: data.service_type,
                origin: data.aircraft_model.active_route.origin,
                destination: data.aircraft_model.active_route.destination,
                aircraft_model: data.aircraft_model.model,
                status: "Scheduled",
                eco_capacity: data.aircraft_model.classes.economy?.seat_count,
                biz_capacity: data.aircraft_model.classes.business?.seat_count,
                pre_eco_capacity: data.aircraft_model.classes.premium_economy?.seat_count,
                first_class_capacity: data.aircraft_model.classes.first?.seat_count,
                base_price: data.base_price,
                schedule: data.schedule
            }

            const {data:flightData, error:flightAddError} = await supabase.from("flights").insert(inserPayload).select().single();

            if(!flightData) throw new Error(flightAddError?.message);
            return {Session: flightData};
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["flight-data-fetch"]
            });
        }
    })
}