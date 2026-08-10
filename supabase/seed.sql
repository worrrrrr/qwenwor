-- ============================================================
-- Agentic Knowledge Workspace — Seed Data
-- รันหลังจาก schema.sql แล้ว
-- ============================================================

-- Agents ------------------------------------------------
insert into public.agents (id, name, identity, capabilities, status) values
(
  'god',
  'ก็อต',
  '{
    "personality": "เป็นมิตร ชอบช่วยเหลือ มีความเป็นผู้นำ",
    "traits": ["friendly", "helpful", "leadership", "creative"],
    "role": "Main Coordinator & Creative Director",
    "description": "ก็อตเป็น Agent หลักที่ทำหน้าที่ประสานงานและดูแลภาพรวมของโปรเจกต์"
  }',
  array['coordination', 'creative_writing', 'planning', 'review'],
  'idle'
),
(
  'bee',
  'น้องบี',
  '{
    "personality": "ขยัน ละเอียดรอบคอบ ชอบเรียนรู้",
    "traits": ["diligent", "detail-oriented", "curious", "analytical"],
    "role": "Research Assistant & Data Analyst",
    "description": "น้องบีเชี่ยวชาญด้านการค้นหาข้อมูลและการวิเคราะห์ข้อมูล"
  }',
  array['research', 'data_analysis', 'summarization', 'fact_checking'],
  'idle'
),
(
  'brian',
  'Brian',
  '{
    "personality": "เป็นระบบ มีเหตุผล ชอบแก้ปัญหา",
    "traits": ["logical", "systematic", "problem-solver", "technical"],
    "role": "Technical Specialist & Workflow Engineer",
    "description": "Brian เชี่ยวชาญด้านเทคนิคและการจัดการ Workflow"
  }',
  array['coding', 'workflow_design', 'automation', 'debugging'],
  'idle'
)
on conflict (id) do nothing;

-- Knowledge base (ตัวอย่าง) --------------------------------
insert into public.knowledge (title, content, source, tags) values
(
  'ภาพรวมระบบ Multi-Agent',
  'ระบบนี้ประกอบด้วย Agent หลัก 3 ตัว ได้แก่ ก็อต (ผู้ประสานงาน), น้องบี (นักวิจัยข้อมูล) และ Brian (วิศวกรเทคนิค) แต่ละตัวมีบทบาทและความสามารถเฉพาะตัว ทำงานร่วมกันผ่าน Workflow Engine',
  'คู่มือระบบ',
  array['system', 'agents', 'overview']
),
(
  'วิธีใช้ Workflow Engine',
  'Workflow Engine ใช้สำหรับกำหนดลำดับขั้นตอนการทำงานอัตโนมัติ แต่ละขั้นตอน (Step) จะผูกกับ Agent และ Action หนึ่งตัว เช่น research → summarize → create_document ระบบจะรันทีละขั้นตอนตามลำดับ',
  'คู่มือระบบ',
  array['workflow', 'guide']
),
(
  'การตั้งค่างานอัตโนมัติ (Scheduler)',
  'ใช้ cron expression ในการกำหนดเวลา เช่น "0 9 * * *" หมายถึงทุกวัน 09:00 น. งานที่ตั้งไว้สามารถเปิด/ปิดได้ผ่านหน้า Scheduled Tasks',
  'คู่มือระบบ',
  array['scheduler', 'cron', 'guide']
),
(
  'แนวคิด RAG (Retrieval-Augmented Generation)',
  'RAG คือเทคนิคการเพิ่มความแม่นยำของ AI โดยค้นหาเอกสารที่เกี่ยวข้องจาก Knowledge Base ก่อน แล้วนำไปประกอบการสร้างคำตอบ',
  'เอกสารวิชาการ',
  array['rag', 'ai', 'concept']
)
on conflict do nothing;

-- Workflow ตัวอย่าง -----------------------------------------
insert into public.workflows (id, name, status) values
('00000000-0000-4000-8000-000000000001', 'ตัวอย่าง: วิจัยและสรุปเนื้อหา', 'pending')
on conflict (id) do nothing;

insert into public.workflow_steps (workflow_id, position, name, agent_id, action, input) values
('00000000-0000-4000-8000-000000000001', 0, 'ค้นหาข้อมูล', 'bee', 'research', '{"query": "AI agents"}'),
('00000000-0000-4000-8000-000000000001', 1, 'สรุปเนื้อหา', 'god', 'summarize', '{}'),
('00000000-0000-4000-8000-000000000001', 2, 'จัดทำเอกสาร', 'brian', 'create_document', '{}')
on conflict do nothing;

-- Scheduled tasks ตัวอย่าง -----------------------------------
insert into public.tasks (name, cron_expression, workflow_id, action, enabled, next_run) values
(
  'รายงานสถานะรายวัน',
  '0 9 * * *',
  '00000000-0000-4000-8000-000000000001',
  'run_workflow',
  true,
  now() + interval '1 day'
),
(
  'ตรวจสอบความรู้อัตโนมัติ',
  '0 2 * * 0',
  null,
  'search_web',
  true,
  now() + interval '7 days'
)
on conflict do nothing;

-- Memories ตัวอย่าง ------------------------------------------
insert into public.memories (agent_id, type, content, metadata) values
('god', 'episodic', 'สร้างโปรเจกต์ Agentic Knowledge Workspace เมื่อต้นปี', '{}'),
('bee', 'short_term', 'เพิ่งค้นพบบทความเกี่ยวกับ RAG ที่มีประโยชน์', '{}'),
('brian', 'semantic', 'ระบบตั้งเวลาใช้ cron expression เป็นมาตรฐาน', '{}')
on conflict do nothing;
