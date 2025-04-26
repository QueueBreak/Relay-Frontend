import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

//TODO: Make src mandatory
interface UserAvatarProps {
  src?: string
  fallbackText: string
}

export function UserAvatar({src, fallbackText}: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={src}/>
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}