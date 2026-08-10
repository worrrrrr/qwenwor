<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import type { KnowledgeBase } from '$lib/types';

  interface Props {
    knowledge?: KnowledgeBase;
    mode: 'create' | 'edit';
    onDone: () => void;
  }

  let { knowledge, mode, onDone }: Props = $props();

  let errorMsg = $state('');

  let values = $state({ title: '', content: '', source: '', tags: '' });

  onMount(() => {
    if (knowledge) {
      values = {
        title: knowledge.title,
        content: knowledge.content,
        source: knowledge.metadata.source ?? '',
        tags: (knowledge.metadata.tags ?? []).join(', ')
      };
    }
  });
</script>

<form
  method="POST"
  action={mode === 'edit' ? '?/update' : '?/create'}
  use:enhance={() => {
    return async ({ update, result }) => {
      if (result.type === 'success') {
        errorMsg = '';
        onDone();
      } else if (result.type === 'failure') {
        errorMsg = String(result.data?.error ?? '') || 'เกิดข้อผิดพลาด ไม่สามารถบันทึกได้';
      } else {
        errorMsg = 'เกิดข้อผิดพลาด ไม่สามารถบันทึกได้';
      }
      await update();
    };
  }}
  class="space-y-4"
>
  {#if mode === 'edit'}
    <input type="hidden" name="id" value={knowledge?.id} />
  {/if}

  {#if errorMsg}
    <div class="p-3 rounded-md bg-red-50 text-red-700 text-sm">{errorMsg}</div>
  {/if}

  <label class="block text-sm font-medium text-gray-700">
    ชื่อเรื่อง *
    <input type="text" name="title" bind:value={values.title} required class="input input-green mt-1" placeholder="ชื่อเอกสาร" />
  </label>

  <label class="block text-sm font-medium text-gray-700">
    เนื้อหา *
    <textarea name="content" bind:value={values.content} required rows="5" class="input input-green mt-1" placeholder="เนื้อหาเอกสาร..."></textarea>
  </label>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block text-sm font-medium text-gray-700">
      แหล่งที่มา
      <input type="text" name="source" bind:value={values.source} class="input input-green mt-1" placeholder="เช่น คู่มือระบบ" />
    </label>
    <label class="block text-sm font-medium text-gray-700">
      แท็ก (คั่นด้วย ,)
      <input type="text" name="tags" bind:value={values.tags} class="input input-green mt-1" placeholder="เช่น ai, guide" />
    </label>
  </div>

  <button class="btn btn-green w-full">{mode === 'edit' ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร'}</button>
</form>
