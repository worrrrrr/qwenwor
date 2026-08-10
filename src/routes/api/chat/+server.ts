// API กลางสำหรับแชทกับ Agent (ทั้งคุยแยก และแชทรวม)
// POST { chatId?, agentIds: string[], prompt }
import { json, error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { generateReply, buildAgentSystemPrompt } from '$lib/server/llm';

export async function POST({ request, locals }) {
	const { user } = await locals.safeGetSession();
	if (!user) return error(401, 'ต้องล็อกอินก่อน');

	const body = await request.json().catch(() => ({}));
	const prompt = String(body.prompt ?? '').trim();
	const chatId = body.chatId ? String(body.chatId) : null;
	const agentIds = Array.isArray(body.agentIds)
		? body.agentIds.map(String)
		: body.agentId
			? [String(body.agentId)]
			: [];

	if (!prompt) return error(400, 'กรุณาพิมพ์ข้อความ');
	if (agentIds.length === 0) return error(400, 'กรุณาเลือก Agent อย่างน้อย 1 ตัว');

	// 1) หาหรือสร้าง conversation
	let chat = null;
	if (chatId) {
		const { data } = await supabaseAdmin
			.from('agent_chats')
			.select('*')
			.eq('id', chatId)
			.maybeSingle();
		chat = data;
	}

	if (!chat) {
		const isGroup = agentIds.length > 1;
		const { data, error: e } = await supabaseAdmin
			.from('agent_chats')
			.insert({
				user_id: user.id,
				agent_id: agentIds.length === 1 ? agentIds[0] : null,
				is_group: isGroup,
				title: prompt.slice(0, 50)
			})
			.select()
			.single();
		if (e) return error(500, e.message);
		chat = data;
	}

	// 2) บันทึกข้อความผู้ใช้
	const { error: ue } = await supabaseAdmin.from('chat_messages').insert({
		chat_id: chat.id,
		role: 'user',
		content: prompt
	});
	if (ue) return error(500, ue.message);

	// 3) ดึงประวัติล่าสุดสำหรับ context (ให้ AI เข้าใจบริบทสนทนา)
	const { data: historyRows } = await supabaseAdmin
		.from('chat_messages')
		.select('*')
		.eq('chat_id', chat.id)
		.order('created_at', { ascending: true })
		.limit(40);

	const history = (historyRows ?? [])
		.filter((m) => m.role === 'user' || (m.role === 'agent' && !m.content.startsWith('⚠️')))
		.map((m) => ({
			role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
			content: m.content
		}));

	// 4) โหลด Agent ที่เลือก แล้วรันคำตอบแบบขนาน
	const { data: agents } = await supabaseAdmin.from('agents').select('*').in('id', agentIds);

	const replies = await Promise.all(
		(agents ?? []).map(async (agent) => {
			const system = buildAgentSystemPrompt(agent);
			try {
				const res = await generateReply({
					provider: agent.provider ?? 'groq',
					model: agent.model ?? '',
					system,
					history
				});

				const { data: msg, error: me } = await supabaseAdmin
					.from('chat_messages')
					.insert({
						chat_id: chat.id,
						role: 'agent',
						agent_id: agent.id,
						content: res.text,
						metadata: { provider: res.provider, model: res.model }
					})
					.select()
					.single();

				// บันทึกความจำระยะสั้นของ Agent
				await supabaseAdmin.from('memories').insert([
					{ agent_id: agent.id, type: 'short_term', content: `ถูกถามว่า: ${prompt.slice(0, 200)}` },
					{ agent_id: agent.id, type: 'episodic', content: `ตอบไปว่า: ${res.text.slice(0, 200)}` }
				]);

				return { agentId: agent.id, agentName: agent.name, message: msg ?? null, error: null };
			} catch (e) {
				const msg = await supabaseAdmin
					.from('chat_messages')
					.insert({
						chat_id: chat.id,
						role: 'agent',
						agent_id: agent.id,
						content: `[ผิดพลาด] ${e instanceof Error ? e.message : String(e)}`
					})
					.select()
					.single();
				return { agentId: agent.id, agentName: agent.name, message: msg ?? null, error: e instanceof Error ? e.message : String(e) };
			}
		})
	);

	// 5) อัปเดตเวลาแก้ไขล่าสุดของ chat
	await supabaseAdmin
		.from('agent_chats')
		.update({ updated_at: new Date().toISOString() })
		.eq('id', chat.id);

	return json({ chatId: chat.id, replies });
}
