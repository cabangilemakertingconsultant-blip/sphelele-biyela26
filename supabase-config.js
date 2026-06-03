import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://utkcxjpxvlyhueqyhgzh.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0a2N4anB4dmx5aHVlcXloZ3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTIzNTAsImV4cCI6MjA5NjA2ODM1MH0.f8zgRGQdglPuQ5LGEcYhopG8hPSlQCvgnYtibypX9NA'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)
