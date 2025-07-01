import {privateApi} from "@/api/axios.ts";
import {ChatMessage} from "@/types/ChatMessage.ts";

const MESSAGES_API = "/messages"

export async function getMostRecentChatMessages(chatRoomId: string): Promise<ChatMessage[]> {
  const response = await privateApi.get(MESSAGES_API + "/" + chatRoomId)
  return response.data
}

export async function getMessagesBefore(chatRoomId: string, lastSeenId: string): Promise<ChatMessage[]> {
  const response = await privateApi.get(MESSAGES_API + "/" + chatRoomId + "?lastSeenId=" + lastSeenId);
  return response.data
}