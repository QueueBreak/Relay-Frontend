import { ChatHeader } from "@/components/custom/ChatHeader";
import { ChatInput } from "@/components/custom/ChatInput";
import { MessageBubble } from "@/components/custom/MessageBubble";
import { useLoaderData, useNavigation } from "react-router";
import { ChatRoomWithParticipants } from "@/types/ChatRoomWithParticipants.ts";
import Loader from "@/components/custom/Loader.tsx";
import { useAuth } from "@/features/auth/useAuth.ts";
import { useChatMessages } from "@/hooks/useChatMessages.ts";
import { useEffect, useRef } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ChatMessage } from "@/types/ChatMessage.ts";
import { ChatDateDivider } from "@/components/custom/ChatDateDivider.tsx";

export default function ChatPage() {
  const { chatRoomWithParticipants } = useLoaderData() as {
    chatRoomWithParticipants: ChatRoomWithParticipants;
  };

  const { user, isLoading: isUserLoading } = useAuth();
  const { state: navigationState } = useNavigation();
  const chatRoomId = chatRoomWithParticipants.chatRoomId;

  const {
    chatMessages,
    loading: areChatMessagesLoading,
    fetchOlderMessages,
    hasMore,
  } = useChatMessages(chatRoomId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const anchorMessageRef = useRef<HTMLDivElement | null>(null);
  const initialScrollDone = useRef(false);
  const shouldScrollToBottomRef = useRef(false);
  const isUserAtBottomRef = useRef(true);

  const isLoading = isUserLoading || navigationState !== "idle";

  useEffect(() => {
    if (!initialScrollDone.current && chatMessages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      initialScrollDone.current = true;
      return;
    }

    if (shouldScrollToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollToBottomRef.current = false;
      return;
    }

    if (isUserAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = async () => {
      const nearTop = container.scrollTop <= 64;

      const nearBottom =
        Math.abs(
          container.scrollHeight - container.scrollTop - container.clientHeight
        ) < 16;

      isUserAtBottomRef.current = nearBottom;

      if (nearTop && hasMore && !areChatMessagesLoading) {
        const anchor = anchorMessageRef.current;
        const topBefore = anchor?.getBoundingClientRect().top ?? 0;

        await fetchOlderMessages(chatMessages[0]?.id);

        requestAnimationFrame(() => {
          const topAfter = anchor?.getBoundingClientRect().top ?? 0;
          const delta = topAfter - topBefore;
          container.scrollTop += delta;
        });
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [chatMessages, fetchOlderMessages, hasMore, areChatMessagesLoading]);

  if (isLoading) return <Loader fullscreen={false} />;

  const grouped = groupMessagesByDate(chatMessages);

  return (
    <div className="flex flex-col flex-1 bg-card h-full">
      <div className="shrink-0">
        <ChatHeader
          displayName={chatRoomWithParticipants.displayName}
          status="online"
        />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto
          [&::-webkit-scrollbar]:w-3
          [&::-webkit-scrollbar-thumb]:bg-white/25
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-white/80
          [&::-webkit-scrollbar-thumb:active]:bg-white
          [&::-webkit-scrollbar-track]:bg-white/10"
      >
        {areChatMessagesLoading && hasMore && (
          <div className="py-2">
            <Loader fullscreen={false} />
          </div>
        )}

        {Object.entries(grouped).map(([label, messages]) => (
          <div key={label} className="space-y-2">
            <ChatDateDivider label={label} />
            {messages.map((msg) => {
              const isFirst = msg.id === chatMessages[0]?.id;
              return (
                <div key={msg.id} ref={isFirst ? anchorMessageRef : null}>
                  <MessageBubble
                    from={
                      msg.senderUserAccountId === user?.userAccountId
                        ? "me"
                        : "them"
                    }
                    text={msg.messageContent}
                    timestamp={msg.timestamp}
                  />
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0">
        <ChatInput
          chatRoomId={chatRoomId}
          onMessageSent={() => {
            shouldScrollToBottomRef.current = true;
          }}
        />
      </div>
    </div>
  );
}

function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: Record<string, ChatMessage[]> = {};

  for (const msg of messages) {
    const date = new Date(msg.timestamp);
    const label = isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : format(date, "MMMM d, yyyy");

    if (!groups[label]) groups[label] = [];
    groups[label].push(msg);
  }

  return groups;
}
