<script lang="ts">
  import Icons from '$lib/components/Icons.svelte';

  export interface SuggestionItem {
    label: string;
    sublabel?: string;
    href?: string;
  }

  interface Props {
    placeholder?: string;
    items: SuggestionItem[];
    onSelect?: (item: SuggestionItem) => void;
    value?: string;
    class?: string;
  }

  let { placeholder = 'ค้นหา...', items, onSelect, value = $bindable(''), class: className = '' }: Props = $props();

  let open = $state(false);

  // แนะนำทันทีเมื่อโฟกัส (ยังไม่พิมพ์ = แสดงรายการยอดนิยม, พิมพ์แล้ว = กรองตามคำ)
  const filtered = $derived.by(() => {
    const q = value.trim().toLowerCase();
    if (!q) return items.slice(0, 5);
    return items
      .filter((i) =>
        `${i.label} ${i.sublabel ?? ''}`.toLowerCase().includes(q)
      )
      .slice(0, 8);
  });

  function pick(item: SuggestionItem) {
    value = item.label;
    open = false;
    onSelect?.(item);
  }
</script>

<div class="relative {className}">
  <div class="relative">
    <Icons name="search" size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="search"
      bind:value={value}
      onfocus={() => (open = true)}
      onblur={() => setTimeout(() => (open = false), 150)}
      placeholder={placeholder}
      class="input pl-9"
    />
  </div>

  {#if open && filtered.length > 0}
    <ul class="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {#each filtered as item (item.label)}
        <li>
          {#if item.href}
            <a
              href={item.href}
              onclick={() => (open = false)}
              class="block px-3 py-2 hover:bg-gray-50 text-sm"
            >
              <span class="font-medium text-gray-800">{item.label}</span>
              {#if item.sublabel}
                <span class="block text-xs text-gray-400 truncate">{item.sublabel}</span>
              {/if}
            </a>
          {:else}
            <button
              type="button"
              onclick={() => pick(item)}
              class="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
            >
              <span class="font-medium text-gray-800">{item.label}</span>
              {#if item.sublabel}
                <span class="block text-xs text-gray-400 truncate">{item.sublabel}</span>
              {/if}
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
