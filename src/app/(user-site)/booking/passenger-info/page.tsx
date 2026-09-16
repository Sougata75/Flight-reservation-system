"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { z } from "zod";
import { PassengerSchema } from "@/services/validation/passenger.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPassengers } from "@/store/slices/global.slice";
import { useEffect } from "react";

export default function PassengerInfo() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, isAuthLoading } = useAppSelector((state: any) => state.global);

  // 1. ALL HOOKS MUST GO HERE BEFORE ANY EARLY RETURNS
  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/authentication");   
    }
  }, [isLoggedIn, isAuthLoading, router, dispatch]);

  const { register, control, handleSubmit, formState: { errors } } = useForm<z.input<typeof PassengerSchema>>({
    resolver: zodResolver(PassengerSchema),
    defaultValues: {
      contactEmail: "",
      contactPhone: "",
      passengers: [{ firstName: "", lastName: "", gender: "Male", dob: "" }] 
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "passengers",
  });

  // 2. NOW IT IS SAFE TO RETURN EARLY
  // Prevent the form from flashing on the screen while redirecting
  if (isAuthLoading || !isLoggedIn) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold text-gray-500 animate-pulse">
          Verifying account security...
        </div>
      </div>
    );
  }

  // 3. SUBMIT HANDLER
  const onSubmit = (data: z.input<typeof PassengerSchema>) => {
    dispatch(setPassengers(data));
    router.push("/booking/seat-selection"); 
  };

  // 4. MAIN RENDER
  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold mb-6">Passenger Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        
        {/* --- CONTACT DETAILS --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-red-700">Contact Details</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600">Email Address</label>
              <input {...register("contactEmail")} className="w-full mt-1 p-3 border rounded-lg" placeholder="Email for e-ticket" />
              {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-600">Phone Number</label>
              <input {...register("contactPhone")} className="w-full mt-1 p-3 border rounded-lg" placeholder="Mobile number" />
              {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
            </div>
          </div>
        </div>

        {/* --- DYNAMIC PASSENGER BLOCKS --- */}
        {fields.map((field, index) => (
          <div key={field.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-700">Passenger {index + 1}</h3>
              {index > 0 && (
                <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm font-bold hover:underline">
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-600">First Name</label>
                <input {...register(`passengers.${index}.firstName`)} className="w-full mt-1 p-3 border rounded-lg" placeholder="As on ID" />
                {errors.passengers?.[index]?.firstName && <p className="text-red-500 text-xs mt-1">{errors.passengers[index]?.firstName?.message}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-600">Last Name</label>
                <input {...register(`passengers.${index}.lastName`)} className="w-full mt-1 p-3 border rounded-lg" placeholder="As on ID" />
                {errors.passengers?.[index]?.lastName && <p className="text-red-500 text-xs mt-1">{errors.passengers[index]?.lastName?.message}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-600">Gender</label>
                <select {...register(`passengers.${index}.gender`)} className="w-full mt-1 p-3 border rounded-lg bg-white">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.passengers?.[index]?.gender && <p className="text-red-500 text-xs mt-1">{errors.passengers[index]?.gender?.message}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-600">Date of Birth</label>
                <input type="date" {...register(`passengers.${index}.dob`)} className="w-full mt-1 p-3 border rounded-lg" />
                {errors.passengers?.[index]?.dob && <p className="text-red-500 text-xs mt-1">{errors.passengers[index]?.dob?.message}</p>}
              </div>
            </div>
          </div>
        ))}

        {/* --- ADD PASSENGER BUTTON --- */}
        <button 
          type="button" 
          onClick={() => append({ firstName: "", lastName: "", gender: "Male", dob: "" })}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-bold hover:border-red-500 hover:text-red-500 transition-colors"
        >
          + Add Another Passenger
        </button>

        {/* --- SUBMIT BUTTON --- */}
        <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold text-xl rounded-xl hover:bg-red-700 shadow-md transition-colors">
          Continue to Seat Selection
        </button>

      </form>
    </div>
  );
}