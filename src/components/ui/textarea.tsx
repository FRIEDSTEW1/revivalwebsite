import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-36 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm transition-all placeholder:text-muted-foreground focus-visible:border-gold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/15 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
