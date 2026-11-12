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
