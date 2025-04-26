import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

export function UserAvatar() {
  return (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/100"/>
      <AvatarFallback>ME</AvatarFallback>
    </Avatar>
  )
}