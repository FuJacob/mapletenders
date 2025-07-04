import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzlyducvtzmuflltsaho.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bHlkdWN2dHptdWZsbHRzYWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NzY5NDcsImV4cCI6MjA2NzE1Mjk0N30.zbigBZC_FS6vfxhHypVO50PpohslcuMpPxKndDs71Rw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these with Supabase CLI later)
export interface Profile {
  id: string
  email: string
  company_name?: string
  company_size?: string
  industry?: string
  profile_completed: boolean
  created_at: string
  updated_at: string
}
