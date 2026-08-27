import { SEO } from "@/components/SEO"
import { PageHeader } from "@/components/PageHeader"
import { TeamCard } from "@/components/TeamCard"
import { Reveal } from "@/components/motion/Reveal"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getTeam } from "@/lib/data"

export function Team() {
  const { data: team, loading, error } = useAsync(getTeam)

  return (
    <>
      <SEO
        title="Team"
        description="Meet the coaching team at Revival MMA — fully qualified, DBS certified, and experienced across MMA, Boxing, Kickboxing and BJJ."
      />
      <PageHeader
        eyebrow="Our Coaches"
        title="Meet The Team"
        subtitle="Our coaching team has over a decade of proven martial arts experience."
      />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {loading && <PageLoading />}
        {error && <PageError message={error} />}
        {team && team.length === 0 && (
          <PageEmpty message="Team members coming soon. Contact us to learn more about our coaches!" />
        )}
        {team && team.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={m.id} index={i}>
                <TeamCard member={m} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
