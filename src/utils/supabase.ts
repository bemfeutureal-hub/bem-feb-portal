import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qozvqigaktfzwvthbxte.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenZxaWdha3Rmend2dGhieHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MjA3NDMsImV4cCI6MjEwODM5Njc0M30.gJmisaPjkGufzgOHdY2VI3HZ1B22fDf2PqHlnLsj-o4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
