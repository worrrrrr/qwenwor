import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '$lib/server/supabase';

// GET /api/brains - ดึงรายการ brains ทั้งหมด
export const GET: RequestHandler = async ({ locals }) => {
  const supabase = await createClient(locals);
  
  const { data, error } = await supabase
    .from('brains')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data || []);
};

// POST /api/brains - สร้าง brain ใหม่
export const POST: RequestHandler = async ({ request, locals }) => {
  const supabase = await createClient(locals);
  const body = await request.json();

  const { data, error } = await supabase
    .from('brains')
    .insert({
      name: body.name,
      description: body.description || '',
      type: body.type || 'general',
      color: body.color || 'blue',
      icon: body.icon || 'brain',
      is_active: body.is_active ?? true,
      user_id: (await locals.getUser())?.id || null
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json(data);
};
