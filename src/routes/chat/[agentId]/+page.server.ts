import { error, redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { buildChatHistory } from '$lib/server/chatHistory';
import { mapAgent, mapMessage } from '$lib/server/mappers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/login');

	const { data: agentRow, error: ae } = await supabaseAdmin
		.from('agents')
		.select('*')
		.eq('id', params.agentId)
		.maybeSingle();

	if (ae || !agentRow) throw error(404, 'ไม่พบ Agent นี้');

	// ประวัติแชททั้งหมดของ Agent นี้ (สำหรับผู้ใช้คนนี้)
	const historyRooms = await buildChatHistory(user.id, { agentId: params.agentId, isGroup: false });

	// สร้างห้องใหม่?
	if (url.searchParams.get('new') === '1') {
		return {
			agent: mapAgent(agentRow),
			historyRooms,
			activeRoomId: null,
			messages: []
		};
	}

	// เลือกห้องจาก ?room= หรือใช้ห้องล่าสุด
	const roomParam = url.searchParams.get('room');
	let activeRoom: { id: string } | null = null;
	if (roomParam && historyRooms.some((r) => r.id === roomParam)) {
		activeRoom = historyRooms.find((r) => r.id === roomParam) ?? null;
	} else if (historyRooms.length > 0) {
		activeRoom = historyRooms[0];
	}

	let messages: any[] = [];
	if (activeRoom) {
		const { data: msgs } = await supabaseAdmin
			.from('chat_messages')
			.select('*')
			.eq('chat_id', activeRoom.id)
			.order('created_at', { ascending: true });
		messages = msgs ?? [];
	}

	return {
		agent: mapAgent(agentRow),
		historyRooms,
		activeRoomId: activeRoom?.id ?? null,
		messages: messages.map(mapMessage)
	};
};


