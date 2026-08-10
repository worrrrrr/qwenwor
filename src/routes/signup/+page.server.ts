import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	signup: async ({ request, locals }) => {
		const form = await request.formData();
		const fullName = String(form.get('fullName') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'กรุณากรอกอีเมลและรหัสผ่าน', email, fullName });
		}

		if (password.length < 6) {
			return fail(400, { error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร', email, fullName });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName } }
		});

		if (error) {
			return fail(400, { error: error.message, email, fullName });
		}

		return {
			message: 'สมัครสมาชิกสำเร็จ! ตรวจสอบอีเมลเพื่อยืนยันบัญชี แล้วจึงเข้าสู่ระบบได้'
		};
	}
} satisfies Actions;
