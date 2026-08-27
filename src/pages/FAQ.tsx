import { Link } from "react-router-dom"
import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { FAQAccordion } from "@/components/FAQAccordion"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { Button } from "@/components/ui/button"
import { useAsync } from "@/lib/hooks"
import { getFAQs } from "@/lib/data"

export function FAQ() {
  const { data: faqs, loading, error } = useAsync(getFAQs)

  return (
    <>
      <SEO
        title="FAQ"
        description="Frequently Asked Questions — everything you need to know about Revival MMA."
      />
      <PageHeader
        eyebrow="Got Questions?"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Revival MMA."
      />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {faqs && faqs.length === 0 && <PageEmpty message="No FAQs available yet." />}
        {faqs && faqs.length > 0 && (
          <div className="rounded-xl border border-border bg-card px-6 shadow-sm">
            <FAQAccordion items={faqs} />
          </div>
        )}

        <div className="mt-14 flex flex-col items-center gap-4 rounded-xl border border-gold/30 bg-gold/5 p-10 text-center">
          <h2 className="font-serif text-2xl font-bold">Still Have Questions?</h2>
          <p className="text-sm text-muted-foreground">Contact us if you have any questions!</p>
          <Button asChild size="lg">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
