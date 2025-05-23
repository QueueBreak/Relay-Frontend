import {createContext} from "react";
import {TypingMap} from "@/types/TypingMap.ts";
import {ChatMessagesMap} from "@/types/ChatMessagesMap.ts";
import {ChatMessage} from "@/types/ChatMessage.ts";

interface ChatStoreContextType {
  chatMessagesMap: ChatMessagesMap;
  typingMap: TypingMap;

  setInitialMessages: (chatRoomId: string, messages: ChatMessage[]) => void;
  appendMessage: (chatRoomId: string, message: ChatMessage) => void;
  prependMessages: (chatRoomId: string, messages: ChatMessage[]) => void;

  setTyping: (chatRoomId: string, userId: string, isTyping: boolean) => void;
}

export const ChatStoreContext = createContext<ChatStoreContextType | null>(null);