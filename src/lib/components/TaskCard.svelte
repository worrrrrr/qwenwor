<script lang="ts">
  import type { ScheduledTask } from '$lib/types';

  interface Props {
    task: ScheduledTask;
  }

  let { task }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
  <div class="flex justify-between items-start mb-3">
    <div>
      <h3 class="font-semibold text-lg text-gray-900">{task.name}</h3>
      <p class="text-sm text-gray-500 font-mono mt-1">{task.cronExpression}</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" class="sr-only peer" checked={task.enabled} />
      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
    </label>
  </div>

  <div class="mb-3">
    <p class="text-sm text-gray-600">
      <span class="font-medium">Action:</span> {task.action}
    </p>
    {#if task.workflowId}
      <p class="text-sm text-gray-600">
        <span class="font-medium">Workflow:</span> {task.workflowId}
      </p>
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-3 pt-3 border-t">
    <div>
      <p class="text-xs text-gray-500">Last Run</p>
      <p class="text-sm font-medium text-gray-700">
        {task.lastRun ? new Date(task.lastRun).toLocaleString('th-TH') : 'ยังไม่เคยรัน'}
      </p>
    </div>
    <div>
      <p class="text-xs text-gray-500">Next Run</p>
      <p class="text-sm font-medium text-orange-600">
        {task.nextRun ? new Date(task.nextRun).toLocaleString('th-TH') : 'ไม่ได้กำหนด'}
      </p>
    </div>
  </div>
</div>
