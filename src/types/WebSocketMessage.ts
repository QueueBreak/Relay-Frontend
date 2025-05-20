import {ChatMessage} from "@/types/ChatMessage.ts";

export interface WebSocketMessage {
  type: string
  payload: ChatMessage
}