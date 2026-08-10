<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { enhanceRefresh } from '$lib/enhanceRefresh';
  import type { ScheduledTask } from '$lib/types';
  import Icons from '$lib/components/Icons.svelte';
  import TaskCard from '$lib/components/TaskCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import TaskForm from '$lib/components/TaskForm.svelte';

  let { data } = $props();
  const tasks = $derived(data.tasks);
  const workflows = $derived(data.workflows);

  let showCreate = $state(false);
  let editingTask = $state<ScheduledTask | null>(null);

  function closeForms() {
    showCreate = false;
    editingTask = null;
  }

  // ปิดฟอร์ม + รีเฟรชรายการทันทีหลังบันทึกสำเร็จ
  function handleSaved() {
    closeForms();
    invalidateAll();
  }
</script>

<svelte:head>
  <title>Scheduled Tasks - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="h-full flex flex-col gap-6 overflow-y-auto pr-1">
  <!-- Header + ปุ่มเพิ่ม -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="page-title flex items-center gap-2">
        <Icons name="tasks" size={26} /> Scheduled Tasks
      </h1>
      <p class="page-subtitle">จัดการงานอัตโนมัติที่รันตามเวลาที่กำหนด</p>
    </div>
    <button onclick={() => (showCreate = true)} class="btn btn-orange">
      <Icons name="plus" size={16} /> สร้างงาน
    </button>
  </div>

  <!-- รายการงาน -->
  {#if tasks.length === 0}
    <div class="text-center py-16 card p-8">
      <Icons name="tasks" size={40} class="mx-auto opacity-30" />
      <h3 class="mt-3 text-sm font-medium text-gray-900">ยังไม่มี Scheduled Tasks</h3>
      <p class="mt-1 text-sm text-gray-500">กดปุ่ม "สร้างงาน" เพื่อเริ่มต้น</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each tasks as task (task.id)}
        <div class="flex flex-col gap-2">
          <TaskCard task={task} toggleForm />
          <div class="flex justify-end gap-1 pr-2">
            <button
              onclick={() => (editingTask = task)}
              class="p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="แก้ไข"
            >
              <Icons name="pencil" size={15} />
            </button>
            <form method="POST" action="?/delete" use:enhance={enhanceRefresh}>
              <input type="hidden" name="id" value={task.id} />
              <button
                class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="ลบ"
                onclick={(e) => {
                  if (!confirm(`ลบงาน \"${task.name}\" นี้?`)) e.preventDefault();
                }}
              >
                <Icons name="trash" size={15} />
              </button>
            </form>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if showCreate}
  <Modal open={showCreate} title="สร้าง Scheduled Task" onClose={closeForms}>
    <TaskForm {workflows} mode="create" onDone={handleSaved} />
  </Modal>
{/if}

{#if editingTask}
  <Modal open={true} title={`แก้ไขงาน: ${editingTask.name}`} onClose={closeForms}>
    <TaskForm task={editingTask} {workflows} mode="edit" onDone={handleSaved} />
  </Modal>
{/if}
