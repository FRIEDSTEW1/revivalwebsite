import { Loader2 } from "lucide-react"

export function PageLoading() {
  return (
    <div className="flex items-center justify-center gap-2.5 py-20 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-gold-dark dark:text-gold" />
      Loading…
    </div>
  )
}

export function PageError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center text-sm text-destructive">
      {message}
    </p>
  )
}

export function PageEmpty({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
      {message}
    </p>
  )
}
