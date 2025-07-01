import {useTypingUsers} from "@/hooks/useTypingUsers.ts";
import {UserAvatarWithStatus} from "@/components/custom/UserAvatarWithStatus.tsx";

interface ChatHeaderProps {
  displayName: string;
  status: "online" | "offline";
  chatRoomId: string;
  type: "GROUP" | "DIRECT";
  participants?: { userAccountId: string; displayName: string }[];
}

export function ChatHeader({
                             displayName,
                             status,
                             chatRoomId,
                             type,
                             participants = [],
                           }: ChatHeaderProps) {
  const typingUsers = useTypingUsers(chatRoomId);

  return (
    <div className="px-4 py-3 border-b bg-background space-y-1">
      <div className="flex items-center gap-3">
        <UserAvatarWithStatus
          status={status}
          fallbackText={displayName.substring(0, 1)}
        />
        <div className="flex flex-col">
          <span className="font-medium leading-tight">{displayName}</span>
          <span className="text-xs text-muted-foreground leading-none">
            {typingUsers.length > 0 ? "Typing..." : status}
          </span>
        </div>
      </div>

      {type === "GROUP" && participants.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {participants.map((p) => (
            <span
              key={p.userAccountId}
              className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground"
            >
              {p.displayName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}