import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djmdymzglwroykquvirx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbWR5bXpnbHdyb3lrcXV2aXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTU1MDEsImV4cCI6MjA3MzYzMTUwMX0.0UzhI2WB_RKhX_M1vHDTqXWSUcA7hWybZIONuoFPhSs'
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;
