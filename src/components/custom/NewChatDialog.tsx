import {useEffect, useRef, useState} from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"
import {Checkbox} from "@/components/ui/checkbox.tsx"
import {Friend} from "@/types/Friend.ts"
import {useNavigate} from "react-router"
import {getAllFriends} from "@/api/friends.ts"
import Loader from "@/components/custom/Loader.tsx"
import AddFriendDialog from "@/components/custom/AddFriendDialog.tsx"
import {createDirectChatRoom, createGroupChatRoom} from "@/api/chatrooms.ts"
import {CreateChatRoomRequest} from "@/types/CreateChatRoomRequest.ts"

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChatCreated: () => void
}

export function NewChatDialog({open, onOpenChange, onChatCreated}: NewChatDialogProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false)
  const [mode, setMode] = useState<"direct" | "group">("direct")
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")
  const navigate = useNavigate()
  const prevAddFriendDialogRef = useRef(showAddFriendDialog)

  const fetchFriends = async () => {
    setIsLoading(true)
    try {
      const friends = await getAllFriends()
      setFriends(friends)
    } catch {
      setFriends([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      setMode("direct")
      setSelectedFriendIds([])
      setGroupName("")
      fetchFriends()
    }
  }, [open])

  useEffect(() => {
    if (prevAddFriendDialogRef.current && !showAddFriendDialog) {
      fetchFriends()
    }
    prevAddFriendDialogRef.current = showAddFriendDialog
  }, [showAddFriendDialog])

  async function handleStartDirectChat(friendId: string) {
    try {
      const req: CreateChatRoomRequest = {
        type: "DIRECT",
        participants: [friendId],
      }
      const res = await createDirectChatRoom(req)
      onChatCreated()
      navigate(`/chat/${res.chatRoomId}`)
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to start chat:", err)
    }
  }

  async function handleCreateGroupChat() {
    try {
      const req: CreateChatRoomRequest = {
        type: "GROUP",
        participants: selectedFriendIds,
      }
      const res = await createGroupChatRoom(req, groupName.trim())
      onChatCreated()
      navigate(`/chat/${res.chatRoomId}`)
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to create group:", err)
    }
  }

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriendIds(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  const isGroupFormValid = groupName.trim().length > 0 && selectedFriendIds.length >= 2

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Start a new chat</DialogTitle>
            <DialogDescription>
              Choose to start a direct or group chat with your friends.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={mode} onValueChange={(v: string) => setMode(v as "direct" | "group")}>
            <TabsList className="mb-4 w-full justify-center">
              <TabsTrigger value="direct">1-on-1</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
            </TabsList>

            <TabsContent value="direct">
              {isLoading ? (
                <Loader fullscreen={false} />
              ) : (
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <Button
                      key={friend.friendAccountId}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleStartDirectChat(friend.friendAccountId)}
                    >
                      {friend.displayName}
                    </Button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="group">
              {isLoading ? (
                <Loader fullscreen={false} />
              ) : (
                <>
                  <div className="mb-4 space-y-2 max-h-64 overflow-y-auto pr-1">
                    {friends.map((friend) => (
                      <label
                        key={friend.friendAccountId}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedFriendIds.includes(friend.friendAccountId)}
                          onCheckedChange={() => toggleFriendSelection(friend.friendAccountId)}
                        />
                        <span>{friend.displayName}</span>
                      </label>
                    ))}
                  </div>

                  <Input
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="mb-4"
                  />

                  <Button
                    disabled={!isGroupFormValid}
                    onClick={handleCreateGroupChat}
                    className="w-full"
                  >
                    Create Group Chat
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>

          <div className="pt-4 text-right">
            <Button
              variant="outline"
              onClick={() => setShowAddFriendDialog(true)}
            >
              Add Friend
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddFriendDialog
        open={showAddFriendDialog}
        onOpenChange={setShowAddFriendDialog}
      />
    </>
  )
}
