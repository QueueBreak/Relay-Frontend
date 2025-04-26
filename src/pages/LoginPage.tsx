import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {Link, useNavigate} from "react-router";
import * as React from "react";

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    // 🧪 Fake login logic
    if (username && password) {
      navigate(`/`)
    } else {
      alert("Please enter username and password")
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-background px-4">
      <div className="bg-card p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Welcome to Relay</h1>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="john_doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <Button className="w-full" type="submit">
            Log In
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