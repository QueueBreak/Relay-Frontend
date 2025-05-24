export interface OutgoingChatMessage {
  destinationChatRoomId: string
  chatRoomType: string
  messageContent: string
  attachmentFileName?: string
}