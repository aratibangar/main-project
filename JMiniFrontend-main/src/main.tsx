import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
        <UserProvider>
        <App />
        </UserProvider>
     </BrowserRouter>
  </StrictMode>,
)
