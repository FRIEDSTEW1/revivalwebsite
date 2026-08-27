import { supabase } from "./supabase"

function requireSupabase() {
  if (!supabase) {
    throw new Error("Admin actions require Supabase to be configured. See supabase/README.md.")
  }
  return supabase
}

export async function fetchAll<T>(table: string, orderBy?: string): Promise<T[]> {
  const client = requireSupabase()
  let query = client.from(table).select("*")
  if (orderBy) query = query.order(orderBy)
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
