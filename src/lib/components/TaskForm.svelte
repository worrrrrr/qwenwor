<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import type { ScheduledTask, Workflow } from '$lib/types';

  interface Props {
    task?: ScheduledTask;
    workflows: Workflow[];
    mode: 'create' | 'edit';
    onDone: () => void;
  }

  let { task, workflows, mode, onDone }: Props = $props();

  let errorMsg = $state('');

  let values = $state({ name: '', cron: '', action: '', workflowId: '' });

  const cronPresets = [
    { expr: '* * * * *', desc: 'ทุกนาที' },
    { expr: '*/5 * * * *', desc: 'ทุก 5 นาที' },
    { expr: '0 * * * *', desc: 'ทุกชั่วโมง' },
    { expr: '0 9 * * *', desc: 'ทุกวัน 09:00' },
    { expr: '0 9 * * 1-5', desc: 'จันทร์-ศุกร์ 09:00' },
    { expr: '0 0 * * *', desc: 'ทุกวันเที่ยงคืน' },
    { expr: '0 0 * * 0', desc: 'ทุกวันอาทิตย์' }
  ];

  let cronOpen = $state(false);

  onMount(() => {
    if (task) {
      values = {
        name: task.name,
        cron: task.cronExpression,
        action: task.action,
        workflowId: task.workflowId ?? ''
      };
    }
  });
</script>

<form
  method="POST"
  action={mode === 'edit' ? '?/update' : '?/create'}
  use:enhance={() => {
    return async ({ update, result }) => {
      if (result.type === 'success') {
        errorMsg = '';
        onDone();
      } else if (result.type === 'failure') {
        errorMsg = String(result.data?.error ?? '') || 'เกิดข้อผิดพลาด ไม่สามารถบันทึกได้';
      } else {
        errorMsg = 'เกิดข้อผิดพลาด ไม่สามารถบันทึกได้';
      }
      await update();
    };
  }}
  class="space-y-4"
>
  {#if mode === 'edit'}
    <input type="hidden" name="id" value={task?.id} />
  {/if}

  {#if errorMsg}
    <div class="p-3 rounded-md bg-red-50 text-red-700 text-sm">{errorMsg}</div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block text-sm font-medium text-gray-700">
      ชื่องาน *
      <input type="text" name="name" bind:value={values.name} required class="input input-green mt-1" placeholder="เช่น รายงานยอดขายรายวัน" />
    </label>
    <label class="block text-sm font-medium text-gray-700">
      Cron expression *
      <div class="relative">
        <input
          type="text"
          name="cron"
          bind:value={values.cron}
          required
          onfocus={() => (cronOpen = true)}
          onblur={() => setTimeout(() => (cronOpen = false), 150)}
          class="input input-green mt-1"
          placeholder="เช่น 0 9 * * *"
        />
        {#if cronOpen}
          <ul class="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {#each cronPresets as preset (preset.expr)}
              <li>
                <button
                  type="button"
                  onclick={() => {
                    values.cron = preset.expr;
                    cronOpen = false;
                  }}
                  class="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-sm flex items-center justify-between gap-2"
                >
                  <code class="font-mono text-xs text-indigo-600">{preset.expr}</code>
                  <span class="text-xs text-gray-500">{preset.desc}</span>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </label>
    <label class="block text-sm font-medium text-gray-700">
      Action
      <input type="text" name="action" bind:value={values.action} class="input input-green mt-1" placeholder="เช่น run_workflow" />
    </label>
    <label class="block text-sm font-medium text-gray-700">
      Workflow (ไม่บังคับ)
      <select name="workflowId" bind:value={values.workflowId} class="input input-green mt-1 bg-white">
        <option value="">— ไม่เลือก —</option>
        {#each workflows as wf (wf.id)}
          <option value={wf.id}>{wf.name}</option>
        {/each}
      </select>
    </label>
  </div>

  <button class="btn btn-green w-full">{mode === 'edit' ? 'บันทึกการแก้ไข' : 'สร้างงาน'}</button>
</form>
