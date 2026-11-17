import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useHydration } from "./useHydration";

export const useAuthInit = () => {
  const { initializeAuth, isLoading, isAuthenticated } = useAuthStore();
  const isHydrated = useHydration();

  useEffect(() => {
    // Only initialize auth after hydration
    if (isHydrated) {
      initializeAuth();
    }
  }, [isHydrated, initializeAuth]);

  return { isLoading: isLoading || !isHydrated, isAuthenticated };
};
