import {useNavigate, useParams} from "react-router";
import {cn} from "@/lib/utils.ts";

interface ChatListItemProps {
  name: string
  chatRoomId: string
  lastMessage: string
}

export function ChatListItem({name, chatRoomId, lastMessage}: ChatListItemProps) {
  const navigate = useNavigate()
  const { chatId } = useParams()
  const isSelected = chatRoomId === chatId

  return (
    <div
      onClick={() => {
        if (chatId !== chatRoomId) {
          navigate(`/chat/${chatRoomId}`)
        }
      }}
      className={cn(
        "px-4 py-3 cursor-pointer border-b transition-colors",
        isSelected
          ? "bg-muted text-primary font-semibold"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground truncate">{lastMessage}</div>
    </div>
  )
}