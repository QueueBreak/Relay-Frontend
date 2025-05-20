import {getChatRoomWithParticipants} from "@/api/chatrooms.ts";
import {LoaderFunctionArgs} from "react-router";

export async function chatPageLoader({params}: LoaderFunctionArgs) {
  const chatRoomId = params.chatId;
  if (!chatRoomId) {
    throw new Response("Missing chatRoomId", {status: 400})
  }
  try {
    const chatRoomWithParticipants = await getChatRoomWithParticipants(chatRoomId);
    return {chatRoomWithParticipants}
  } catch (e) {
    console.error("Failed to load chat room metadata:", e)
    throw new Response("Failed to load chat room", {status: 500})
  }
}