import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// ปลายทางสำหรับ Magic Link / OAuth callback (PKCE: แลก code เป็น session)
export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) redirect(303, next);
	}

	redirect(303, '/login');
};
