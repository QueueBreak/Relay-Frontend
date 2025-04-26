import {Sidebar} from "@/components/custom/Sidebar.tsx";
import {Outlet} from "react-router";


export default function ChatLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar/>
      <main className="flex-1 flex flex-col">
        <Outlet/>
      </main>
    </div>
  )
}