"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, HelpCircle, LogOut, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setAuthStatus } from "@/store/slices/global.slice";
import { useSignOut } from "@/hooks/useAuth"; 

function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { profileData } = useAppSelector((state) => state.global);
  const { mutate: signOut, isPending } = useSignOut();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(undefined, {
      onSuccess: () => {
        dispatch(setAuthStatus(false));
        setDropdownOpen(false);
        router.push("/authentication");
        router.refresh();
      },
      onError: (error) => {
        console.error(error.message);
      }
    });
  };

  const userObj = Array.isArray(profileData) ? profileData[0] : profileData;
  const displayName = userObj?.name || userObj?.email || "Admin User";
  
  const getInitials = (fullName: string, email: string) => {
    if (!fullName || fullName === "User") {
      return email ? email.charAt(0).toUpperCase() : "A";
    }
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const initials = getInitials(userObj?.name, userObj?.email);

  return (
    <div className="w-full bg-transparent flex justify-between font-sans">
      <div className="w-full flex justify-between items-center bg-white px-8 py-4 border-b border-gray-100 shadow-sm">
        
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Control Center</span>
        </div>

        <div className="flex items-center gap-6">
          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
            <Bell className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-red-50 border border-red-100 text-[#d9232d] flex items-center justify-center font-black text-sm tracking-wider hover:shadow-md transition-all focus:outline-none"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                
                <div className="px-5 py-3 border-b border-gray-100 flex flex-col">
                  <span className="text-sm font-black text-gray-900 capitalize truncate">{displayName}</span>
                  <span className="text-xs font-medium text-gray-400 truncate mt-0.5">{userObj?.email || "admin@nextfly.com"}</span>
                </div>

                <div className="p-2">
                  <button 
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                    {isPending ? "Logging out..." : "Logout Session"}
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Navbar;