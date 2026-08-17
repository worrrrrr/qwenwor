<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { chatActivity } from '$lib/chatActivity.svelte';
  import type { IconName } from '$lib/components/Icons.svelte';

  interface ChatItem {
    id: string;
    title: string;
    isGroup: boolean;
    agentId: string | null;
    agentName: string | null;
    updatedAt: string;
  }

  interface Props {
    open: boolean;
    onToggle: () => void;
    chats?: ChatItem[];
  }

  let { open, onToggle, chats = [] }: Props = $props();

  // ประวัติแชทแบบเรียลไทม์: เริ่มจาก prop (SSR) แล้วอัปเดตทันทีเมื่อมีสัญญาณแชทใหม่
  let liveChats = $state<ChatItem[]>([]);
  let lastVersion = 0;
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  // ซิงก์กับ prop เมื่อ navigate ใหม่ (layout load รีเฟรช)
  $effect(() => {
    liveChats = chats;
  });

  // ฟังสัญญาณ "เพิ่งคุยเสร็จ" → ดึงประวัติแชทล่าสุดมาแสดงทันที (debounce 300ms)
  $effect(() => {
    const v = chatActivity.version;
    if (v === 0 || v === lastVersion) return;
    lastVersion = v;
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      try {
        const res = await fetch('/api/chats');
        if (res.ok) {
          const data = await res.json();
          liveChats = data.chats ?? [];
        }
      } catch {
        // ไม่เป็นไร ถ้าดึงไม่สำเร็จให้ใช้ข้อมูลเดิม
      }
    }, 300);
  });

  const navLinks: { href: string; label: string; icon: IconName }[] = [
    { href: '/', label: 'Dashboard', icon: 'dashboard' },
    { href: '/chat', label: 'แชทรวม', icon: 'sparkles' },
    { href: '/agents', label: 'Agents', icon: 'agents' },
    { href: '/knowledge', label: 'Knowledge', icon: 'knowledge' },
    { href: '/workflows', label: 'Workflows', icon: 'workflows' },
    { href: '/tasks', label: 'Tasks', icon: 'tasks' },
    { href: '/works', label: 'ผลงาน', icon: 'chart' },
    { href: '/blogs', label: 'Blogs', icon: 'knowledge' },
    { href: '/prompts', label: 'Prompts', icon: 'sparkles' },
    { href: '/skills', label: 'Skills', icon: 'dashboard' },
    { href: '/brains', label: 'Brains', icon: 'knowledge' }
  ];

  function isActive(href: string): boolean {
    if (href === '/') return page.url.pathname === '/';
    return page.url.pathname.startsWith(href);
  }

  // ห้องที่กำลังเปิดอยู่ (จาก URL ?room=)
  const activeRoomId = $derived(page.url.searchParams.get('room'));
  const isChatPage = $derived(page.url.pathname.startsWith('/chat'));

  function chatHref(c: ChatItem): string {
    if (c.isGroup) return `/chat?room=${c.id}`;
    return c.agentId ? `/chat/${c.agentId}?room=${c.id}` : `/chat?room=${c.id}`;
  }

  function chatLabel(c: ChatItem): string {
    if (c.isGroup) return 'แชทรวม';
    return c.agentName ?? 'แชท';
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
</script>

<aside
  class="hidden lg:block shrink-0 overflow-hidden bg-white border-r border-gray-200 transition-[width] duration-300 ease-in-out {open ? 'lg:w-64' : 'lg:w-16'}"
>
  <div class="flex flex-col w-full h-full">
    <!-- Header Sidebar -->
    <div class="flex items-center {open ? 'justify-between px-4' : 'justify-center px-2'} h-14 shrink-0 border-b border-gray-100">
      {#if open}
        <div class="flex items-center gap-2 text-gray-800 overflow-hidden whitespace-nowrap">
          <Icons name="menu" size={18} />
          <span class="text-sm font-semibold">เมนูหลัก</span>
        </div>
      {/if}
      <button
        onclick={onToggle}
        class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label={open ? 'ซ่อนเมนูซ้าย' : 'แสดงเมนูซ้าย'}
        title={open ? 'ซ่อนเมนู' : 'ขยายเมนู'}
      >
        <Icons name={open ? 'panel-left' : 'panel-right'} size={18} />
      </button>
    </div>

    <!-- Navigation List -->
    <nav class="shrink-0 p-2 space-y-1 overflow-y-auto max-h-64">
      {#each navLinks as link (link.href)}
        <a
          href={link.href}
          title={!open ? link.label : undefined}
          class="flex items-center {open ? 'gap-3 px-3' : 'justify-center px-0'} py-2 rounded-md text-sm font-medium transition-colors {isActive(link.href)
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
        >
          <Icons name={link.icon} size={20} class="shrink-0" />
          {#if open}
            <span class="whitespace-nowrap overflow-hidden text-ellipsis">{link.label}</span>
          {/if}
        </a>
      {/each}
    </nav>

    <!-- ประวัติแชท (History) -->
    {#if open}
      <div class="flex-1 min-h-0 flex flex-col border-t border-gray-100">
        <div class="flex items-center justify-between px-4 py-2">
          <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
            <Icons name="chat" size={13} /> ประวัติแชท
          </span>
          <a
            href="/chat?new=1"
            title="เริ่มแชทใหม่"
            class="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Icons name="plus" size={14} />
          </a>
        </div>

        <div class="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {#if liveChats.length === 0}
            <p class="px-2 py-2 text-xs text-gray-400">ยังไม่มีประวัติแชท</p>
          {:else}
            {#each liveChats as c (c.id)}
              <a
                href={chatHref(c)}
                onclick={(e) => {
                  e.preventDefault();
                  goto(chatHref(c), { invalidateAll: true });
                }}
                title={c.title}
                class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors {activeRoomId === c.id && isChatPage
                  ? 'bg-indigo-50'
                  : 'hover:bg-gray-50'}"
              >
                <div
                  class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold {c.isGroup
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'}"
                >
                  {(c.title || '?').charAt(0)}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <span class={`text-xs truncate ${activeRoomId === c.id && isChatPage ? 'text-indigo-700 font-semibold' : 'text-gray-800'}`}>
                      {c.title || 'แชทใหม่'}
                    </span>
                    <span class="text-[10px] text-gray-400 shrink-0">{timeAgo(c.updatedAt)}</span>
                  </div>
                  <p class="text-[11px] text-gray-400 truncate">{chatLabel(c)}</p>
                </div>
              </a>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  </div>
</aside>