"use client";
import { useEffect, useState } from "react";
import { routeData } from "@/services/json/navigation.routes";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { CircleQuestionMark, Globe } from "lucide-react";
import { VideoText } from "@/components/ui/video-text";
import { useSignOut } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setAuthStatus } from "@/store/slices/global.slice";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});

function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const logoUrl = "https://media.istockphoto.com/id/2217012106/video/a-beautiful-airplane-wing-view-flying-above-morning-clouds-with-sunrise-light-representing.mp4?s=mp4-640x640-is&k=20&c=wnGe2GG8WivHM1NHtVlrZePwgOlD9s5wKAOySqpdSgE=";
  
  const { mutate: signOut } = useSignOut();
  
  const dispatch = useAppDispatch();
  const { isLoggedIn, isAuthLoading } = useAppSelector((state: any) => state.global);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      const { data } = await supabase
        .from("Users")
        .select("name, email")
        .eq("auth_user_id", userId)
        .single();
      if (data) {
        setUserData(data);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setAuthStatus(!!session));
      if (session?.user) {
        setUserData({ name: session.user.user_metadata?.full_name || "User", email: session.user.email || "" });
        fetchUserData(session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      dispatch(setAuthStatus(!!session));
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  const getInitials = () => {
    if (!userData?.name || userData.name === "User") {
      return userData?.email ? userData.email.charAt(0).toUpperCase() : "U";
    }
    const parts = userData.name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className={`w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 px-6 lg:px-12 h-20 flex justify-between items-center ${plusJakartaSans.variable} font-sans shadow-sm transition-all`}>
      
      <div className="flex items-center">
        <div className="relative h-14 w-32 overflow-hidden flex items-center">
          <VideoText src={logoUrl}>
            NextFly
          </VideoText>
        </div>
      </div>

      <nav className="hidden lg:flex items-center gap-24">
        {routeData.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative text-sm font-bold transition-all duration-300 py-2 ${
                isActive 
                  ? "text-red-700" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.routeName}
              {isActive && (
                <span className="absolute -bottom-5.5 left-0 w-full h-1 bg-red-700 rounded-t-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 text-gray-400">
          <button className="hover:text-red-700 transition-colors focus:outline-none">
            <Globe size={22} />
          </button>
          <button className="hover:text-red-700 transition-colors focus:outline-none">
            <CircleQuestionMark size={22} />
          </button>
        </div>
        
        <div className="w-px h-6 bg-gray-200 hidden md:block mx-1"></div>
        
        {isAuthLoading ? (
          <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-xl"></div>
        ) : isLoggedIn ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 bg-red-50 border border-red-300 rounded-full flex items-center justify-center text-red-700 font-black text-sm hover:bg-red-700 hover:text-white transition-all shadow-sm focus:outline-none ring-2 ring-transparent focus:ring-red-100"
            >
              {getInitials()}
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {userData?.name || "Voyager"}
                    </p>
                    <p className="text-xs font-medium text-gray-500 truncate">
                      {userData?.email || "Account Active"}
                    </p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors"
                    >
                      Go to Profile
                    </button>
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <button 
            onClick={() => router.push("/authentication")} 
            className="bg-red-700 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:bg-red-800 transition-all duration-300 shadow-md shadow-red-900/10 whitespace-nowrap"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;