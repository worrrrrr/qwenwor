<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { Skill, AgentSkill } from '$lib/types';

  let skills: Skill[] = $state([]);
  let agentSkills: AgentSkill[] = $state([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let selectedCategory = $state('all');
  let categories = $state<string[]>([]);
  let viewMode = $state<'grid' | 'list'>('grid');

  onMount(async () => {
    await loadSkills();
  });

  async function loadSkills() {
    if (!browser) return;
    loading = true;
    error = null;

    try {
      const [skillsRes, agentSkillsRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/agent-skills')
      ]);
      
      if (!skillsRes.ok) throw new Error('Failed to load skills');
      skills = await skillsRes.json();
      
      if (agentSkillsRes.ok) {
        agentSkills = await agentSkillsRes.json();
      }

      // Extract unique categories
      const cats = new Set(skills.map(s => s.category));
      categories = ['all', ...Array.from(cats)];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  const filteredSkills = $derived(
    selectedCategory === 'all' 
      ? skills 
      : skills.filter(s => s.category === selectedCategory)
  );

  function getLevelColor(level: string): string {
    switch (level) {
      case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'intermediate': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'advanced': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }

  function getLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      basic: 'พื้นฐาน',
      intermediate: 'กลาง',
      advanced: 'สูง',
      expert: 'ผู้เชี่ยวชาญ'
    };
    return labels[level] || level;
  }

  function getAgentsWithSkill(skillId: string): AgentSkill[] {
    return agentSkills.filter(as => as.skillId === skillId);
  }
</script>

<svelte:head>
  <title>Skills - Agentic Workspace</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">🎯 Skills</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">ทักษะของ AI Agents ในระบบ</p>
      </div>
      <div class="flex gap-2">
        <button
          onclick={() => viewMode = viewMode === 'grid' ? 'list' : 'grid'}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          {viewMode === 'grid' ? '📋 List' : '🔲 Grid'}
        </button>
        <a
          href="/skills/new"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <span class="text-xl mr-2">+</span> เพิ่มทักษะใหม่
        </a>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      {#each categories as cat}
        <button
          onclick={() => selectedCategory = cat}
          class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors {selectedCategory === cat 
            ? 'bg-green-600 text-white' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}"
        >
          {cat === 'all' && 'ทั้งหมด'}
          {cat !== 'all' && cat}
        </button>
      {/each}
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
        ❌ {error}
      </div>
    {:else if filteredSkills.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🎯</div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">ยังไม่มีทักษะ</h3>
        <p class="text-gray-600 dark:text-gray-400 mt-1">เพิ่มทักษะแรกของคุณเลย!</p>
      </div>
    {:else}
      <!-- Skills Display -->
      {#if viewMode === 'grid'}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredSkills as skill (skill.id)}
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
              <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-2xl">
                      {skill.icon === 'sparkles' && '✨'}
                      {skill.icon === 'code' && '💻'}
                      {skill.icon === 'book' && '📚'}
                      {skill.icon === 'lightbulb' && '💡'}
                      {skill.icon === 'target' && '🎯'}
                      {skill.icon === 'brain' && '🧠'}
                      {skill.icon !== 'sparkles' && skill.icon !== 'code' && skill.icon !== 'book' && skill.icon !== 'lightbulb' && skill.icon !== 'target' && skill.icon !== 'brain' && skill.icon}
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </h3>
                      <span class="text-sm text-gray-500 dark:text-gray-400">{skill.category}</span>
                    </div>
                  </div>
                </div>
                
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {skill.description}
                </p>
                
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 text-xs font-medium rounded-full {getLevelColor(skill.level)}">
                    📊 {getLevelLabel(skill.level)}
                  </span>
                  
                  {@const agentsWithSkill = getAgentsWithSkill(skill.id)}
                  {#if agentsWithSkill.length > 0}
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      👥 {agentsWithSkill.length} agent{agentsWithSkill.length > 1 ? 's' : ''}
                    </span>
                  {/if}
                </div>
              </div>
              
              <div class="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="/skills/{skill.id}"
                  class="block text-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  ดูรายละเอียด
                </a>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- List View -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ทักษะ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">หมวดหมู่</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ระดับ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Agents</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {#each filteredSkills as skill (skill.id)}
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <span class="text-xl">{skill.icon}</span>
                      <span class="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {skill.category}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 text-xs font-medium rounded-full {getLevelColor(skill.level)}">
                      {getLevelLabel(skill.level)}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {@const agentsWithSkill = getAgentsWithSkill(skill.id)}
                    {agentsWithSkill.length > 0 ? `${agentsWithSkill.length} agent${agentsWithSkill.length > 1 ? 's' : ''}` : '-'}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="/skills/{skill.id}" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                      ดูรายละเอียด →
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    {/if}
  </div>
</div>

```
