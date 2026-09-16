import {z} from "zod";

// The shape of the data you are collecting
export const PassengerSchema = z.object({
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(10, "Valid phone required"),
  passengers: z.array(
    z.object({
      firstName: z.string().min(2, "First name required"),
      lastName: z.string().min(2, "Last name required"),
      gender: z.enum(["Male", "Female", "Other"]),
      dob: z.string(), // Date of birth
    })
  ).min(1, "At least one passenger is required")
});


export const CheckInSchema = z.object({
  pnr: z.string().min(1, "Booking Reference is required").trim(),
  lastName: z.string().min(2, "Last Name is required").trim().toLowerCase(),
});

export type CheckInForm = z.infer<typeof CheckInSchema>;


export const FlightStatusSchema = z.object({
  flightNumber: z.string().min(2, "Flight number is required").trim().toUpperCase(),
  date: z.string().min(1, "Date is required"),
});

export type FlightStatusForm = z.infer<typeof FlightStatusSchema>;