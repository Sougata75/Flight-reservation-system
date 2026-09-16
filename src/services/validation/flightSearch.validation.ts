import {z} from "zod"



const selectOptionSchema = z
  .object({
    value: z.string(),
    label: z.string(),
    fullData: z.any().optional(),
  })
  .nullable()
  .optional()
  .refine((data) => data && data.value, {
    message: "Please select an airport",
  });

const dateSchema = z.object({
  depart: z.string().min(1, { message: "Departure date is required" }),
  return: z.string().optional().or(z.literal("")),
});

export const FlightSearchSchema = z.object({
  origin: selectOptionSchema,
  destination: selectOptionSchema,
  date: dateSchema,
  class: z.string().min(1, { message: "Please select a cabin class" }),
}).refine((data) => {
  if (data.origin && data.destination) {
    return data.origin.value !== data.destination.value;
  }
  return true;
}, {
  message: "Origin and destination cannot be the same.",
  path: ["destination"], 
});

export type FlightSearchType = z.infer<typeof FlightSearchSchema>; 