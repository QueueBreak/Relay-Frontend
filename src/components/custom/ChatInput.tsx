import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "@/features/websocket/useWebSocket.ts";
import { WebSocketMessage } from "@/types/WebSocketMessage.ts";
import { Textarea } from "@/components/custom/TextArea.tsx";

interface ChatInputProps {
  chatRoomId: string;
  onMessageSent?: () => void;
}

export function ChatInput({ chatRoomId, onMessageSent }: ChatInputProps) {
  const [messageContent, setMessageContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { send } = useWebSocket();

  function handleSendMessage() {
    const trimmed = messageContent.trim();
    if (!trimmed) return;

    const chatMessage: WebSocketMessage = {
      type: "chat",
      payload: {
        destinationChatRoomId: chatRoomId,
        messageContent: trimmed,
      },
    };

    send(chatMessage);
    setMessageContent("");
    onMessageSent?.();
  }

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.overflowY = "hidden";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
    el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
  }, [messageContent]);

  return (
    <div className="border-t px-4 py-3 bg-background flex gap-2 items-end">
      <Textarea
        ref={textareaRef}
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        rows={1}
        placeholder="Type a message..."
        className="resize-none w-full max-h-40 min-h-[36px]
                  rounded-md border border-input bg-transparent
                  px-3 py-[7px] text-sm leading-[1.4rem] shadow-sm
                  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                  disabled:opacity-50 overflow-hidden
                  placeholder:text-muted-foreground
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar]:cursor-default
                  [&::-webkit-scrollbar-thumb]:bg-white/25
                  [&::-webkit-scrollbar-thumb]:rounded-md
                  [&::-webkit-scrollbar-thumb]:hover:bg-white/80
                  [&::-webkit-scrollbar-thumb]:active:bg-white
                  [&::-webkit-scrollbar-thumb]:cursor-default
                  [&::-webkit-scrollbar-track]:bg-white/10"
      />
      <Button onClick={handleSendMessage}>Send</Button>
    </div>
  );
}
