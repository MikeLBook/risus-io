"use client"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const { user, loading, signInWithDiscord, signOut } = useAuth()
  const searchParams = useSearchParams()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading auth state...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Debug Info */}
      <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <div className="text-sm space-y-1">
          <div>User: {user ? "✅ Logged in" : "❌ Not logged in"}</div>
          <div>Loading: {loading ? "⏳ True" : "✅ False"}</div>
          <div>User Email: {user?.email || "None"}</div>
          <div>User ID: {user?.id || "None"}</div>
          <div>URL Error: {searchParams.get("error") || "None"}</div>
          <div>URL Success: {searchParams.get("success") || "None"}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {!user ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <button
              onClick={signInWithDiscord}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700"
            >
              Sign in with Discord
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
            <p className="mb-4">Email: {user.email}</p>
            <p className="mb-4">ID: {user.id}</p>
            {user.user_metadata?.full_name && (
              <p className="mb-4">Name: {user.user_metadata.full_name}</p>
            )}
            <div className="flex-row" style={{ justifyContent: "space-between" }}>
              <Button asChild>
                <Link href="/characters">View Characters</Link>
              </Button>
              <Button onClick={signOut}>Sign Out</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
