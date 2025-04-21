interface ChatListItemProps {
  name: string
  lastMessage: string
}

export function ChatListItem({name, lastMessage}: ChatListItemProps) {
  return (
    <div className="px-4 py-3 hover:bg-muted cursor-pointer border-b">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground truncate">{lastMessage}</div>
    </div>
  )
}