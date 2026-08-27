import { supabase } from "./supabase"

function requireSupabase() {
  if (!supabase) {
    throw new Error("Admin actions require Supabase to be configured. See supabase/README.md.")
  }
  return supabase
}

export async function fetchAll<T>(
  table: string,
  orderBy?: string,
  opts?: { ascending?: boolean }
): Promise<T[]> {
  const client = requireSupabase()
  let query = client.from(table).select("*")
  if (orderBy) query = query.order(orderBy, { ascending: opts?.ascending ?? true })
  const { data, error } = await query
  if (error) throw error
  return data as T[]
}

export async function createRow(table: string, row: Record<string, unknown>) {
  const client = requireSupabase()
  const { error } = await client.from(table).insert(row)
  if (error) throw error
}

export async function updateRow(table: string, id: string, row: Record<string, unknown>) {
  const client = requireSupabase()
  const { error } = await client.from(table).update(row).eq("id", id)
  if (error) throw error
}

export async function deleteRow(table: string, id: string) {
  const client = requireSupabase()
  const { error } = await client.from(table).delete().eq("id", id)
  if (error) throw error
}

export async function upsertPageContent(page: string, content: string) {
  const client = requireSupabase()
  const { error } = await client
    .from("page_content")
    .upsert({ page, content, lastUpdated: new Date().toISOString() }, { onConflict: "page" })
  if (error) throw error
}

/** Row count for a table, optionally filtered to rows where `column` equals `value`. */
export async function countRows(
  table: string,
  filter?: { column: string; value: boolean }
): Promise<number> {
  const client = requireSupabase()
  let query = client.from(table).select("*", { count: "exact", head: true })
  if (filter) query = query.eq(filter.column, filter.value)
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

/** Persists a drag-reorder as sequential `order` values, in one batch. */
export async function persistOrder(table: string, orderedIds: string[]) {
  const client = requireSupabase()
  const results = await Promise.all(
    orderedIds.map((id, index) => client.from(table).update({ order: index }).eq("id", id))
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

/**
 * Uploads a file to the `media` storage bucket (see supabase/schema.sql)
 * and returns its public URL. Admin-only per the bucket's write policy.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const client = requireSupabase()
  const ext = file.name.split(".").pop() || "jpg"
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await client.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) throw error

  const { data } = client.storage.from("media").getPublicUrl(path)
  return data.publicUrl
}
