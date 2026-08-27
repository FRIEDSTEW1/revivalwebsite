import { Star } from "lucide-react"
import type { Testimonial } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <img
          src={testimonial.image}
          alt=""
          aria-hidden
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex gap-0.5 text-amber-500" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{testimonial.content}</p>
      </CardContent>
    </Card>
  )
}
