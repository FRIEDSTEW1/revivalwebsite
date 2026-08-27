import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-all placeholder:text-muted-foreground focus-visible:border-gold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/15 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
