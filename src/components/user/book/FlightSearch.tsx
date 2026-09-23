"use client"

import Select from "react-select";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fSearchData, tripChanger } from "@/store/slices/global.slice";
import {Controller, useForm} from "react-hook-form";
import {airport} from "aviation-codes";
import { bookingClass, tripType } from "@/services/json/flights.table";
import {z} from "zod";
import { FlightSearchSchema } from "@/services/validation/flightSearch.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { lazy } from "react";



function FlightSearch() {

  const navigation = useRouter();
  const today = new Date().toISOString().split("T")[0];

    const dispatch = useAppDispatch();
    const {trip, flightSearchData} = useAppSelector((state) => state.global);
    console.log("flightSearchData----", flightSearchData)

    const airportOptions = airport.iata.codes().map((code) => {
  const data = airport.iata.get(code);
  return {
    value: data?.iata || "",
    label: `${data?.city}, ${data?.country} (${data?.iata}) - ${data?.name}`,
    fullData: data, 
  };
});


const noBorderStyles = {
  control: (base: any, state: any) => ({
    ...base,
    border: "0",                     // Kills the default border
    boxShadow: "none",               // Kills the blue focus outline
    backgroundColor: "transparent",  // Inherits your white background
    padding: "0px",
    minHeight: "auto",
    cursor: "text",
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: "30px",                  // Removes internal padding so it aligns left
    hight: "20px"
  }),
  input: (base: any) => ({
    ...base,
    margin: "0px",
    padding: "0px",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9ca3af",                // Tailwind text-gray-400
    margin: "0px",
  }),
  singleValue: (base: any) => ({
    ...base,
    margin: "0px",
  }),
  indicatorSeparator: () => ({
    display: "none",                 // Hides the vertical dividing line
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "0px",
    color: "#9ca3af",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "1rem",            // Matches your rounded-2xl look
    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)", // Smooth shadow
    marginTop: "12px",
    border: "1px solid #e5e7eb",     // Light gray border for the dropdown
    overflow: "hidden",
    zIndex: 50,                      // Ensures it floats above other elements
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "white", // Gray hover effect
    color: "#1f2937",
    padding: "12px 16px",
    cursor: "pointer",
  })
};

    const {register,reset,control,formState:{errors},handleSubmit} = useForm<z.input<typeof FlightSearchSchema>>({
      resolver: zodResolver(FlightSearchSchema),
      defaultValues: {
        origin: undefined,
        destination: undefined,
        date: {
          depart: "",
          return: "",
        },
        class: "",
      }
    });

    const onsubmit = (data: z.infer<typeof FlightSearchSchema>) => {
          console.log("search data", data);
      dispatch(fSearchData(data));
      navigation.push("/search")
    }

  return (
    <div className='w-full h-full flex flex-col p-10'>
        <div className='w-full flex gap-5'>
            {tripType.map((item) => (
                <button 
                onClick={() => dispatch(tripChanger(item))} key={item}
                className={`${trip === item? "bg-amber-500":"bg-white/10 backdrop-blur-lg"} text-black text-xl font-semibold capitalize p-2 px-7 rounded-full hover:bg-amber-100/50 transition-all duration-500`}>
                    {item}
                </button>
            ))}

            <button 
                className={`bg-white/10 backdrop-blur-lg text-black text-xl font-semibold capitalize p-2 px-7 rounded-full hover:bg-amber-100/50 transition-all duration-500`}>
                    multi-city
            </button>
        </div>
        <div className=" w-full h-full flex flex-wrap items-end">
            <form className="flex items-end gap-8" onSubmit={handleSubmit(onsubmit)}>
                <div className="flex flex-col gap-y-3">
                    <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">from</label>
                <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                    <Controller
                         name="origin"
                         control={control}
                         render={({ field: {onChange,value} }) => (
                           <Select
                             value={value}
                             onChange={onChange}
                             instanceId="origin-select"
                             options={airportOptions}
                             styles={noBorderStyles}
                             placeholder="Search origin city..."
                             className="text-lg text-black w-70 border-none outline-none"
                             isSearchable={true}
                           />
                            )}
                          />
                </div>
                </div>

                <div className="flex flex-col gap-y-3">
                    <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">to</label>
                <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                    <Controller
                         name="destination"
                         control={control}
                         render={({ field: {onChange,value} }) => (
                           <Select
                             value={value}
                             onChange={onChange}
                             instanceId="destination-select"
                             options={airportOptions}
                             styles={noBorderStyles}
                             placeholder="Search destination city..."
                             className="text-lg text-black w-70 border-none outline-none"
                             isSearchable={true}
                           />
                            )}
                          />
                </div>
                </div>

                <div className="flex flex-col gap-y-3">
                    <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">date</label>
                <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                    <div className="flex flex-col gap-1 border-r border-gray-300 w-[50%]">
                      <label className="text-sm text-gray-500 font-semibold capitalize">depart</label>
                      <input type="date" className="w-30 text-black text-[18px] outline-none" min={today} {...register("date.depart")}/>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-gray-300 w-[50%] px-2">
                      <label className={`${trip === "one-way" && "hidden"} text-sm text-gray-500 font-semibold capitalize`}>return</label>
                      <input type="date" disabled={trip === "one-way"} className={`${trip === "one-way" && "opacity-0"} w-30 text-black text-[18px] outline-none`} min={today} {...register("date.return")}/>
                    </div>
                </div>
                </div>

                <div className="flex flex-col gap-y-3">
                    <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">class</label>
                <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                    <Controller
                    name="class"
                    control={control}
                    render={({field}) => (
                      <select className="w-60 capitalize text-black text-[18px] outline-none" {...field}>
                        <option value="" disabled>Select class</option>
                        {bookingClass.map((item) => (
                          <option className="capitalize" key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    )}
                    />
                </div>
                </div>

                <div className="flex flex-col">
                <div className="flex items-center bg-white h-20 rounded-xl shadow-md shadow-gray-300">
                    <button type="submit" className="w-70 rounded-xl h-full bg-red-700 hover:bg-red-800 hover:-translate-y-2 transition-all duration-500 text-3xl text-white font-semibold capitalize">search flights</button>
                </div>
                </div>
            </form>
        </div>

    </div>
  )
}

export default FlightSearch