import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import Loader from "@/components/custom/Loader.tsx";
import {Button} from "@/components/ui/button.tsx";

interface AddFriendDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddFriendDialog({open, onOpenChange}: AddFriendDialogProps) {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || query.trim() === "") {
      setUsers([])
      return
    }

    const timeout = setTimeout(() => {
      setLoading(true)
      // searchUsers(query)
      //   .then(setUsers)
      //   .catch(() => setUsers([]))
      //   .finally(() => setLoading(false))
      setLoading(false)
    }, 300) // debounce

    return () => clearTimeout(timeout)
  }, [query, open])

  // const handleAddFriend = async (userId: string) => {
  //   try {
  //     await sendFriendRequest(userId)
  //     // Optionally remove from list or show toast
  //   } catch (e) {
  //     console.error("Failed to send friend request", e)
  //   }
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {loading ? (
          <Loader fullscreen={false}/>
        ) : (
          <div className="space-y-2 pt-2">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <span>{user.displayName}</span>
                {/*<Button size="sm" onClick={() => handleAddFriend(user.id)}>*/}
                <Button size="sm">
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}