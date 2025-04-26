import {ThemeProvider} from "@/components/theme-provider.tsx";
import ChatPage from "@/pages/ChatPage.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ChatPage />
    </ThemeProvider>
  )
}

export default App
