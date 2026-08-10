// บันทึกผลงาน (Portfolio) — POST { agentId, chatId, title, content }
import { json, error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function POST({ request, locals }) {
	const { user } = await locals.safeGetSession();
	if (!user) return error(401, 'ต้องล็อกอินก่อน');

	const body = await request.json().catch(() => ({}));
	const agentId = body.agentId ? String(body.agentId) : null;
	const chatId = body.chatId ? String(body.chatId) : null;
	const content = String(body.content ?? '').trim();
	const title = String(body.title ?? '').trim();

	if (!content) return error(400, 'ไม่มีเนื้อหาที่จะบันทึก');

	const { data, error: e } = await supabaseAdmin
		.from('agent_works')
		.insert({
			user_id: user.id,
			agent_id: agentId,
			chat_id: chatId,
			title: title || 'ผลงานใหม่',
			content
		})
		.select()
		.single();

	if (e) return error(500, e.message);

	return json({ success: true, work: data });
}
