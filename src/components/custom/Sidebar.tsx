import {Separator} from "@/components/ui/separator"
import {ChatListItem} from "./ChatListItem"
import {UserAvatar} from "./UserAvatar"
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/features/auth/useAuth.ts";
import {Plus} from "lucide-react";
import {useEffect, useState} from "react";
import {NewChatDialog} from "@/components/custom/NewChatDialog.tsx";
import {getUserChatRooms} from "@/api/chatrooms.ts";
import {useChatRoomStore} from "@/features/chatroomsstore/useChatRoomStore.tsx";
import {ChatRoomWithParticipants} from "@/types/ChatRoomWithParticipants.ts";

export function Sidebar() {
  const {user, logout} = useAuth()
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const {chatRooms, addOrUpdateRoom} = useChatRoomStore();

  async function handleNewRoomCreated() {
    try {
      const updatedRooms = await getUserChatRooms();
      updatedRooms.forEach(room => {
        const chatRoomWithParticipants: ChatRoomWithParticipants = {
          chatRoomId: room.chatRoomId,
          displayName: room.displayName,
          lastMessage: room.lastMessage,
          lastMessageTimestamp: room.lastMessageTimestamp,
          type: room.type,
          participants: []
        }

        addOrUpdateRoom(chatRoomWithParticipants);
      });
    } catch (err) {
      console.error("Failed to refresh chat rooms after new room creation", err);
    }
  }

  useEffect(() => {
    getUserChatRooms()
      .then(rooms => {
        rooms.forEach(room => {
          const chatRoomWithParticipants: ChatRoomWithParticipants = {
            chatRoomId: room.chatRoomId,
            displayName: room.displayName,
            lastMessage: room.lastMessage,
            lastMessageTimestamp: room.lastMessageTimestamp,
            type: room.type,
            participants: []
          }

          addOrUpdateRoom(chatRoomWithParticipants);
        });
      })
      .catch(err => console.error("Failed to load chat rooms", err));
  }, [addOrUpdateRoom]);


  return (
    <div className="h-full w-[350px] bg-background border-r flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-foreground">{user?.displayName}</span>
          <UserAvatar fallbackText={user?.displayName?.substring(0, 1) ?? ""}/>
        </div>
      </div>

      <div className="px-4 pb-2">
        <Button
          variant="secondary"
          className="w-full flex items-center gap-2"
          onClick={() => setShowNewChatModal(true)}
        >
          <Plus className="w-4 h-4"/>
          New Chat
        </Button>
      </div>

      <NewChatDialog
        open={showNewChatModal}
        onOpenChange={setShowNewChatModal}
        onChatCreated={handleNewRoomCreated}
      />

      <Separator/>

      <div className="overflow-y-auto flex-1">
        {chatRooms.map((chatRoom: ChatRoomWithParticipants) => (

          <ChatListItem
            key={chatRoom.chatRoomId}
            name={chatRoom.displayName}
            chatRoomId={chatRoom.chatRoomId}
            lastMessage={chatRoom.lastMessage}
            isUnread={chatRoom.isUnread}
          />
        ))}
      </div>

      <div className="p-4">
        <Button variant="outline" onClick={logout} className="w-full">
          Logout
        </Button>
      </div>
    </div>
  )
}