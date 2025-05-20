import {Separator} from "@/components/ui/separator"
import {ChatListItem} from "./ChatListItem"
import {UserAvatar} from "./UserAvatar"
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/features/auth/useAuth.ts";
import {useLoaderData, useRevalidator} from "react-router";
import {ChatRoom} from "@/types/ChatRoom.ts";
import {Plus} from "lucide-react";
import {useState} from "react";
import {NewChatDialog} from "@/components/custom/NewChatDialog.tsx";

export function Sidebar() {
  const {user, logout} = useAuth()
  const {chatRooms} = useLoaderData() as { chatRooms: ChatRoom[] }
  const revalidator = useRevalidator()
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  function handleNewRoomCreated() {
    revalidator.revalidate();
  }

  return (
    <div className="h-full w-[350px] bg-background border-r flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <UserAvatar fallbackText={user?.displayName.substring(0, 1) ?? ""}/>
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
        {chatRooms.map((chatRoom: ChatRoom) => (
          <ChatListItem
            key={chatRoom.chatRoomId}
            name={chatRoom.displayName}
            chatRoomId={chatRoom.chatRoomId}
            lastMessage={"To be added"}
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