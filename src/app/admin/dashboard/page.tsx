"use client";

import { useFlightFetch } from "@/hooks/useFlightData";
import { useAppSelector } from "@/hooks/useRedux";
import FlightStats from "@/components/admin/FlightStats"; 
import { 
  Users as UsersIcon, 
  Ticket, 
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAdminAnalytics, useAdminBookings, useAdminUsers } from "@/hooks/useAdminHooks";

const chartConfig = {
  revenue: {
    label: "Revenue (₹)",
    color: "#d9232d", 
  },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
  const { pagination } = useAppSelector((state) => state.global);
  const { data: flights, isLoading: flightsLoading } = useFlightFetch(pagination.currentPage, 5);
  const { bookings, isLoading: bookingsLoading } = useAdminBookings();
  const { users, isLoading: usersLoading } = useAdminUsers();
  const { data: analyticsData, isLoading: analyticsLoading } = useAdminAnalytics();

  const isLoading = flightsLoading || bookingsLoading || usersLoading || analyticsLoading;

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "confirmed" || s === "completed") {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[9px] font-bold uppercase tracking-widest border border-green-100">
          <CheckCircle2 className="w-3 h-3" /> Confirmed
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[9px] font-bold uppercase tracking-widest border border-red-100">
          <XCircle className="w-3 h-3" /> Cancelled
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-[9px] font-bold uppercase tracking-widest border border-yellow-100">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  };

  return (
    <div className="w-full h-[90vh] p-6 flex flex-col gap-5 font-sans overflow-hidden">
      
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Welcome back, Admin. Here is what is happening across NextFly today.</p>
        </div>
        
        <Link 
          href="/admin/analytics"
          className="px-4 py-2 bg-[#d9232d] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-800 transition-colors shadow-md shadow-red-900/20 flex items-center gap-1.5"
        >
          Full Analytics <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="shrink-0">
        <FlightStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">

        <Card className="rounded-[1.5rem] border-gray-200 shadow-sm bg-white flex flex-col lg:col-span-2 min-h-0">
          <CardHeader className="p-4 pb-0 shrink-0">
            <CardTitle className="text-base font-black text-gray-900">Revenue Growth</CardTitle>
            <CardDescription className="text-xs font-medium">Performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2 flex-1 min-h-0">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#d9232d]" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <AreaChart 
                  accessibilityLayer 
                  data={analyticsData?.chartData || []} 
                  margin={{ top: 10, left: -25, right: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f4f5f7" />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    className="text-[10px] font-bold fill-gray-400"
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                    className="text-[10px] font-bold fill-gray-400"
                    width={50}
                  />
                  <ChartTooltip 
                    cursor={{ stroke: '#d9232d', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={<ChartTooltipContent indicator="dot" />} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#dashboardRevenue)" 
                    activeDot={{ r: 4, fill: '#d9232d', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5 min-h-0 lg:col-span-1">
          
          <div className="bg-white border border-gray-200 rounded-[1.5rem] p-4 shadow-sm flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-[#d9232d]">
                  <Ticket className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">Recent Bookings</h2>
              </div>
              <Link href="/admin/bookings" className="text-[11px] font-bold text-[#d9232d] hover:underline flex items-center gap-0.5">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-gray-50 text-xs">
                  {bookingsLoading ? (
                    <tr>
                      <td className="py-4 text-center text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : bookings?.slice(0, 3).map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold text-gray-900">
                        {booking.id.toString().slice(0, 6).toUpperCase()}
                      </td>
                      <td className="py-2.5 font-medium text-gray-600 truncate max-w-22.5 capitalize">
                        {booking.passengers?.[0]?.firstName || "Guest"}
                      </td>
                      <td className="py-2.5 font-black text-[#d9232d]">
                        ₹{Number(booking.total_price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 text-right">
                        {getStatusBadge(booking.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[1.5rem] p-4 shadow-sm flex flex-col flex-1 min-h-0">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <UsersIcon className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-black text-gray-900 tracking-tight">Recent Users</h2>
              </div>
              <Link href="/admin/users" className="text-[11px] font-bold text-[#d9232d] hover:underline flex items-center gap-0.5">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-gray-50 text-xs">
                  {usersLoading ? (
                    <tr>
                      <td className="py-4 text-center text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : users?.slice(0, 3).map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 font-bold text-gray-900 capitalize truncate max-w-25">
                        {user.name || "Unknown"}
                      </td>
                      <td className="py-2.5 font-medium text-gray-400 text-[11px] truncate max-w-110">
                        {user.email}
                      </td>
                      <td className="py-2.5 text-right">
                        {user.user_role?.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[8px] font-bold uppercase tracking-widest border border-purple-100">
                            <ShieldCheck className="w-2.5 h-2.5" /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[8px] font-bold uppercase tracking-widest border border-gray-200">
                            Regular
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}