import { SEO } from "@/components/SEO"
import { PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getPageContent } from "@/lib/data"

const values = [
  {
    title: "Our Story",
    body: "Revival MMA was founded to give Harrow a martial arts home built on real technique, real coaching, and a real community — not a franchise checklist.",
  },
  {
    title: "Our Training Philosophy",
    body: "Beyond the physical skills, we develop confidence, discipline, and mental resilience in every student.",
  },
  {
    title: "Our Journey",
    body: "From a handful of classes to Harrow's largest dedicated martial arts academy, growth has always followed the same rule: put the training and the people first.",
  },
  {
    title: "Our Values",
    body: "Respect, discipline, and consistency — on the mats and off them.",
  },
]

export function About() {
  const { data: videoUrl, loading, error } = useAsync(() => getPageContent("about_video"))

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SEO
        title="About"
        description="The premier martial arts and fitness destination in Harrow. Learn our story, training philosophy, and values."
      />

      <div className="mb-12 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">About Revival MMA</p>
        <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
          The Largest Martial Arts Academy in Harrow
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Premium training with fully qualified coaches, for every age and every level.
        </p>
      </div>

      {loading && <PageLoading />}
      {error && <PageError message={error} />}
      {videoUrl && (
        <div className="mb-14 aspect-video w-full overflow-hidden rounded-lg border border-border">
          <iframe
            src={videoUrl}
            title="Revival MMA Documentary"
            className="h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="grid gap-10 sm:grid-cols-2">
        {values.map((v) => (
          <div key={v.title}>
            <h2 className="font-serif text-xl font-semibold">{v.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
