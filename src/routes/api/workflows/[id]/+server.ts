// GET /api/workflows/[id] — ดึงสถานะ/ผลลัพธ์ล่าสุดของ workflow (ใช้ polling ขณะรัน)
import { json, error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { mapWorkflow } from '$lib/server/mappers';

export async function GET({ params, locals }) {
	const { user } = await locals.safeGetSession();
	if (!user) return error(401, 'ต้องล็อกอินก่อน');

	const { data, error: e } = await supabaseAdmin
		.from('workflows')
		.select('*, workflow_steps(*)')
		.eq('id', params.id)
		.order('position', { referencedTable: 'workflow_steps', ascending: true })
		.maybeSingle();

	if (e) return error(500, e.message);
	if (!data) return error(404, 'ไม่พบ Workflow นี้');

	return json({ workflow: mapWorkflow(data) });
}
