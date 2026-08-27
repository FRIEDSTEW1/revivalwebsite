import { SEO } from "@/components/SEO"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getPageContent } from "@/lib/data"

export function Terms() {
  const { data: content, loading, error } = useAsync(() => getPageContent("terms"))

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <SEO
        title="Terms & Conditions"
        description="Please read our terms and conditions carefully."
      />

      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Terms & Conditions</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Please read our terms and conditions carefully.
        </p>
      </div>

      {loading && <PageLoading />}
      {error && <PageError message={error} />}
      {content === null && !loading && !error && (
        <PageEmpty message="Terms & Conditions will be available soon." />
      )}
      {content && (
        <div
          className="[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-3 [&_p]:text-sm [&_p]:text-muted-foreground [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_li]:text-sm [&_li]:text-muted-foreground [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  )
}
