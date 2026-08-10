<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { enhanceRefresh } from '$lib/enhanceRefresh';
  import Icons from '$lib/components/Icons.svelte';
  import WorkflowCard from '$lib/components/WorkflowCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import type { Agent } from '$lib/types';

  let { data } = $props();
  const workflows = $derived(data.workflows);
  const agents = $derived(data.agents);

  let showCreate = $state(false);
  let advanced = $state(false);
  // ลำดับ Agent ที่เลือก (เรียงตามการทำงาน) — โหมดง่าย: แค่เลือกคน
  let agentOrder = $state<string[]>([]);
  // โหมดขั้นสูง: ใช้แก้ชื่อขั้นตอน / action เอง
  let stepOverrides = $state<Record<string, { name: string; action: string }>>({});

  // แปลงความสามารถของ Agent เป็นชื่อขั้นตอนภาษาไทย (สร้างอัตโนมัติตามหน้าที่)
  const capabilityLabels: Record<string, string> = {
    coordination: 'ประสานงาน',
    creative_writing: 'เขียนเนื้อหาสร้างสรรค์',
    planning: 'วางแผน',
    review: 'ทบทวนผลงาน',
    research: 'ค้นหาข้อมูล',
    data_analysis: 'วิเคราะห์ข้อมูล',
    summarization: 'สรุปเนื้อหา',
    fact_checking: 'ตรวจสอบข้อเท็จจริง',
    coding: 'เขียนโค้ด',
    workflow_design: 'ออกแบบ workflow',
    automation: 'จัดการอัตโนมัติ',
    debugging: 'แก้ไขปัญหา'
  };

  function agentById(id: string): Agent | null {
    return agents.find((a) => a.id === id) ?? null;
  }

  // สร้างชื่อขั้นตอนจากบทบาท/ความสามารถของ Agent
  function autoStepName(id: string): string {
    const a = agentById(id);
    if (!a) return 'ขั้นตอน';
    const cap = a.capabilities[0];
    return `${a.name} — ${capabilityLabels[cap] ?? a.identity.role}`;
  }

  function autoAction(id: string): string {
    return agentById(id)?.capabilities[0] ?? 'process';
  }

  function openCreate() {
    agentOrder = [];
    stepOverrides = {};
    advanced = false;
    showCreate = true;
  }

  function toggleAgent(id: string) {
    if (agentOrder.includes(id)) {
      agentOrder = agentOrder.filter((x) => x !== id);
      const { [id]: _removed, ...rest } = stepOverrides;
      stepOverrides = rest;
    } else {
      agentOrder = [...agentOrder, id];
      if (advanced) {
        stepOverrides = {
          ...stepOverrides,
          [id]: { name: autoStepName(id), action: autoAction(id) }
        };
      }
    }
  }

  function moveStep(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= agentOrder.length) return;
    const next = [...agentOrder];
    [next[index], next[target]] = [next[target], next[index]];
    agentOrder = next;
  }

  function removeStep(index: number) {
    const id = agentOrder[index];
    agentOrder = agentOrder.filter((_, i) => i !== index);
    const { [id]: _removed, ...rest } = stepOverrides;
    stepOverrides = rest;
  }

  function toggleAdvanced() {
    advanced = !advanced;
    if (advanced) {
      // เตรียมค่าเริ่มต้น (ชื่อขั้นตอน + action) ให้ทุกขั้นตอนตอนเปิดโหมดขั้นสูง
      const next: Record<string, { name: string; action: string }> = {};
      for (const id of agentOrder) {
        next[id] = stepOverrides[id] ?? { name: autoStepName(id), action: autoAction(id) };
      }
      stepOverrides = next;
    }
  }

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
</script>

<svelte:head>
  <title>Workflows - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="h-full flex flex-col gap-6 overflow-y-auto pr-1">
  <!-- Header + ปุ่มเพิ่ม -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="page-title flex items-center gap-2">
        <Icons name="workflows" size={26} /> Workflows
      </h1>
      <p class="page-subtitle">เลือก Agent เรียงลำดับ แล้วระบบสร้างขั้นตอนให้อัตโนมัติตามหน้าที่</p>
    </div>
    <button onclick={openCreate} class="btn btn-purple">
      <Icons name="plus" size={16} /> สร้าง Workflow
    </button>
  </div>

  <!-- รายการ workflows -->
  {#if workflows.length === 0}
    <div class="text-center py-16 card p-8">
      <Icons name="workflows" size={40} class="mx-auto opacity-30" />
      <h3 class="mt-3 text-sm font-medium text-gray-900">ยังไม่มี Workflows</h3>
      <p class="mt-1 text-sm text-gray-500">กดปุ่ม "สร้าง Workflow" เพื่อเริ่มต้น</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each workflows as workflow (workflow.id)}
        <div>
          <WorkflowCard workflow={workflow} {agents} />
          <div class="mt-2 flex items-center gap-2">
            {#if workflow.status === 'pending' || workflow.status === 'failed'}
              <form method="POST" action="?/run" use:enhance={enhanceRefresh}>
                <input type="hidden" name="id" value={workflow.id} />
                <button class="btn btn-blue">
                  <Icons name="play" size={13} /> รันเลย
                </button>
              </form>
            {/if}
            {#if workflow.status === 'pending' || workflow.status === 'running'}
              <form method="POST" action="?/cancel" use:enhance={enhanceRefresh}>
                <input type="hidden" name="id" value={workflow.id} />
                <button class="btn btn-gray">
                  <Icons name="close" size={13} /> ยกเลิก
                </button>
              </form>
            {/if}
            <form method="POST" action="?/delete" use:enhance={enhanceRefresh} class="ml-auto">
              <input type="hidden" name="id" value={workflow.id} />
              <button
                class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="ลบ"
                onclick={(e) => {
                  if (!confirm(`ลบ Workflow \"${workflow.name}\" นี้?`)) e.preventDefault();
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
  <Modal open={showCreate} title="สร้าง Workflow ใหม่" onClose={() => (showCreate = false)}>
    <form
      method="POST"
      action="?/create"
      use:enhance={() => {
        return async ({ update, result }) => {
          await update();
          if (result.type === 'success') {
            showCreate = false;
            invalidateAll();
          }
        };
      }}
      class="space-y-4"
    >
      <label class="block text-sm font-medium text-gray-700">
        ชื่อ Workflow *
        <input
          type="text"
          name="name"
          required
          class="input input-purple mt-1"
          placeholder="เช่น รายงานประจำสัปดาห์"
        />
      </label>

      <!-- ลำดับการทำงาน (เลือกคนเรียงๆ กัน) -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-700">ลำดับการทำงาน</p>
          <button
            type="button"
            onclick={toggleAdvanced}
            class="text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
          >
            {advanced ? 'ซ่อนโหมดขั้นสูง' : 'โหมดขั้นสูง'}
          </button>
        </div>

        {#if agentOrder.length === 0}
          <p class="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-lg px-3 py-4 text-center">
            ยังไม่ได้เลือก Agent — กดเลือกคนด้านล่าง ระบบจะเรียงขั้นตอนให้ตามลำดับ
          </p>
        {:else}
          <div class="space-y-1.5">
            {#each agentOrder as agentId, index (agentId)}
              {@const agent = agentById(agentId)}
              <div class="flex items-center gap-2 bg-purple-50/60 border border-purple-100 rounded-xl px-2 py-1.5">
                <input type="hidden" name="agentOrder" value={agentId} />
                <span class="shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div
                  class="shrink-0 w-7 h-7 rounded-full bg-linear-to-br {gradientFor(agentId)} flex items-center justify-center text-white text-[10px] font-bold"
                >
                  {(agent?.name ?? '?').charAt(0)}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-800 truncate">{agent?.name ?? agentId}</p>
                  <p class="text-[11px] text-gray-500 truncate">{agent?.identity.role}</p>
                </div>
                {#if advanced}
                  <div class="flex items-center gap-1">
                    <input
                      type="text"
                      name="stepName"
                      bind:value={stepOverrides[agentId].name}
                      placeholder="ชื่อขั้นตอน"
                      class="input input-purple !py-1 !text-xs w-36"
                    />
                    <input
                      type="text"
                      name="stepAction"
                      bind:value={stepOverrides[agentId].action}
                      placeholder="action"
                      class="input input-purple !py-1 !text-xs w-24"
                    />
                  </div>
                {/if}
                <div class="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onclick={() => moveStep(index, -1)}
                    disabled={index === 0}
                    class="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-30 transition-colors"
                    title="เลื่อนขึ้น"
                  >
                    <Icons name="chevron-up" size={14} />
                  </button>
                  <button
                    type="button"
                    onclick={() => moveStep(index, 1)}
                    disabled={index === agentOrder.length - 1}
                    class="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-30 transition-colors"
                    title="เลื่อนลง"
                  >
                    <Icons name="chevron-down" size={14} />
                  </button>
                  <button
                    type="button"
                    onclick={() => removeStep(index)}
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="เอาออก"
                  >
                    <Icons name="close" size={14} />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}

        <p class="text-[11px] text-gray-400 mt-2">
          {advanced
            ? 'โหมดขั้นสูง: แก้ชื่อขั้นตอน / action เองได้'
            : 'ระบบสร้างขั้นตอนให้อัตโนมัติตามหน้าที่ของแต่ละ Agent (เช่น น้องบี → ค้นหาข้อมูล)'}
        </p>
      </div>

      <!-- เลือก Agent (เพิ่มต่อท้ายคิว) -->
      <div>
        <p class="text-sm font-medium text-gray-700 mb-2">เลือก Agent (เพิ่มทีละตัวตามลำดับ)</p>
        <div class="flex flex-wrap gap-2">
          {#each agents as a (a.id)}
            <button
              type="button"
              onclick={() => toggleAgent(a.id)}
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium transition-colors {agentOrder.includes(a.id)
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'}"
            >
              <span class="inline-block w-2 h-2 rounded-full bg-linear-to-br {gradientFor(a.id)}"></span>
              {a.name}
            </button>
          {/each}
        </div>
      </div>

      <button class="btn btn-purple w-full" disabled={agentOrder.length === 0}>
        สร้าง Workflow ({agentOrder.length} ขั้นตอน)
      </button>
    </form>
  </Modal>
{/if}
