import { Loader2 } from "lucide-react"

interface LoaderProps {
  fullscreen?: boolean
  className?: string
}

export default function Loader({ fullscreen = true, className = "" }: LoaderProps) {
  const base = fullscreen
    ? "flex items-center justify-center h-screen w-full"
    : "flex items-center justify-center w-full py-4"

  return (
    <div className={`${base} ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
    </div>
  )
}