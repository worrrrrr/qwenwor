import { supabaseAdmin } from '$lib/server/supabase';
import { mapTask, mapWorkflow } from '$lib/server/mappers';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// คำนวณ next_run แบบง่าย (สำหรับการทดสอบ)
// TODO: ใช้ cron-parser จริงเพื่อคำนวณตาม cron expression
function computeNextRun(): string {
	return new Date(Date.now() + 60_000).toISOString();
}

export const load: PageServerLoad = async () => {
	const [tasksRes, workflowsRes] = await Promise.all([
		supabaseAdmin
			.from('tasks')
			.select('*')
			.order('created_at', { ascending: false }),
		supabaseAdmin.from('workflows').select('*').order('name')
	]);

	return {
		tasks: tasksRes.data?.map(mapTask) ?? [],
		workflows: workflowsRes.data?.map(mapWorkflow) ?? []
	};
};

export const actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		const cron = String(form.get('cron') ?? '').trim();
		const action = String(form.get('action') ?? '').trim();
		const workflowId = String(form.get('workflowId') ?? '');

		if (!name || !cron) return fail(400, { error: 'กรุณากรอกชื่อและ cron expression' });

		const { error } = await supabaseAdmin.from('tasks').insert({
			name,
			cron_expression: cron,
			action: action || 'run_workflow',
			workflow_id: workflowId || null,
			enabled: true,
			next_run: computeNextRun()
		});

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const name = String(form.get('name') ?? '').trim();
		const cron = String(form.get('cron') ?? '').trim();
		const action = String(form.get('action') ?? '').trim();
		const workflowId = String(form.get('workflowId') ?? '');

		if (!name || !cron) return fail(400, { error: 'กรุณากรอกชื่อและ cron expression' });

		const { error } = await supabaseAdmin
			.from('tasks')
			.update({
				name,
				cron_expression: cron,
				action: action || 'run_workflow',
				workflow_id: workflowId || null,
				next_run: new Date(Date.now() + 60_000).toISOString()
			})
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	toggle: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const enabled = String(form.get('enabled') ?? '') === 'true';

		const { error } = await supabaseAdmin
			.from('tasks')
			.update({ enabled, next_run: enabled ? computeNextRun() : null })
			.eq('id', id);

		if (error) return fail(500, { error: error.message });
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');

		const { error } = await supabaseAdmin.from('tasks').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
} satisfies Actions;
