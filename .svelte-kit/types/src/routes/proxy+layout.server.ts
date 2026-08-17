// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<LayoutServerLoad>[0]) => {
	const { user } = await locals.safeGetSession();

	// หน้า public (ไม่ต้องล็อกอิน)
	const isPublicPath =
		url.pathname.startsWith('/login') ||
		url.pathname.startsWith('/signup') ||
		url.pathname.startsWith('/auth') ||
		url.pathname.startsWith('/logout');

	if (!user && !isPublicPath) {
		redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
	}

	// นับจำนวนข้อมูลจาก Supabase สำหรับแสดงในเมนูขวา
	const [agents, knowledge, workflows, tasks] = await Promise.all([
		supabaseAdmin.from('agents').select('id', { count: 'exact', head: true }),
		supabaseAdmin.from('knowledge').select('id', { count: 'exact', head: true }),
		supabaseAdmin.from('workflows').select('id', { count: 'exact', head: true }),
		supabaseAdmin.from('tasks').select('id', { count: 'exact', head: true })
	]);

	// ประวัติแชทล่าสุด 12 ห้อง สำหรับ sidebar ซ้าย (เฉพาะคนที่ล็อกอิน)
	let recentChats: {
		id: string;
		title: string;
		isGroup: boolean;
		agentId: string | null;
		agentName: string | null;
		updatedAt: string;
	}[] = [];

	if (user) {
		const [chatsRes, agentsRes] = await Promise.all([
			supabaseAdmin
				.from('agent_chats')
				.select('id, title, is_group, agent_id, updated_at')
				.eq('user_id', user.id)
				.order('updated_at', { ascending: false })
				.limit(12),
			supabaseAdmin.from('agents').select('id, name')
		]);

		// จับคู่ชื่อ Agent สำหรับห้องแชทแบบเดี่ยว
		const agentNames = new Map((agentsRes.data ?? []).map((a) => [a.id, a.name]));
		recentChats = (chatsRes.data ?? []).map((c) => ({
			id: c.id,
			title: c.title,
			isGroup: c.is_group,
			agentId: c.agent_id,
			agentName: c.agent_id ? (agentNames.get(c.agent_id) ?? null) : null,
			updatedAt: c.updated_at
		}));
	}

	return {
		user,
		counts: {
			agents: agents.count ?? 0,
			knowledge: knowledge.count ?? 0,
			workflows: workflows.count ?? 0,
			tasks: tasks.count ?? 0
		},
		recentChats
	};
};
