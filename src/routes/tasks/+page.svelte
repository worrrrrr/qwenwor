<script lang="ts">
  import { getAllTasks } from '$lib/scheduler';
  import TaskCard from '$lib/components/TaskCard.svelte';

  const tasks = getAllTasks();
</script>

<svelte:head>
  <title>Scheduled Tasks - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="mb-8">
  <h1 class="text-3xl font-bold text-gray-900 mb-2">⏰ Scheduled Tasks</h1>
  <p class="text-gray-600">จัดการงานอัตโนมัติที่รันตามเวลาที่กำหนด</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each tasks as task}
    <TaskCard task={task} />
  {/each}
</div>

{#if tasks.length === 0}
  <div class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มี Scheduled Tasks</h3>
    <p class="mt-1 text-sm text-gray-500">ยังไม่ได้สร้างงานอัตโนมัติในระบบ</p>
  </div>
{/if}
