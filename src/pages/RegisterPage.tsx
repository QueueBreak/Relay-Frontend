import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import * as React from "react"
import {useState} from "react"
import {Link, Navigate, useNavigate} from "react-router";
import {useAuth} from "@/features/auth/useAuth.ts";
import Loader from "@/components/custom/Loader.tsx";
import {register} from "@/api/auth.ts";
import {getCurrentUser} from "@/api/users.ts";

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const {isAuthenticated, isLoading, setUser} = useAuth()

  if (isLoading) return <Loader/>

  if (isAuthenticated) {
    return <Navigate to="/" replace/>
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !displayName || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      const {token} = await register({email, displayName, password})
      localStorage.setItem("access_token", token)

      const user = await getCurrentUser()
      setUser(user)

      navigate("/", {replace: true})
    } catch {
      alert("Failed to register")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background px-4">
      <form
        onSubmit={handleRegister}
        className="bg-card p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Join Relay</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="john_doe@yahoo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            placeholder="john_doe"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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

        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}