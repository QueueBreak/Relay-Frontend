import {ChatHeader} from "@/components/custom/ChatHeader";
import {ChatInput} from "@/components/custom/ChatInput";
import {useLoaderData, useNavigation} from "react-router";
import {ChatRoomWithParticipants} from "@/types/ChatRoomWithParticipants.ts";
import Loader from "@/components/custom/Loader.tsx";
import {useAuth} from "@/features/auth/useAuth.ts";
import {useChatMessages} from "@/hooks/useChatMessages.ts";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {format, isToday, isYesterday} from "date-fns";
import {ChatMessage} from "@/types/ChatMessage.ts";
import {ChatDateDivider} from "@/components/custom/ChatDateDivider.tsx";
import AnimatedMessageBubble from "@/components/custom/AnimatedMessageBubble.tsx";
import ScrollToBottomButton from "@/components/custom/ScrollToButtomButton.tsx";
import NewMessagesDivider from "@/components/custom/NewMessageDivider.tsx";

export default function ChatPage() {
  const {chatRoomWithParticipants} = useLoaderData() as {
    chatRoomWithParticipants: ChatRoomWithParticipants;
  };

  const {user, isLoading: isUserLoading} = useAuth();
  const {state: navigationState} = useNavigation();
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
  const isUserAtBottomRef = useRef(false);
  const isFetchingRef = useRef(false);

  const lastAnimatedMessageIdRef = useRef<string | null>(null);
  const suppressInitialAnimationRef = useRef(true);
  const lastMessageIdAtMount = useRef(chatMessages[chatMessages.length - 1]?.id);

  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState<string | null>(null)
  const [lastUnreadMessageId, setLastUnreadMessageId] = useState<string | null>(null);
  const lastSeenMessageIdRef = useRef<string | null>(null);
  const hasMountedRef = useRef(false);

  const isLoading = isUserLoading || navigationState !== "idle";

  const firstMessageId = chatMessages[0]?.id;
  const lastMessageId = chatMessages[chatMessages.length - 1]?.id;
  const isNewMessage = !!lastMessageId && lastMessageId !== lastAnimatedMessageIdRef.current;

  const hasScrolledPastLastUnreadRef = useRef(false);
  const unreadDismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onScroll = useCallback(async () => {
    const container = scrollRef.current;
    if (!container || isFetchingRef.current) return;

    const nearTop = container.scrollTop <= 64;

    isUserAtBottomRef.current = Math.abs(
      container.scrollHeight - container.scrollTop - container.clientHeight
    ) < 50;

    setShowScrollButton(!isUserAtBottomRef.current);

    if (nearTop && hasMore && !areChatMessagesLoading) {
      isFetchingRef.current = true;

      const anchor = anchorMessageRef.current;
      const topBefore = anchor?.getBoundingClientRect().top ?? 0;
      const firstMessageIdBefore = chatMessages[0]?.id;

      try {
        await fetchOlderMessages(firstMessageIdBefore);
      } finally {
        requestAnimationFrame(() => {
          const topAfter = anchor?.getBoundingClientRect().top ?? 0;
          scrollRef.current!.scrollTop += topAfter - topBefore;
          isFetchingRef.current = false;
        });
      }
    }

    if (lastUnreadMessageId) {
      const unreadElement = document.getElementById(`msg-${lastUnreadMessageId}`);
      if (unreadElement && container) {
        const unreadBottom = unreadElement.getBoundingClientRect().bottom;
        const containerBottom = container.getBoundingClientRect().bottom;

        const hasScrolledPast = unreadBottom < containerBottom;

        if (hasScrolledPast && !hasScrolledPastLastUnreadRef.current) {
          hasScrolledPastLastUnreadRef.current = true;

          unreadDismissTimeoutRef.current = setTimeout(() => {
            setUnreadCount(0);
            setFirstUnreadMessageId(null);
            setLastUnreadMessageId(null);
            lastSeenMessageIdRef.current =
              chatMessages[chatMessages.length - 1]?.id ?? null;
          }, 2200);
        } else if (!hasScrolledPast && hasScrolledPastLastUnreadRef.current) {
          hasScrolledPastLastUnreadRef.current = false;
          if (unreadDismissTimeoutRef.current) {
            clearTimeout(unreadDismissTimeoutRef.current);
            unreadDismissTimeoutRef.current = null;
          }
        }
      }
    }
  }, [chatMessages, fetchOlderMessages, hasMore, areChatMessagesLoading, lastUnreadMessageId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      suppressInitialAnimationRef.current = false;
      lastAnimatedMessageIdRef.current = lastMessageIdAtMount.current ?? null;
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!initialScrollDone.current && chatMessages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      initialScrollDone.current = true;

      lastSeenMessageIdRef.current = chatMessages[chatMessages.length - 1]?.id ?? null;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          hasMountedRef.current = true;
        });
      });

      return;
    }

    if (shouldScrollToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollToBottomRef.current = false;
      return;
    }

    if (isUserAtBottomRef.current && initialScrollDone.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [chatMessages]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (
      !suppressInitialAnimationRef.current &&
      isNewMessage &&
      lastMessageId &&
      initialScrollDone.current &&
      hasMountedRef.current &&
      !isUserAtBottomRef.current
    ) {
      const lastSeenId = lastSeenMessageIdRef.current;
      const lastSeenIndex = chatMessages.findIndex(m => m.id === lastSeenId);

      if (lastSeenIndex === -1) return;

      const newUnread = chatMessages.slice(lastSeenIndex + 1).filter(
        msg => msg.senderUserAccountId !== user?.userAccountId
      );

      if (newUnread.length > 0) {
        setUnreadCount(newUnread.length);

        if (!firstUnreadMessageId) {
          setFirstUnreadMessageId(newUnread[0].id);
        }

        setLastUnreadMessageId(newUnread[newUnread.length - 1].id);
      }

      lastAnimatedMessageIdRef.current = lastMessageId;
    }
  }, [isNewMessage, lastMessageId, chatMessages, user, firstUnreadMessageId]);

  const handleMessageSent = useCallback(() => {
    shouldScrollToBottomRef.current = true;
    setUnreadCount(0);
    setFirstUnreadMessageId(null);
    lastSeenMessageIdRef.current = chatMessages[chatMessages.length - 1]?.id ?? null;
  }, [chatMessages]);

  const groupedMessages = useMemo(
    () => groupMessagesByDate(chatMessages),
    [chatMessages]
  );

  if (isLoading) return <Loader fullscreen={false}/>;

  return (
    <div className="flex flex-col flex-1 bg-card h-full relative">
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
            <Loader fullscreen={false}/>
          </div>
        )}

        {Object.entries(groupedMessages).map(([label, messages]) => (
          <div key={label} className="space-y-2">
            <ChatDateDivider label={label}/>
            {messages.map((msg) => {
              const isFirst = msg.id === firstMessageId;
              const isLast = msg.id === lastMessageId;
              const shouldAnimate =
                hasMountedRef.current &&
                !suppressInitialAnimationRef.current &&
                isNewMessage &&
                isLast;

              return (
                <div key={msg.id} id={`msg-${msg.id}`}>
                  {msg.id === firstUnreadMessageId && <NewMessagesDivider />}
                  <AnimatedMessageBubble
                    key={msg.id}
                    msg={msg}
                    from={msg.senderUserAccountId === user?.userAccountId ? "me" : "them"}
                    animate={shouldAnimate}
                    anchorRef={isFirst ? anchorMessageRef : undefined}
                  />
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} className="mb-4"/>
      </div>

      {showScrollButton &&
        <ScrollToBottomButton
          onClick={() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            setUnreadCount(0);
            lastSeenMessageIdRef.current = chatMessages[chatMessages.length - 1]?.id ?? null;
          }}
          unreadCount={unreadCount}
        />
      }

      <div className="shrink-0">
        <ChatInput chatRoomId={chatRoomId} onMessageSent={handleMessageSent}/>
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
