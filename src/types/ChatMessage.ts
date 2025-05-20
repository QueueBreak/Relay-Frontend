//TODO: Split into incoming and outgoing so we dont have to use optional
export interface ChatMessage {
  id: string
  senderUserAccountId: string
  destinationChatRoomId: string
  messageContent: string
  timestamp: number
}