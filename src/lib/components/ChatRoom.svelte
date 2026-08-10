<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import { bumpChatActivity } from '$lib/chatActivity.svelte';
  import type { Agent, ChatMessage } from '$lib/types';

  interface Props {
    agents: Agent[];
    mode: 'single' | 'group';
    chatId?: string | null;
    initialMessages?: ChatMessage[];
    selectedIds?: string[];
    onToggleAgent?: (id: string) => void;
    onChatCreated?: (id: string) => void;
  }

  let {
    agents,
    mode,
    chatId = null,
    initialMessages = [],
    selectedIds = [],
    onToggleAgent,
    onChatCreated
  }: Props = $props();

  // ข้อความทั้งหมด = ประวัติจาก prop (read-only) + ข้อความใหม่ในเซสชันนี้
  let sessionMessages = $state<ChatMessage[]>([]);
  let sessionChatId = $state<string | null>(null);
  const messages = $derived<ChatMessage[]>([...initialMessages, ...sessionMessages]);
  const activeChatId = $derived<string | null>(sessionChatId ?? chatId);

  let input = $state('');
  let loading = $state(false);
  let flash = $state('');
  let suggestOpen = $state(false);

  // คำแนะนำการพิมพ์ — แสดงเฉพาะตอนพิมพ์ข้อความไปแล้ว (กรองตามที่พิมพ์)
  const promptSuggestions = [
    'ช่วยสรุปใจความสำคัญของ',
    'ค้นหาข้อมูลเกี่ยวกับ',
    'เขียนบทความเรื่อง',
    'วางแผน',
    'อธิบายให้เข้าใจง่ายว่า',
    'เปรียบเทียบระหว่าง',
    'ตั้งชื่อเรื่อง',
    'แนะนำแนวทาง'
  ];

  const suggestFiltered = $derived.by(() => {
    const q = input.trim().toLowerCase();
    if (!q) return []; // ยังไม่ได้พิมพ์ → ยังไม่ขึ้นคำแนะนำ
    return promptSuggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  });

  function applySuggestion(s: string) {
    input = s + ' ';
    suggestOpen = false;
  }

  // เลื่อนลงล่างสุดอัตโนมัติเมื่อมีข้อความใหม่ (เรียก update ทุกครั้งที่ messages เปลี่ยน)
  function autoscroll(node: HTMLElement, _params?: unknown) {
    node.scrollTop = node.scrollHeight;
    return {
      update() {
        node.scrollTop = node.scrollHeight;
      }
    };
  }

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

  function isSelected(id: string): boolean {
    return selectedIds.length === 0 || selectedIds.includes(id);
  }

  function formatTime(d: Date): string {
    return new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  }

  async function send() {
    const prompt = input.trim();
    if (!prompt || loading) return;
    input = '';
    loading = true;

    sessionMessages = [
      ...sessionMessages,
      { id: `tmp-${Date.now()}`, chatId: activeChatId ?? '', role: 'user' as const, content: prompt, createdAt: new Date() }
    ];

    const ids = mode === 'group'
      ? agents.filter((a) => isSelected(a.id)).map((a) => a.id)
      : [agents[0]?.id].filter((x): x is string => Boolean(x));

    if (ids.length === 0) {
      loading = false;
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chatId: activeChatId, agentIds: ids, prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'เกิดข้อผิดพลาด');

      const wasNewRoom = !activeChatId;
      sessionChatId = data.chatId;
      if (wasNewRoom && data.chatId) onChatCreated?.(data.chatId);
      bumpChatActivity();
      const newMsgs = (data.replies ?? []).map((r: { message: ChatMessage | null }) => r.message).filter(Boolean);
      sessionMessages = [...sessionMessages, ...newMsgs];
    } catch (e) {
      sessionMessages = [
        ...sessionMessages,
        {
          id: `err-${Date.now()}`,
          chatId: activeChatId ?? '',
          role: 'agent' as const,
          content: `[ผิดพลาด] ${e instanceof Error ? e.message : String(e)}`,
          createdAt: new Date()
        }
      ];
    } finally {
      loading = false;
    }
  }

  async function saveToWorks(msg: ChatMessage) {
    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          agentId: msg.agentId,
          chatId: activeChatId,
          title: msg.content.slice(0, 40),
          content: msg.content
        })
      });
      if (!res.ok) throw new Error('บันทึกไม่สำเร็จ');
      flash = 'บันทึกลงผลงานแล้ว!';
      setTimeout(() => (flash = ''), 2500);
    } catch (e) {
      flash = `บันทึกไม่สำเร็จ: ${e instanceof Error ? e.message : String(e)}`;
      setTimeout(() => (flash = ''), 3000);
    }
  }

  let activeIndex = $state(-1);

  function onKeydown(e: KeyboardEvent) {
    // ถ้าเปิดคำแนะนำอยู่: ใช้ ↑↓ / Enter / Esc กับคำแนะนำก่อน
    if (suggestOpen && suggestFiltered.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % suggestFiltered.length;
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + suggestFiltered.length) % suggestFiltered.length;
        return;
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        applySuggestion(suggestFiltered[activeIndex]);
        return;
      }
      if (e.key === 'Escape') {
        suggestOpen = false;
        activeIndex = -1;
        return;
      }
    }

    // ไม่งั้น Enter = ส่งข้อความ
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // เลื่อนลงล่างสุดเมื่อมีข้อความใหม่ (action autoscroll จัดการให้แล้ว)
</script>

<div class="flex flex-col h-full bg-white rounded-2xl shadow-md overflow-hidden">
  <!-- เลือก Agent (เฉพาะโหมดแชทรวม) — สไตล์กลุ่มไลน์ -->
  {#if mode === 'group' && onToggleAgent}
    <div class="p-3 border-b border-gray-200 shrink-0">
      <!-- หัวห้อง: อวาตาร์สมาชิก + ชื่อห้อง -->
      <div class="flex items-center gap-3 mb-2">
        <div class="flex -space-x-2 shrink-0">
          {#each agents.slice(0, 6) as agent (agent.id)}
            <div
              class="w-8 h-8 rounded-full ring-2 ring-white bg-linear-to-br {gradientFor(agent.id)} flex items-center justify-center text-white text-[10px] font-bold"
              title={agent.name}
            >
              {agent.name.charAt(0).toUpperCase()}
            </div>
          {/each}
          {#if agents.length > 6}
            <div
              class="w-8 h-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600"
              title="Agent อื่นๆ"
            >
              +{agents.length - 6}
            </div>
          {/if}
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-800 leading-tight">ห้องแชทรวม</p>
          <p class="text-[11px] text-gray-400 truncate">
            สมาชิก {agents.length} Agent · ข้อความของแต่ละคนจะแสดงข้างใต้ชื่อของตัวเอง
          </p>
        </div>
      </div>
      <!-- เลือกว่าให้ใครตอบในรอบถัดไป -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-gray-500 mr-1">ตอบโดย:</span>
        {#each agents as agent (agent.id)}
          <button
            onclick={() => onToggleAgent(agent.id)}
            class="px-2.5 py-1 rounded-full text-xs font-medium border transition-colors {isSelected(agent.id)
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
              : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}"
          >
            <span class="inline-block w-2 h-2 rounded-full bg-linear-to-br {gradientFor(agent.id)} mr-1.5"></span>
            {agent.name}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- พื้นที่ข้อความ -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4" use:autoscroll={messages}>
    {#if messages.length === 0}
      <div class="text-center py-14">
        <Icons name="sparkles" size={36} class="mx-auto opacity-40" />
        <p class="mt-3 text-sm text-gray-500">
          {mode === 'group' ? 'ส่งคำถามเดียวให้หลาย Agent ตอบพร้อมกัน' : 'เริ่มคุยกับ Agent กันเลย'}
        </p>
        <p class="mt-1 text-xs text-gray-400">AI จะตอบตามบุคลิกของแต่ละ Agent</p>
      </div>
    {/if}

    {#each messages as msg (msg.id)}
      {#if msg.role === 'user'}
        <div class="flex justify-end">
          <div class="max-w-[75%] bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm shadow">
            <p class="whitespace-pre-wrap break-words">{msg.content}</p>
            <p class="text-[10px] text-indigo-200 text-right mt-1">{formatTime(msg.createdAt)}</p>
          </div>
        </div>
      {:else}
        <div class="flex items-start gap-2.5">
          <div
            class="w-8 h-8 rounded-full bg-linear-to-br {gradientFor(msg.agentId ?? 'x')} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1"
          >
            {(agentById.get(msg.agentId ?? '')?.name ?? 'AI').charAt(0).toUpperCase()}
          </div>
          <div class="flex-1 max-w-[75%] bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-semibold text-gray-700">
                {mode === 'group' ? agentById.get(msg.agentId ?? '')?.name ?? 'Agent' : agents[0]?.name ?? 'AI'}
              </span>
              <span class="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
            </div>
            <p class="whitespace-pre-wrap break-words text-gray-800">{msg.content}</p>
            <div class="mt-1.5 flex items-center justify-end gap-1">
              <button
                onclick={() => saveToWorks(msg)}
                class="text-[11px] text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-1"
                title="บันทึกลงผลงาน"
              >
                <Icons name="heart" size={13} /> บันทึกผลงาน
              </button>
            </div>
          </div>
        </div>
      {/if}
    {/each}

    {#if loading}
      <div class="flex items-center gap-2 text-sm text-gray-400 pl-10">
        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        กำลังให้ Agent ตอบ...
      </div>
    {/if}
  </div>

  {#if flash}
    <div class="px-4 py-1.5 text-xs text-emerald-600 bg-emerald-50 border-t border-emerald-100">{flash}</div>
  {/if}

  <!-- ช่องพิมพ์ -->
  <div class="p-3 border-t border-gray-200 shrink-0">
    <div class="flex items-end gap-2">
      <div class="flex-1 relative">
        <textarea
          bind:value={input}
          onkeydown={onKeydown}
          oninput={() => (activeIndex = -1)}
          onfocus={() => {
            suggestOpen = true;
            activeIndex = -1;
          }}
          onblur={() => setTimeout(() => (suggestOpen = false), 150)}
          rows={2}
          placeholder="พิมพ์ข้อความ แล้วกด Enter เพื่อส่ง..."
          class="input flex-1 resize-none"
        ></textarea>

        {#if suggestOpen && suggestFiltered.length > 0}
          <div class="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <p class="px-3 pt-2 pb-1 text-[11px] font-medium text-gray-400 uppercase flex items-center gap-1">
              <Icons name="sparkles" size={12} /> แนะนำการพิมพ์
            </p>
            <ul class="max-h-48 overflow-y-auto">
              {#each suggestFiltered as s, i (s)}
                <li>
                  <button
                    type="button"
                    onclick={() => applySuggestion(s)}
                    onmouseenter={() => (activeIndex = i)}
                    class="w-full text-left px-3 py-1.5 text-sm text-gray-700 {activeIndex === i ? 'bg-indigo-50' : 'hover:bg-indigo-50/60'}"
                  >
                    {s}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
      <button
        onclick={send}
        disabled={loading || !input.trim()}
        class="btn btn-blue shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ส่ง
      </button>
    </div>
  </div>
</div>
