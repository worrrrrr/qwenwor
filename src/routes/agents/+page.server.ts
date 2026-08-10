import { supabaseAdmin } from '$lib/server/supabase';
import { mapAgent, mapMemory } from '$lib/server/mappers';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [agentsRes, memoriesRes] = await Promise.all([
		supabaseAdmin.from('agents').select('*').order('name'),
		supabaseAdmin
			.from('memories')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(200)
	]);

	const agents = agentsRes.data?.map(mapAgent) ?? [];
	const memories = memoriesRes.data ?? [];

	for (const agent of agents) {
		agent.memory = memories
			.filter((m) => m.agent_id === agent.id)
			.map(mapMemory);
	}

	return { agents };
};

export const actions = {
	create: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'ต้องล็อกอินก่อน' });

		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const role = String(form.get('role') ?? '').trim();
		const personality = String(form.get('personality') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();
		const provider = String(form.get('provider') ?? 'groq');
		const model = String(form.get('model') ?? '').trim();
		const color = String(form.get('avatarColor') ?? 'blue');

		if (!name) return fail(400, { error: 'กรุณากรอกชื่อ Agent' });

		const id = `agent_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

		const { error } = await supabaseAdmin.from('agents').insert({
			id,
			name,
			identity: {
				personality,
				traits: [],
				role,
				description
			},
			capabilities: [],
			status: 'idle',
			provider,
			model,
			avatar_color: color
		});

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const name = String(form.get('name') ?? '').trim();
		const role = String(form.get('role') ?? '').trim();
		const personality = String(form.get('personality') ?? '').trim();
		const description = String(form.get('description') ?? '').trim();
		const provider = String(form.get('provider') ?? 'groq');
		const model = String(form.get('model') ?? '').trim();
		const color = String(form.get('avatarColor') ?? 'blue');

		if (!name) return fail(400, { error: 'กรุณากรอกชื่อ Agent' });

		const { error } = await supabaseAdmin
			.from('agents')
			.update({
				name,
				identity: { personality, traits: [], role, description },
				provider,
				model,
				avatar_color: color,
				updated_at: new Date().toISOString()
			})
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');

		const { error } = await supabaseAdmin.from('agents').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	setStatus: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const status = String(form.get('status') ?? '');

		if (!['idle', 'working', 'waiting', 'error'].includes(status)) {
			return fail(400, { error: 'สถานะไม่ถูกต้อง' });
		}

		const { error } = await supabaseAdmin
			.from('agents')
			.update({ status, updated_at: new Date().toISOString() })
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	addMemory: async ({ request }) => {
		const form = await request.formData();
		const agentId = String(form.get('agentId') ?? '');
		const type = String(form.get('type') ?? 'short_term');
		const content = String(form.get('content') ?? '').trim();

		if (!content) return fail(400, { error: 'กรุณากรอกข้อความ' });

		const { error } = await supabaseAdmin
			.from('memories')
			.insert({ agent_id: agentId, type, content });

		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
} satisfies Actions;
