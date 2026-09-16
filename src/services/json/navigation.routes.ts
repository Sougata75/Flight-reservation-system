import { AdminRouteType, RouteType } from "@/typescript/interfaces/interface.routes";
import { FileChartColumnIncreasing, LayoutDashboard, PlaneTakeoff, Settings, Ticket, Users } from "lucide-react";


export const routeData: RouteType[] = [
    {
        path: "/",
        routeName: "Book"
    },
    {
        path: "/manage",
        routeName: "Manage"
    },
    {
        path: "/check-in",
        routeName: "Check-in"
    },
    {
        path: "/flight-status",
        routeName: "Flight Status"
    },
    {
        path: "/experience",
        routeName: "Experience"
    }
]

export const adminRouteData: AdminRouteType[] = [
    {
        path: "/admin/dashboard",
        routeName: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        path: "/admin/flights",
        routeName: "Flights",
        icon: PlaneTakeoff
    },
    {
        path: "/admin/bookings",
        routeName: "Bookings",
        icon: Ticket
    },
    {
        path: "/admin/users",
        routeName: "Users",
        icon: Users
    },
    {
        path: "/admin/analytics",
        routeName: "Analytics",
        icon: FileChartColumnIncreasing
    },
    // {
    //     path: "/admin/settings",
    //     routeName: "Settings",
    //     icon: Settings
    // },
]