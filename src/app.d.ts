import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from './database.types.ts' // import generated types

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      supabase: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
      session: Session | null
      user: User | null
    }
    interface PageData {
      session: Session | null
      user: User | null
    }
    // interface PageState {}
    // interface Platform {}
  }
}
