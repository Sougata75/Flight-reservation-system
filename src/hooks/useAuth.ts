import { supabase } from "@/lib/supabaseClient"
import { SignInType, SignUpType } from "@/typescript/interfaces/auth.interface"
import { useMutation, useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"


export const useAuthentication = () => {
    return useMutation({
        mutationKey:["sign-up"],
        mutationFn: async (data:SignUpType) => {
            const {data:authData, error:authError} = await supabase.auth.signUp({
               email: data.email,
               phone: data.phone,
               password: data.password,
            });

            if(authError){
                throw new Error(`Auth failed: ${authError.message}`);
            }

            if(!authData.user){
                throw new Error(`Signup failed`)
            }

            const userProfilePayload = {
                auth_user_id: authData.user.id,
                name: data.name,
                phone: data.phone,
                email: data.email,
                password: data.password,
                user_role: data.role,
            } 

            const {error:dbError} = await supabase.from("Users").insert([userProfilePayload]);

            if(dbError){
                throw new Error(dbError.message);
            }
            return authData.user;
        }
    })
}

export const useSignIn = () => {
    return useMutation({
        mutationKey: ["sign-in"],
        mutationFn: async (data: SignInType) => {
            const {data:authData , error: authError} = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password
            })

            if(authError){
                throw new Error("Signin failed")
            }

            if(!authData.session || !authData.user){
                throw new Error("No session returned");
            }

            const {data:profileRole,error:profileError} = await supabase.from("Users").select("user_role").eq("auth_user_id",authData.user.id).single();

            if(profileError) throw new Error(profileError.message);
            const role = profileRole.user_role.member_type;

            Cookies.set("user_role",role, {path: "/"});
            Cookies.set("access_token",authData.session.access_token, {path: "/"});
            Cookies.set("refresh_token",authData.session.refresh_token, {path: "/"});

            return {Session: authData.session, profileRole};
        }
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationKey: ["sign-out"],
        mutationFn: async () => {
            const {error} = await supabase.auth.signOut();

            if(error){
                throw new Error("Sign Out failed",error)
            }

            Cookies.remove("user_role");
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
        }
    })
}


export const useUserProfile = (isLoggedIn: boolean) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("Users")
        .select("name, email")
        .eq("auth_user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      return data || { name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User" };
    },
    enabled: isLoggedIn,
  });
};


export const useProfileData = () => {
  return useQuery({
    queryKey: ["profileData"],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");

      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (userError && userError.code !== "PGRST116") throw userError;

      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;

      let bookings = bookingsData || [];

      if (bookings.length > 0) {
        const flightIds = [...new Set(bookings.map(b => b.outbound_flight_id))];
        const { data: flightsData } = await supabase
          .from("flights")
          .select("*")
          .in("id", flightIds);

        if (flightsData) {
          bookings = bookings.map(b => ({
            ...b,
            outbound_flight: flightsData.find(f => f.id === b.outbound_flight_id) || null
          }));
        }
      }

      return {
        profile: userData || { name: user.user_metadata?.full_name || "User", email: user.email },
        bookings
      };
    }
  });
};