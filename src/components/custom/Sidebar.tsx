import {Separator} from "@/components/ui/separator"
import {ChatListItem} from "./ChatListItem"
import {UserAvatar} from "./UserAvatar"

export function Sidebar() {

  return (
    <div className="w-[300px] bg-background border-r flex flex-col">
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