import type { GymClass } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ClassCard({ gymClass }: { gymClass: GymClass }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <img
        src={gymClass.image}
        alt={gymClass.name}
        loading="lazy"
        className="h-48 w-full object-cover"
      />
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{gymClass.name}</CardTitle>
          <Badge variant="secondary">{gymClass.ageRange}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm text-muted-foreground">{gymClass.description}</p>
        <ul className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {gymClass.benefits.map((b) => (
            <li key={b} className="flex items-center gap-1.5">
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
              {b}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
