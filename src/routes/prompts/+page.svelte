<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { Prompt } from '$lib/types';

  let prompts: Prompt[] = $state([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let searchQuery = $state('');
  let selectedCategory = $state('all');
  let categories = $state<string[]>([]);

  onMount(async () => {
    await loadPrompts();
  });

  async function loadPrompts() {
    if (!browser) return;
    loading = true;
    error = null;

    try {
      const res = await fetch('/api/prompts');
      if (!res.ok) throw new Error('Failed to load prompts');
      const data = await res.json();
      prompts = data;
      
      // Extract unique categories
      const cats = new Set(prompts.map(p => p.category));
      categories = ['all', ...Array.from(cats)];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  const filteredPrompts = $derived(
    prompts.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
  );

  async function copyPrompt(prompt: Prompt) {
    if (!browser) return;
    await navigator.clipboard.writeText(prompt.template);
    // TODO: Show toast notification
  }

  async function incrementUsage(promptId: string) {
    if (!browser) return;
    try {
      await fetch(`/api/prompts/${promptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment_usage: true })
      });
      // Refresh list
      await loadPrompts();
    } catch (e) {
      console.error('Failed to increment usage:', e);
    }
  }
</script>

<svelte:head>
  <title>Prompts - Agentic Workspace</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">⚡ Prompts</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">คลัง Prompt Template สำหรับ AI Agents</p>
      </div>
      <a
        href="/prompts/new"
        class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        <span class="text-xl mr-2">+</span> สร้าง Prompt ใหม่
      </a>
    </div>

    <!-- Search & Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="🔍 ค้นหา prompt..."
        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      
      <select
        bind:value={selectedCategory}
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
      >
        {#each categories as cat}
          <option value={cat}>
            {cat === 'all' ? 'ทั้งหมด' : cat}
          </option>
        {/each}
      </select>
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
        ❌ {error}
      </div>
    {:else if filteredPrompts.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">⚡</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">ไม่พบ prompt</h3>
        <p class="text-gray-600 dark:text-gray-400 mt-1">ลองค้นหาด้วยคำอื่นหรือสร้าง prompt ใหม่</p>
      </div>
    {:else}
      <!-- Prompts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredPrompts as prompt (prompt.id)}
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col">
            <div class="p-5 flex-1">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {prompt.name}
                  </h3>
                  <span class="inline-block px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full mt-1">
                    {prompt.category}
                  </span>
                </div>
                {#if prompt.isPublic}
                  <span class="text-lg" title="Public">🌍</span>
                {:else}
                  <span class="text-lg" title="Private">🔒</span>
                {/if}
              </div>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {prompt.description}
              </p>
              
              {#if prompt.tags && prompt.tags.length > 0}
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each prompt.tags.slice(0, 3) as tag}
                    <span class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      #{tag}
                    </span>
                  {/each}
                </div>
              {/if}
              
              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
                <code class="text-xs text-gray-700 dark:text-gray-300 font-mono block line-clamp-3">
                  {prompt.template}
                </code>
              </div>
            </div>
            
            <div class="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                ใช้แล้ว: <span class="font-medium text-purple-600 dark:text-purple-400">{prompt.usageCount}</span> ครั้ง
              </div>
              <div class="flex gap-2">
                <button
                  onclick={() => copyPrompt(prompt)}
                  class="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  title="Copy template"
                >
                  📋 Copy
                </button>
                <a
                  href="/prompts/{prompt.id}"
                  class="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  ดูรายละเอียด
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

```
