<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import type { IconName } from '$lib/components/Icons.svelte';
  import { page } from '$app/state';

  interface Props {
    open: boolean;
    onToggle: () => void;
  }

  let { open, onToggle }: Props = $props();

  const navLinks: { href: string; label: string; icon: IconName }[] = [
    { href: '/', label: 'Dashboard', icon: 'dashboard' },
    { href: '/chat', label: 'แชท', icon: 'sparkles' },
    { href: '/agents', label: 'Agents', icon: 'agents' },
    { href: '/knowledge', label: 'Knowledge', icon: 'knowledge' },
    { href: '/workflows', label: 'Workflows', icon: 'workflows' },
    { href: '/tasks', label: 'Tasks', icon: 'tasks' },
    { href: '/works', label: 'ผลงาน', icon: 'chart' }
  ];

  function isActive(href: string): boolean {
    if (href === '/') return page.url.pathname === '/';
    return page.url.pathname.startsWith(href);
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
          <span class="text-sm font-semibold">Studio</span>
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
    <nav class="flex-1 overflow-hidden p-2 space-y-1">
      
    </nav>
  </div>
</aside>