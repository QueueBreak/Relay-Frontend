import * as React from "react";
import {createContext, useCallback, useContext, useState} from "react";
import {ChatRoomWithParticipants} from "@/types/ChatRoomWithParticipants.ts";

type ChatRoomStoreContextType = {
  chatRooms: ChatRoomWithParticipants[];
  updateChatRoomPreview: (roomId: string, message: string, timestamp: number, currentChatId?: string) => void;
  getChatRoomById: (chatRoomId: string) => ChatRoomWithParticipants | undefined;
  addOrUpdateRoom: (room: ChatRoomWithParticipants) => void;
  markChatAsRead: (chatRoomId: string) => void;
};

const ChatRoomStoreContext = createContext<ChatRoomStoreContextType | null>(null);

export function ChatRoomStoreProvider({children}: { children: React.ReactNode }) {
  const [chatRooms, setChatRooms] = useState<ChatRoomWithParticipants[]>([]);

  const updateChatRoomPreview = useCallback(
    (
      chatRoomId: string,
      message: string,
      timestamp: number,
      currentChatId?: string
    ) => {
      setChatRooms(prev => {
        const updated = prev.map(room => {
          if (room.chatRoomId !== chatRoomId) return room;

          const currentTs = room.lastMessageTimestamp ?? 0;
          if (timestamp < currentTs) return room;

          const isUnread = currentChatId !== chatRoomId;
          console.log(currentChatId)
          console.log(chatRoomId)
          console.log(isUnread);
          return {
            ...room,
            lastMessage: message,
            lastMessageTimestamp: timestamp,
            isUnread
          };
        });

        updated.sort(
          (a, b) => (b.lastMessageTimestamp ?? 0) - (a.lastMessageTimestamp ?? 0)
        );

        return updated;
      });
    },
    []
  );

  const markChatAsRead = useCallback((chatRoomId: string) => {
    setChatRooms(prev =>
      prev.map(room =>
        room.chatRoomId === chatRoomId
          ? { ...room, isUnread: false }
          : room
      )
    );
  }, []);

  const getChatRoomById = useCallback((chatRoomId: string) => {
    return chatRooms.find(room => room.chatRoomId === chatRoomId);
  }, [chatRooms]);

  const addOrUpdateRoom = useCallback((newRoom: ChatRoomWithParticipants) => {
    setChatRooms(prev => {
      const exists = prev.find(r => r.chatRoomId === newRoom.chatRoomId);

      if (!exists) {
        return [...prev, newRoom];
      }

      return prev.map(prevRoom =>
        prevRoom.chatRoomId === newRoom.chatRoomId
          ? {
            ...prevRoom,
            displayName: newRoom.displayName ?? prevRoom.displayName,
            lastMessage: newRoom.lastMessage ?? prevRoom.lastMessage,
            lastMessageTimestamp: newRoom.lastMessageTimestamp ?? prevRoom.lastMessageTimestamp,
            chatRoomType: newRoom.chatRoomType ?? prevRoom.chatRoomType,
            participants: newRoom.participants?.length ? newRoom.participants : prevRoom.participants,
          }
          : prevRoom
      );
    });
  }, []);

  return (
    <ChatRoomStoreContext.Provider value={{chatRooms, updateChatRoomPreview, getChatRoomById, addOrUpdateRoom, markChatAsRead}}>
      {children}
    </ChatRoomStoreContext.Provider>
  );
}

export function useChatRoomStore() {
  const ctx = useContext(ChatRoomStoreContext);
  if (!ctx) throw new Error("useChatRoomStore must be used inside ChatRoomStoreProvider");
  return ctx;
}