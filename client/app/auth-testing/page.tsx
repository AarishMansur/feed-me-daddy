"use client"
import { authClient } from "../lib/auth-client"


function AuthTesting() {
   const { data: session ,isPending} = authClient.useSession()
  return (
    <main style={{ padding: 32 }}>
      <h1>Auth Testing</h1>

      {isPending ? (
        <p>Loading...</p>
      ) : session ? (
        <>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <button onClick={() => authClient.signOut()}>Sign out</button>
        </>
      ) : (
        <button
          onClick={() =>
            authClient.signIn.social({
              provider: "google",
              callbackURL: "http://localhost:3000/auth-testing",
            })
          }
        >
          Continue with Google
        </button>
      )}
    </main>
  )
}

export default AuthTesting