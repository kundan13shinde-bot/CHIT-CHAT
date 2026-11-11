import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import ChatPage from './Pages/ChatPage.jsx'
import AuthPage from './Pages/AuthPage.jsx'
import { useAuth } from '@clerk/react'
import PageLoader from './components/auth/PageLoader.jsx'

function App() {
  const { isSignedIn, isLoaded } = useAuth()

  // Wait for Clerk to finish loading, otherwise we'd redirect before knowing the auth state.
  if (!isLoaded) return <PageLoader />

  return (
    <Routes>
      <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to="/auth" replace />} />
      <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
