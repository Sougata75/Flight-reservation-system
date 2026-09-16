"use client";

import { useAdminAnalytics } from "@/hooks/useAdminHooks";
import { Loader2, TrendingUp, TrendingDown, IndianRupee, CreditCard, Activity } from "lucide-react";
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

const chartConfig = {
  revenue: {
    label: "Revenue (₹)",
    color: "#d9232d", 
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d9232d] mb-4" />
        <p className="text-gray-500 font-bold">Analyzing flight data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-500 font-bold">Failed to load analytics data.</p>
      </div>
    );
  }

  const isGrowthPositive = data.growth >= 0;

  return (

    <div className="w-full h-[90vh] p-6 flex flex-col gap-5 font-sans overflow-hidden">
      
      <div className="shrink-0">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Analytics Overview</h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">Track your revenue and booking performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        
        <Card className="rounded-[1.25rem] border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Month</CardTitle>
            <div className="w-7 h-7 bg-green-50 rounded-full flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-gray-900 truncate">
              ₹{data.currentMonthRevenue.toLocaleString('en-IN')}
            </div>
            <p className={`text-[11px] font-bold mt-1.5 flex items-center gap-1 ${isGrowthPositive ? 'text-green-600' : 'text-red-500'}`}>
              {isGrowthPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isGrowthPositive ? "+" : ""}{data.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.25rem] border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Month</CardTitle>
            <div className="w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-gray-900 truncate">
              ₹{data.lastMonthRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] font-bold mt-1.5 text-gray-400">
              Previous billing cycle
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.25rem] border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lifetime Rev</CardTitle>
            <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
              <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-gray-900 truncate">
              ₹{data.totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] font-bold mt-1.5 text-gray-400">
              All time gross volume
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.25rem] border-gray-200 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-1">
            <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bookings</CardTitle>
            <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-gray-900">
              {data.totalBookings.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] font-bold mt-1.5 text-gray-400">
              Active reservations
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Revenue Chart - Flex-1 makes it fill only the remaining space */}
      <Card className="rounded-[1.5rem] border-gray-200 shadow-sm bg-white flex flex-col flex-1 min-h-0">
        <CardHeader className="p-5 pb-0 shrink-0">
          <CardTitle className="text-lg font-black text-gray-900">Revenue Growth</CardTitle>
          <CardDescription className="text-xs font-medium">Performance over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-4 flex-1 min-h-0">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <AreaChart 
              accessibilityLayer 
              data={data.chartData} 
              margin={{ top: 10, left: -20, right: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f4f5f7" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                className="text-[10px] font-bold fill-gray-400"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                className="text-[10px] font-bold fill-gray-400"
                width={60}
              />
              <ChartTooltip 
                cursor={{ stroke: '#d9232d', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={<ChartTooltipContent indicator="dot" />} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                activeDot={{ r: 5, fill: '#d9232d', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
    </div>
  );
}