import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider,} from "react-router";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import ChatLayout from "@/layouts/ChatLayout.tsx";
import ChatPage from "@/pages/ChatPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import RegisterPage from "@/pages/RegisterPage.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/",
    element: <ChatLayout/>,
    children: [
      {
        index: true,
        //TODO: Extract this component
        element: <div className="flex items-center justify-center h-full text-muted-foreground">Select a chat</div>
      },
      {
        path: "/chat/:chatId",
        element: <ChatPage/>
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}/>
    </ThemeProvider>
  </StrictMode>,
)
