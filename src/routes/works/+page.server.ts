import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { mapWork } from '$lib/server/mappers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/login');

	const { data } = await supabaseAdmin
		.from('agent_works')
		.select('*, agents(name)')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	return { works: (data ?? []).map(mapWork) };
};
