<script lang="ts">
  import Icons from './Icons.svelte';
  import { chatActivity } from '$lib/chatActivity.svelte';
  import type { ChatHistoryItem } from '$lib/types';

  interface Props {
    rooms: ChatHistoryItem[];
    activeRoomId: string | null;
    /** กรองการรีเฟรชสด: แสดงเฉพาะห้องของ Agent นี้ */
    filterAgentId?: string | null;
    /** กรองการรีเฟรชสด: แสดงเฉพาะห้องรวม */
    groupOnly?: boolean;
    onNew: () => void;
    onOpen: (id: string) => void;
    onDelete: (id: string) => void;
  }

  let {
    rooms,
    activeRoomId = null,
    filterAgentId = null,
    groupOnly = false,
    onNew,
    onOpen,
    onDelete
  }: Props = $props();

  let query = $state('');
  let liveRooms = $state<ChatHistoryItem[]>([]);
  let lastVersion = 0;
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  // ซิงก์กับ prop จาก server (ตอน navigate / SSR)
  $effect(() => {
    liveRooms = rooms;
  });

  // รีเฟรชสดเมื่อมีข้อความแชทใหม่ (debounce 300ms)
  $effect(() => {
    const v = chatActivity.version;
    if (v === 0 || v === lastVersion) return;
    lastVersion = v;
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      try {
        const res = await fetch('/api/chats?limit=200');
        if (!res.ok) return;
        const data = await res.json();
        let list = (data.chats ?? []) as ChatHistoryItem[];
        if (groupOnly) list = list.filter((c) => c.isGroup);
        if (filterAgentId) list = list.filter((c) => c.agentId === filterAgentId);
        liveRooms = list;
      } catch {
        // ถ้าไม่สำเร็จให้ใช้ข้อมูลเดิม
      }
    }, 300);
  });

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return liveRooms;
    return liveRooms.filter((r) => {
      const title = (r.title || 'แชทใหม่').toLowerCase();
      const name = (r.agentName || '').toLowerCase();
      const label = r.isGroup ? 'แชทรวม' : '';
      return title.includes(q) || name.includes(q) || label.includes(q);
    });
  });

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

  function timeAgo(iso: string): string {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'เมื่อสักครู่';
    if (mins < 60) return `${mins} นาที`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชม.`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} วัน`;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  }

  function previewText(c: ChatHistoryItem): string {
    if (!c.preview) return 'ยังไม่มีข้อความ';
    return c.preview.replace(/\s+/g, ' ').slice(0, 60);
  }
</script>

<aside class="h-full flex flex-col bg-white rounded-2xl shadow-md overflow-hidden">
  <!-- หัว: ชื่อ + จำนวน + ปุ่มห้องใหม่ -->
  <div class="p-3 border-b border-gray-200 flex items-center justify-between shrink-0">
    <h2 class="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
      <Icons name="chat" size={16} class="shrink-0" />
      ประวัติแชท
      <span class="text-xs font-normal text-gray-400">({liveRooms.length})</span>
    </h2>
    <button
      onclick={onNew}
      title="เริ่มแชทใหม่"
      class="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
    >
      <Icons name="plus" size={16} />
    </button>
  </div>

  <!-- ค้นหา -->
  <div class="p-2 border-b border-gray-100 shrink-0">
    <div class="relative">
      <Icons name="search" size={14} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        bind:value={query}
        placeholder="ค้นหาประวัติแชท..."
        class="input pl-8 !py-1.5 !text-xs"
      />
    </div>
  </div>

  <!-- รายการห้อง -->
  <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
    {#if filtered.length === 0}
      <p class="px-3 py-6 text-xs text-gray-400 text-center">
        {query.trim()
          ? 'ไม่พบห้องแชทที่ตรงกับคำค้นหา'
          : 'ยังไม่มีประวัติแชท — กด ➕ เพื่อเริ่มห้องใหม่'}
      </p>
    {:else}
      {#each filtered as room (room.id)}
        <div
          class="group relative flex items-center gap-2 rounded-xl transition-colors {activeRoomId === room.id
            ? 'bg-indigo-50'
            : 'hover:bg-gray-50'}"
        >
          <button
            onclick={() => onOpen(room.id)}
            class="flex-1 min-w-0 flex items-center gap-2.5 pl-2 py-2 pr-1 text-left"
            title={room.title || 'แชทใหม่'}
          >
            <div
              class="shrink-0 w-9 h-9 rounded-full bg-linear-to-br {gradientFor(room.id)} flex items-center justify-center text-white text-xs font-bold"
            >
              {(room.title || '?').charAt(0).toUpperCase()}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <span
                  class={`text-xs truncate ${activeRoomId === room.id ? 'text-indigo-700 font-semibold' : 'text-gray-800'}`}
                >
                  {room.title || 'แชทใหม่'}
                </span>
                <span class="text-[10px] text-gray-400 shrink-0">{timeAgo(room.updatedAt)}</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="text-[11px] text-gray-400 truncate">
                  {room.isGroup ? 'แชทรวม' : (room.agentName ?? 'แชท')}
                </span>
              </div>
              <p class="text-[11px] text-gray-500 truncate">{previewText(room)}</p>
            </div>
          </button>
          <button
            onclick={() => onDelete(room.id)}
            title="ลบห้องนี้"
            class="shrink-0 w-6 h-6 mr-1 flex items-center justify-center rounded-md text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Icons name="trash" size={13} />
          </button>
        </div>
      {/each}
    {/if}
  </div>

  <!-- หมายเหตุจำนวนสูงสุด -->
  {#if liveRooms.length >= 200}
    <p class="text-center text-[10px] text-gray-300 py-1.5 border-t border-gray-100 shrink-0">
      แสดง {liveRooms.length} ห้องล่าสุด
    </p>
  {/if}
</aside>

