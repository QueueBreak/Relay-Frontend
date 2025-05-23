import {Participant} from "@/types/Participant.ts";
import {ChatRoom} from "@/types/ChatRoom.ts";

export interface ChatRoomWithParticipants extends ChatRoom{
  chatRoomType: "direct" | "group"
  participants: Participant[]
  isUnread?: boolean
}