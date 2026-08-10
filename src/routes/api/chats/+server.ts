// GET /api/chats — ประวัติแชทของผู้ใช้ (ใช้รีเฟรช sidebar / panel ประวัติแชท)
// รองรับ ?limit= (ค่าเริ่มต้น 12) และ ?preview=0 เพื่อไม่ต้องโหลดตัวอย่างข้อความ
import { json, error } from '@sveltejs/kit';
import { buildChatHistory } from '$lib/server/chatHistory';

export async function GET({ locals, url }) {
	const { user } = await locals.safeGetSession();
	if (!user) return error(401, 'ต้องล็อกอินก่อน');

	const limit = Math.min(Number(url.searchParams.get('limit')) || 12, 200);

	const chats = await buildChatHistory(user.id, { limit });

	return json({ chats });
}
