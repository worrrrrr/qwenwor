<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    children: Snippet;
  }

  let { open, title, onClose, children }: Props = $props();
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      type="button"
      tabindex="-1"
      class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-default"
      onclick={onClose}
      aria-label="ปิดหน้าต่าง"
    ></button>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          onclick={onClose}
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="ปิด"
        >
          <Icons name="close" size={18} />
        </button>
      </div>
      <div class="p-5">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
