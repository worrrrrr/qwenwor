<script lang="ts">
  import Icons from './Icons.svelte';
  import type { Workflow, WorkflowStatus, Agent } from '$lib/types';

  interface Props {
    workflow: Workflow;
    agents?: Agent[];
  }

  let { workflow, agents = [] }: Props = $props();

  // สถานะล่าสุด = ข้อมูลจาก API (poll ระหว่างรัน) หรือค่า prop เริ่มต้น
  let remote = $state<Workflow | null>(null);
  const liveWorkflow = $derived<Workflow>(remote ?? workflow);

  // navigate ไป workflow อื่น → ล้างข้อมูล poll เก่า
  $effect(() => {
    if (remote && remote.id !== workflow.id) remote = null;
  });

  let pollTimer: ReturnType<typeof setInterval> | null = null;

  // ขณะกำลังรัน → poll ทุก 1 วินาที เพื่อแสดง "ใครทำถึงไหน" แบบเรียลไทม์
  $effect(() => {
    if (liveWorkflow.status !== 'running') return;
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/workflows/${liveWorkflow.id}`);
        if (!res.ok) return;
        const data = await res.json();
        const wf = data.workflow as Workflow;
        remote = wf;
        if (wf.status !== 'running' && pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      } catch {
        // ไม่เป็นไร ถ้าดึงไม่สำเร็จให้ลองรอบถัดไป
      }
    }, 1000);

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    };
  });

  const agentById = $derived(new Map(agents.map((a) => [a.id, a])));

  const gradientPool = [
    'from-blue-400 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-orange-400 to-pink-600',
    'from-purple-400 to-fuchsia-600',
    'from-cyan-400 to-sky-600',
    'from-red-400 to-rose-600'
  ];

  function gradientFor(id: string): string {
    let h = 0;
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return gradientPool[h % gradientPool.length];
  }

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

  function agentName(id?: string | null): string {
    if (!id) return '';
    return agentById.get(id)?.name ?? id;
  }

  const doneCount = $derived(liveWorkflow.steps.filter((s) => s.status === 'completed').length);
  const progressPct = $derived(
    liveWorkflow.steps.length > 0 ? (doneCount / liveWorkflow.steps.length) * 100 : 0
  );

  // ขั้นตอนที่กำลังทำงานอยู่ (สำหรับบรรทัด "กำลังทำงาน: ใคร — ทำอะไร")
  const currentStep = $derived(liveWorkflow.steps.find((s) => s.status === 'running'));

  function formatTime(iso?: string): string {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // แสดงผลลัพธ์ของขั้นตอน (รองรับ output รูปแบบต่างๆ)
  function outputText(output: Record<string, any>): string {
    if (output.note) return output.note;
    if (typeof output.text === 'string') return output.text;
    try {
      return JSON.stringify(output);
    } catch {
      return String(output);
    }
  }
</script>


<div class="card p-5">
  <div class="flex justify-between items-start mb-3">
    <h3 class="font-semibold text-lg text-gray-900">{liveWorkflow.name}</h3>
    <span class="badge {getStatusColor(liveWorkflow.status)}">
      {getStatusText(liveWorkflow.status)}
    </span>
  </div>

  <!-- กำลังทำงานขั้นตอนไหน (เรียลไทม์) -->
  {#if currentStep}
    <div class="mb-3 flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2">
      <svg class="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="min-w-0">
        กำลังทำงาน:
        <strong>{agentName(currentStep.agentId)}</strong>
        <span class="text-blue-500">— {currentStep.name}</span>
      </span>
    </div>
  {/if}

  <div class="mb-4">
    <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
      <span>Progress</span>
      <span>
        {doneCount} / {liveWorkflow.steps.length} ขั้นตอน
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div
        class="bg-purple-600 h-2 rounded-full transition-all duration-500"
        style="width: {progressPct}%"
      ></div>
    </div>
  </div>

  <div class="space-y-2.5">
    <h4 class="text-sm font-medium text-gray-700">ขั้นตอน & ผลลัพธ์:</h4>
    {#each liveWorkflow.steps as step, index (step.id)}
      <div>
        <div class="flex items-center gap-2 text-sm">
          <span class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
            {step.status === 'completed' ? 'bg-green-500 text-white' : ''}
            {step.status === 'running' ? 'bg-blue-500 text-white animate-pulse' : ''}
            {step.status === 'pending' ? 'bg-gray-300 text-gray-600' : ''}
            {step.status === 'failed' ? 'bg-red-500 text-white' : ''}
            {step.status === 'skipped' ? 'bg-gray-200 text-gray-500' : ''}
          ">
            {#if step.status === 'completed'}
              <Icons name="check" size={12} />
            {:else}
              {index + 1}
            {/if}
          </span>
          <span class="flex-1 min-w-0 text-gray-700 truncate">{step.name}</span>
          {#if step.agentId}
            <span class="flex items-center gap-1 shrink-0 text-xs text-gray-500" title={step.agentId}>
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-linear-to-br {gradientFor(step.agentId)}"></span>
              {agentName(step.agentId)}
            </span>
          {/if}
        </div>
        {#if step.output}
          <div class="ml-8 mt-1 flex items-start gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5">
            <Icons name="check" size={12} class="mt-0.5 text-green-500 shrink-0" />
            <span class="min-w-0">
              {outputText(step.output)}
              {#if step.output.finishedAt}
                <span class="text-gray-400">· เสร็จ {formatTime(step.output.finishedAt)}</span>
              {/if}
            </span>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <div class="mt-4 pt-3 border-t flex justify-between text-xs text-gray-500">
    <span>สร้าง: {new Date(liveWorkflow.createdAt).toLocaleDateString('th-TH')}</span>
    <span>อัพเดท: {new Date(liveWorkflow.updatedAt).toLocaleDateString('th-TH')}</span>
  </div>
</div>
