import { ChatMessage } from "@/types/ChatMessage.ts";
import * as React from "react";
import { MessageBubble } from "@/components/custom/MessageBubble.tsx";
import { motion } from "framer-motion";

interface AnimatedMessageBubbleProps {
  msg: ChatMessage;
  from: "me" | "them";
  animate: boolean;
  anchorRef?: React.Ref<HTMLDivElement>;
  chatRoomId: string;
  onMediaLoaded?: () => void;
  isGroupChat?: boolean;
  senderUserAccountId?: string;
  getDisplayNameById?: (id: string) => string;
}

export default function AnimatedMessageBubble({
                                                msg,
                                                from,
                                                animate,
                                                anchorRef,
                                                chatRoomId,
                                                onMediaLoaded,
                                              }: AnimatedMessageBubbleProps) {
  const bubble = (
    <MessageBubble
      key={msg.id}
      from={from}
      text={msg.messageContent}
      timestamp={msg.timestamp}
      attachmentFileName={msg.attachmentFileName}
      chatRoomId={chatRoomId}
      onMediaLoaded={onMediaLoaded}
    />
  );

  return (
    <div key={msg.id} ref={anchorRef}>
      {animate ? (
        <motion.div
          initial={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.25, ease: "easeIn" }}
        >
          {bubble}
        </motion.div>
      ) : (
        bubble
      )}
    </div>
  );
}
