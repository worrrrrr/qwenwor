import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	// เข้าสู่ระบบด้วยอีเมล + รหัสผ่าน
	login: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'กรุณากรอกอีเมลและรหัสผ่าน', email });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { error: error.message, email });
		}

		const redirectTo = url.searchParams.get('redirectTo');
		redirect(303, redirectTo && redirectTo.startsWith('/') ? redirectTo : '/');
	},

	// ส่งลิงก์เข้าสู่ระบบทางอีเมล (Magic Link / OTP)
	magiclink: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();

		if (!email) {
			return fail(400, { error: 'กรุณากรอกอีเมล' });
		}

		const { error } = await locals.supabase.auth.signInWithOtp({
			email,
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});

		if (error) {
			return fail(400, { error: error.message, email });
		}

		return { message: `ส่งลิงก์เข้าสู่ระบบไปยัง ${email} แล้ว — ตรวจสอบอีเมลของคุณ` };
	}
} satisfies Actions;
