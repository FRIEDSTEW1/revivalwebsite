interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div
        aria-hidden
        className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-20">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-dark dark:text-gold">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 font-serif text-[clamp(2.25rem,5.5vw,3.5rem)] font-bold leading-[1.08]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
        <span aria-hidden className="mx-auto mt-7 block h-1 w-16 rounded-full bg-gold-gradient" />
      </div>
    </section>
  )
}
