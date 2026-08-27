import { Award, ShieldCheck, Sparkles, Users } from "lucide-react"
import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeading } from "@/components/SectionHeading"
import { PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getPageContent } from "@/lib/data"

const values = [
  {
    icon: Sparkles,
    title: "Our Story",
    body: "Revival MMA was founded to give Harrow a martial arts home built on real technique, real coaching, and a real community — not a franchise checklist.",
  },
  {
    icon: Award,
    title: "Our Training Philosophy",
    body: "Beyond the physical skills, we develop confidence, discipline, and mental resilience in every student.",
  },
  {
    icon: Users,
    title: "Our Journey",
    body: "From a handful of classes to Harrow's largest dedicated martial arts academy, growth has always followed the same rule: put the training and the people first.",
  },
  {
    icon: ShieldCheck,
    title: "Our Values",
    body: "Respect, discipline, and consistency — on the mats and off them.",
  },
]

export function About() {
  const { data: videoUrl, loading, error } = useAsync(() => getPageContent("about_video"))

  return (
    <>
      <SEO
        title="About"
        description="The premier martial arts and fitness destination in Harrow. Learn our story, training philosophy, and values."
      />
      <PageHeader
        eyebrow="About Revival MMA"
        title="The Largest Martial Arts Academy in Harrow"
        subtitle="Premium training with fully qualified coaches, for every age and every level."
      />

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {videoUrl && (
          <figure className="overflow-hidden rounded-xl border border-border shadow-lg">
            <div className="aspect-video w-full bg-muted">
              <iframe
                src={videoUrl}
                title="Revival MMA Documentary"
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className="border-t border-border bg-card px-6 py-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Revival MMA Documentary</span> — see
              our extensive facilities and specialist equipment.
            </figcaption>
          </figure>
        )}

        <div className="mt-20">
          <SectionHeading
            title="What We Stand For"
            subtitle="Everything you need to transform your life"
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="card-lift rounded-xl border border-border bg-card p-7 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold-dark dark:text-gold">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
