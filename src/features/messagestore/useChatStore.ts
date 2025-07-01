import {useContext} from "react";
import {ChatStoreContext} from "@/features/messagestore/ChatStoreContext.tsx";

export function useChatStore() {
  const ctx = useContext(ChatStoreContext);
  if (!ctx) throw new Error("useChatStore must be used inside ChatStoreProvider");
  return ctx;
}