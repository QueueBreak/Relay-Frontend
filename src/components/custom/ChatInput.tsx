import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"

export function ChatInput() {
  return (
    <div className="border-t px-4 py-3 bg-background flex gap-2">
      <Input className="flex-1" placeholder="Type a message..." />
      <Button>Send</Button>
    </div>
  )
}