import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useAdminBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          outbound_flight:flights!outbound_flight_id (
            flight_number, origin, destination, schedule
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    },
  });

  return { bookings, isLoading, isError, updateStatusMutation };
};



export const useAdminUsers = () => {
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("users data",data)
      return data || [];
    },
  });

  return { users, isLoading, isError };
};


export const useAdminAnalytics = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("total_price, created_at, status");

      if (error) throw error;

      const activeBookings = bookings?.filter(b => b.status?.toLowerCase() !== "cancelled") || [];

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      let currentMonthRevenue = 0;
      let lastMonthRevenue = 0;
      let totalRevenue = 0;

      const chartDataMap: Record<string, number> = {};
      const chartLabels: string[] = [];
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
        chartDataMap[label] = 0;
        chartLabels.push(label);
      }

      activeBookings.forEach((b) => {
        const date = new Date(b.created_at);
        const m = date.getMonth();
        const y = date.getFullYear();
        const price = Number(b.total_price) || 0;

        totalRevenue += price;

        if (m === currentMonth && y === currentYear) {
          currentMonthRevenue += price;
        }
        if (m === lastMonth && y === lastMonthYear) {
          lastMonthRevenue += price;
        }

        const label = date.toLocaleString("default", { month: "short", year: "2-digit" });
        if (chartDataMap[label] !== undefined) {
          chartDataMap[label] += price;
        }
      });

      let growth = 0;
      if (lastMonthRevenue === 0 && currentMonthRevenue > 0) {
        growth = 100;
      } else if (lastMonthRevenue > 0) {
        growth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
      }

      const chartData = chartLabels.map(label => ({
        month: label,
        revenue: chartDataMap[label]
      }));

      return {
        totalRevenue,
        currentMonthRevenue,
        lastMonthRevenue,
        growth: Number(growth.toFixed(1)),
        totalBookings: activeBookings.length,
        chartData
      };
    },
  });

  return { data, isLoading, isError };
};