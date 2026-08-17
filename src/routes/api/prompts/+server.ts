import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '$lib/server/supabase';

// GET /api/prompts - ดึงรายการ prompts ทั้งหมด
export const GET: RequestHandler = async ({ locals }) => {
  const supabase = await createClient(locals);
  
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('usage_count', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data || []);
};

// POST /api/prompts - สร้าง prompt ใหม่
export const POST: RequestHandler = async ({ request, locals }) => {
  const supabase = await createClient(locals);
  const body = await request.json();

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      name: body.name,
      description: body.description || '',
      template: body.template,
      variables: body.variables || [],
      category: body.category || 'general',
      tags: body.tags || [],
      is_public: body.is_public || false,
      user_id: (await locals.getUser())?.id || null
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json(data);
};
