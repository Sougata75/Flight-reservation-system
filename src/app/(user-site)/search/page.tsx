"use client";
import { useSearchFlight } from "@/hooks/useFlightData";
import { useAppSelector } from "@/hooks/useRedux";
import { FlightSearchSchema } from "@/services/validation/flightSearch.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useAppDispatch } from "@/hooks/useRedux";
import { fSearchData, tripChanger } from "@/store/slices/global.slice";
import { airport } from "aviation-codes";
import { bookingClass, tripType } from "@/services/json/flights.table";
import { z } from "zod";
import FlightSearch from "@/components/user/book/FlightSearch";
import SearchFlightResult from "@/components/user/book/SearchFlightResult";

function FlightSearchResulte() {
  const dispatch = useAppDispatch();
  const { flightSearchData, trip } = useAppSelector((state) => state.global);

  const today = new Date().toISOString().split("T")[0];

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
      border: "none",
      boxShadow: "none",
      "&:hover": { border: "none" }
    })
  };

  const {
    register,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<z.input<typeof FlightSearchSchema>>({
    resolver: zodResolver(FlightSearchSchema),
    defaultValues: {
      origin: undefined,
      destination: undefined,
      date: {
        depart: "",
        return: "",
      },
      class: "",
    },
  });

  const onsubmit = (data: z.infer<typeof FlightSearchSchema>) => {
          console.log("search data", data);
      dispatch(fSearchData(data));
    }

  return (
    <>

    <section className="w-full border-b border-gray-200 shadow-sm z-10 px-8 py-5">
        
        {/* Trip Type Toggles */}
        <div className="flex gap-3 mb-5">
          {tripType.map((item) => (
            <button
              key={item}
              onClick={() => dispatch(tripChanger(item))}
              className={`px-5 py-1.5 text-sm font-bold rounded-full capitalize transition-all duration-300 ${
                trip === item
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Horizontal Form Container */}
        {/* Note: Drop your React Hook Form <form onSubmit={...}> tag right here */}
        {/* Your Exact Form UI */}
        <div className="w-full h-full flex flex-wrap justify-center pb-4">
          <form className="flex items-end gap-8" onSubmit={handleSubmit(onsubmit)}>
            
            {/* FROM */}
            <div className="flex flex-col gap-y-3">
              <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">from</label>
              <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                <Controller
                  name="origin"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      instanceId="origin-select"
                      options={airportOptions} // REPLACE WITH: airportOptions
                      styles={noBorderStyles}
                      placeholder="Search origin city..."
                      className="text-lg text-black w-90 border-none outline-none"
                      isSearchable={true}
                    />
                  )}
                />
              </div>
            </div>

            {/* TO */}
            <div className="flex flex-col gap-y-3">
              <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">to</label>
              <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                <Controller
                  name="destination"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      instanceId="destination-select"
                      options={airportOptions} // REPLACE WITH: airportOptions
                      styles={noBorderStyles}
                      placeholder="Search destination city..."
                      className="text-lg text-black w-90 border-none outline-none"
                      isSearchable={true}
                    />
                  )}
                />
              </div>
            </div>

            {/* DATE */}
            <div className="flex flex-col gap-y-3">
              <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">date</label>
              <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300 min-w-75">
                <div className="flex flex-col gap-1 border-r border-gray-300 w-[50%] pr-2">
                  <label className="text-sm text-gray-500 font-semibold capitalize">depart</label>
                  <input type="date" className="w-full text-black text-[18px] outline-none bg-transparent" min={today} {...register("date.depart")} />
                </div>
                <div className="flex flex-col gap-1 border-l border-gray-300 w-[50%] pl-4">
                  <label className={`${trip === "one-way" ? "opacity-50" : ""} text-sm text-gray-500 font-semibold capitalize`}>return</label>
                  <input type="date" disabled={trip === "one-way"} className={`${trip === "one-way" ? "opacity-30" : ""} w-full text-black text-[18px] outline-none bg-transparent`} min={today} {...register("date.return")} />
                </div>
              </div>
            </div>

            {/* CLASS */}
            <div className="flex flex-col gap-y-3">
              <label className="text-xl uppercase text-gray-700 font-bold tracking-widest">class</label>
              <div className="flex items-center bg-white p-5 h-20 rounded-xl shadow-md shadow-gray-300">
                <Controller
                  name="class"
                  control={control}
                  render={({ field }) => (
                    <select className="w-65 capitalize text-black text-[18px] outline-none bg-transparent cursor-pointer" {...field}>
                      <option value="" disabled>Select class</option>
                      {bookingClass.map((item) => (
                        <option key={item} value="item">{item}</option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex flex-col">
              <div className="flex items-center bg-white h-20 rounded-xl shadow-md shadow-gray-300">
                <button type="submit" className="w-74 px-8 rounded-xl h-full bg-red-700 hover:bg-red-800 hover:-translate-y-2 transition-all duration-500 text-3xl text-white font-semibold capitalize whitespace-nowrap">
                  modify search
                </button>
              </div>
            </div>

          </form>
        </div>
      </section>

      <section className="py-6.25">
        <SearchFlightResult />
      </section>
    </>
  );
}

export default FlightSearchResulte;
