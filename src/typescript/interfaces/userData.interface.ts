import {z}from "zod"; 

export const UserDataType = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password cannot exceed 20 characters" })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    role: z.object({
    role: z.string(),
    member_type: z.string()
  }),
  nationality: z.string().min(4, "Nationality is required"),
  gender: z.string().min(4, "Gender is required"),
  
  dob: z.coerce.date()
    .max(new Date(), { message: "Date of birth cannot be in the future" })
    .refine((date) => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      return date <= eighteenYearsAgo;
    }, { message: "You must be at least 18 years old" }),
  identity: z.string().min(5, "Identity is required"),
  passport: z.object({
    passportNumber: z.string().min(3, "Passport number is required"),
    issuingCountry: z.string().min(4, "Issuing country is required"),
    issuingDate: z.coerce.date()
      .max(new Date(), { message: "Issuing date cannot be in the future" }),
    expiryDate: z.coerce.date()
      .min(new Date(), { message: "Expiry date must be in the future" }),
  }),
   emergencyContact: z.object({
    name: z.string().min(2, "Family member name is required"),
    relationship: z.string().min(3, "Relationship is required"),
    contact: z.string().min(7, "Alternative number is required"),
    email: z.string().email("Alternative email address is required"),
   })
})


export interface BookingPayload {
  userId: string;
  outboundFlightId: string;
  returnFlightId: string | null;
  contactEmail: string;
  contactPhone: string;
  passengers: any[];
  totalPrice: number;
  paymentId: string;
  cabinName: string; 
}

export interface UpgradeParams {
  bookingId: number;
  newSeat: string;
  passengers: any[];
}

export interface SearchParams {
  flightNumber: string;
  date: string;
}