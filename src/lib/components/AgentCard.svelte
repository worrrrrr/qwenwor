<script lang="ts">
  import type { Agent } from '$lib/types';

  interface Props {
    agent: Agent;
  }

  let { agent }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-center">
      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-3">
        {agent.name.charAt(0)}
      </div>
      <div>
        <h3 class="font-semibold text-lg text-gray-900">{agent.name}</h3>
        <p class="text-sm text-gray-500">{agent.identity.role}</p>
      </div>
    </div>
    <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
      Active
    </span>
  </div>

  <div class="mb-3">
    <p class="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
  </div>

  <div class="border-t pt-3">
    <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
      <span>Capabilities:</span>
      <span>{agent.capabilities.length} skills</span>
    </div>
    <div class="flex flex-wrap gap-1">
      {#each agent.capabilities.slice(0, 3) as capability}
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
