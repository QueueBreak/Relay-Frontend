import {ChatMessage} from "@/types/ChatMessage.ts";
import {TypingMessage} from "@/types/TypingMessage.ts";

export interface WebSocketMessage {
  type: string
  payload: ChatMessage | TypingMessage
}