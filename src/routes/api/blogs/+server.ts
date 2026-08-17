import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '$lib/server/supabase';

// GET /api/blogs - ดึงรายการ blogs ทั้งหมด
export const GET: RequestHandler = async ({ locals }) => {
  const supabase = await createClient(locals);
  
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      agents (name)
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  // Transform data to match Blog interface
  const blogs = (data || []).map((blog: any) => ({
    ...blog,
    agentName: blog.agents?.name || null
  }));

  return json(blogs);
};

// POST /api/blogs - สร้าง blog ใหม่
export const POST: RequestHandler = async ({ request, locals }) => {
  const supabase = await createClient(locals);
  const body = await request.json();

  const { data, error } = await supabase
    .from('blogs')
    .insert({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || '',
      cover_image: body.cover_image || '',
      tags: body.tags || [],
      status: body.status || 'draft',
      agent_id: body.agent_id || null,
      user_id: (await locals.getUser())?.id || null
    })
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json(data);
};
