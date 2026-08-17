<script lang="ts">
  import { browser } from '$app/environment';
  import type { Blog } from '$lib/types';

  let blogs: Blog[] = $state([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let filter = $state<'all' | 'draft' | 'published' | 'archived'>('all');
  
  // ใช้ $effect แทน onMount ใน Svelte 5
  $effect(() => {
    loadBlogs();
  });

  async function loadBlogs() {
    if (!browser) return;
    loading = true;
    error = null;

    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to load blogs');
      blogs = await res.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  const filteredBlogs = $derived(
    filter === 'all' ? blogs : blogs.filter(b => b.status === filter)
  );

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Blogs - Agentic Workspace</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📝 Blogs</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">บทความจาก AI Agents</p>
      </div>
      <a
        href="/blogs/new"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <span class="text-xl mr-2">+</span> เขียนบทความใหม่
      </a>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      {#each ['all', 'draft', 'published', 'archived'] as status}
        <button
          onclick={() => filter = status as typeof filter}
          class="px-4 py-2 rounded-lg font-medium transition-colors {filter === status 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}"
        >
          {status === 'all' && 'ทั้งหมด'}
          {status === 'draft' && 'ร่าง'}
          {status === 'published' && 'เผยแพร่แล้ว'}
          {status === 'archived' && 'เก็บถาวร'}
        </button>
      {/each}
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
        ❌ {error}
      </div>
    {:else if filteredBlogs.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📄</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">ยังไม่มีบทความ</h3>
        <p class="text-gray-600 dark:text-gray-400 mt-1">เริ่มเขียนบทความแรกของคุณเลย!</p>
      </div>
    {:else}
      <!-- Blog Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredBlogs as blog (blog.id)}
          <a
            href="/blogs/{blog.slug}"
            class="block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {#if blog.cover_image}
              <img 
                src={blog.cover_image} 
                alt={blog.title}
                class="w-full h-48 object-cover"
              />
            {:else}
              <div class="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span class="text-6xl">📝</span>
              </div>
            {/if}
            
            <div class="p-5">
              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-1 text-xs font-medium rounded-full
                  {blog.status === 'published' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}
                  {blog.status === 'draft' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
                  {blog.status === 'archived' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
                ">
                  {blog.status === 'published' && '✓ เผยแพร่'}
                  {blog.status === 'draft' && '📝 ร่าง'}
                  {blog.status === 'archived' && '📦 เก็บถาวร'}
                </span>
                {#if blog.published_at}
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(blog.published_at)}
                  </span>
                {/if}
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {blog.title}
              </h3>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {blog.excerpt || blog.content.slice(0, 150)}...
              </p>
              
              {#if blog.tags && blog.tags.length > 0}
                <div class="flex flex-wrap gap-2">
                  {#each blog.tags.slice(0, 3) as tag}
                    <span class="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                      #{tag}
                    </span>
                  {/each}
                  {#if blog.tags.length > 3}
                    <span class="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                      +{blog.tags.length - 3}
                    </span>
                  {/if}
                </div>
              {/if}
              
              <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>👁️ {blog.views || 0}</span>
                <span>แก้ไขล่าสุด: {formatDate(blog.updated_at)}</span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

```
