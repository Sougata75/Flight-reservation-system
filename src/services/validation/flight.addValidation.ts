import { z } from "zod";

export const cabinDetailsSchema = z.object({
  seat_count: z.number(),
  layout: z.string(),
  pitch: z.string(),
});

export const cabinClassesSchema = z.object({
  first: cabinDetailsSchema.optional(),
  business: cabinDetailsSchema.optional(),
  premium_economy: cabinDetailsSchema.optional(),
  economy: cabinDetailsSchema.optional(),
});

export const activeRouteSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  route_type: z.string(),
});

export const aircraftSchema = z.object({
  model: z.string(),
  tail_number: z.string(),
  manufacturer: z.string(),
  total_seats: z.number(),
  classes: cabinClassesSchema,
  active_route: activeRouteSchema,
});

export const scheduleSchema = z.object({
  departure_time: z.string().datetime({ message: "Invalid departure date/time format" }),
  arrival_time: z.string().datetime({ message: "Invalid arrival date/time format" }),
});

export const flightFormSchema = z.object({
  flight_number: z.string().min(1, "Flight number is required"),
  service_type: z.string().min(1, "Service type is required"),
  base_price: z.coerce.number().min(1, "Base price is required"),
  aircraft_model: aircraftSchema, 
  schedule: scheduleSchema,
});

export type FlightFormValues = z.infer<typeof flightFormSchema>;


export const flightUpdateSchema = flightFormSchema.extend({
  status: z.string().min(1, "Flight status is required"),
});


export type FlightUpdateValues = z.infer<typeof flightUpdateSchema>;

