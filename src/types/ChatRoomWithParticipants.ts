import {Participant} from "@/types/Participant.ts";
import {ChatRoom} from "@/types/ChatRoom.ts";

export interface ChatRoomWithParticipants extends ChatRoom{
  participants: Participant[]
  isUnread?: boolean
}