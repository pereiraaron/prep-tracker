import { useAuthStore } from "@store/useAuthStore";
import { useShallow } from "zustand/react/shallow";

const useAuth = () =>
  useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isAuthenticated: s.isAuthenticated,
      isHydrated: s.isHydrated,
      isLoading: s.isLoading,
      error: s.error,
      login: s.login,
      signup: s.signup,
      socialLogin: s.socialLogin,
      passkeyLogin: s.passkeyLogin,
      passkeyConditionalLogin: s.passkeyConditionalLogin,
      logout: s.logout,
      clearError: s.clearError,
      hydrate: s.hydrate,
    })),
  );

export default useAuth;
