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
      <AvatarFallback className={`text-white bg-purple-900`}>{fallbackText}</AvatarFallback>
    </Avatar>
  )
}