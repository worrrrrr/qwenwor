<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import ChatRoom from '$lib/components/ChatRoom.svelte';
  import ChatHistory from '$lib/components/ChatHistory.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();
  const agents = $derived(data.agents);
  const rooms = $derived(data.historyRooms ?? []);
  const activeRoomId = $derived(data.activeRoomId);

  // เลือก Agent ที่จะตอบในห้อง — ว่าง = ทุกตัว
  let selected = $state<string[]>([]);

  // เมนูประวัติแชท (แสดงเป็น drawer บนจอเล็ก)
  let mobileHistoryOpen = $state(false);

  function toggleAgent(id: string) {
    selected = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
  }

  function switchRoom(id: string) {
    mobileHistoryOpen = false;
    goto(`/chat?room=${id}`, { invalidateAll: true });
  }

  function newRoom() {
    mobileHistoryOpen = false;
    goto('/chat?new=1', { invalidateAll: true });
  }

  async function deleteRoom(id: string) {
    if (!confirm('ลบห้องแชทรวมนี้ทิ้ง? (ข้อความทั้งหมดในห้องจะหายไป)')) return;
    const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const target = activeRoomId === id ? 'new' : `room=${activeRoomId}`;
      goto(`/chat?${target}`, { invalidateAll: true });
    }
  }

  function onChatCreated(id: string) {
    goto(`/chat?room=${id}`, { invalidateAll: true });
  }
</script>

<svelte:head>
  <title>แชทรวม - Agentic Knowledge Workspace</title>
</svelte:head>

<div class="h-full flex flex-col gap-3">
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-3 min-w-0">
      <!-- ปุ่มเปิดประวัติ (จอเล็ก) -->
      <button
        onclick={() => (mobileHistoryOpen = true)}
        class="lg:hidden shrink-0 p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
        title="เปิดประวัติแชท"
        aria-label="เปิดประวัติแชท"
      >
        <Icons name="chat" size={18} />
      </button>
      <div class="min-w-0">
        <h1 class="page-title flex items-center gap-2">
          <Icons name="chat" size={26} /> แชทรวม (Group Chat)
        </h1>
        <p class="page-subtitle">ส่งคำถามเดียว ให้หลาย Agent ตอบพร้อมกัน เปรียบเทียบมุมมองได้ในห้องเดียว</p>
      </div>
    </div>
  </div>

  <div class="flex-1 min-h-0 flex gap-3">
    <!-- แผงประวัติแชท (จอใหญ่) -->
    <div class="hidden lg:block w-72 shrink-0">
      <ChatHistory
        rooms={rooms}
        activeRoomId={activeRoomId}
        groupOnly={true}
        onNew={newRoom}
        onOpen={switchRoom}
        onDelete={deleteRoom}
      />
    </div>

    <!-- พื้นที่แชท -->
    <div class="flex-1 min-w-0 min-h-0 flex flex-col">
      {#key activeRoomId}
        <ChatRoom
          {agents}
          mode="group"
          chatId={activeRoomId}
          initialMessages={data.messages}
          selectedIds={selected}
          onToggleAgent={toggleAgent}
          onChatCreated={onChatCreated}
        />
      {/key}
    </div>
  </div>
</div>

<!-- Drawer ประวัติแชท (จอเล็ก) -->
{#if mobileHistoryOpen}
  <div
    class="fixed inset-0 z-40 bg-black/30 lg:hidden"
    onclick={() => (mobileHistoryOpen = false)}
    aria-hidden="true"
  ></div>
  <div class="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] p-2 lg:hidden">
    <ChatHistory
      rooms={rooms}
      activeRoomId={activeRoomId}
      groupOnly={true}
      onNew={newRoom}
      onOpen={switchRoom}
      onDelete={deleteRoom}
    />
  </div>
{/if}

