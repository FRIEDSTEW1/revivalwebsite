import { FramedImage } from "@/components/FramedImage"
import type { TeamMember } from "@/lib/types"

export function TeamCard({ member, priority = false }: { member: TeamMember; priority?: boolean }) {
  return (
    <article className="card-lift group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <FramedImage
          src={member.image?.trim()}
          framing={member.image_framing}
          defaultY={0}
          alt={member.name}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          sizes="(min-width: 1280px) 285px, (min-width: 1024px) 24vw, (min-width: 640px) 48vw, calc(100vw - 40px)"
          className="h-full w-full object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-serif text-xl font-bold text-white">{member.name}</h3>
          <p className="text-sm font-semibold text-gold">{member.role}</p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-dark dark:text-gold">
          {member.experience}+ Years Experience
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
      </div>
    </article>
  )
}
