<script lang="ts">
  import { getAllKnowledge } from '$lib/knowledge';
  import KnowledgeCard from '$lib/components/KnowledgeCard.svelte';

  const knowledge = getAllKnowledge();
</script>

<svelte:head>
  <title>Knowledge Base - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-2">📚 Knowledge Base</h1>
  <p class="text-gray-600">ระบบจัดเก็บและค้นหาความรู้ด้วย RAG (Retrieval-Augmented Generation)</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each knowledge as item}
    <KnowledgeCard knowledge={item} />
  {/each}
</div>

{#if knowledge.length === 0}
  <div class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีเอกสารความรู้</h3>
    <p class="mt-1 text-sm text-gray-500">ยังไม่ได้เพิ่มเอกสารเข้าในระบบ</p>
  </div>
{/if}
