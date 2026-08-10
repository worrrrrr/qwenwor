import { createServerClient } from '@supabase/ssr';
import { type Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	// สร้าง Supabase client ฝั่ง server ที่ผูกกับ cookies ของ request/response
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// ดึงผู้ใช้ที่ล็อกอินอยู่ (getUser = ยืนยันกับ Auth server ทุกครั้ง — ปลอดภัยกว่า getSession)
	event.locals.safeGetSession = async () => {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return { user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
