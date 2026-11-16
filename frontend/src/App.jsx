import './App.css'
import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import ChatPage from './Pages/ChatPage.jsx'
import AuthPage from './Pages/AuthPage.jsx'
import { useAuth } from '@clerk/react'
import PageLoader from './components/auth/PageLoader.jsx'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore.js'

function App() {
  const { isSignedIn, isLoaded, getToken } = useAuth()
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const authUser = useAuthStore((state) => state.authUser)
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth)
  const isSyncingUser = useAuthStore((state) => state.isSyncingUser)

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn) {
      checkAuth(getToken)
    } else {
      clearAuth()
    }
  }, [isLoaded, isSignedIn, getToken, checkAuth, clearAuth])

  // Wait for Clerk to finish loading, otherwise we'd redirect before knowing the auth state.
  if (!isLoaded) return <PageLoader />

  // Signed in with Clerk but the MongoDB profile isn't verified/synced yet: hold the chat page back,
  // otherwise its API calls hit the backend first and get "404 User profile is not synced yet".
  if (isSignedIn && !authUser && (isCheckingAuth || isSyncingUser)) return <PageLoader />

  return (
    <>
      <Routes>
        <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
