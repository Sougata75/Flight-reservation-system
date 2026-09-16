import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface UpgradeParams {
  bookingId: string;
  newSeat: string;
  passengers: any[];
}

export const useManageBookings = (isLoggedIn: boolean, isAuthLoading: boolean) => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["manageBookings"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:flights!outbound_flight_id (
            flight_number, origin, destination, aircraft_model, schedule
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error && error.code !== 'PGRST116') throw error; 
      return data || [];
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
      queryClient.invalidateQueries({ queryKey: ["manageBookings"] });
    }
  });

  return { bookings, isLoading, isError, upgradeMutation };
};