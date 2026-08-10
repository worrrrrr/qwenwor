// Tools & Actions System
import type { Tool, ToolParameter } from '$lib/types';

class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  get(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  unregister(id: string): boolean {
    return this.tools.delete(id);
  }

  async executeTool(toolId: string, params: Record<string, any>): Promise<any> {
    const tool = this.get(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }
    return await tool.execute(params);
  }
}

export const toolRegistry = new ToolRegistry();

// Built-in tools
const builtInTools: Tool[] = [
  {
    id: 'search_web',
    name: 'Search Web',
    description: 'ค้นหาข้อมูลจากอินเทอร์เน็ต',
    parameters: [
      { name: 'query', type: 'string', description: 'คำค้นหา', required: true }
    ],
    execute: async (params) => {
      console.log('Searching web for:', params.query);
      // Placeholder for actual web search implementation
      return { results: [], query: params.query };
    }
  },
  {
    id: 'read_file',
    name: 'Read File',
    description: 'อ่านไฟล์จาก Knowledge Base',
    parameters: [
      { name: 'fileId', type: 'string', description: 'รหัสไฟล์', required: true }
    ],
    execute: async (params) => {
      console.log('Reading file:', params.fileId);
      // Placeholder for actual file reading
      return { content: '', fileId: params.fileId };
    }
  },
  {
    id: 'send_message',
    name: 'Send Message',
    description: 'ส่งข้อความไปยัง Agent อื่น',
    parameters: [
      { name: 'recipientId', type: 'string', description: 'ผู้รับ', required: true },
      { name: 'content', type: 'string', description: 'เนื้อหา', required: true }
    ],
    execute: async (params) => {
      console.log('Sending message to:', params.recipientId, params.content);
      // Placeholder for actual messaging
      return { success: true, recipientId: params.recipientId };
    }
  },
  {
    id: 'create_document',
    name: 'Create Document',
    description: 'สร้างเอกสารใหม่ใน Knowledge Base',
    parameters: [
      { name: 'title', type: 'string', description: 'ชื่อเอกสาร', required: true },
      { name: 'content', type: 'string', description: 'เนื้อหา', required: true },
      { name: 'tags', type: 'array', description: 'แท็ก', required: false }
    ],
    execute: async (params) => {
      console.log('Creating document:', params.title);
      // Placeholder for actual document creation
      return { id: `doc_${Date.now()}`, title: params.title };
    }
  },
  {
    id: 'run_workflow',
    name: 'Run Workflow',
    description: 'รัน Workflow ที่กำหนด',
    parameters: [
      { name: 'workflowId', type: 'string', description: 'รหัส Workflow', required: true }
    ],
    execute: async (params) => {
      console.log('Running workflow:', params.workflowId);
      // Placeholder for actual workflow execution
      return { workflowId: params.workflowId, status: 'started' };
    }
  },
  {
    id: 'schedule_task',
    name: 'Schedule Task',
    description: 'ตั้งเวลางานอัตโนมัติ',
    parameters: [
      { name: 'name', type: 'string', description: 'ชื่องาน', required: true },
      { name: 'cronExpression', type: 'string', description: 'Cron expression', required: true },
      { name: 'action', type: 'string', description: 'การกระทำ', required: true }
    ],
    execute: async (params) => {
      console.log('Scheduling task:', params.name);
      // Placeholder for actual task scheduling
      return { taskId: `task_${Date.now()}`, name: params.name };
    }
  }
];

// Register all built-in tools
builtInTools.forEach(tool => toolRegistry.register(tool));

export function getTool(id: string): Tool | undefined {
  return toolRegistry.get(id);
}

export function getAllTools(): Tool[] {
  return toolRegistry.getAll();
}

export function executeTool(toolId: string, params: Record<string, any>): Promise<any> {
  return toolRegistry.executeTool(toolId, params);
}

export function registerCustomTool(tool: Tool): void {
  toolRegistry.register(tool);
}
