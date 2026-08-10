// Agent definitions for Multi-Agent System
import type { Agent, Identity } from '$lib/types';

export const agents: Agent[] = [
  {
    id: 'god',
    name: 'ก็อต',
    identity: {
      personality: 'เป็นมิตร ชอบช่วยเหลือ มีความเป็นผู้นำ',
      traits: ['friendly', 'helpful', 'leadership', 'creative'],
      role: 'Main Coordinator & Creative Director',
      description: 'ก็อตเป็น Agent หลักที่ทำหน้าที่ประสานงานและดูแลภาพรวมของโปรเจกต์'
    },
    memory: [],
    capabilities: ['coordination', 'creative_writing', 'planning', 'review'],
    status: 'idle'
  },
  {
    id: 'bee',
    name: 'น้องบี',
    identity: {
      personality: 'ขยัน ละเอียดรอบคอบ ชอบเรียนรู้',
      traits: ['diligent', 'detail-oriented', 'curious', 'analytical'],
      role: 'Research Assistant & Data Analyst',
      description: 'น้องบีเชี่ยวชาญด้านการค้นหาข้อมูลและการวิเคราะห์ข้อมูล'
    },
    memory: [],
    capabilities: ['research', 'data_analysis', 'summarization', 'fact_checking'],
    status: 'idle'
  },
  {
    id: 'brian',
    name: 'Brian',
    identity: {
      personality: 'เป็นระบบ มีเหตุผล ชอบแก้ปัญหา',
      traits: ['logical', 'systematic', 'problem-solver', 'technical'],
      role: 'Technical Specialist & Workflow Engineer',
      description: 'Brian เชี่ยวชาญด้านเทคนิคและการจัดการ Workflow'
    },
    memory: [],
    capabilities: ['coding', 'workflow_design', 'automation', 'debugging'],
    status: 'idle'
  }
];

export function getAgent(id: string): Agent | undefined {
  return agents.find(a => a.id === id);
}

export function getAllAgents(): Agent[] {
  return agents;
}

export function updateAgentStatus(id: string, status: Agent['status']): void {
  const agent = getAgent(id);
  if (agent) {
    agent.status = status;
  }
}
