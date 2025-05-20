import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider,} from "react-router";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import ChatLayout from "@/layouts/ChatLayout.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import RegisterPage from "@/pages/RegisterPage.tsx";
import {AuthProvider} from "@/features/auth/AuthProvider.tsx";
import {chatLayoutLoader} from "@/loaders/chatLayoutLoader.ts";
import {chatPageLoader} from "@/loaders/chatPageLoader.ts";
import ChatPage from "@/pages/ChatPage.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/register",
    element: <RegisterPage/>
  },
  {
    path: "/",
    element: <ChatLayout/>,
    loader: chatLayoutLoader,
    children: [
      {
        index: true,
        //TODO: Extract this component
        element: <div className="flex bg-card items-center justify-center h-full text-muted-foreground">Select a chat</div>
      },
      {
        path: "chat/:chatId",
        loader: chatPageLoader,
        element: <ChatPage/>
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router}/>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)
