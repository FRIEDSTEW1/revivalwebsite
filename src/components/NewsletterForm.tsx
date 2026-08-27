import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeNewsletter } from "@/lib/data"

export function NewsletterForm() {
  const [submitting, setSubmitting] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = String(new FormData(form).get("email") ?? "")
    setSubmitting(true)
    try {
      await subscribeNewsletter(email)
      setSubscribed(true)
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (subscribed) {
    return <p className="font-semibold">You're subscribed! Watch your inbox for updates.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        aria-label="Email address"
        className="sm:max-w-xs"
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  )
}
