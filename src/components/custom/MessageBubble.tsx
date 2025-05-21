  interface MessageBubbleProps {
    from: "me" | "them";
    text: string;
    timestamp: number;
  }

  export function MessageBubble({ from, text, timestamp }: MessageBubbleProps) {
    const time = new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const isMe = from === "me";

    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} px-14 mb-1`}>
        <div
          className={`
            max-w-[75%]
            px-3 pt-1.5 pb-2.5 pr-15
            rounded-xl
            text-sm
            relative
            ${isMe
            ? "bg-primary/95 text-primary-foreground rounded-br-sm"
            : "bg-muted/90 text-secondary-foreground rounded-bl-sm"}
          `}
          style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        >
          <span>{text}</span>
          <span
            className={`
              absolute bottom-2 right-2 text-[10px] leading-none
              ${isMe ? "text-black/50" : "text-white/60"}
              whitespace-nowrap
            `}
          >
            {time}
          </span>
        </div>
      </div>
    );
  }
