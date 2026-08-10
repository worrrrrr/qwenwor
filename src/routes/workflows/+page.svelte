<script lang="ts">
  import { getAllWorkflows, getActiveWorkflows } from '$lib/workflow';
  import WorkflowCard from '$lib/components/WorkflowCard.svelte';

  const workflows = getAllWorkflows();
  const activeWorkflows = getActiveWorkflows();
</script>

<svelte:head>
  <title>Workflows - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="mb-8">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">⚙️ Workflows</h1>
      <p class="text-gray-600">จัดการลำดับขั้นตอนการทำงานอัตโนมัติ</p>
    </div>
    <div class="text-right">
      <p class="text-sm text-gray-500">{workflows.length} workflows ทั้งหมด</p>
      <p class="text-sm text-blue-600 font-medium">{activeWorkflows.length} กำลังทำงาน</p>
    </div>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  {#each workflows as workflow}
    <WorkflowCard workflow={workflow} />
  {/each}
</div>

{#if workflows.length === 0}
  <div class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มี Workflows</h3>
    <p class="mt-1 text-sm text-gray-500">ยังไม่ได้สร้าง workflow ในระบบ</p>
  </div>
{/if}
