// Supabase client สำหรับฝั่ง browser (ถ้าต้องการเรียกจาก client)
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createBrowserClient(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
);
