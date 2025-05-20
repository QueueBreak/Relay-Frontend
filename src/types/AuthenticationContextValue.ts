import {AuthenticatedUser} from "@/types/AuthenticatedUser.ts";

export interface AuthenticationContextValue {
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthenticatedUser | null) => void
  logout: () => void
}