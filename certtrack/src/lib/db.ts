import { createClient, type InValue } from '@libsql/client'

// Bolt native database connection
// Uses libsql - Bolt's built-in database
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./db/certtrack.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export default db

// Helper for typed queries
export async function query<T>(sql: string, params: InValue[] = []): Promise<T[]> {
  const result = await db.execute({ sql, args: params })
  return result.rows as T[]
}

export async function queryOne<T>(sql: string, params: InValue[] = []): Promise<T | null> {
  const result = await db.execute({ sql, args: params })
  return (result.rows[0] as T) || null
}

export async function execute(sql: string, params: InValue[] = []): Promise<{ rowsAffected: number; lastInsertRowid: number | bigint }> {
  const result = await db.execute({ sql, args: params })
  return {
    rowsAffected: result.rowsAffected,
    lastInsertRowid: result.lastInsertRowid ?? 0,
  }
}