// แปลงข้อมูลจากแถวในตาราง (database row) → type ที่แอปใช้
import type {
	Agent,
	AgentWork,
	ChatConversation,
	ChatMessage,
	KnowledgeBase,
	Memory,
	MemoryType,
	ScheduledTask,
	Workflow,
	WorkflowStep
} from '$lib/types';

export function mapAgent(row: Record<string, any>): Agent {
	return {
		id: row.id,
		name: row.name,
		identity: row.identity,
		memory: [],
		capabilities: row.capabilities ?? [],
		status: row.status,
		provider: row.provider ?? 'groq',
		model: row.model ?? '',
		avatarColor: row.avatar_color ?? 'blue'
	};
}

export function mapKnowledge(row: Record<string, any>): KnowledgeBase {
	return {
		id: row.id,
		title: row.title,
		content: row.content,
		embeddings: row.embeddings ?? undefined,
		metadata: {
			source: row.source ?? '',
			createdAt: new Date(row.created_at),
			updatedAt: new Date(row.updated_at),
			tags: row.tags ?? [],
			agentId: row.agent_id ?? undefined
		}
	};
}

export function mapMemory(row: Record<string, any>): Memory {
	return {
		id: row.id,
		type: row.type as MemoryType,
		content: row.content,
		timestamp: new Date(row.created_at),
		metadata: row.metadata ?? undefined
	};
}

export function mapWorkflow(row: Record<string, any>): Workflow {
	const steps: WorkflowStep[] = (row.workflow_steps ?? [])
		.sort((a: Record<string, any>, b: Record<string, any>) => a.position - b.position)
		.map((s: Record<string, any>) => ({
			id: s.id,
			name: s.name,
			agentId: s.agent_id,
			action: s.action,
			input: s.input ?? undefined,
			output: s.output ?? undefined,
			status: s.status
		}));

	return {
		id: row.id,
		name: row.name,
		steps,
		status: row.status,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}

export function mapTask(row: Record<string, any>): ScheduledTask {
	return {
		id: row.id,
		name: row.name,
		cronExpression: row.cron_expression,
		workflowId: row.workflow_id ?? undefined,
		action: row.action,
		enabled: row.enabled,
		lastRun: row.last_run ? new Date(row.last_run) : undefined,
		nextRun: row.next_run ? new Date(row.next_run) : undefined
	};
}

export function mapChat(row: Record<string, any>): ChatConversation {
	return {
		id: row.id,
		agentId: row.agent_id ?? null,
		isGroup: row.is_group ?? false,
		title: row.title,
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at)
	};
}

export function mapMessage(row: Record<string, any>): ChatMessage {
	return {
		id: row.id,
		chatId: row.chat_id,
		role: row.role,
		agentId: row.agent_id ?? null,
		content: row.content,
		metadata: row.metadata ?? undefined,
		createdAt: new Date(row.created_at)
	};
}

export function mapWork(row: Record<string, any>): AgentWork {
	return {
		id: row.id,
		agentId: row.agent_id ?? null,
		agentName: row.agents?.name ?? undefined,
		chatId: row.chat_id ?? null,
		title: row.title,
		content: row.content,
		tags: row.tags ?? [],
		createdAt: new Date(row.created_at)
	};
}
