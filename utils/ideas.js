import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bpcyehfovttkcvvedetr.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwY3llaGZvdnR0a2N2dmVkZXRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzM2MDc5NSwiZXhwIjoxOTc4OTM2Nzk1fQ.YHgeELf3NBm95GCNb4Z29320aUcXFWMEUrMDOvFvOAM');
export {supabase}

