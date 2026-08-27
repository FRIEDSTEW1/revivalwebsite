import { useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, isSupabaseConfigured } from "@/lib/auth"

export function AdminLogin() {
  const { session, signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-24 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-bold">Admin Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your website content and settings</p>
      </div>

      {!isSupabaseConfigured && (
        <p className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          Please log in to access admin panel. Admin login isn't available yet — connect Supabase
          first (see <code>supabase/README.md</code>).
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading || !isSupabaseConfigured}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
}
