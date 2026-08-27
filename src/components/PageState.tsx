export function PageLoading() {
  return <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
}

export function PageError({ message }: { message: string }) {
  return <p className="py-12 text-center text-sm text-destructive">{message}</p>
}

export function PageEmpty({ message }: { message: string }) {
  return <p className="py-12 text-center text-sm text-muted-foreground">{message}</p>
}
