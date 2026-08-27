import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "center" | "left"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-dark dark:text-gold">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
      <span aria-hidden className="mt-1 h-1 w-16 rounded-full bg-gold-gradient" />
    </div>
  )
}
