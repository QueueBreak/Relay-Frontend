export interface ChatRoom {
  chatRoomId: string
  displayName: string
  lastMessage: string
  lastMessageTimestamp: number
  type: "DIRECT" | "GROUP"
}