import { SEO } from "@/components/SEO"
import { FAQAccordion } from "@/components/FAQAccordion"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { Button } from "@/components/ui/button"
import { useAsync } from "@/lib/hooks"
import { getFAQs } from "@/lib/data"
import { Link } from "react-router-dom"

export function FAQ() {
  const { data: faqs, loading, error } = useAsync(getFAQs)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SEO
        title="FAQ"
        description="Frequently Asked Questions — everything you need to know about Revival MMA."
      />

      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Everything you need to know about Revival MMA.
        </p>
      </div>

      {loading && <PageLoading />}
      {error && <PageError message={error} />}
      {faqs && faqs.length === 0 && <PageEmpty message="No FAQs available yet." />}
      {faqs && faqs.length > 0 && <FAQAccordion items={faqs} />}

      <div className="mt-12 flex flex-col items-center gap-3 rounded-lg border border-border bg-muted/30 p-8 text-center">
        <h2 className="font-serif text-xl font-semibold">Still Have Questions?</h2>
        <p className="text-sm text-muted-foreground">Contact us if you have any questions!</p>
        <Button asChild>
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
