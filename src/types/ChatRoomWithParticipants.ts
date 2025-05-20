import {Participant} from "@/types/Participant.ts";

export interface ChatRoomWithParticipants {
  chatRoomId: string
  chatRoomType: "direct" | "group"
  displayName: string
  participants: Participant[]
}