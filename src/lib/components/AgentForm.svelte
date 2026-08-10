<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import type { Agent } from '$lib/types';
  import SuggestInput from '$lib/components/SuggestInput.svelte';

  interface Props {
    agent?: Agent;
    mode: 'create' | 'edit';
    onDone: () => void;
  }

  let { agent, mode, onDone }: Props = $props();

  let errorMsg = $state('');

  const providers = ['groq', 'gemini', 'deepseek', 'ollama'];
  const avatarColors = ['blue', 'emerald', 'orange', 'purple', 'cyan', 'red'];

  // คำแนะนำการพิมพ์ (ช่วยเติมเวลาไม่รู้จะพิมพ์อะไร)
  const nameIdeas = ['แม่หมอ AI', 'นักข่าว AI', 'นักออกแบบ AI', 'เชฟ AI', 'โค้ชส่วนตัว AI', 'ผู้ช่วยธุรกิจ AI', 'ก็อต', 'น้องบี', 'Brian'];

  const roleIdeas = [
    'ผู้เชี่ยวชาญการตลาด',
    'นักวิจัยข้อมูล',
    'โปรแกรมเมอร์',
    'นักเขียนบทความ',
    'ครูสอนพิเศษ',
    'นักวิเคราะห์การเงิน',
    'นักออกแบบ UI/UX',
    'ผู้ช่วยส่วนตัว',
    'นักแปลภาษา',
    'ที่ปรึกษาธุรกิจ'
  ];

  const personalityIdeas = [
    'เป็นมิตร อบอุ่น',
    'ตรงไปตรงมา เฉียบคม',
    'ตลก ขี้เล่น',
    'ละเอียด รอบคอบ',
    'มืออาชีพ เป็นทางการ',
    'คิดบวก ให้กำลังใจ',
    'ขี้สงสัย ชอบตั้งคำถาม',
    'ใจเย็น สุภาพ'
  ];

  const modelByProvider: Record<string, string[]> = {
    groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    gemini: ['gemini-2.0-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-lite'],
    deepseek: ['deepseek-chat', 'deepseek-reasoner'],
    ollama: ['qwen2.5', 'llama3.2', 'gemma2', 'mistral']
  };

  let values = $state({
    name: '',
    role: '',
    personality: '',
    description: '',
    provider: 'groq',
    model: '',
    avatarColor: 'blue'
  });

  const modelOptions = $derived(modelByProvider[values.provider] ?? []);

  // เติมค่าเริ่มต้นเมื่อฟอร์มถูกเปิด (โหมดแก้ไข)
  onMount(() => {
    if (agent) {
      values = {
        name: agent.name,
        role: agent.identity.role ?? '',
        personality: agent.identity.personality ?? '',
        description: agent.identity.description ?? '',
        provider: agent.provider ?? 'groq',
        model: agent.model ?? '',
        avatarColor: agent.avatarColor ?? 'blue'
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
    <input type="hidden" name="id" value={agent?.id} />
  {/if}

  {#if errorMsg}
    <div class="p-3 rounded-md bg-red-50 text-red-700 text-sm">{errorMsg}</div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700">
        ชื่อ Agent *
        <SuggestInput
          name="name"
          bind:value={values.name}
          options={nameIdeas}
          placeholder="เช่น แม่หมอ AI, นักข่าว AI..."
          required
        />
      </label>
    </div>
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700">
        บทบาท
        <SuggestInput
          name="role"
          bind:value={values.role}
          options={roleIdeas}
          placeholder="เช่น ผู้เชี่ยวชาญการตลาด"
        />
      </label>
    </div>
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700">
        บุคลิก
        <SuggestInput
          name="personality"
          bind:value={values.personality}
          options={personalityIdeas}
          placeholder="เช่น เป็นมิตร ตลก ตรงไปตรงมา..."
        />
      </label>
    </div>
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700">
        คำอธิบาย
        <textarea name="description" bind:value={values.description} rows="2" class="input input-green mt-1" placeholder="Agent นี้ถนัดอะไร?"></textarea>
      </label>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">
        AI Provider
        <select name="provider" bind:value={values.provider} class="input input-green mt-1 bg-white">
          {#each providers as p (p)}
            <option value={p}>{p}</option>
          {/each}
        </select>
      </label>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">
        โมเดล (เว้นว่าง = ค่าเริ่มต้น)
        <SuggestInput
          name="model"
          bind:value={values.model}
          options={modelOptions}
          placeholder="เช่น llama-3.3-70b-versatile"
        />
      </label>
    </div>
    <div class="md:col-span-2">
      <label class="block text-sm font-medium text-gray-700">
        สีอวาตาร์
        <select name="avatarColor" bind:value={values.avatarColor} class="input input-green mt-1 bg-white">
          {#each avatarColors as c (c)}
            <option value={c}>{c}</option>
          {/each}
        </select>
      </label>
    </div>
  </div>

  <button class="btn btn-green w-full">{mode === 'edit' ? 'บันทึกการแก้ไข' : 'สร้าง Agent'}</button>
</form>
