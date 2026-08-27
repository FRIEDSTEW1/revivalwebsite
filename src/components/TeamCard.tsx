import type { TeamMember } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card className="overflow-hidden text-center">
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        className="h-64 w-full object-cover"
      />
      <CardContent className="flex flex-col items-center gap-2 pt-6">
        <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
        <p className="text-sm font-medium text-primary">{member.role}</p>
        <p className="text-xs text-muted-foreground">{member.experience}+ years experience</p>
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {member.specialties.map((s) => (
            <Badge key={s} variant="outline">{s}</Badge>
          ))}
        </div>
        <p className="pt-3 text-sm text-muted-foreground">{member.bio}</p>
      </CardContent>
    </Card>
  )
}
