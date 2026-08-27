import { SEO } from "@/components/SEO"
import { TeamCard } from "@/components/TeamCard"
import { PageEmpty, PageError, PageLoading } from "@/components/PageState"
import { useAsync } from "@/lib/hooks"
import { getTeam } from "@/lib/data"

export function Team() {
  const { data: team, loading, error } = useAsync(getTeam)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SEO
        title="Team"
        description="Meet the coaching team at Revival MMA — fully qualified, DBS certified, and experienced across MMA, Boxing, Kickboxing and BJJ."
      />

      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">Meet Our Coaches</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Our coaching team has over a decade of proven martial arts experience.
        </p>
      </div>

      {loading && <PageLoading />}
      {error && <PageError message={error} />}
      {team && team.length === 0 && (
        <PageEmpty message="Team members coming soon. Contact us to learn more about our coaches!" />
      )}
      {team && team.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <TeamCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  )
}
