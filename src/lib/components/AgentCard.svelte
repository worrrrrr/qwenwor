<script lang="ts">
  import type { Agent, AgentStatus } from '$lib/types';

  interface Props {
    agent: Agent;
  }

  let { agent }: Props = $props();

  function getStatusColor(status: AgentStatus): string {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-700';
      case 'working': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'waiting': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  function getStatusText(status: AgentStatus): string {
    const texts: Record<AgentStatus, string> = {
      idle: 'ว่าง',
      working: 'กำลังทำงาน',
      waiting: 'รอคิว',
      error: 'มีปัญหา'
    };
    return texts[status];
  }
</script>

<div class="card p-4">
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-center">
      <div class="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">
        {agent.name.charAt(0)}
      </div>
      <div>
        <h3 class="font-semibold text-lg text-gray-900">{agent.name}</h3>
        <p class="text-sm text-gray-500">{agent.identity.role}</p>
      </div>
    </div>
    <span class="badge {getStatusColor(agent.status)}">
      {getStatusText(agent.status)}
    </span>
  </div>

  <div class="mb-3">
    <p class="text-sm text-gray-600 line-clamp-2">{agent.identity.description}</p>
  </div>

  <div class="border-t pt-3">
    <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
      <span>Capabilities:</span>
      <span>{agent.capabilities.length} skills</span>
    </div>
    <div class="flex flex-wrap gap-1">
      {#each agent.capabilities.slice(0, 3) as capability (capability)}
        <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
          {capability}
        </span>
      {/each}
      {#if agent.capabilities.length > 3}
        <span class="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs">
          +{agent.capabilities.length - 3} more
        </span>
      {/if}
    </div>
  </div>
</div>
