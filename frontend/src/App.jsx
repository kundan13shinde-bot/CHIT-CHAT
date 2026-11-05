import { useEffect } from 'react';
import './App.css'
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const { isSignedIn, getToken } = useAuth();

  // Saves the signed-in Clerk user to MongoDB (the webhook does the same when it can reach the backend).
  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        const token = await getToken();
        await fetch(`${API_URL}/api/users/sync`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to sync user", error);
      }
    })();
  }, [isSignedIn, getToken]);

  return (
    <div>
      <h1>MY APP</h1>
          <header>
        <Show when="signed-out">
          <SignInButton mode = "modal"/>
          <SignUpButton mode = "modal"/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
    )
}

export default App
