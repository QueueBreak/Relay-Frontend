import {UserAvatarWithStatus} from "@/components/custom/UserAvatarWithStatus.tsx";
import {UserStatus} from "@/types/UserStatus.ts";

interface ChatHeaderProps {
  displayName: string
  status: UserStatus
}

export function ChatHeader({displayName, status}: ChatHeaderProps) {
  return (
    <div className="px-4 py-3 border-b flex items-center gap-3 bg-background">
      <UserAvatarWithStatus status={"online"} fallbackText={displayName.substring(0, 1)} />
      <div>
        <div className="font-medium">{displayName}</div>
        <div className="text-sm text-muted-foreground">{status}</div>
      </div>
    </div>
  )
}