import {ReactNode, useEffect, useState} from "react";
import {AuthenticatedUser} from "@/types/AuthenticatedUser.ts";
import {getCurrentUser} from "@/api/users.ts";
import {AuthContext} from "@/features/auth/AuthContext.tsx";

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setIsLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch {
        localStorage.removeItem("access_token")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser();
  }, [])

  const logout = () => {
    localStorage.removeItem("access_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      setUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}