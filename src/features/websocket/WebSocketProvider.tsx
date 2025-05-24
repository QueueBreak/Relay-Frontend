import {useAuth} from "@/features/auth/useAuth.ts";
import {useEffect, useRef, useState} from "react";
import {WebSocketContext} from "@/features/websocket/WebSocketContext.tsx";
import {WebSocketMessage} from "@/types/WebSocketMessage.ts";
import {useChatStore} from "@/features/messagestore/useChatStore.ts";
import {useChatRoomStore} from "@/features/chatroomsstore/useChatRoomStore.tsx";
import {useParams} from "react-router";
import {ChatMessage} from "@/types/ChatMessage.ts";
import {TypingMessage} from "@/types/TypingMessage.ts";

export function WebSocketProvider({children}: { children: React.ReactNode }) {
  const {user} = useAuth()
  const {appendMessage, setTyping} = useChatStore();
  const {updateChatRoomPreview} = useChatRoomStore();
  const [isReady, setIsReady] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const { chatId } = useParams<{ chatId: string }>();
  const chatIdRef = useRef<string>(chatId);

  useEffect(() => {
    chatIdRef.current = chatId ?? "";
  }, [chatId]);

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token || !user) return

    const socket = new WebSocket(`ws://localhost:8080/ws/v1/chat?token=${token}`)
    socketRef.current = socket

    socket.onopen = () => {
      console.log("Connected")
      setIsReady(true)
    }

    socket.onclose = () => {
      console.log("Disconnected")
      setIsReady(false)
    }

    socket.onerror = console.error

    socket.onmessage = (event) => {
      try {
        const webSocketMessage: WebSocketMessage = JSON.parse(event.data)

        switch (webSocketMessage.type) {
          case "chat": {
            const chatMessage = webSocketMessage.payload as ChatMessage;

            updateChatRoomPreview(
              chatMessage.destinationChatRoomId,
              chatMessage.messageContent,
              chatMessage.timestamp,
              chatIdRef.current
            );
            appendMessage(chatMessage.destinationChatRoomId, chatMessage)

            break
          }
          case "typing": {
            const typingMessage = webSocketMessage.payload as TypingMessage;

            setTyping(
              typingMessage.destinationChatRoomId,
              typingMessage.senderUserAccountId,
              typingMessage.typing
            );
            break;
          }
          // case "presence":
          //   console.log("presence")
          //   break
          default:
            console.warn("Unknown message type:", webSocketMessage)
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message", e)
      }
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [appendMessage, setTyping, updateChatRoomPreview, user])

  const send = (msg: WebSocketMessage) => {
    const socket = socketRef.current
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg))
    } else {
      console.warn("Socket not ready")
    }
  }

  return (
    <WebSocketContext.Provider value={{send, isReady}}>
      {children}
    </WebSocketContext.Provider>
  )
}