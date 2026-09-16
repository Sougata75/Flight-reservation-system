import {z} from "zod"

export const SignUpSchema = z.object({
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
})
 

export const LoginSchema = z.object({
  email: z.string().email("Incorrect email format"),
  password: z.string().min(1, { message: "Password is required" })
})