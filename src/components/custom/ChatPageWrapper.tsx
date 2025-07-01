import { useParams } from "react-router";
import ChatPage from "@/pages/ChatPage.tsx";

export default function ChatPageWrapper() {
  const { chatId } = useParams();

  if (!chatId) return null;

  return <ChatPage key={chatId} />;
}