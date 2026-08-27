import type { TeamMember } from "@/lib/types"

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="card-lift group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={member.image?.trim()}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
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
