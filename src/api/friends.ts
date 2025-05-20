import {privateApi} from "@/api/axios.ts";
import {Friend} from "@/types/Friend.ts";

const FRIENDS_API = "/friends"

export async function getAllFriends(): Promise<Friend[]> {
  const response = await privateApi.get(FRIENDS_API);
  return response.data
}