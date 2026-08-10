// เริ่มเข้าสู่ระบบด้วย Google (OAuth + PKCE)
// 1) ผู้ใช้กดปุ่ม → มา GET /auth/google?next=...
// 2) เรียก signInWithOAuth → Supabase เก็บ code_verifier ใน cookie แล้ว redirect ไปหน้า Google
// 3) Google ส่งกลับมาที่ /auth/callback?code=... → แลกเป็น session (โค้ดเดิมที่มีอยู่)
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const next = url.searchParams.get('next') ?? '/';
	// ป้องกัน open redirect: ให้ redirect ได้เฉพาะ path ในแอปเท่านั้น
	const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';

	const redirectTo = `${url.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;

	const { data, error } = await locals.supabase.auth.signInWithOAuth({
		provider: 'google',
		options: { redirectTo }
	});

	if (error || !data.url) {
		redirect(
			303,
			'/login?error=' + encodeURIComponent(`ไม่สามารถเชื่อมต่อ Google ได้: ${error?.message ?? 'unknown'}`)
		);
	}

	redirect(302, data.url);
};
