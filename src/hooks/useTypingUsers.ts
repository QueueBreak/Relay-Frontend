import {useChatStore} from "@/features/messagestore/useChatStore.ts";

export function useTypingUsers(chatRoomId: string): string[] {
  const { typingMap } = useChatStore();
  const typingUsers = typingMap[chatRoomId];
  return typingUsers ? Array.from(typingUsers) : [];
}