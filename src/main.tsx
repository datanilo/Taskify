import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles.css'
import { SidebarProvider } from '@/components/ui/sidebar.tsx' 
import App from '@/App.tsx'
import { UserProvider } from '@/auth/contexts/UserProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </UserProvider>
  </StrictMode>,
)