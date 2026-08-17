// @ts-nocheck
import { supabaseAdmin } from '$lib/server/supabase';
import { mapAgent, mapKnowledge, mapTask, mapWorkflow } from '$lib/server/mappers';
import type { PageServerLoad } from './$types';

export const load = async () => {
	const [agentsRes, knowledgeRes, workflowsRes, tasksRes] = await Promise.all([
		supabaseAdmin.from('agents').select('*').order('name'),
		supabaseAdmin
			.from('knowledge')
			.select('*')
			.order('created_at', { ascending: false }),
		supabaseAdmin
			.from('workflows')
			.select('*, workflow_steps(*)')
			.order('created_at', { ascending: false }),
		supabaseAdmin
			.from('tasks')
			.select('*')
			.order('created_at', { ascending: false })
	]);

	return {
		agents: agentsRes.data?.map(mapAgent) ?? [],
		knowledge: knowledgeRes.data?.map(mapKnowledge) ?? [],
		workflows: workflowsRes.data?.map(mapWorkflow) ?? [],
		tasks: tasksRes.data?.map(mapTask) ?? []
	};
};
;null as any as PageServerLoad;