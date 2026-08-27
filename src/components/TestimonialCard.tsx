import { Quote, Star } from "lucide-react"
import type { Testimonial } from "@/lib/types"

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card-lift relative flex h-full flex-col rounded-xl border border-border bg-card p-7 shadow-sm">
      <Quote
        aria-hidden
        className="absolute right-6 top-6 h-8 w-8 text-gold/20"
        fill="currentColor"
      />

      <div
        className="flex gap-0.5 text-gold"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {testimonial.content}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-sm font-bold text-gold-dark dark:text-gold">
          {testimonial.name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-semibold">{testimonial.name}</span>
          <span className="block text-xs text-muted-foreground">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  )
}
