<script lang="ts">
  import { onMount } from 'svelte';
  import Icons from '$lib/components/Icons.svelte';
  import logo from '$lib/assets/logo.svg?url';
  import type { User } from '@supabase/supabase-js';

  interface Props {
    title?: string;
    subtitle?: string;
    user?: User | null;
  }

  let { title = 'Agentic Knowledge Workspace', subtitle, user = null }: Props = $props();
  
  let currentTime = $state(new Date());
  let isMenuOpen = $state(false);

  const initials = $derived((user?.email?.charAt(0) ?? 'A').toUpperCase());

  onMount(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
    
    return () => clearInterval(timer);
  });
</script>

<nav class="sticky top-0 z-50 backdrop-blur-md border-gray-200/60 transition-colors">
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- ซ้าย: โลโก้ -->
      <div class="flex items-center">
        <a href="/" class="shrink-0 flex items-center">
          <img src={logo} alt="โลโก้" class="h-9 w-auto mr-3 rounded-lg" draggable="false" />
          <div>
            <h1 class="text-xl font-bold text-gray-900">{title}</h1>
            {#if subtitle}
              <p class="text-xs text-gray-500">{subtitle}</p>
            {/if}
          </div>
        </a>
      </div>

      <!-- ขวา -->
      <div class="flex items-center space-x-4">
        <!-- เวลา -->
        <div class="hidden md:block text-sm text-gray-600 font-medium">
          {currentTime.toLocaleTimeString('th-TH')}
        </div>

        <!-- User + ออกจากระบบ -->
        {#if user}
          <div class="hidden md:flex flex-col items-end mr-1">
            <span class="text-xs font-semibold text-gray-800">{user.email}</span>
            <span class="text-[11px] text-gray-500">ผู้ใช้</span>
          </div>
        {/if}

        <!-- Profile -->
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-medium text-sm shadow-xs">
            {initials}
          </div>
        </div>

        {#if user}
          <form method="POST" action="/logout">
            <button
              class="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50/60 transition-colors"
              title="ออกจากระบบ"
              aria-label="ออกจากระบบ"
            >
              <Icons name="external" size={18} />
            </button>
          </form>
        {/if}

        <!-- Mobile menu button -->
        <div class="lg:hidden flex items-center">
          <button
            onclick={() => isMenuOpen = !isMenuOpen}
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 focus:outline-none"
            aria-label="เปิดเมนู"
          >
            <Icons name={isMenuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu (ใช้พื้นหลังโปร่งใสเช่นกัน) -->
  {#if isMenuOpen}
    <div class="lg:hidden border-t border-gray-200/60 bg-white/90 backdrop-blur-lg">
      <div class="pt-2 pb-3 space-y-1">
        <a href="/" class="bg-indigo-50/80 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Dashboard
        </a>
        <a href="/agents" class="border-transparent text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Agents
        </a>
        <a href="/knowledge" class="border-transparent text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Knowledge
        </a>
        <a href="/workflows" class="border-transparent text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Workflows
        </a>
        <a href="/tasks" class="border-transparent text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          Tasks
        </a>
        <a href="/works" class="border-transparent text-gray-600 hover:bg-gray-50/80 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
          ผลงาน
        </a>
      </div>
    </div>
  {/if}
</nav>