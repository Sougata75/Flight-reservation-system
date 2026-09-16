import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { nationalityList } from "@/services/json/nationality.counteries";
import { logIn, nextStep, prevStep, stepReseter } from "@/store/slices/global.slice";
import type {SignUpType}  from "@/typescript/interfaces/auth.interface";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/services/validation/auth.signupValidation";
import { useAuthentication } from "@/hooks/useAuth";
import {z} from "zod";

function Signup() {
  const dispatch = useAppDispatch();
  const { formStep } = useAppSelector((state) => state.global);

  const {mutate:signUp,isPending,isError,isSuccess} = useAuthentication();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    control,
    trigger
  } = useForm<z.input<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      role: {
        role: "member",
        member_type: "regular",
      },
    },
  });

  const onSubmit = (data: z.input<typeof SignUpSchema>) => {
    signUp(data as SignUpType,{
      onSuccess: () => {
        dispatch(logIn("login"));
        dispatch(stepReseter());
        reset();
      },
      onError: (error) => {
        console.log("SingUp error",error.message);
      }
    })
  } 

  return (
    <div className="w-full">
  <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-between">
        <div className="w-full">
          <div className="flex flex-col px-5 py-1">
            <label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Full Name
            </label>
            <input
              className={`w-full text-lg p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-red-700 transition-shadow ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
            />
            <div className="min-h-6 mt-1">
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message as string}</span>}
            </div>
          </div>

          <div className="flex flex-col px-5 py-1">
            <label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Contact Number
            </label>
            <input
              className={`w-full text-lg p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-red-700 transition-shadow ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              placeholder="Enter your contact number"
              {...register("phone")}
            />
            <div className="min-h-6 mt-1">
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message as string}</span>}
            </div>
          </div>

          <div className="flex flex-col px-5 py-1">
            <label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Email Address
            </label>
            <input
              className={`w-full text-lg p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-red-700 transition-shadow ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              type="text"
              placeholder="Enter your email address"
              {...register("email")}
            />
            <div className="min-h-6 mt-1">
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message as string}</span>}
            </div>
          </div>

          <div className="flex flex-col px-5 py-1">
            <label className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
              Password
            </label>
            <input
              className={`w-full text-lg p-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-red-700 transition-shadow ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              type="password"
              placeholder="Enter a new password"
              {...register("password")}
            />
            <div className="min-h-6 mt-1">
              {errors.password && <span className="text-red-500 text-sm">{errors.password.message as string}</span>}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end items-end p-5 mt-4">
          <button
            type="submit"
            disabled = {isPending}
            className="text-xl text-white font-semibold bg-red-700 w-full py-3 rounded-md hover:bg-red-800 transition-colors duration-300 shadow-md"
          >
            {isPending? "Submitting ..." : "Submit"}
          </button>
        </div>
      </div>
  </form>
</div>
  );
}

export default Signup;
