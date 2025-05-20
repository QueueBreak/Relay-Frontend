import {getUserChatRooms} from "@/api/chatrooms.ts";
import {redirect} from "react-router";

export async function chatLayoutLoader() {
  try {
    const chatRooms = await getUserChatRooms()
    return { chatRooms }
  } catch (e) {
    console.error("Failed to load chat rooms:", e)
    return redirect("/login");
  }
}