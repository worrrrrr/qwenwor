// สร้างรายการ "ประวัติแชท" (สำหรับ panel ฝั่งซ้าย + API)
// - ดึงห้องแชทของผู้ใช้ (กรองตาม Agent / ห้องรวม ได้)
// - จับคู่ชื่อ Agent
// - ดึงข้อความล่าสุดของแต่ละห้องมาเป็นตัวอย่าง (preview)
import { supabaseAdmin } from './supabase';
import type { ChatHistoryItem } from '$lib/types';

interface Options {
  agentId?: string;
  isGroup?: boolean;
  limit?: number;
}

export async function buildChatHistory(userId: string, opts: Options = {}): Promise<ChatHistoryItem[]> {
	let query = supabaseAdmin
		.from('agent_chats')
		.select('id, title, is_group, agent_id, updated_at')
		.eq('user_id', userId)
		.order('updated_at', { ascending: false });

	if (opts.agentId) query = query.eq('agent_id', opts.agentId);
	if (opts.isGroup !== undefined) query = query.eq('is_group', opts.isGroup);
	if (opts.limit) query = query.limit(opts.limit);

	const { data: chats } = await query;
	const rows = chats ?? [];
	if (rows.length === 0) return [];

	const agentIds = [...new Set(rows.map((c) => c.agent_id).filter((x): x is string => Boolean(x)))];

	const [agentsRes, msgsRes] = await Promise.all([
		agentIds.length > 0
			? supabaseAdmin.from('agents').select('id, name').in('id', agentIds)
			: Promise.resolve({ data: [] }),
		supabaseAdmin
			.from('chat_messages')
			.select('chat_id, content')
			.in(
				'chat_id',
				rows.map((c) => c.id)
			)
			.order('created_at', { ascending: false })
	]);

	const agentNames = new Map((agentsRes.data ?? []).map((a) => [a.id, a.name]));

	// ข้อความล่าสุดของแต่ละห้อง (แรกที่เจอหลัง order desc = ล่าสุด)
	const previews = new Map<string, string>();
	const seen = new Set<string>();
	for (const m of msgsRes.data ?? []) {
		if (!seen.has(m.chat_id)) {
			seen.add(m.chat_id);
			previews.set(m.chat_id, m.content);
		}
	}

	return rows.map((c) => ({
		id: c.id,
		title: c.title,
		isGroup: c.is_group,
		agentId: c.agent_id,
		agentName: c.agent_id ? (agentNames.get(c.agent_id) ?? null) : null,
		updatedAt: c.updated_at,
		preview: previews.get(c.id)
	}));
}
