// Knowledge Base (RAG) System
import type { KnowledgeBase, KnowledgeMetadata } from '$lib/types';

class KnowledgeBaseStore {
  private store: Map<string, KnowledgeBase> = new Map();

  add(knowledge: KnowledgeBase): void {
    this.store.set(knowledge.id, knowledge);
  }

  get(id: string): KnowledgeBase | undefined {
    return this.store.get(id);
  }

  search(query: string, limit: number = 10): KnowledgeBase[] {
    const results: KnowledgeBase[] = [];
    const queryLower = query.toLowerCase();
    
    for (const kb of this.store.values()) {
      if (kb.title.toLowerCase().includes(queryLower) || 
          kb.content.toLowerCase().includes(queryLower)) {
        results.push(kb);
        if (results.length >= limit) break;
      }
    }
    
    return results;
  }

  getAll(): KnowledgeBase[] {
    return Array.from(this.store.values());
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  update(id: string, updates: Partial<KnowledgeBase>): boolean {
    const existing = this.get(id);
    if (!existing) return false;
    
    const updated = { ...existing, ...updates };
    this.store.set(id, updated);
    return true;
  }
}

export const knowledgeBaseStore = new KnowledgeBaseStore();

export function createKnowledge(
  title: string,
  content: string,
  source: string,
  tags: string[] = []
): KnowledgeBase {
  const id = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const knowledge: KnowledgeBase = {
    id,
    title,
    content,
    metadata: {
      source,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags
    }
  };
  
  knowledgeBaseStore.add(knowledge);
  return knowledge;
}

export function searchKnowledge(query: string, limit?: number): KnowledgeBase[] {
  return knowledgeBaseStore.search(query, limit);
}

export function getAllKnowledge(): KnowledgeBase[] {
  return knowledgeBaseStore.getAll();
}
