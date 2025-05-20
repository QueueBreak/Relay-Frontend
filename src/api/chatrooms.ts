import {privateApi} from "@/api/axios.ts";
import {ChatRoom} from "@/types/ChatRoom.ts";
import {CreateChatRoomRequest} from "@/types/CreateChatRoomRequest.ts";
import {CreateChatRoomResponse} from "@/types/CreateChatRoomResponse.ts";
import {ChatRoomWithParticipants} from "@/types/ChatRoomWithParticipants.ts";

const CHATROOMS_API = "/chatrooms"

export async function getUserChatRooms(): Promise<ChatRoom[]> {
  const response = await privateApi.get(CHATROOMS_API)
  return response.data
}

export async function getChatRoomWithParticipants(chatRoomId: string): Promise<ChatRoomWithParticipants> {
  const response = await privateApi.get(CHATROOMS_API + "/" + chatRoomId)
  return response.data
}

export async function createChatRoom(createChatRoomRequest: CreateChatRoomRequest): Promise<CreateChatRoomResponse> {
  const response = await privateApi.post<CreateChatRoomResponse>(CHATROOMS_API, createChatRoomRequest)
  return response.data
}