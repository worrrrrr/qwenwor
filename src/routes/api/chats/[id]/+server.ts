import { json, error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function DELETE({ params, locals }) {
const { user } = await locals.safeGetSession();
if (!user) return error(401, 'ต้องล็อกอินก่อน');

const { error: e } = await supabaseAdmin
.from('agent_chats')
.delete()
.eq('id', params.id)
.eq('user_id', user.id);

if (e) return error(500, e.message);
return json({ success: true });
}
