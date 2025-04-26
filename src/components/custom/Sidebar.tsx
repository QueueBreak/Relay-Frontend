import {Separator} from "@/components/ui/separator"
import {ChatListItem} from "./ChatListItem"
import {UserAvatar} from "./UserAvatar"
import {useNavigate} from "react-router";

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate("/chat/1")}
      className="w-[300px] bg-background border-r flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <UserAvatar fallbackText={"AT"}/>
      </div>
      <Separator/>
      <div className="overflow-y-auto flex-1">
        <ChatListItem name="Alice" lastMessage="Let's talk later!"/>
        <ChatListItem name="Bob" lastMessage="Sure!"/>
      </div>
    </div>
  )
}