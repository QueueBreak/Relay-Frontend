import {privateApi} from "@/api/axios.ts";
import {Friend} from "@/types/Friend.ts";
import {AddFriendRequest} from "@/types/AddFriendRequest.ts";

const FRIENDS_API = "/friends"

export async function getAllFriends(): Promise<Friend[]> {
  const response = await privateApi.get(FRIENDS_API);
  return response.data
}

export async function addFriend(addFriendRequest: AddFriendRequest): Promise<void> {
  const response = await privateApi.post(FRIENDS_API, addFriendRequest);
  return response.data
}