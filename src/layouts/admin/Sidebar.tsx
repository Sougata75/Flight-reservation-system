"use client"
import { adminRouteData } from "@/services/json/navigation.routes"
import Link from "next/link"
import { usePathname } from "next/navigation"

function Sidebar() {
  const pathLocation = usePathname()

  return (
    <div className="w-80 h-[94vh] flex flex-col bg-white border-r border-gray-100 py-6 fixed left-0 top-18.75 shadow-sm select-none">
      <div className="px-8 pb-6 mb-2 border-b border-gray-100">
        <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Navigation</span>
      </div>

      <div className="flex flex-col gap-1.5 px-4 flex-1">
        {adminRouteData.map((item) => {
          const isActive = pathLocation === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.routeName} href={item.path}>
              <div className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? "bg-red-50 text-[#d9232d] shadow-sm shadow-red-900/5" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? "bg-[#d9232d] text-white shadow-md shadow-red-900/20" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-900"
                  }`}>
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-sm font-bold tracking-tight ${isActive ? "text-[#d9232d]" : "text-gray-700 group-hover:text-gray-900"}`}>
                    {item.routeName}
                  </span>
                </div>

                {isActive && (
                  <div className="w-1.5 h-6 bg-[#d9232d] rounded-full"></div>
                )}
              </div>
            </Link>
          )  
        })}
      </div>

      <div className="px-8 pt-4 border-t border-gray-100 mt-auto">
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900">NextFly v2.4</span>
            <span className="text-[10px] font-medium text-gray-400">System Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar