import {createContext} from "react";
import {WebSocketMessage} from "@/types/WebSocketMessage.ts";

type WebSocketContextType = {
  send: (message: WebSocketMessage) => void
  isReady: boolean
}

export const WebSocketContext = createContext<WebSocketContextType | null>(null)