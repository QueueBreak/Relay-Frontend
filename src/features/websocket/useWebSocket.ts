import {useContext} from "react";
import {WebSocketContext} from "@/features/websocket/WebSocketContext.tsx";

export function useWebSocket() {
  const ctx = useContext(WebSocketContext)
  if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider")
  return ctx
}