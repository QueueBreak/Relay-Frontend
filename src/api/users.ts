import {AuthenticatedUser} from "@/types/AuthenticatedUser.ts";
import {privateApi} from "@/api/axios.ts";
import {SearchUserResult} from "@/types/SearchUserResult.ts";

const USERS_API = "/users"

export async function getCurrentUser(): Promise<AuthenticatedUser> {
  const response = await privateApi.get(USERS_API + "/me");
  return response.data
}

export async function searchUsersForDisplayName(displayName: string, signal?: AbortSignal): Promise<SearchUserResult[]> {
  const response = await privateApi.get(
    `${USERS_API}/search/${encodeURIComponent(displayName)}`,
    { signal }
    );
  return response.data;
}