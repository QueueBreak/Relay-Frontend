import { UserAvatarWithStatus } from "@/components/custom/UserAvatarWithStatus.tsx";
import { useTypingUsers } from "@/hooks/useTypingUsers.ts"; // assumes you placed it in hooks

interface ChatHeaderProps {
  displayName: string
  status: "online" | "offline"
  chatRoomId: string
}

export function ChatHeader({ displayName, status, chatRoomId }: ChatHeaderProps) {
  const typingUsers = useTypingUsers(chatRoomId);

  return (
    <div className="px-4 py-3 border-b flex items-center gap-3 bg-background">
      <UserAvatarWithStatus status={status} fallbackText={displayName.substring(0, 1)} />
      <div>
        <div className="font-medium">{displayName}</div>
        <div className="text-sm text-muted-foreground">
          {typingUsers.length > 0 ? "Typing..." : status}
        </div>
      </div>
    </div>
  );
}