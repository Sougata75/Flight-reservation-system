import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/hooks/useRedux";
import { CheckInForm } from "@/services/validation/passenger.validation";
import { BookingPayload, SearchParams, UpgradeParams } from "@/typescript/interfaces/userData.interface";


export const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (payload: BookingPayload) => {
      const bookingRecord = {
        user_id: payload.userId,
        outbound_flight_id: payload.outboundFlightId,
        return_flight_id: payload.returnFlightId,
        contact_email: payload.contactEmail,
        contact_phone: payload.contactPhone,
        passengers: payload.passengers,
        total_price: payload.totalPrice,
        payment_id: payload.paymentId,
        status: "confirmed"
      };

      const { data, error } = await supabase.from("bookings").insert(bookingRecord).select().single();
      if (error) throw error;
      return data;
    }
  });
};

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch Stripe secret");
      return data.clientSecret as string;
    }
  });
};

export const useLatestBooking = () => {
  const { isLoggedIn, isAuthLoading } = useAppSelector((state: any) => state.global);

  return useQuery({
    queryKey: ["latestBooking", "ticket"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:outbound_flight_id (
            flight_number, origin, destination, schedule, aircraft_model
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    },
    enabled: !isAuthLoading && isLoggedIn, 
  });
};


interface CheckInParams {
  pnr: string;
  lastName: string;
}

export const useCheckIn = () => {
  return useMutation({
    mutationFn: async ({ pnr, lastName }: CheckInForm) => {
      const numericId = pnr.replace(/\D/g, "");
      
      if (!numericId) {
        throw new Error("Invalid Booking Reference format. Must contain your booking number.");
      }

      const { data: booking, error: dbError } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", parseInt(numericId))
        .single();

      if (dbError || !booking) {
        throw new Error("We couldn't find a booking with that reference.");
      }

      const passengers = booking.passengers || [];
      const nameMatches = passengers.some((p: any) => 
        p.lastName.toLowerCase() === lastName.toLowerCase()
      );

      if (!nameMatches) {
        throw new Error("The last name does not match the booking reference.");
      }

      return booking.id;
    }
  });
};


export const useManageCheckIn = (bookingId: string) => {
  const queryClient = useQueryClient();
  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID provided");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:outbound_flight_id (
            flight_number, origin, destination, schedule, aircraft_model
          )
        `)
        .eq("id", parseInt(bookingId))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bookingId,
  });

  const confirmCheckInMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "checked_in" })
        .eq("id", parseInt(bookingId));

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    }
  });

  return { 
    booking, 
    isLoading, 
    isError, 
    confirmCheckInMutation 
  };
};


export const useBoardingPass = (bookingId: string) => {
  return useQuery({
    queryKey: ["boardingPass", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("No booking ID provided");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:outbound_flight_id (
            flight_number, origin, destination, schedule, aircraft_model
          )
        `)
        .eq("id", parseInt(bookingId))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bookingId,
  });
};




export const useManageBooking = (isLoggedIn: boolean, isAuthLoading: boolean) => {
  const queryClient = useQueryClient();

  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ["latestBooking"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:outbound_flight_id (
            flight_number, origin, destination, aircraft_model
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; 
      return data || null;
    },
    enabled: !isAuthLoading && isLoggedIn,
  });

  const upgradeMutation = useMutation({
    mutationFn: async ({ bookingId, newSeat, passengers }: UpgradeParams) => {
      const updatedPassengers = [...passengers];
      updatedPassengers[0].seat = newSeat;

      const { error } = await supabase
        .from("bookings")
        .update({ passengers: updatedPassengers })
        .eq("id", bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["latestBooking"] });
    }
  });

  return { booking, isLoading, isError, upgradeMutation };
};


export const useFlightStatus = () => {
  return useMutation({
    mutationFn: async ({ flightNumber, date }: SearchParams) => {
      const { data, error } = await supabase
        .from("flights")
        .select("*")
        .ilike("flight_number", flightNumber.trim())
        .single();

      if (error || !data) {
        throw new Error("Flight not found in the database. Please verify the flight number.");
      }

      return {
        flight_number: data.flight_number,
        status: data.status || "On Time",
        origin: { code: data.origin, city: data.origin, terminal: "5", gate: "A10" },
        destination: { code: data.destination, city: data.destination, terminal: "2", gate: "TBA", baggage: "Belt 4" },
        schedule: {
          departure_time: data.schedule?.departure_time || `${date}T10:30:00Z`,
          arrival_time: data.schedule?.arrival_time || `${date}T00:15:00Z`,
          estimated_arrival: data.schedule?.arrival_time || `${date}T23:50:00Z`
        },
        aircraft: data.aircraft_model || "Boeing 787-9 Dreamliner",
        progress: 65
      };
    },
  });
};


export const useTicketData = (bookingId: string) => {
  return useQuery({
    queryKey: ["ticketData", bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error("Booking ID is required");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:flights!outbound_flight_id(*)
        `)
        .eq("id", bookingId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bookingId,
  });
};