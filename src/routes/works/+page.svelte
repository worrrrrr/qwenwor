<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Icons from '$lib/components/Icons.svelte';

  let { data } = $props();
  const works = $derived(data.works);
  let expanded = $state<string | null>(null);

  function formatDate(d: Date): string {
    return new Date(d).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });
  }

  async function remove(id: string) {
    await fetch(`/api/works/${id}`, { method: 'DELETE' });
    await invalidateAll();
  }
</script>

<svelte:head>
  <title>ผลงาน - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="h-full flex flex-col gap-4 overflow-y-auto pr-1">
  <div>
    <h1 class="page-title flex items-center gap-2">
      <Icons name="trophy" size={26} /> ผลงาน (Portfolio)
    </h1>
    <p class="page-subtitle">รวมผลงานที่บันทึกจากบทสนทนากับ Agent — กดปุ่ม "บันทึกผลงาน" ในหน้าย่อยของแชทได้</p>
  </div>

  {#if works.length === 0}
    <div class="text-center py-16 card p-8">
      <Icons name="chart" size={40} class="mx-auto opacity-30" />
      <h3 class="mt-3 text-sm font-medium text-gray-900">ยังไม่มีผลงาน</h3>
      <p class="mt-1 text-sm text-gray-500">ไปคุยกับ Agent แล้วกด "บันทึกผลงาน" บนคำตอบที่ชอบได้เลย</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {#each works as work (work.id)}
        <div class="card p-4 flex flex-col">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium shrink-0">
                {work.agentName ?? 'AI'}
              </span>
              <span class="text-[10px] text-gray-400 shrink-0">{formatDate(work.createdAt)}</span>
            </div>
            <button
              onclick={() => remove(work.id)}
              class="text-gray-300 hover:text-red-500 transition-colors shrink-0"
              title="ลบผลงาน"
            >
              <Icons name="trash" size={15} />
            </button>
          </div>

          <p class="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{work.title}</p>
          <p class="text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap flex-1">{work.content}</p>

          <button
            onclick={() => (expanded = expanded === work.id ? null : work.id)}
            class="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {expanded === work.id ? 'ย่อ' : 'ดูเต็ม'}
          </button>

          {#if expanded === work.id}
            <div class="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto border border-gray-100">
              {work.content}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
