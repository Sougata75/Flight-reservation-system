import Cookies from "js-cookie";

export const getAccessToken = () => {
  if (typeof window === "undefined") return null; // Prevents Next.js server crashes
  return Cookies.get("access_token");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("refresh_token");
};

export const getUserData = () => {
  if (typeof window === "undefined") return null;
  
  const rawData = Cookies.get("user_data");
  
  if (rawData) {
    try {
      return JSON.parse(rawData); // Safely parses the retrieved string
    } catch (error) {
      console.error("Failed to parse user cookie", error);
      return null;
    }
  }
  
  return null;
};