// Memory + Identity System
import type { Memory, MemoryType, Agent } from '$lib/types';

class MemoryStore {
  private memories: Map<string, Memory[]> = new Map();

  addMemory(agentId: string, memory: Omit<Memory, 'id'>): Memory {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullMemory: Memory = { ...memory, id };
    
    if (!this.memories.has(agentId)) {
      this.memories.set(agentId, []);
    }
    
    this.memories.get(agentId)!.push(fullMemory);
    return fullMemory;
  }

  getMemories(agentId: string, type?: MemoryType): Memory[] {
    const agentMemories = this.memories.get(agentId) || [];
    if (type) {
      return agentMemories.filter(m => m.type === type);
    }
    return agentMemories;
  }

  getRecentMemories(agentId: string, limit: number = 10): Memory[] {
    const agentMemories = this.memories.get(agentId) || [];
    return agentMemories
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  searchMemories(agentId: string, query: string): Memory[] {
    const agentMemories = this.memories.get(agentId) || [];
    const queryLower = query.toLowerCase();
    
    return agentMemories.filter(m => 
      m.content.toLowerCase().includes(queryLower)
    );
  }

  deleteMemory(agentId: string, memoryId: string): boolean {
    const agentMemories = this.memories.get(agentId);
    if (!agentMemories) return false;
    
    const index = agentMemories.findIndex(m => m.id === memoryId);
    if (index === -1) return false;
    
    agentMemories.splice(index, 1);
    return true;
  }

  clearMemories(agentId: string): void {
    this.memories.set(agentId, []);
  }
}

export const memoryStore = new MemoryStore();

export function addShortTermMemory(agentId: string, content: string, metadata?: Record<string, any>): Memory {
  return memoryStore.addMemory(agentId, {
    type: 'short_term',
    content,
    timestamp: new Date(),
    metadata
  });
}

export function addLongTermMemory(agentId: string, content: string, metadata?: Record<string, any>): Memory {
  return memoryStore.addMemory(agentId, {
    type: 'long_term',
    content,
    timestamp: new Date(),
    metadata
  });
}

export function addEpisodicMemory(agentId: string, content: string, metadata?: Record<string, any>): Memory {
  return memoryStore.addMemory(agentId, {
    type: 'episodic',
    content,
    timestamp: new Date(),
    metadata
  });
}

export function addSemanticMemory(agentId: string, content: string, metadata?: Record<string, any>): Memory {
  return memoryStore.addMemory(agentId, {
    type: 'semantic',
    content,
    timestamp: new Date(),
    metadata
  });
}

export function getAgentMemories(agentId: string, type?: MemoryType): Memory[] {
  return memoryStore.getMemories(agentId, type);
}

export function getRecentMemories(agentId: string, limit?: number): Memory[] {
  return memoryStore.getRecentMemories(agentId, limit);
}

export function searchMemories(agentId: string, query: string): Memory[] {
  return memoryStore.searchMemories(agentId, query);
}
