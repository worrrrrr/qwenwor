// Core types for Agentic Knowledge Workspace

export interface Agent {
  id: string;
  name: string;
  identity: Identity;
  memory: Memory[];
  capabilities: string[];
  status: AgentStatus;
}

export interface Identity {
  personality: string;
  traits: string[];
  role: string;
  description: string;
}

export interface Memory {
  id: string;
  type: MemoryType;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export type MemoryType = 'short_term' | 'long_term' | 'episodic' | 'semantic';

export type AgentStatus = 'idle' | 'working' | 'waiting' | 'error';

export interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  embeddings?: number[];
  metadata: KnowledgeMetadata;
}

export interface KnowledgeMetadata {
  source: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  agentId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  agentId: string;
  action: string;
  input?: any;
  output?: any;
  status: StepStatus;
}

export type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression: string;
  workflowId?: string;
  action: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (params: Record<string, any>) => Promise<any>;
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
