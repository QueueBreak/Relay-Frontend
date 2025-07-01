import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import * as React from "react"
import {useState} from "react"
import {login} from "@/api/auth"
import {Link, Navigate, useNavigate} from "react-router";
import {getCurrentUser} from "@/api/users.ts";
import {useAuth} from "@/features/auth/useAuth.ts";
import Loader from "@/components/custom/Loader.tsx";

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const {isAuthenticated, isLoading, setUser} = useAuth()

  if (isLoading) return <Loader />

  if (isAuthenticated) {
    return <Navigate to="/" replace/>
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return

    try {
      setLoading(true)
      const {token} = await login({email, password})
      localStorage.setItem("access_token", token)

      const user = await getCurrentUser()
      setUser(user)

      navigate("/", {replace: true})
    } catch {
      alert("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background px-4">
      <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <h1 className="text-2xl font-semibold text-center">Welcome to Relay</h1>

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              // type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}