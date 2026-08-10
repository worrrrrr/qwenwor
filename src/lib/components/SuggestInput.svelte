<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';

  interface Props {
    name: string;
    value?: string;
    options: string[];
    placeholder?: string;
    required?: boolean;
    class?: string;
  }

  let {
    name,
    value = $bindable(''),
    options,
    placeholder = '',
    required = false,
    class: className = ''
  }: Props = $props();

  let open = $state(false);
  let active = $state(-1);

  const filtered = $derived.by(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options.slice(0, 6);
    return options.filter((o) => o.toLowerCase().includes(q)).slice(0, 6);
  });

  function apply(opt: string) {
    value = opt;
    open = false;
    active = -1;
  }

  function handleKey(e: KeyboardEvent) {
    if (open && filtered.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        active = (active + 1) % filtered.length;
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        active = (active - 1 + filtered.length) % filtered.length;
        return;
      }
      if (e.key === 'Enter' && active >= 0) {
        e.preventDefault();
        apply(filtered[active]);
        return;
      }
      if (e.key === 'Escape') {
        open = false;
        active = -1;
        return;
      }
    }
  }
</script>

<div class="relative {className}">
  <input
    type="text"
    {name}
    bind:value
    {required}
    onfocus={() => {
      open = true;
      active = -1;
    }}
    onblur={() => setTimeout(() => (open = false), 150)}
    onkeydown={handleKey}
    placeholder={placeholder}
    class="input input-green mt-1"
  />

  {#if open && filtered.length > 0}
    <div class="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <p class="px-3 pt-2 pb-1 text-[11px] font-medium text-gray-400 uppercase flex items-center gap-1">
        <Icons name="sparkles" size={12} /> แนะนำ
      </p>
      <ul class="max-h-48 overflow-y-auto">
        {#each filtered as opt, i (opt)}
          <li>
            <button
              type="button"
              onclick={() => apply(opt)}
              onmouseenter={() => (active = i)}
              class="w-full text-left px-3 py-1.5 text-sm text-gray-700 {active === i ? 'bg-indigo-50' : 'hover:bg-indigo-50/60'}"
            >
              {opt}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
