import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export type User = {
  id: number
  discord_id: string
  username: string
  avatar_url?: string
  favorite_language_id?: number
  created_at: string
}

export type Series = {
  id: number
  name: string
  release_year?: number
  created_at: string
}

export type Set = {
  id: number
  series_id: number
  name: string
  code: string
  release_date?: string
  total_cards?: number
  created_at: string
  series_name?: string
}

export type Card = {
  id: number
  set_id: number
  number: string
  name: string
  rarity?: string
  card_type?: string
  created_at: string
  set_name?: string
  set_code?: string
}

export type Language = {
  id: number
  code: string
  name: string
}

export type Variant = {
  id: number
  name: string
  description?: string
}

export type Condition = {
  id: number
  name: string
  abbreviation?: string
  description?: string
}

export type UserCard = {
  id: number
  user_id: number
  card_id: number
  language_id: number
  variant_id: number
  condition_id: number
  quantity: number
  notes?: string
  created_at: string
  updated_at: string
  card_name?: string
  card_number?: string
  set_name?: string
  set_code?: string
  language_name?: string
  variant_name?: string
  condition_name?: string
}

export type UserCollectingSet = {
  id: number
  user_id: number
  set_id: number
  created_at: string
  set_name?: string
  set_code?: string
  series_name?: string
}
