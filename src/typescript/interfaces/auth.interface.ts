import { LoginSchema, SignUpSchema } from "@/services/validation/auth.signupValidation"
import {z} from "zod"


export type SignUpType = z.infer<typeof SignUpSchema>;
export type SignInType = z.infer<typeof LoginSchema>;