<script lang="ts">
  import type { Tool } from '$lib/types';

  interface Props {
    tool: Tool;
  }

  let { tool }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow border-l-4 border-red-500">
  <div class="flex items-start justify-between mb-3">
    <div class="flex items-center">
      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center text-white mr-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <div>
        <h3 class="font-semibold text-lg text-gray-900">{tool.name}</h3>
        <p class="text-xs text-gray-500">ID: {tool.id}</p>
      </div>
    </div>
  </div>

  <p class="text-sm text-gray-600 mb-3">{tool.description}</p>

  {#if tool.parameters && tool.parameters.length > 0}
    <div class="mb-3">
      <h4 class="text-xs font-medium text-gray-500 uppercase mb-2">Parameters</h4>
      <div class="space-y-1">
        {#each tool.parameters as param}
          <div class="flex items-center text-sm">
            <span class="font-mono text-blue-600 mr-2">{param.name}</span>
            <span class="text-gray-400 mr-2">:</span>
            <span class="text-gray-600">{param.type}</span>
            {#if param.required}
              <span class="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">required</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="pt-3 border-t">
    <button 
      class="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm font-medium transition-colors"
      on:click={() => console.log('Execute tool:', tool.name)}
    >
      Execute Tool
    </button>
  </div>
</div>
