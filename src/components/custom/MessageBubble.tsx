interface MessageBubbleProps {
  from: "me" | "them"
  text: string
}

export function MessageBubble({from, text}: MessageBubbleProps) {
  const isMe = from === "me"
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] ${
          isMe ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {text}
      </div>
    </div>
  )
}