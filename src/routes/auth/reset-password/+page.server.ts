import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// ผู้ใช้คลิกลิงก์จากอีเมล → มาโดยมี ?code=... → แลกเป็น session แล้วล้าง URL
export const load: PageServerLoad = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) redirect(303, '/auth/reset-password');
	}

	// ไม่มี session → ลิงก์ไม่ถูกต้อง/หมดอายุ ให้กลับไปหน้า login พร้อมแจ้ง
	const { user } = await locals.safeGetSession();
	if (!user) {
		redirect(
			303,
			'/login?error=' +
				encodeURIComponent('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ — ลองขอใหม่อีกครั้ง')
		);
	}

	return {};
};

export const actions = {
	update: async ({ request, locals }) => {
		const form = await request.formData();
		const password = String(form.get('password') ?? '');
		const confirmPassword = String(form.get('confirmPassword') ?? '');

		if (password.length < 6) {
			return fail(400, { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
		}
		if (password !== confirmPassword) {
			return fail(400, { error: 'รหัสผ่านทั้งสองช่องไม่ตรงกัน' });
		}

		const { error } = await locals.supabase.auth.updateUser({ password });
		if (error) {
			return fail(400, { error: error.message });
		}

		redirect(
			303,
			'/login?message=' + encodeURIComponent('รีเซ็ตรหัสผ่านสำเร็จ! เข้าสู่ระบบด้วยรหัสผ่านใหม่')
		);
	}
} satisfies Actions;
