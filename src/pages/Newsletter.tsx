import { Mail } from "lucide-react"
import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { NewsletterForm } from "@/components/NewsletterForm"

export function Newsletter() {
  return (
    <>
      <SEO
        title="Newsletter"
        description="Stay updated with the latest news and announcements from Revival MMA."
      />
      <PageHeader
        eyebrow="Newsletter"
        title="Stay In The Loop"
        subtitle="Stay updated with the latest news and announcements."
      />

      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-gold/30 bg-gold/5 p-10 text-center sm:p-12">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark dark:text-gold">
            <Mail className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Class updates, grading dates, and academy announcements — straight to your inbox. No
            spam, unsubscribe any time.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </>
  )
}
