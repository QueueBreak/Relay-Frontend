import { Sidebar } from "@/components/custom/Sidebar"
import { ChatHeader } from "@/components/custom/ChatHeader"
import { ChatInput } from "@/components/custom/ChatInput"
import { MessageBubble } from "@/components/custom/MessageBubble"

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-muted relative">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          <MessageBubble from="them" text="Hey there!" />
          <MessageBubble from="me" text="Hi! What's up?" />
          {/* add more bubbles here */}
        </div>
        <ChatInput />
      </div>
    </div>
  )
}