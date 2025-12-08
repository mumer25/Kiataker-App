// supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xshafdlkblzngihmllrt.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaGFmZGxrYmx6bmdpaG1sbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTg5NjYsImV4cCI6MjA4MDQ5NDk2Nn0.8VuQeogJosj5ooKX4RSPNCORudhhCvoQ4QQOg7IPfb4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,        // ✅ Persist sessions in React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,    // ✅ Not needed for React Native
  },
});




// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = 'https://xshafdlkblzngihmllrt.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaGFmZGxrYmx6bmdpaG1sbHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTg5NjYsImV4cCI6MjA4MDQ5NDk2Nn0.8VuQeogJosj5ooKX4RSPNCORudhhCvoQ4QQOg7IPfb4';

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
