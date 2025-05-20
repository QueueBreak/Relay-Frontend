import {AuthenticatedUser} from "@/types/AuthenticatedUser.ts";
import {privateApi} from "@/api/axios.ts";

const USERS_API = "/users"

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  const response = await privateApi.get(USERS_API + "/me");
  return response.data
}