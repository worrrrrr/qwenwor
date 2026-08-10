<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { enhanceRefresh } from '$lib/enhanceRefresh';
  import type { KnowledgeBase } from '$lib/types';
  import Icons from '$lib/components/Icons.svelte';
  import KnowledgeCard from '$lib/components/KnowledgeCard.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import KnowledgeForm from '$lib/components/KnowledgeForm.svelte';
  import SearchAutocomplete from '$lib/components/SearchAutocomplete.svelte';

  let { data } = $props();
  const knowledge = $derived(data.knowledge);

  let query = $state('');
  let showCreate = $state(false);
  let editingDoc = $state<KnowledgeBase | null>(null);

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return knowledge;
    return knowledge.filter(
      (k) =>
        k.title.toLowerCase().includes(q) ||
        k.content.toLowerCase().includes(q) ||
        k.metadata.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  // รายการสำหรับ autocomplete
  const searchItems = $derived(
    knowledge.map((k) => ({ label: k.title, sublabel: k.metadata.source || 'เอกสารความรู้' }))
  );

  function closeForms() {
    showCreate = false;
    editingDoc = null;
  }

  // ปิดฟอร์ม + รีเฟรชรายการทันทีหลังบันทึกสำเร็จ
  function handleSaved() {
    closeForms();
    invalidateAll();
  }
</script>

<svelte:head>
  <title>Knowledge Base - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="h-full flex flex-col gap-6 overflow-y-auto pr-1">
  <!-- Header + ปุ่มเพิ่ม -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="page-title flex items-center gap-2">
        <Icons name="knowledge" size={26} /> Knowledge Base
      </h1>
      <p class="page-subtitle">ระบบจัดเก็บและค้นหาความรู้ด้วย RAG</p>
    </div>
    <button onclick={() => (showCreate = true)} class="btn btn-green">
      <Icons name="plus" size={16} /> เพิ่มเอกสาร
    </button>
  </div>

  <!-- ค้นหา (พร้อม autocomplete) -->
  <SearchAutocomplete
    bind:value={query}
    items={searchItems}
    placeholder="ค้นหาเอกสาร..."
    class="max-w-md"
  />

  <!-- รายการเอกสาร -->
  {#if filtered.length === 0}
    <div class="text-center py-16 card p-8">
      <Icons name="knowledge" size={40} class="mx-auto opacity-30" />
      <h3 class="mt-3 text-sm font-medium text-gray-900">
        {query ? 'ไม่พบเอกสารที่ค้นหา' : 'ยังไม่มีเอกสารความรู้'}
      </h3>
      <p class="mt-1 text-sm text-gray-500">กดปุ่ม "เพิ่มเอกสาร" เพื่อเริ่มต้น</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filtered as item (item.id)}
        <div class="flex flex-col gap-2">
          <KnowledgeCard knowledge={item} />
          <div class="flex justify-end gap-1 pr-2">
            <button
              onclick={() => (editingDoc = item)}
              class="p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="แก้ไข"
            >
              <Icons name="pencil" size={15} />
            </button>
            <form method="POST" action="?/delete" use:enhance={enhanceRefresh}>
              <input type="hidden" name="id" value={item.id} />
              <button
                class="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="ลบ"
                onclick={(e) => {
                  if (!confirm(`ลบเอกสาร \"${item.title}\" นี้?`)) e.preventDefault();
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
  <Modal open={showCreate} title="เพิ่มเอกสารความรู้" onClose={closeForms}>
    <KnowledgeForm mode="create" onDone={handleSaved} />
  </Modal>
{/if}

{#if editingDoc}
  <Modal open={true} title={`แก้ไขเอกสาร: ${editingDoc.title}`} onClose={closeForms}>
    <KnowledgeForm knowledge={editingDoc} mode="edit" onDone={handleSaved} />
  </Modal>
{/if}
