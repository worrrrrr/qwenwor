<script lang="ts">
  import type { Workflow, WorkflowStatus } from '$lib/types';

  interface Props {
    workflow: Workflow;
  }

  let { workflow }: Props = $props();

  function getStatusColor(status: WorkflowStatus): string {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'running': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  function getStatusText(status: WorkflowStatus): string {
    const texts = {
      pending: 'รอทำงาน',
      running: 'กำลังทำงาน',
      completed: 'เสร็จสิ้น',
      failed: 'ล้มเหลว'
    };
    return texts[status] || status;
  }
</script>

<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
  <div class="flex justify-between items-start mb-3">
    <h3 class="font-semibold text-lg text-gray-900">{workflow.name}</h3>
    <span class="px-2 py-1 text-xs rounded-full {getStatusColor(workflow.status)}">
      {getStatusText(workflow.status)}
    </span>
  </div>

  <div class="mb-4">
    <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
      <span>Progress</span>
      <span>
        {workflow.steps.filter(s => s.status === 'completed').length} / {workflow.steps.length} steps
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div 
        class="bg-purple-600 h-2 rounded-full transition-all duration-300"
        style="width: {(workflow.steps.filter(s => s.status === 'completed').length / workflow.steps.length) * 100}%"
      ></div>
    </div>
  </div>

  <div class="space-y-2">
    <h4 class="text-sm font-medium text-gray-700">ขั้นตอน:</h4>
    {#each workflow.steps as step, index}
      <div class="flex items-center text-sm">
        <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2
          {step.status === 'completed' ? 'bg-green-500 text-white' : ''}
          {step.status === 'running' ? 'bg-blue-500 text-white' : ''}
          {step.status === 'pending' ? 'bg-gray-300 text-gray-600' : ''}
          {step.status === 'failed' ? 'bg-red-500 text-white' : ''}
          {step.status === 'skipped' ? 'bg-gray-200 text-gray-500' : ''}
        ">
          {index + 1}
        </span>
        <span class="flex-1 text-gray-700">{step.name}</span>
        <span class="text-xs text-gray-500">{step.agentId}</span>
      </div>
    {/each}
  </div>

  <div class="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500">
    <span>สร้าง: {new Date(workflow.createdAt).toLocaleDateString('th-TH')}</span>
    <span>อัพเดท: {new Date(workflow.updatedAt).toLocaleDateString('th-TH')}</span>
  </div>
</div>
