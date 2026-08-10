<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { enhanceRefresh } from '$lib/enhanceRefresh';
  import type { Agent, AgentStatus } from '$lib/types';
  import Icons from '$lib/components/Icons.svelte';
  import AgentCard from '$lib/components/AgentCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import AgentForm from '$lib/components/AgentForm.svelte';

  let { data } = $props();
  const agents = $derived(data.agents);

  const statusOptions: AgentStatus[] = ['idle', 'working', 'waiting', 'error'];
  const memoryTypes = ['short_term', 'long_term', 'episodic', 'semantic'];

  let showCreate = $state(false);
  let editingAgent = $state<Agent | null>(null);

  function closeForms() {
    showCreate = false;
    editingAgent = null;
  }

  // ปิดฟอร์ม + รีเฟรชรายการทันทีหลังบันทึกสำเร็จ
  function handleSaved() {
    closeForms();
    invalidateAll();
  }

  function formatTime(ts: Date): string {
    return new Date(ts).toLocaleString('th-TH');
  }
</script>

<svelte:head>
  <title>Agents - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="h-full flex flex-col gap-6 overflow-y-auto pr-1">
  <!-- Header + ปุ่มเพิ่ม -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="page-title flex items-center gap-2">
        <Icons name="agents" size={26} /> Agents
      </h1>
      <p class="page-subtitle">จัดการ Agent ของคุณ — สร้าง แก้ไข ลบ และคุยได้</p>
    </div>
    <button onclick={() => (showCreate = true)} class="btn btn-green">
      <Icons name="plus" size={16} /> เพิ่ม Agent
    </button>
  </div>

  <!-- รายการ Agents -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each agents as agent (agent.id)}
      <div class="space-y-3">
        <AgentCard {agent} />

        <!-- ปุ่มจัดการ -->
        <div class="flex gap-2">
          <a href={`/chat/${agent.id}`} class="btn btn-blue flex-1">
            <Icons name="chat" size={15} /> คุย
          </a>
          <button
            onclick={() => (editingAgent = agent)}
            class="px-3 py-1.5 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="แก้ไข"
          >
            <Icons name="pencil" size={15} />
          </button>
          <form method="POST" action="?/delete" use:enhance={enhanceRefresh}>
            <input type="hidden" name="id" value={agent.id} />
            <button
              class="px-3 py-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="ลบ"
              onclick={(e) => {
                if (!confirm(`ลบ Agent \"${agent.name}\" นี้?`)) e.preventDefault();
              }}
            >
              <Icons name="trash" size={15} />
            </button>
          </form>
        </div>

        <!-- ปุ่มเปลี่ยนสถานะ -->
        <form method="POST" action="?/setStatus" use:enhance={enhanceRefresh} class="flex flex-wrap gap-2">
          <input type="hidden" name="id" value={agent.id} />
          {#each statusOptions as status (status)}
            <button
              name="status"
              value={status}
              class="px-3 py-1 text-xs rounded-full border transition-colors {agent.status === status
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}"
            >
              {status}
            </button>
          {/each}
        </form>

        <!-- Memory viewer -->
        <div class="box">
          <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <Icons name="memory" size={16} /> Memory ({agent.memory.length})
          </h4>
          <ul class="space-y-2 max-h-40 overflow-y-auto">
            {#each agent.memory as mem (mem.id)}
              <li class="text-xs text-gray-600 border-b border-gray-100 pb-2">
                <span class="font-medium text-indigo-600">{mem.type}</span>
                <p>{mem.content}</p>
                <p class="text-gray-400">{formatTime(mem.timestamp)}</p>
              </li>
            {/each}
          </ul>
          <form method="POST" action="?/addMemory" use:enhance={enhanceRefresh} class="mt-3 flex gap-2">
            <input type="hidden" name="agentId" value={agent.id} />
            <select name="type" class="text-xs border rounded px-2 py-1 bg-white">
              {#each memoryTypes as type (type)}
                <option value={type}>{type}</option>
              {/each}
            </select>
            <input
              type="text"
              name="content"
              placeholder="เพิ่มความจำ..."
              class="flex-1 text-xs border rounded px-2 py-1"
              required
            />
            <button class="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded">+</button>
          </form>
        </div>
      </div>
    {/each}
  </div>

  {#if agents.length === 0}
    <div class="text-center py-16 card p-8">
      <Icons name="agents" size={40} class="mx-auto opacity-30" />
      <h3 class="mt-3 text-sm font-medium text-gray-900">ยังไม่มี Agent</h3>
      <p class="mt-1 text-sm text-gray-500">กดปุ่ม "เพิ่ม Agent" เพื่อสร้างตัวแรก</p>
      <button onclick={() => (showCreate = true)} class="btn btn-green mt-4">
        <Icons name="plus" size={16} /> เพิ่ม Agent
      </button>
    </div>
  {/if}
</div>

{#if showCreate}
  <Modal open={showCreate} title="เพิ่ม Agent ใหม่" onClose={closeForms}>
    <AgentForm mode="create" onDone={handleSaved} />
  </Modal>
{/if}

{#if editingAgent}
  <Modal open={true} title={`แก้ไข Agent: ${editingAgent.name}`} onClose={closeForms}>
    <AgentForm agent={editingAgent} mode="edit" onDone={handleSaved} />
  </Modal>
{/if}
