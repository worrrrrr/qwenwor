// Supabase client สำหรับฝั่ง server เท่านั้น
// ใช้ Service Role Key → bypass RLS (ยังไม่มีระบบ auth)
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export const supabaseAdmin = createClient(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		realtime: {
			params: {
				eventsPerSecond: 10
			},
			disabled: true
		}
	}
);

export { createClient };
