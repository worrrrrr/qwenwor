// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { buildChatHistory } from '$lib/server/chatHistory';
import { mapAgent, mapMessage } from '$lib/server/mappers';
import type { PageServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/login');

	const [agentsRes, historyRooms] = await Promise.all([
		supabaseAdmin.from('agents').select('*').order('name'),
		buildChatHistory(user.id, { isGroup: true })
	]);

	// สร้างห้องใหม่?
	if (url.searchParams.get('new') === '1') {
		return {
			agents: agentsRes.data?.map(mapAgent) ?? [],
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
		agents: agentsRes.data?.map(mapAgent) ?? [],
		historyRooms,
		activeRoomId: activeRoom?.id ?? null,
		messages: messages.map(mapMessage)
	};
};

