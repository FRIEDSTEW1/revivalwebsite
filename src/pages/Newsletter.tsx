import { SEO } from "@/components/SEO"
import { NewsletterForm } from "@/components/NewsletterForm"

export function Newsletter() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <SEO
        title="Newsletter"
        description="Stay updated with the latest news and announcements from Revival MMA."
      />
      <h1 className="font-serif text-4xl font-bold sm:text-5xl">Stay In The Loop</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        Stay updated with the latest news and announcements.
      </p>
      <div className="mt-8 flex justify-center">
        <NewsletterForm />
      </div>
    </div>
  )
}
