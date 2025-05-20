import {LoginRequest} from "@/types/LoginRequest.ts";
import {AuthenticationResponse} from "@/types/AuthenticationResponse.ts";
import {RegisterRequest} from "@/types/RegisterRequest.ts";
import {publicApi} from "@/api/axios.ts";

const AUTH_API = "/auth"

export async function login(loginRequest: LoginRequest): Promise<AuthenticationResponse> {
  const response = await publicApi.post<AuthenticationResponse>(AUTH_API + "/authenticate", loginRequest)
  return response.data
}

export async function register(registerRequest: RegisterRequest): Promise<AuthenticationResponse> {
  const response = await publicApi.post<AuthenticationResponse>(AUTH_API + "/register", registerRequest)
  return response.data
}