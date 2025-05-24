export interface OutgoingChatMessage {
  destinationChatRoomId: string
  messageContent: string
  attachmentFileName?: string
}