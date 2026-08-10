<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import ChatRoom from '$lib/components/ChatRoom.svelte';
  import ChatHistory from '$lib/components/ChatHistory.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();

  const agent = $derived(data.agent);
  const rooms = $derived(data.historyRooms ?? []);
  const activeRoomId = $derived(data.activeRoomId);

  // เมนูประวัติแชท (แสดงเป็น drawer บนจอเล็ก)
  let mobileHistoryOpen = $state(false);

  function switchRoom(id: string) {
    mobileHistoryOpen = false;
    goto(`/chat/${agent.id}?room=${id}`, { invalidateAll: true });
  }

  function newRoom() {
    mobileHistoryOpen = false;
    goto(`/chat/${agent.id}?new=1`, { invalidateAll: true });
  }

  async function deleteRoom(id: string) {
    if (!confirm('ลบห้องแชทนี้ทิ้ง? (ข้อความทั้งหมดในห้องจะหายไป)')) return;
    const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const target = activeRoomId === id ? 'new' : `room=${activeRoomId}`;
      goto(`/chat/${agent.id}?${target}`, { invalidateAll: true });
    }
  }

  function onChatCreated(id: string) {
    goto(`/chat/${agent.id}?room=${id}`, { invalidateAll: true });
  }
</script>

<svelte:head>
  <title>{agent.name} - แชท</title>
</svelte:head>

<div class="h-full flex flex-col gap-3">
  <div class="flex items-center gap-3">
    <!-- ปุ่มเปิดประวัติ (จอเล็ก) -->
    <button
      onclick={() => (mobileHistoryOpen = true)}
      class="lg:hidden shrink-0 p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
      title="เปิดประวัติแชท"
      aria-label="เปิดประวัติแชท"
    >
      <Icons name="chat" size={18} />
    </button>

    <div
      class="w-11 h-11 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg"
    >
      {agent.name.charAt(0)}
    </div>
    <div>
      <h1 class="text-2xl font-bold text-gray-900">คุยกับ {agent.name}</h1>
      <p class="text-sm text-gray-500">{agent.identity.role}</p>
    </div>
  </div>

  <div class="flex-1 min-h-0 flex gap-3">
    <!-- แผงประวัติแชท (จอใหญ่) -->
    <div class="hidden lg:block w-72 shrink-0">
      <ChatHistory
        rooms={rooms}
        activeRoomId={activeRoomId}
        filterAgentId={agent.id}
        onNew={newRoom}
        onOpen={switchRoom}
        onDelete={deleteRoom}
      />
    </div>

    <!-- พื้นที่แชท -->
    <div class="flex-1 min-w-0 min-h-0 flex flex-col">
      {#key activeRoomId}
        <ChatRoom
          agents={[agent]}
          mode="single"
          chatId={activeRoomId}
          initialMessages={data.messages}
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
      filterAgentId={agent.id}
      onNew={newRoom}
      onOpen={switchRoom}
      onDelete={deleteRoom}
    />
  </div>
{/if}

