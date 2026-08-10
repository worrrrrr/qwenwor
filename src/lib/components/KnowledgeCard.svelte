<script lang="ts">
  import type { KnowledgeBase } from '$lib/types';

  interface Props {
    knowledge: KnowledgeBase;
  }

  let { knowledge }: Props = $props();
</script>

<div class="card card-accent-green p-5">
  <div class="flex justify-between items-start mb-2">
    <h3 class="font-semibold text-lg text-gray-900 line-clamp-1">
      {knowledge.title}
    </h3>
    <span class="text-xs text-gray-400 whitespace-nowrap ml-2">
      {new Date(knowledge.metadata.updatedAt).toLocaleDateString('th-TH')}
    </span>
  </div>

  <p class="text-sm text-gray-600 mb-3 line-clamp-2">
    {knowledge.content.substring(0, 150)}{knowledge.content.length > 150 ? '...' : ''}
  </p>

  <div class="flex flex-wrap gap-2 mb-3">
    {#each knowledge.metadata.tags as tag (tag)}
      <span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
        #{tag}
      </span>
    {/each}
  </div>

  <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
    <div class="flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <span>{knowledge.metadata.source}</span>
    </div>
    {#if knowledge.metadata.agentId}
      <span class="text-blue-600">Agent: {knowledge.metadata.agentId}</span>
    {/if}
  </div>
</div>
