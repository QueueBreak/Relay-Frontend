import {ChatMessage} from "@/types/ChatMessage.ts";
import {TypingMessage} from "@/types/TypingMessage.ts";
import {OutgoingChatMessage} from "@/types/OutgoingChatMessage.ts";
import {OutgoingTypingMessage} from "@/types/OutgoingTypingMessage.ts";
import {CreateChatRoomResponse} from "@/types/CreateChatRoomResponse.ts";

export interface WebSocketMessage {
  type: string
  payload: ChatMessage | TypingMessage | OutgoingChatMessage | OutgoingTypingMessage | CreateChatRoomResponse
}