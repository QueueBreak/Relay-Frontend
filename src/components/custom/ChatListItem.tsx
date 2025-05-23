import {useNavigate, useParams} from "react-router";
import {cn} from "@/lib/utils.ts";
import {UserAvatarWithStatus} from "@/components/custom/UserAvatarWithStatus.tsx";
import {useTypingUsers} from "@/hooks/useTypingUsers.ts";

interface ChatListItemProps {
  name: string;
  chatRoomId: string;
  lastMessage: string;
  isUnread?: boolean;
  status?: "online" | "offline";
  fallbackText?: string;
}

export function ChatListItem({ name,
                               chatRoomId,
                               lastMessage,
                               isUnread
                             }: ChatListItemProps) {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const isSelected = chatRoomId === chatId;
  const typingUsers = useTypingUsers(chatRoomId);
  const isTyping = typingUsers.length > 0;

  return (
    <div
      onClick={() => {
        if (!isSelected) {
          navigate(`/chat/${chatRoomId}`);
        }
      }}
      className={cn(
        "px-4 py-3 cursor-pointer border-b transition-colors flex items-center justify-between gap-3",
        isSelected
          ? "bg-muted text-primary font-semibold"
          : isUnread
            ? "bg-accent/20"
            : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <UserAvatarWithStatus status={"online"} fallbackText={name.substring(0, 1)} />

        <div className="flex flex-col min-w-0">
          <div className={cn("truncate", isUnread && !isSelected && "font-bold text-foreground")}>
            {name}
          </div>
          <div
            className={cn(
              "text-sm truncate",
              isUnread && !isSelected
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            )}
          >
            {isTyping ? "Typing..." : lastMessage}
          </div>
        </div>
      </div>
      {isUnread && !isSelected && (
        <div className="h-2 w-2 rounded-full bg-purple-500" />
      )}
    </div>
  );
}
