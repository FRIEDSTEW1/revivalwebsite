import { Check } from "lucide-react"
import type { GymClass } from "@/lib/types"

export function ClassCard({ gymClass }: { gymClass: GymClass }) {
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={gymClass.image?.trim()}
          alt={gymClass.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-gray-900 shadow-sm">
          {gymClass.ageRange}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-bold">{gymClass.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {gymClass.description}
        </p>

        <ul className="mt-5 grid gap-2 border-t border-border pt-5">
          {gymClass.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark dark:text-gold" strokeWidth={2.5} />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
