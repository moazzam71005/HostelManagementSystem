import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wembevatuhjuvaeymtpa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbWJldmF0dWhqdXZhZXltdHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NjEwMjAsImV4cCI6MjA0ODAzNzAyMH0.CEJBiKZ0PQO4nIAdRD4ccSwSqNo3sRqYb31YsBiMpaQ'

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase