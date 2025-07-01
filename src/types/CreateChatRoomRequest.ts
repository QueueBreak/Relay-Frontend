export interface CreateChatRoomRequest {
  type: "DIRECT" | "GROUP"
  participants: string[]
}