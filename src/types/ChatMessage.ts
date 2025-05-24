export interface ChatMessage {
  id: string
  senderUserAccountId: string
  destinationChatRoomId: string
  messageContent: string
  timestamp: number
  attachmentFileName?: string
}