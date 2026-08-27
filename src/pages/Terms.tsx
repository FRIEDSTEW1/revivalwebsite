import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getPageContent } from "@/lib/data"

const prose = [
  "[&_h2]:mt-0 [&_h2]:mb-6 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight",
  "[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground",
  "[&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted-foreground",
  "[&_ul]:mb-5 [&_ul]:space-y-2 [&_ul]:pl-1",
  "[&_li]:relative [&_li]:pl-6 [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-muted-foreground",
  "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.6em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-gold",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
].join(" ")

export function Terms() {
  const { data: content, loading, error } = useAsync(() => getPageContent("terms"))

  return (
    <>
      <SEO title="Terms & Conditions" description="Please read our terms and conditions carefully." />
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Please read our terms and conditions carefully."
      />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {content === null && !loading && !error && (
          <PageEmpty message="Terms & Conditions will be available soon." />
        )}
        {content && (
          <article
            className={`rounded-xl border border-border bg-card p-8 shadow-sm sm:p-12 ${prose}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </>
  )
}
