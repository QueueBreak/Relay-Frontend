import {Sidebar} from "@/components/custom/Sidebar.tsx";
import {Navigate, Outlet} from "react-router";
import {useAuth} from "@/features/auth/useAuth.ts";
import Loader from "@/components/custom/Loader.tsx";
import {WebSocketProvider} from "@/features/websocket/WebSocketProvider.tsx";
import {ChatStoreProvider} from "@/features/messagestore/ChatStoreProvider.tsx";


export default function ChatLayout() {
  const {isAuthenticated, isLoading} = useAuth()

  if (isLoading) return <Loader/>

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  return (
    <ChatStoreProvider>
      <WebSocketProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col h-full min-h-0">
            <Outlet />
          </main>
        </div>
      </WebSocketProvider>
    </ChatStoreProvider>
  )
}