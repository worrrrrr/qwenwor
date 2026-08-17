// @ts-nocheck
import { supabaseAdmin } from '$lib/server/supabase';
import { mapAgent, mapWorkflow } from '$lib/server/mappers';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = async () => {
	const [wfRes, agentsRes] = await Promise.all([
		supabaseAdmin
			.from('workflows')
			.select('*, workflow_steps(*)')
			.order('created_at', { ascending: false }),
		supabaseAdmin.from('agents').select('*').order('name')
	]);

	return {
		workflows: wfRes.data?.map(mapWorkflow) ?? [],
		agents: agentsRes.data?.map(mapAgent) ?? []
	};
};

export const actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		if (!name) return fail(400, { error: 'กรุณากรอกชื่อ workflow' });

		// โหมดง่าย: รับเฉพาะลำดับ Agent → สร้างขั้นตอนอัตโนมัติตามหน้าที่
		const order = form.getAll('agentOrder').map(String).filter(Boolean);
		if (order.length === 0) return fail(400, { error: 'กรุณาเลือก Agent อย่างน้อย 1 ตัว' });

		// โหมดขั้นสูง: ถ้ามี stepName/stepAction ให้ใช้ค่าที่ผู้ใช้ตั้งเอง (fallback เป็นอัตโนมัติ)
		const stepNames = form.getAll('stepName').map(String);
		const stepActions = form.getAll('stepAction').map(String);

		// โหลดข้อมูล Agent เพื่อสร้างชื่อขั้นตอนจากบทบาท/ความสามารถ
		const { data: agents } = await supabaseAdmin
			.from('agents')
			.select('id, name, identity, capabilities');
		const agentMap = new Map((agents ?? []).map((a) => [a.id, a]));

		const capabilityLabels: Record<string, string> = {
			coordination: 'ประสานงาน',
			creative_writing: 'เขียนเนื้อหาสร้างสรรค์',
			planning: 'วางแผน',
			review: 'ทบทวนผลงาน',
			research: 'ค้นหาข้อมูล',
			data_analysis: 'วิเคราะห์ข้อมูล',
			summarization: 'สรุปเนื้อหา',
			fact_checking: 'ตรวจสอบข้อเท็จจริง',
			coding: 'เขียนโค้ด',
			workflow_design: 'ออกแบบ workflow',
			automation: 'จัดการอัตโนมัติ',
			debugging: 'แก้ไขปัญหา'
		};

		const steps = order.map((agentId, i) => {
			const agent = agentMap.get(agentId);
			const cap = (agent?.capabilities?.[0] as string | undefined) ?? 'process';
			const role = agent?.identity?.role;
			const autoName = agent
				? `${agent.name} — ${capabilityLabels[cap] ?? role ?? 'ทำงาน'}`
				: `ขั้นตอน ${i + 1}`;
			return {
				name: stepNames[i]?.trim() || autoName,
				agent_id: agentId,
				action: stepActions[i]?.trim() || cap,
				position: i
			};
		});

		const { data: wf, error: wfError } = await supabaseAdmin
			.from('workflows')
			.insert({ name })
			.select('id')
			.single();

		if (wfError) return fail(500, { error: wfError.message });

		const { error: stepsError } = await supabaseAdmin
			.from('workflow_steps')
			.insert(steps.map((s) => ({ ...s, workflow_id: wf.id })));

		if (stepsError) return fail(500, { error: stepsError.message });
		return { success: true };
	},

	run: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'ไม่พบ id' });

		// เริ่มรันแบบเบื้องหลัง (ไม่บล็อกคำขอ) — หน้าเว็บ poll ดูกระบวนการสด
		runWorkflowInBackground(id);
		return { success: true };
	},

	cancel: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');

		await supabaseAdmin
			.from('workflows')
			.update({ status: 'failed', updated_at: new Date().toISOString() })
			.eq('id', id);

		await supabaseAdmin
			.from('workflow_steps')
			.update({ status: 'skipped' })
			.eq('workflow_id', id)
			.in('status', ['pending', 'running']);

		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');

		const { error } = await supabaseAdmin.from('workflows').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
} satisfies Actions;

// รัน workflow ทีละขั้นตอนแบบเบื้องหลัง (อัปเดตสถานะ + บันทึกผลลัพธ์แต่ละขั้นตอนลง DB)
// หน้าเว็บจะ poll /api/workflows/[id] เพื่อดูความคืบหน้าแบบเรียลไทม์
async function runWorkflowInBackground(id: string) {
	try {
		const { data: steps } = await supabaseAdmin
			.from('workflow_steps')
			.select('*')
			.eq('workflow_id', id)
			.order('position');

		if (!steps || steps.length === 0) {
			await supabaseAdmin
				.from('workflows')
				.update({ status: 'failed', updated_at: new Date().toISOString() })
				.eq('id', id);
			return;
		}

		await supabaseAdmin
			.from('workflows')
			.update({ status: 'running', updated_at: new Date().toISOString() })
			.eq('id', id);

		for (const step of steps) {
			// เริ่มขั้นตอนนี้
			await supabaseAdmin.from('workflow_steps').update({ status: 'running' }).eq('id', step.id);

			// จำลองการทำงานของ Agent (อนาคต: ส่งให้ Agent / Tool ที่กำหนดจริง)
			await new Promise((r) => setTimeout(r, 800));

			// บันทึกผลลัพธ์ของขั้นตอนนี้
			await supabaseAdmin
				.from('workflow_steps')
				.update({
					status: 'completed',
					output: {
						note: `ขั้นตอน "${step.name}" เสร็จสิ้น`,
						agentId: step.agent_id,
						finishedAt: new Date().toISOString()
					}
				})
				.eq('id', step.id);
		}

		await supabaseAdmin
			.from('workflows')
			.update({ status: 'completed', updated_at: new Date().toISOString() })
			.eq('id', id);
	} catch (e) {
		await supabaseAdmin
			.from('workflows')
			.update({ status: 'failed', updated_at: new Date().toISOString() })
			.eq('id', id);
	}
}
;null as any as PageServerLoad;