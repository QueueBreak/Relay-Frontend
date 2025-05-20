import {useEffect, useState} from "react"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Friend} from "@/types/Friend.ts";
import {useNavigate} from "react-router";
import {getAllFriends} from "@/api/friends.ts";
import Loader from "@/components/custom/Loader.tsx";
import AddFriendDialog from "@/components/custom/AddFriendDialog.tsx";
import {createChatRoom} from "@/api/chatrooms.ts";
import {useAuth} from "@/features/auth/useAuth.ts";
import {CreateChatRoomRequest} from "@/types/CreateChatRoomRequest.ts";

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChatCreated: () => void
}

export function NewChatDialog({open, onOpenChange, onChatCreated}: NewChatDialogProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false)
  const {user} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return;
    setIsLoading(true)

    const fetchFriends = async () => {
      try {
        const friends = await getAllFriends();
        setFriends(friends);
      } catch {
        setFriends([]);
      } finally {
        setIsLoading(false)
      }
    }

    fetchFriends();
  }, [open])

  async function handleStartChat(friend: Friend) {
    try {
      const userDisplayName = user?.displayName ?? "";
      const createChatRoomRequest: CreateChatRoomRequest = {
        chatRoomType: "direct",
        participants: [friend.displayName, userDisplayName]
      }
      const createChatRoomResponse = await createChatRoom(createChatRoomRequest)
      onChatCreated();
      navigate(`/chat/${createChatRoomResponse.chatRoomId}`)
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to start chat:", err)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new chat</DialogTitle>
            <DialogDescription>Select a friend to begin a new conversation.</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <Loader fullscreen={false}/>
          ) : (
            <div className="space-y-2">
              {friends.map((friend) => (
                <Button
                  key={friend.friendAccountId}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleStartChat(friend)}
                >
                  {friend.displayName}
                </Button>
              ))}
            </div>
          )}

          <div className="pt-4 text-right">
            <Button variant="outline" onClick={() => setShowAddFriendDialog(true)}>
              Add Friend
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddFriendDialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog} />
    </>
  )
}