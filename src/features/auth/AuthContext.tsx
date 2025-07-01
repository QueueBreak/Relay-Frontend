import {createContext} from "react"
import {AuthenticationContextValue} from "@/types/AuthenticationContextValue.ts";

export const AuthContext = createContext<AuthenticationContextValue | undefined>(undefined)