<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    title?: string;
    subtitle?: string;
  }

  let { title = 'Agentic Knowledge Workspace', subtitle }: Props = $props();
  
  let currentTime = $state(new Date());
  let isMenuOpen = false;

  onMount(() => {
    if (browser) {
      const timer = setInterval(() => {
        currentTime = new Date();
      }, 1000);
      
      return () => clearInterval(timer);
    }
  });
</script>

<nav class="bg-white shadow-lg border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <!-- Logo and Title -->
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center">
          <span class="text-3xl mr-3">🤖</span>
          <div>
            <h1 class="text-xl font-bold text-gray-900">{title}</h1>
            {#if subtitle}
              <p class="text-xs text-gray-500">{subtitle}</p>
            {/if}
          </div>
        </div>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:ml-6 md:flex md:space-x-8">
          <a 
            href="/" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Dashboard
          </a>
          <a 
            href="/agents" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Agents
          </a>
          <a 
            href="/knowledge" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Knowledge
          </a>
          <a 
            href="/workflows" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Workflows
          </a>
          <a 
            href="/tasks" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Tasks
          </a>
          <a 
            href="/tools" 
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            Tools
          </a>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center space-x-4">
        <!-- Time Display -->
        <div class="hidden md:block text-sm text-gray-600">
          {currentTime.toLocaleTimeString('th-TH')}
        </div>
        
        <!-- Profile -->
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
            A
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button
            on:click={() => isMenuOpen = !isMenuOpen}
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {#if isMenuOpen}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              {/if}
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if isMenuOpen}
    <div class="md:hidden border-t border-gray-200">
      <div class="pt-2 pb-3 space-y-1">
        <a 
          href="/" 
          class="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Dashboard
        </a>
        <a 
          href="/agents" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Agents
        </a>
        <a 
          href="/knowledge" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Knowledge
        </a>
        <a 
          href="/workflows" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Workflows
        </a>
        <a 
          href="/tasks" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Tasks
        </a>
        <a 
          href="/tools" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        >
          Tools
        </a>
      </div>
    </div>
  {/if}
</nav>
