import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import Loading from "./components/Loading";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>

      <BrowserRouter>
        <ShopContextProvider>

          <ClerkLoading>
            <Loading />
          </ClerkLoading>

          <ClerkLoaded>
            <App />
          </ClerkLoaded>

        </ShopContextProvider>
      </BrowserRouter>

    </ClerkProvider>
  </StrictMode>
)