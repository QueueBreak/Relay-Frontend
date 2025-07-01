import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import Loader from "@/components/custom/Loader.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SearchUserResult} from "@/types/SearchUserResult.ts";
import {searchUsersForDisplayName} from "@/api/users.ts";
import axios from "axios";
import {addFriend} from "@/api/friends.ts";
import {useToast} from "@/components/ui/use-toast.tsx";

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddFriendDialog({open, onOpenChange}: AddFriendDialogProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUserResult[]>([]);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 3) {
      setUsers([]);
      setTooShort(trimmedQuery.length > 0);
      return;
    }

    setTooShort(false);
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await searchUsersForDisplayName(trimmedQuery, controller.signal);
          setUsers(response);
          setSearchCompleted(true);
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.name === "CanceledError") {
              console.log("Request cancelled");
            } else {
              console.error("Axios error", err.message);
            }
          } else {
            console.error("Unexpected error", err);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    setSearchCompleted(false); // user started typing again
  }, [query]);

  const handleAddFriend = async (userId: string) => {
    try {
      await addFriend({ friendAccountId: userId });
      setUsers((prev) => prev.filter((u) => u.userAccountId !== userId));

      toast({
        title: "Friend request sent",
        description: "The user has been added to your friends list.",
        duration: 3000,
      });
    } catch (err) {
      console.error("Failed to add friend:", err);
      toast({
        title: "Error",
        description: "Could not send friend request.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
          <DialogDescription>
            Search for people by display name and add them to your friend list.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {tooShort && (
          <p className="text-sm text-muted-foreground pt-2">Please enter at least 3 characters.</p>
        )}

        <div className="pt-2 min-h-[80px]">
          {loading ? (
            <Loader fullscreen={false}/>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.userAccountId} className="flex justify-between items-center">
                  <span>{user.displayName}</span>
                  <Button size="sm" onClick={() => handleAddFriend(user.userAccountId)}>
                    Add
                  </Button>
                </div>
              ))}

              {users.length === 0 && !loading && !tooShort && searchCompleted && (
                <p className="text-sm text-muted-foreground">No users found.</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
