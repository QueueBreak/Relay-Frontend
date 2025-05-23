import {ReactNode, useCallback, useState} from "react";
import {ChatMessagesMap} from "@/types/ChatMessagesMap.ts";
import {TypingMap} from "@/types/TypingMap.ts";
import {ChatMessage} from "@/types/ChatMessage.ts";
import {ChatStoreContext} from "@/features/messagestore/ChatStoreContext.tsx";

export function ChatStoreProvider({children}: { children: ReactNode }) {
  const [chatMessagesMap, setChatMessagesMap] = useState<ChatMessagesMap>({});
  const [typingMap, setTypingMap] = useState<TypingMap>({});

  const setInitialMessages = useCallback((chatRoomId: string, messages: ChatMessage[]) => {
    setChatMessagesMap(prev => ({...prev, [chatRoomId]: messages}));
  }, []);

  const appendMessage = useCallback((chatRoomId: string, msg: ChatMessage) => {
    setChatMessagesMap(prev => {
      if (!(chatRoomId in prev)) {
        return prev;
      }

      return {
        ...prev,
        [chatRoomId]: [...(prev[chatRoomId] ?? []), msg],
      };
    });
  }, []);

  const prependMessages = useCallback((chatRoomId: string, messages: ChatMessage[]) => {
    setChatMessagesMap(prev => {
      if (!(chatRoomId in prev)) {
        return prev;
      }

      return {
        ...prev,
        [chatRoomId]: [...messages, ...(prev[chatRoomId] ?? [])],
      };
    });
  }, []);

  const setTyping = useCallback((chatRoomId: string, userId: string, isTyping: boolean) => {
    setTypingMap(prev => {
      const current = new Set(prev[chatRoomId] ?? []);
      if (isTyping) {
        current.add(userId);
      } else {
        current.delete(userId);
      }
      return {...prev, [chatRoomId]: current};
    });
  }, []);

  // const setPresence = useCallback((userId: string, isOnline: boolean) => {
  //   setPresenceMap(prev => ({...prev, [userId]: isOnline}));
  // }, []);

  return (
    <ChatStoreContext.Provider value={{
      chatMessagesMap,
      typingMap,
      setInitialMessages,
      appendMessage,
      prependMessages,
      setTyping
    }}>
      {children}
    </ChatStoreContext.Provider>
  );
}