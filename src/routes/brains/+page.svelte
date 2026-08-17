<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { Brain } from '$lib/types';

  let brains: Brain[] = $state([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let filterType = $state<'all' | 'general' | 'domain' | 'project' | 'personal'>('all');

  onMount(async () => {
    await loadBrains();
  });

  async function loadBrains() {
    if (!browser) return;
    loading = true;
    error = null;

    try {
      const res = await fetch('/api/brains');
      if (!res.ok) throw new Error('Failed to load brains');
      brains = await res.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  const filteredBrains = $derived(
    filterType === 'all' ? brains : brains.filter(b => b.type === filterType)
  );

  function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      general: 'ทั่วไป',
      domain: 'โดเมนเฉพาะ',
      project: 'โปรเจกต์',
      personal: 'ส่วนตัว'
    };
    return labels[type] || type;
  }

  function getColorClass(color: string): string {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-cyan-600',
      green: 'from-green-500 to-teal-600',
      purple: 'from-purple-500 to-pink-600',
      orange: 'from-orange-500 to-red-600',
      red: 'from-red-500 to-rose-600',
      indigo: 'from-indigo-500 to-purple-600',
      teal: 'from-teal-500 to-emerald-600',
      pink: 'from-pink-500 to-rose-600'
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  }

  function getIconEmoji(icon: string): string {
    const icons: Record<string, string> = {
      brain: '🧠',
      book: '📚',
      lightbulb: '💡',
      target: '🎯',
      folder: '📁',
      database: '💾',
      cloud: '☁️',
      star: '⭐',
      heart: '❤️',
      rocket: '🚀'
    };
    return icons[icon] || '🧠';
  }
</script>

<svelte:head>
  <title>Brains - Agentic Workspace</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">🧠 Brains</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">สมองความรู้กลางสำหรับ AI Agents</p>
      </div>
      <a
        href="/brains/new"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
      >
        <span class="text-xl mr-2">+</span> สร้าง Brain ใหม่
      </a>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 overflow-x-auto">
      {#each ['all', 'general', 'domain', 'project', 'personal'] as type}
        <button
          onclick={() => filterType = type as typeof filterType}
          class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors {filterType === type 
            ? 'bg-indigo-600 text-white' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}"
        >
          {type === 'all' && 'ทั้งหมด'}
          {type === 'general' && 'ทั่วไป'}
          {type === 'domain' && 'โดเมนเฉพาะ'}
          {type === 'project' && 'โปรเจกต์'}
          {type === 'personal' && 'ส่วนตัว'}
        </button>
      {/each}
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
        ❌ {error}
      </div>
    {:else if filteredBrains.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🧠</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">ยังไม่มี brain</h3>
        <p class="text-gray-600 dark:text-gray-400 mt-1">สร้างสมองความรู้แรกของคุณเลย!</p>
      </div>
    {:else}
      <!-- Brains Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredBrains as brain (brain.id)}
          <a
            href="/brains/{brain.id}"
            class="block group"
          >
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
              <!-- Cover with gradient -->
              <div class="h-32 bg-gradient-to-br {getColorClass(brain.color)} flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-black/10"></div>
                <span class="text-7xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {getIconEmoji(brain.icon)}
                </span>
                
                {#if !brain.isActive}
                  <div class="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                    ไม่ใช้งาน
                  </div>
                {/if}
              </div>
              
              <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {brain.name}
                    </h3>
                    <span class="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 rounded-full mt-2">
                      {getTypeLabel(brain.type)}
                    </span>
                  </div>
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {brain.description || 'ไม่มีคำอธิบาย'}
                </p>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{brain.isActive ? '✅ ใช้งาน' : '❌ ไม่ใช้งาน'}</span>
                  </div>
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    อัพเดต: {new Date(brain.updatedAt).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

```
