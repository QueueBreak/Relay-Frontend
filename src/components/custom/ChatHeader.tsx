import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

export function ChatHeader() {
  return (
    <div className="px-4 py-3 border-b flex items-center gap-3 bg-background">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/300"/>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">Alice</div>
        <div className="text-sm text-muted-foreground">online</div>
      </div>
    </div>
  )
}