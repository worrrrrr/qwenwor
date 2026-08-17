import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

// GET /api/skills - ดึงรายการ skills ทั้งหมด
export const GET: RequestHandler = async () => {
  const { data, error } = await supabaseAdmin
    .from('skills')
    .select('*')
    .order('category')
    .order('name');

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data || []);
};

// POST /api/skills - สร้าง skill ใหม่
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const { data, error } = await supabaseAdmin
    .from('skills')
    .insert({
      name: body.name,
      description: body.description || '',
      category: body.category || 'general',
      icon: body.icon || 'sparkles',
      level: body.level || 'basic',
      metadata: body.metadata || {}
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json(data);
};
