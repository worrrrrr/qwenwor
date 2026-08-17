// @ts-nocheck
import { supabaseAdmin } from '$lib/server/supabase';
import { mapKnowledge } from '$lib/server/mappers';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = async () => {
	const res = await supabaseAdmin
		.from('knowledge')
		.select('*')
		.order('created_at', { ascending: false });

	return { knowledge: res.data?.map(mapKnowledge) ?? [] };
};

export const actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const content = String(form.get('content') ?? '').trim();
		const source = String(form.get('source') ?? '').trim();
		const tags = String(form.get('tags') ?? '')
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		if (!title || !content) return fail(400, { error: 'กรุณากรอกชื่อเรื่องและเนื้อหา' });

		const { error } = await supabaseAdmin
			.from('knowledge')
			.insert({ title, content, source: source || 'manual', tags });

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const title = String(form.get('title') ?? '').trim();
		const content = String(form.get('content') ?? '').trim();
		const source = String(form.get('source') ?? '').trim();
		const tags = String(form.get('tags') ?? '')
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		if (!title || !content) return fail(400, { error: 'กรุณากรอกชื่อเรื่องและเนื้อหา' });

		const { error } = await supabaseAdmin
			.from('knowledge')
			.update({
				title,
				content,
				source: source || 'manual',
				tags,
				updated_at: new Date().toISOString()
			})
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');

		const { error } = await supabaseAdmin.from('knowledge').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
} satisfies Actions;
;null as any as PageServerLoad;